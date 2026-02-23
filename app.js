/* =========================================================
   app.js – Present Levels Generator Application Logic
   ========================================================= */

/* ---- State ---- */
const state = {
  pronouns: 'he',
  studentName: '',
  answers: {},        // { questionId: 'yes' | 'no' | 'na' }
  needs: {},          // { sectionKey: boolean }
  cbmEntries: [],     // [{ assessmentId, values: { fieldId: value } }]
  pmDataPoints: [],   // [{ skill, date, score }]
  compliance: {}      // { requirementId: { completed: bool, text: string } }
};

/* ---- Pronoun helpers ---- */
const PRONOUN_MAP = {
  he:   { he: 'he',   him: 'him', his: 'his',   He: 'He',   His: 'His'  },
  she:  { he: 'she',  him: 'her', his: 'her',   He: 'She',  His: 'Her'  },
  they: { he: 'they', him: 'them', his: 'their', He: 'They', His: 'Their'}
};

function interpolate(template) {
  const p   = PRONOUN_MAP[state.pronouns];
  const name = state.studentName || 'The student';
  return template
    .replace(/\{name\}/g,  name)
    .replace(/\{he\}/g,    p.he)
    .replace(/\{him\}/g,   p.him)
    .replace(/\{his\}/g,   p.his)
    .replace(/\{He\}/g,    p.He)
    .replace(/\{His\}/g,   p.His);
}

/* ---- Grade number parser ---- */
function getStudentGradeNum() {
  const raw = (document.getElementById('grade')?.value || '').trim().toLowerCase();
  if (raw === 'k' || raw === 'kindergarten') return 0;
  const m = raw.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/* ---- Current testing season based on month ---- */
function getCurrentSeason() {
  const month = new Date().getMonth(); // 0-indexed
  if (month >= 7 && month <= 10) return 'fall';    // Aug–Nov
  if (month >= 11 || month <= 1) return 'winter';  // Dec–Feb
  return 'spring';                                   // Mar–Jul
}

/* ---- IEP date formatter ---- */
function formatIEPDate() {
  const val = document.getElementById('iepDate').value;
  if (!val) return '';
  return new Date(val + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ---- Academic data sentences (reading levels, fluency) ---- */
function getAcademicDataSentences() {
  const instrLevel  = document.getElementById('ac-instr-level');
  const indepLevel  = document.getElementById('ac-indep-level');
  const instrWPM    = document.getElementById('ac-instr-wpm');
  const indepWPM    = document.getElementById('ac-indep-wpm');
  const out = [];
  if (instrLevel?.value)  out.push(interpolate(`{name} reads instructionally at ${instrLevel.value}.`));
  if (indepLevel?.value)  out.push(interpolate(`{name} reads independently at ${indepLevel.value}.`));
  if (instrWPM?.value)    out.push(interpolate(`{name}'s oral reading fluency at the instructional level is ${instrWPM.value}.`));
  if (indepWPM?.value)    out.push(interpolate(`{name}'s oral reading fluency at the independent level is ${indepWPM.value}.`));
  // CBM assessment sentences
  getCBMSentences().forEach(s => out.push(s));
  // Benchmark gap sentences
  getBenchmarkGapSentences().forEach(s => out.push(s));
  // Prior year comparison
  getPriorYearSentences().forEach(s => out.push(s));
  // Progress monitoring trend
  getPMSentences().forEach(s => out.push(s));
  return out;
}

/* ---- CBM: collect sentences from all added assessments ---- */
function getCBMSentences() {
  const out = [];
  state.cbmEntries.forEach(entry => {
    const assessment = CBM_ASSESSMENTS.find(a => a.id === entry.assessmentId);
    if (!assessment) return;
    assessment.fields.forEach(field => {
      const val = entry.values[field.id];
      if (!val) return;
      const sentence = field.sentence.replace(/\{value\}/g, val);
      out.push(interpolate(sentence));
    });
  });
  return out;
}

/* ---- CBM: populate the assessment picker ---- */
function buildCBMPicker() {
  const picker = document.getElementById('cbm-picker');
  if (!picker) return;
  CBM_ASSESSMENTS.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = `${a.name} (${a.category}, ${a.grades})`;
    picker.appendChild(opt);
  });
}

/* ---- CBM: render fields for selected assessment ---- */
function renderCBMFields(assessmentId) {
  const container = document.getElementById('cbm-fields-container');
  container.innerHTML = '';
  if (!assessmentId) return;

  const assessment = CBM_ASSESSMENTS.find(a => a.id === assessmentId);
  if (!assessment) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'cbm-fields-wrapper';
  wrapper.innerHTML = `<p class="cbm-assessment-name">${assessment.name} <span class="cbm-meta">${assessment.category} &middot; Grades ${assessment.grades}</span></p>`;

  const grid = document.createElement('div');
  grid.className = 'grid-2';

  assessment.fields.forEach(field => {
    const div = document.createElement('div');
    div.className = 'field';
    const label = document.createElement('label');
    label.textContent = field.label;
    div.appendChild(label);

    let input;
    if (field.type === 'select') {
      input = document.createElement('select');
      input.id = `cbm-field-${field.id}`;
      const emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.textContent = '— Select —';
      input.appendChild(emptyOpt);
      field.options.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.value;
        opt.textContent = o.label;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement('input');
      input.id = `cbm-field-${field.id}`;
      input.type = field.type === 'number' ? 'number' : 'text';
      if (field.placeholder) input.placeholder = field.placeholder;
    }
    div.appendChild(input);
    grid.appendChild(div);
  });

  wrapper.appendChild(grid);

  const btnRow = document.createElement('div');
  btnRow.className = 'cbm-btn-row';
  const addBtn = document.createElement('button');
  addBtn.className = 'btn-primary cbm-add-btn';
  addBtn.textContent = 'Add Assessment Data';
  addBtn.addEventListener('click', () => addCBMEntry(assessmentId));
  btnRow.appendChild(addBtn);
  wrapper.appendChild(btnRow);

  container.appendChild(wrapper);
}

/* ---- CBM: add the current entry ---- */
function addCBMEntry(assessmentId) {
  const assessment = CBM_ASSESSMENTS.find(a => a.id === assessmentId);
  if (!assessment) return;

  const values = {};
  let hasAnyValue = false;
  assessment.fields.forEach(field => {
    const el = document.getElementById(`cbm-field-${field.id}`);
    if (el && el.value.trim()) {
      values[field.id] = el.value.trim();
      hasAnyValue = true;
    }
  });

  if (!hasAnyValue) return;

  state.cbmEntries.push({ assessmentId, values });

  // Reset picker and fields
  document.getElementById('cbm-picker').value = '';
  document.getElementById('cbm-fields-container').innerHTML = '';

  renderCBMAddedList();
  updateSectionOutput('academic');
}

/* ---- CBM: render the list of added assessments ---- */
function renderCBMAddedList() {
  const listEl = document.getElementById('cbm-added-list');
  listEl.innerHTML = '';
  if (state.cbmEntries.length === 0) return;

  state.cbmEntries.forEach((entry, idx) => {
    const assessment = CBM_ASSESSMENTS.find(a => a.id === entry.assessmentId);
    if (!assessment) return;

    const card = document.createElement('div');
    card.className = 'cbm-entry-card';

    const header = document.createElement('div');
    header.className = 'cbm-entry-header';
    header.innerHTML = `<strong>${assessment.name}</strong>`;
    const removeBtn = document.createElement('button');
    removeBtn.className = 'cbm-remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      state.cbmEntries.splice(idx, 1);
      renderCBMAddedList();
      updateSectionOutput('academic');
    });
    header.appendChild(removeBtn);
    card.appendChild(header);

    const sentencesList = document.createElement('ul');
    sentencesList.className = 'cbm-entry-sentences';
    assessment.fields.forEach(field => {
      const val = entry.values[field.id];
      if (!val) return;
      const li = document.createElement('li');
      li.textContent = interpolate(field.sentence.replace(/\{value\}/g, val));
      sentencesList.appendChild(li);
    });
    card.appendChild(sentencesList);

    listEl.appendChild(card);
  });
}

/* ============================================================
   FEATURE: Benchmark Gap Calculator
   ============================================================ */
function lookupBenchmark(assessmentId, fieldId, grade, season) {
  const map = CBM_BENCHMARK_MAP[assessmentId];
  if (!map || !map[fieldId]) return null;
  const path = map[fieldId].split('.');
  const norms = BENCHMARK_NORMS[path[0]];
  if (!norms) return null;
  const subtestNorms = norms[path[1]];
  if (!subtestNorms || !subtestNorms[grade]) return null;
  return subtestNorms[grade][season] || null;
}

function getBenchmarkGapSentences() {
  const grade = getStudentGradeNum();
  const season = getCurrentSeason();
  if (grade === null) return [];
  const out = [];
  state.cbmEntries.forEach(entry => {
    const assessment = CBM_ASSESSMENTS.find(a => a.id === entry.assessmentId);
    if (!assessment) return;
    assessment.fields.forEach(field => {
      if (field.type !== 'number') return;
      const val = parseFloat(entry.values[field.id]);
      if (isNaN(val)) return;
      const benchmark = lookupBenchmark(entry.assessmentId, field.id, grade, season);
      if (benchmark === null) return;
      const diff = val - benchmark;
      const absDiff = Math.abs(diff);
      const seasonLabel = season.charAt(0).toUpperCase() + season.slice(1);
      const gradeLabel = grade === 0 ? 'Kindergarten' : `grade ${grade}`;
      if (diff >= 0) {
        out.push(interpolate(`{name}'s score of ${val} on ${field.label} meets or exceeds the ${seasonLabel} ${gradeLabel} benchmark of ${benchmark} (${absDiff} points above benchmark).`));
      } else {
        out.push(interpolate(`{name}'s score of ${val} on ${field.label} is ${absDiff} points below the ${seasonLabel} ${gradeLabel} benchmark of ${benchmark}.`));
      }
    });
  });
  return out;
}

/* ============================================================
   FEATURE: Prior Year Comparison
   ============================================================ */
function getPriorYearSentences() {
  const out = [];
  const pairs = [
    { priorId: 'prior-orf',     currentId: 'current-orf',     label: 'oral reading fluency',           unit: 'WCPM' },
    { priorId: 'prior-math',    currentId: 'current-math',    label: 'math assessment score',          unit: 'points' },
    { priorId: 'prior-reading', currentId: 'current-reading', label: 'reading assessment score',       unit: 'points' }
  ];
  pairs.forEach(p => {
    const priorEl = document.getElementById(p.priorId);
    const currEl  = document.getElementById(p.currentId);
    if (!priorEl || !currEl) return;
    const prior = parseFloat(priorEl.value);
    const curr  = parseFloat(currEl.value);
    if (isNaN(prior) || isNaN(curr)) return;
    const diff = curr - prior;
    const absDiff = Math.abs(diff);
    if (diff > 0) {
      out.push(interpolate(`Compared to {his} previous IEP, {name} has improved {his} ${p.label} from ${prior} to ${curr} ${p.unit}, representing a gain of ${absDiff} ${p.unit}.`));
    } else if (diff < 0) {
      out.push(interpolate(`Compared to {his} previous IEP, {name}'s ${p.label} has decreased from ${prior} to ${curr} ${p.unit}, a decline of ${absDiff} ${p.unit}.`));
    } else {
      out.push(interpolate(`{name}'s ${p.label} has remained at ${curr} ${p.unit} since {his} previous IEP.`));
    }
  });
  return out;
}

function renderPriorYearOutput() {
  const outputEl = document.getElementById('prior-year-output');
  if (!outputEl) return;
  const sentences = getPriorYearSentences();
  if (sentences.length === 0) {
    outputEl.innerHTML = '';
    return;
  }
  outputEl.innerHTML = sentences.map(s => `<p class="prior-year-sentence">${s}</p>`).join('');
}

/* ============================================================
   FEATURE: Progress Monitoring Trend Calculator
   ============================================================ */
function addProgressPoint() {
  const skill = document.getElementById('pm-skill')?.value;
  const date  = document.getElementById('pm-date')?.value;
  const score = parseFloat(document.getElementById('pm-score')?.value);
  if (!skill || !date || isNaN(score)) return;

  state.pmDataPoints.push({ skill, date, score });
  state.pmDataPoints.sort((a, b) => a.date.localeCompare(b.date));

  // Reset inputs
  document.getElementById('pm-date').value = '';
  document.getElementById('pm-score').value = '';

  renderPMTable();
  renderPMTrend();
  updateSectionOutput('academic');
}

function renderPMTable() {
  const container = document.getElementById('pm-data-table');
  if (!container) return;
  if (state.pmDataPoints.length === 0) { container.innerHTML = ''; return; }

  let html = '<table class="pm-table"><thead><tr><th>Date</th><th>Skill</th><th>Score</th><th></th></tr></thead><tbody>';
  state.pmDataPoints.forEach((pt, idx) => {
    const fmtDate = new Date(pt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    html += `<tr><td>${fmtDate}</td><td>${pt.skill}</td><td>${pt.score}</td><td><button class="cbm-remove-btn pm-remove" data-idx="${idx}">x</button></td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;

  container.querySelectorAll('.pm-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pmDataPoints.splice(parseInt(btn.dataset.idx), 1);
      renderPMTable();
      renderPMTrend();
      updateSectionOutput('academic');
    });
  });
}

function calculateTrend(points) {
  if (points.length < 2) return null;
  // Linear regression: x = days since first point, y = score
  const t0 = new Date(points[0].date + 'T00:00:00').getTime();
  const data = points.map(p => ({
    x: (new Date(p.date + 'T00:00:00').getTime() - t0) / (7 * 24 * 60 * 60 * 1000), // weeks
    y: p.score
  }));
  const n = data.length;
  const sumX  = data.reduce((s, d) => s + d.x, 0);
  const sumY  = data.reduce((s, d) => s + d.y, 0);
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0);
  const sumX2 = data.reduce((s, d) => s + d.x * d.x, 0);
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, totalWeeks: 0, startScore: points[0].score, endScore: points[points.length - 1].score };
  const slope = (n * sumXY - sumX * sumY) / denom;
  const totalWeeks = data[data.length - 1].x;
  return { slope: Math.round(slope * 100) / 100, totalWeeks: Math.round(totalWeeks * 10) / 10, startScore: points[0].score, endScore: points[points.length - 1].score };
}

function renderPMTrend() {
  const container = document.getElementById('pm-trend-output');
  if (!container) return;
  if (state.pmDataPoints.length < 3) {
    container.innerHTML = state.pmDataPoints.length > 0
      ? '<p class="pm-hint">Add at least 3 data points for trend analysis.</p>'
      : '';
    return;
  }

  // Group by skill
  const bySkill = {};
  state.pmDataPoints.forEach(p => {
    if (!bySkill[p.skill]) bySkill[p.skill] = [];
    bySkill[p.skill].push(p);
  });

  let html = '';
  Object.entries(bySkill).forEach(([skill, points]) => {
    if (points.length < 3) return;
    const trend = calculateTrend(points);
    if (!trend) return;

    const direction = trend.slope > 0.1 ? 'an upward' : trend.slope < -0.1 ? 'a downward' : 'a flat';
    const rateDesc = Math.abs(trend.slope) < 0.1 ? 'minimal change' : `approximately ${Math.abs(trend.slope)} points per week`;
    const totalGain = Math.round((trend.endScore - trend.startScore) * 10) / 10;
    const weeksLabel = trend.totalWeeks === 1 ? 'week' : 'weeks';

    html += `<p class="pm-trend-sentence">${interpolate(`Over a ${trend.totalWeeks}-${weeksLabel} period, {name} demonstrated ${direction} trend in ${skill}, gaining ${rateDesc}. {His} score moved from ${trend.startScore} to ${trend.endScore} (${totalGain >= 0 ? '+' : ''}${totalGain} total).`)}</p>`;
  });
  container.innerHTML = html;
}

function getPMSentences() {
  if (state.pmDataPoints.length < 3) return [];
  const out = [];
  const bySkill = {};
  state.pmDataPoints.forEach(p => {
    if (!bySkill[p.skill]) bySkill[p.skill] = [];
    bySkill[p.skill].push(p);
  });
  Object.entries(bySkill).forEach(([skill, points]) => {
    if (points.length < 3) return;
    const trend = calculateTrend(points);
    if (!trend) return;
    const direction = trend.slope > 0.1 ? 'an upward' : trend.slope < -0.1 ? 'a downward' : 'a flat';
    const rateDesc = Math.abs(trend.slope) < 0.1 ? 'minimal change' : `approximately ${Math.abs(trend.slope)} points per week`;
    const totalGain = Math.round((trend.endScore - trend.startScore) * 10) / 10;
    const weeksLabel = trend.totalWeeks === 1 ? 'week' : 'weeks';
    out.push(interpolate(`Based on progress monitoring data collected over ${trend.totalWeeks} ${weeksLabel}, {name} demonstrated ${direction} trend in ${skill}, with ${rateDesc}. {His} score moved from ${trend.startScore} to ${trend.endScore} (${totalGain >= 0 ? '+' : ''}${totalGain}).`));
  });
  return out;
}

/* ============================================================
   FEATURE: Compliance Checklist
   ============================================================ */
function buildComplianceChecklist() {
  const listEl = document.getElementById('compliance-list');
  if (!listEl) return;

  COMPLIANCE_REQUIREMENTS.forEach(req => {
    state.compliance[req.id] = state.compliance[req.id] || { completed: false, text: '' };

    const item = document.createElement('div');
    item.className = `compliance-item ${req.category}`;
    item.id = `compliance-${req.id}`;

    const categoryBadge = req.category === 'required' ? '<span class="compliance-badge required">Required</span>'
      : req.category === 'conditional' ? '<span class="compliance-badge conditional">Conditional</span>'
      : '<span class="compliance-badge best-practice">Best Practice</span>';

    item.innerHTML = `
      <div class="compliance-item-header">
        <label class="compliance-check-label">
          <input type="checkbox" class="compliance-checkbox" data-req="${req.id}" />
          <span class="compliance-check-mark"></span>
          <strong>${req.label}</strong>
          ${categoryBadge}
        </label>
      </div>
      <p class="compliance-description">${req.description}</p>
      <textarea class="compliance-textarea" data-req="${req.id}" rows="2" placeholder="${req.prompt}"></textarea>
    `;
    listEl.appendChild(item);
  });

  // Event delegation for compliance checkboxes and textareas
  listEl.addEventListener('change', (e) => {
    const cb = e.target;
    if (cb.classList.contains('compliance-checkbox')) {
      const reqId = cb.dataset.req;
      state.compliance[reqId].completed = cb.checked;
      const item = document.getElementById(`compliance-${reqId}`);
      if (item) item.classList.toggle('completed', cb.checked);
      updateComplianceScore();
    }
  });
  listEl.addEventListener('input', (e) => {
    const ta = e.target;
    if (ta.classList.contains('compliance-textarea')) {
      state.compliance[ta.dataset.req].text = ta.value;
    }
  });
  updateComplianceScore();
}

function updateComplianceScore() {
  const scoreEl = document.getElementById('compliance-score');
  if (!scoreEl) return;
  const required = COMPLIANCE_REQUIREMENTS.filter(r => r.category === 'required');
  const completed = required.filter(r => state.compliance[r.id]?.completed);
  const total = required.length;
  const count = completed.length;
  scoreEl.textContent = `${count} / ${total} required`;
  scoreEl.className = `compliance-score ${count === total ? 'all-complete' : count > 0 ? 'partial' : ''}`;
}

/* ============================================================
   FEATURE: Accommodation & SDI Recommender
   ============================================================ */
function updateAccommodations(sectionKey) {
  const accommBox = document.getElementById(`${sectionKey}-accomm-box`);
  const accommEl  = document.getElementById(`${sectionKey}-accomm`);
  if (!accommBox || !accommEl) return;

  const section = SECTIONS[sectionKey];
  const hasNoAnswers = section.questions.some(q => state.answers[q.id] === 'no');
  const isNeed = state.needs[sectionKey] || false;

  if (!hasNoAnswers && !isNeed) {
    accommBox.classList.add('hidden');
    return;
  }

  // Collect accommodation categories from questions answered 'no'
  const categories = new Set();
  section.questions.forEach(q => {
    if (state.answers[q.id] === 'no' && QUESTION_ACCOMMODATION_MAP[q.id]) {
      QUESTION_ACCOMMODATION_MAP[q.id].forEach(cat => categories.add(cat));
    }
  });

  if (categories.size === 0 && isNeed) {
    // Default categories based on section
    const defaults = {
      academic: ['reading_fluency', 'math_computation'],
      communication: ['communication'],
      motor: ['motor'],
      socialemotional: ['social_emotional'],
      adaptive: ['adaptive'],
      vocational: ['adaptive'],
      health: []
    };
    (defaults[sectionKey] || []).forEach(c => categories.add(c));
  }

  if (categories.size === 0) {
    accommBox.classList.add('hidden');
    return;
  }

  accommBox.classList.remove('hidden');
  let html = '';

  categories.forEach(catKey => {
    const cat = ACCOMMODATIONS_SDI[catKey];
    if (!cat) return;
    html += `<div class="accomm-category">`;
    html += `<p class="accomm-category-label">${cat.label}</p>`;
    html += `<div class="accomm-columns">`;
    html += `<div class="accomm-col"><p class="accomm-col-title">Specially Designed Instruction (SDI)</p><ul>`;
    cat.sdi.forEach(s => { html += `<li>${s}</li>`; });
    html += `</ul></div>`;
    html += `<div class="accomm-col"><p class="accomm-col-title">Accommodations</p><ul>`;
    cat.accommodations.forEach(a => { html += `<li>${a}</li>`; });
    html += `</ul></div>`;
    html += `</div></div>`;
  });

  accommEl.innerHTML = html;
}

/* ============================================================
   FEATURE: Standards Alignment
   ============================================================ */
function updateStandards(sectionKey) {
  const standardsBox = document.getElementById(`${sectionKey}-standards-box`);
  const standardsEl  = document.getElementById(`${sectionKey}-standards`);
  if (!standardsBox || !standardsEl) return;

  const section = SECTIONS[sectionKey];
  const hasNoAnswers = section.questions.some(q => state.answers[q.id] === 'no');
  const isNeed = state.needs[sectionKey] || false;

  if (!hasNoAnswers && !isNeed) {
    standardsBox.classList.add('hidden');
    return;
  }

  const grade = getStudentGradeNum();
  const gradeStr = grade !== null ? String(grade) : '3';

  const categories = new Set();
  section.questions.forEach(q => {
    if (state.answers[q.id] === 'no' && QUESTION_STANDARDS_MAP[q.id]) {
      QUESTION_STANDARDS_MAP[q.id].forEach(cat => categories.add(cat));
    }
  });

  if (categories.size === 0) {
    standardsBox.classList.add('hidden');
    return;
  }

  standardsBox.classList.remove('hidden');
  standardsEl.innerHTML = '';

  categories.forEach(catKey => {
    const standards = STANDARDS_MAP[catKey];
    if (!standards) return;
    standards.forEach(s => {
      const std = s.standard.replace(/\{grade\}/g, gradeStr);
      const li = document.createElement('li');
      li.innerHTML = `<strong>${std}</strong>: ${s.description}`;
      standardsEl.appendChild(li);
    });
  });
}

/* ============================================================
   FEATURE: Parent-Friendly Summary Generator
   ============================================================ */
function generateParentFriendly() {
  state.studentName = document.getElementById('studentName').value.trim();
  state.pronouns    = document.getElementById('pronouns').value;

  const card    = document.getElementById('parent-friendly-card');
  const preview = document.getElementById('parent-friendly-preview');
  card.classList.remove('hidden');

  const sName  = state.studentName || 'Your child';
  const grade  = document.getElementById('grade').value.trim();
  const disab  = document.getElementById('disability').value.trim();

  let html = `<div class="doc-section"><h3>A Guide to Your Child's Present Levels of Performance</h3>`;
  html += `<p>Dear Parent/Guardian,</p>`;
  html += `<p>This summary explains how <strong>${sName}</strong> is doing in school right now. We have written it in everyday language so you can easily understand your child's strengths, needs, and next steps.</p>`;

  if (disab) {
    html += `<p><strong>Your child's disability category is:</strong> ${disab}. This means the IEP team has identified specific areas where ${interpolate('{he}')} needs extra support to be successful in school.</p>`;
  }
  html += `</div>`;

  // Glossary of key terms
  html += `<div class="doc-section"><h3>Key Terms Explained</h3>`;
  const glossaryKeys = ['area_of_need', 'sdi', 'accommodation', 'cbm', 'progress_monitoring', 'iep_goal'];
  glossaryKeys.forEach(key => {
    const t = PARENT_FRIENDLY_TEMPLATES[key];
    if (!t) return;
    html += `<p><strong>${t.technical}:</strong> ${interpolate(t.plain)}</p>`;
  });
  html += `</div>`;

  // Section-by-section plain-language summaries
  Object.entries(SECTIONS).forEach(([key, section]) => {
    const hasNoAnswers = section.questions.some(q => state.answers[q.id] === 'no');
    const isNeed       = state.needs[key] || false;
    const flagged      = hasNoAnswers || isNeed;
    const hasAnyAnswer = section.questions.some(q => state.answers[q.id]);
    if (!hasAnyAnswer && !isNeed) return;

    html += `<div class="doc-section"><h3 class="${flagged ? 'need-section' : ''}">${section.label}</h3>`;

    // Strengths
    const strengths = section.questions.filter(q => state.answers[q.id] === 'yes');
    if (strengths.length > 0) {
      html += `<p><strong>What ${sName} is doing well:</strong></p><ul>`;
      strengths.forEach(q => {
        html += `<li>${interpolate(q.yesSentence)}</li>`;
      });
      html += `</ul>`;
    }

    // Needs
    const needs = section.questions.filter(q => state.answers[q.id] === 'no');
    if (needs.length > 0) {
      html += `<p><strong>Where ${sName} needs more help:</strong></p><ul>`;
      needs.forEach(q => {
        html += `<li>${interpolate(q.noSentence)}</li>`;
      });
      html += `</ul>`;
    }

    if (flagged) {
      html += `<p><em>This area has been identified as a focus for ${sName}'s IEP. The school team will provide extra support and track progress in this area.</em></p>`;
    } else {
      html += `<p><em>${sName} is doing well in this area and does not need extra help right now.</em></p>`;
    }

    html += `</div>`;
  });

  // CBM data in plain language
  if (state.cbmEntries.length > 0) {
    html += `<div class="doc-section"><h3>Assessment Results (What the Scores Mean)</h3>`;
    html += `<p>${interpolate(PARENT_FRIENDLY_TEMPLATES.cbm.plain)}</p>`;
    const gapSentences = getBenchmarkGapSentences();
    if (gapSentences.length > 0) {
      html += `<p>Here is how ${sName}'s scores compare to what we expect for ${interpolate('{his}')} grade level:</p><ul>`;
      gapSentences.forEach(s => { html += `<li>${s}</li>`; });
      html += `</ul>`;
    }
    html += `</div>`;
  }

  // Progress monitoring in plain language
  const pmSentences = getPMSentences();
  if (pmSentences.length > 0) {
    html += `<div class="doc-section"><h3>How Your Child Is Progressing</h3>`;
    html += `<p>${interpolate(PARENT_FRIENDLY_TEMPLATES.progress_monitoring.plain)}</p>`;
    pmSentences.forEach(s => { html += `<p>${s}</p>`; });
    html += `</div>`;
  }

  // Closing
  html += `<div class="doc-section"><h3>Questions?</h3>`;
  html += `<p>If you have questions about your child's present levels, goals, or services, please reach out to ${interpolate('{his}')} case manager. You are a valued member of the IEP team, and your input matters.</p>`;
  html += `</div>`;

  preview.innerHTML = html;
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---- Build question cards for every section ---- */
function buildQuestions() {
  Object.entries(SECTIONS).forEach(([sectionKey, sectionData]) => {
    const container = document.getElementById(`${sectionKey}-questions`);
    if (!container) return;

    sectionData.questions.forEach(q => {
      const card = document.createElement('div');
      card.className = 'question-card';
      card.id = `qcard-${q.id}`;

      card.innerHTML = `
        <div class="question-text">${q.text}</div>
        <div class="yes-no-row">
          <button class="yn-btn yes" data-qid="${q.id}" data-val="yes">✓ Yes</button>
          <button class="yn-btn no"  data-qid="${q.id}" data-val="no">✗ No</button>
          <button class="yn-btn na"  data-qid="${q.id}" data-val="na">— N/A</button>
        </div>
        <div class="question-sentence" id="qsentence-${q.id}"></div>
      `;
      container.appendChild(card);
    });
  });
}

/* ---- Handle yes/no/na button clicks ---- */
function handleYesNo(e) {
  const btn = e.target.closest('.yn-btn');
  if (!btn) return;

  const qid = btn.dataset.qid;
  const val  = btn.dataset.val;

  // Store answer
  state.answers[qid] = val;

  // Update button appearance
  const row = btn.closest('.yes-no-row');
  row.querySelectorAll('.yn-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  // Update card style
  const card = btn.closest('.question-card');
  card.classList.remove('answered-yes', 'answered-no');
  if (val === 'yes') card.classList.add('answered-yes');
  if (val === 'no')  card.classList.add('answered-no');

  // Update sentence
  updateQuestionSentence(qid, val);

  // Refresh section output
  const sectionKey = getSectionForQuestion(qid);
  if (sectionKey) {
    updateSectionOutput(sectionKey);
    updateSummary();
  }
}

function updateQuestionSentence(qid, val) {
  const sentenceEl = document.getElementById(`qsentence-${qid}`);
  if (!sentenceEl) return;

  const q = findQuestion(qid);
  if (!q) return;

  if (val === 'na') {
    sentenceEl.textContent = '';
    sentenceEl.className = 'question-sentence';
    return;
  }

  const template = val === 'yes' ? q.yesSentence : q.noSentence;
  sentenceEl.textContent = interpolate(template);
  sentenceEl.className   = `question-sentence ${val === 'yes' ? 'ok' : 'need'}`;
}

function findQuestion(qid) {
  for (const s of Object.values(SECTIONS)) {
    const q = s.questions.find(q => q.id === qid);
    if (q) return q;
  }
  return null;
}

function getSectionForQuestion(qid) {
  for (const [key, s] of Object.entries(SECTIONS)) {
    if (s.questions.some(q => q.id === qid)) return key;
  }
  return null;
}

/* ---- Refresh entire section output text ---- */
function updateSectionOutput(sectionKey) {
  const section  = SECTIONS[sectionKey];
  const outputEl = document.getElementById(`${sectionKey}-output`);
  if (!outputEl) return;

  const isNeed       = state.needs[sectionKey] || false;
  const hasNoAnswers = section.questions.some(q => state.answers[q.id] === 'no');
  const flagged      = hasNoAnswers || isNeed;

  // Collect answered sentences
  const sentences = section.questions
    .map(q => {
      const ans = state.answers[q.id];
      if (!ans || ans === 'na') return null;
      return interpolate(ans === 'yes' ? q.yesSentence : q.noSentence);
    })
    .filter(Boolean);

  // Extra assessment data
  const extraTextarea = document.getElementById(`${sectionKey}-data`);
  const extraText = extraTextarea ? extraTextarea.value.trim() : '';

  // Reading level sentences (academic section only)
  const readingLines = sectionKey === 'academic' ? getAcademicDataSentences() : [];

  const hasContent = sentences.length > 0 || extraText || readingLines.length > 0 || isNeed;

  if (!hasContent) {
    outputEl.innerHTML = '<span style="color:var(--gray-400);font-style:italic;">Answer the questions above to generate present level text.</span>';
    updateGoalSuggestions(sectionKey);
    updateAccommodations(sectionKey);
    updateStandards(sectionKey);
    updateTabIndicator(sectionKey);
    return;
  }

  let html = '';

  // IEP date intro sentence
  const iepDate = formatIEPDate();
  if (iepDate) {
    html += `<p>Based on data gathered as of ${iepDate}, the following reflects ${interpolate("{name}'s")} present levels of performance.</p>`;
  }

  if (extraText) html += `<p>${interpolate(extraText)}</p>`;
  readingLines.forEach(s => { html += `<p>${s}</p>`; });
  sentences.forEach(s => { html += `<p>${s}</p>`; });

  // Area of need closing sentence
  const needSentence = flagged
    ? `Based on current assessment data, ${section.label} is currently identified as an area of need for ${interpolate('{name}')}.`
    : `Based on current assessment data, ${section.label} is not currently identified as an area of need for ${interpolate('{name}')}.`;
  html += `<p><em>${needSentence}</em></p>`;

  outputEl.innerHTML = html;

  // Show/hide goals
  updateGoalSuggestions(sectionKey);

  // Accommodations & SDI
  updateAccommodations(sectionKey);

  // Standards alignment
  updateStandards(sectionKey);

  // Update tab indicator
  updateTabIndicator(sectionKey);
}

/* ---- Show suggested goals when there are 'no' answers or need toggle ---- */
function updateGoalSuggestions(sectionKey) {
  const section   = SECTIONS[sectionKey];
  const goalsBox  = document.getElementById(`${sectionKey}-goals-box`);
  const goalsList = document.getElementById(`${sectionKey}-goals`);
  if (!goalsBox || !goalsList) return;

  const hasNoAnswers = section.questions.some(q => state.answers[q.id] === 'no');
  const isNeed       = state.needs[sectionKey] || false;

  if (!hasNoAnswers && !isNeed) {
    goalsBox.classList.add('hidden');
    return;
  }

  goalsBox.classList.remove('hidden');
  goalsList.innerHTML = '';

  const goals = section.goals || {};
  Object.values(goals).forEach(goalTemplate => {
    const li = document.createElement('li');
    li.textContent = interpolate(goalTemplate);
    goalsList.appendChild(li);
  });
}

/* ---- Area-of-need toggle ---- */
function handleNeedToggle(e) {
  const cb = e.target;
  if (!cb.classList.contains('need-checkbox')) return;

  const sectionKey = cb.dataset.section;
  state.needs[sectionKey] = cb.checked;

  // Update the card visual
  const panel = document.querySelector(`.section-panel[data-section="${sectionKey}"]`);
  if (panel) {
    let banner = panel.querySelector('.need-banner');
    if (cb.checked) {
      if (!banner) {
        banner = document.createElement('div');
        banner.className = 'need-banner';
        banner.innerHTML = '⚑ This section is marked as an <strong>Area of Need</strong>.';
        const sectionHeader = panel.querySelector('.section-header');
        sectionHeader.insertAdjacentElement('afterend', banner);
      }
    } else {
      if (banner) banner.remove();
    }
  }

  updateSectionOutput(sectionKey);
  updateTabIndicator(sectionKey);
  updateSummary();
}

/* ---- Tab highlighting ---- */
function updateTabIndicator(sectionKey) {
  const tab      = document.querySelector(`.tab[data-section="${sectionKey}"]`);
  const section  = SECTIONS[sectionKey];
  if (!tab || !section) return;

  const hasNoAnswers = section.questions.some(q => state.answers[q.id] === 'no');
  const isNeed       = state.needs[sectionKey] || false;

  if (hasNoAnswers || isNeed) {
    tab.classList.add('needs-attention');
  } else {
    tab.classList.remove('needs-attention');
  }
}

/* ---- Summary panel ---- */
function updateSummary() {
  const summaryEl = document.getElementById('needs-summary');
  if (!summaryEl) return;

  const chips = Object.entries(SECTIONS).map(([key, s]) => {
    const hasAnyAnswer = s.questions.some(q => state.answers[q.id]);
    const hasNoAnswers = s.questions.some(q => state.answers[q.id] === 'no');
    const isNeed       = state.needs[key] || false;
    const reviewed     = hasAnyAnswer || isNeed;
    const flagged      = hasNoAnswers || isNeed;

    let chipClass, chipLabel;
    if (!reviewed) {
      chipClass = 'not-reviewed';
      chipLabel = `${s.label} <span style="font-weight:400">— Not reviewed</span>`;
    } else if (flagged) {
      chipClass = 'is-need';
      chipLabel = `${s.label} — <strong>Area of Need</strong>`;
    } else {
      chipClass = 'no-need';
      chipLabel = s.label;
    }

    return `
      <div class="need-chip ${chipClass}">
        <span class="dot"></span>
        ${chipLabel}
      </div>
    `;
  }).join('');

  summaryEl.innerHTML = `<div class="needs-summary-grid">${chips}</div>`;
}

/* ---- Generate full document ---- */
function generateDocument() {
  // Sync state before generating so pronouns and name are always current
  state.studentName = document.getElementById('studentName').value.trim();
  state.pronouns    = document.getElementById('pronouns').value;

  const preview = document.getElementById('document-preview');

  const sName    = document.getElementById('studentName').value.trim() || 'Student';
  const dob      = document.getElementById('dob').value;
  const grade    = document.getElementById('grade').value.trim();
  const school   = document.getElementById('school').value.trim();
  const teacher  = document.getElementById('teacher').value.trim();
  const iepDate  = document.getElementById('iepDate').value;
  const disab    = document.getElementById('disability').value.trim();

  const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'}) : '';

  let html = `
    <div class="doc-section">
      <h3>Student Information</h3>
      <p><strong>Student Name:</strong> ${sName}</p>
      ${dob    ? `<p><strong>Date of Birth:</strong> ${fmtDate(dob)}</p>` : ''}
      ${grade  ? `<p><strong>Grade:</strong> ${grade}</p>` : ''}
      ${school ? `<p><strong>School:</strong> ${school}</p>` : ''}
      ${teacher? `<p><strong>Case Manager / Teacher:</strong> ${teacher}</p>` : ''}
      ${iepDate? `<p><strong>IEP Date:</strong> ${fmtDate(iepDate)}</p>` : ''}
      ${disab  ? `<p><strong>Disability:</strong> ${disab}</p>` : ''}
    </div>
  `;

  const iepDateFmt = formatIEPDate();

  Object.entries(SECTIONS).forEach(([key, section]) => {
    const hasNoAnswers = section.questions.some(q => state.answers[q.id] === 'no');
    const isNeed       = state.needs[key] || false;
    const flagged      = hasNoAnswers || isNeed;

    const extraEl    = document.getElementById(`${key}-data`);
    const extraText  = extraEl ? extraEl.value.trim() : '';

    const readingLines = key === 'academic' ? getAcademicDataSentences() : [];

    const sentences = section.questions
      .map(q => {
        const ans = state.answers[q.id];
        if (!ans || ans === 'na') return null;
        return interpolate(ans === 'yes' ? q.yesSentence : q.noSentence);
      })
      .filter(Boolean);

    if (sentences.length === 0 && !extraText && !flagged && readingLines.length === 0) return;

    const needSentence = flagged
      ? `Based on current assessment data, ${section.label} is currently identified as an area of need for ${interpolate('{name}')}.`
      : `Based on current assessment data, ${section.label} is not currently identified as an area of need for ${interpolate('{name}')}.`;

    // Collect accommodation categories for this section
    const accommCategories = new Set();
    if (flagged) {
      section.questions.forEach(q => {
        if (state.answers[q.id] === 'no' && QUESTION_ACCOMMODATION_MAP[q.id]) {
          QUESTION_ACCOMMODATION_MAP[q.id].forEach(cat => accommCategories.add(cat));
        }
      });
    }

    // Collect standards
    const standardsCategories = new Set();
    if (flagged) {
      section.questions.forEach(q => {
        if (state.answers[q.id] === 'no' && QUESTION_STANDARDS_MAP[q.id]) {
          QUESTION_STANDARDS_MAP[q.id].forEach(cat => standardsCategories.add(cat));
        }
      });
    }

    const grade = getStudentGradeNum();
    const gradeStr = grade !== null ? String(grade) : '3';

    let accommHtml = '';
    if (accommCategories.size > 0) {
      accommHtml = '<p><strong>Recommended Accommodations & SDI:</strong></p><ul>';
      accommCategories.forEach(catKey => {
        const cat = ACCOMMODATIONS_SDI[catKey];
        if (!cat) return;
        cat.sdi.forEach(s => { accommHtml += `<li><em>SDI:</em> ${s}</li>`; });
        cat.accommodations.slice(0, 3).forEach(a => { accommHtml += `<li><em>Accommodation:</em> ${a}</li>`; });
      });
      accommHtml += '</ul>';
    }

    let standardsHtml = '';
    if (standardsCategories.size > 0) {
      standardsHtml = '<p><strong>Aligned Standards:</strong></p><ul>';
      standardsCategories.forEach(catKey => {
        const standards = STANDARDS_MAP[catKey];
        if (!standards) return;
        standards.slice(0, 3).forEach(s => {
          standardsHtml += `<li>${s.standard.replace(/\{grade\}/g, gradeStr)}: ${s.description}</li>`;
        });
      });
      standardsHtml += '</ul>';
    }

    html += `
      <div class="doc-section">
        <h3 class="${flagged ? 'need-section' : ''}">${section.label}${flagged ? ' ★ Area of Need' : ''}</h3>
        ${iepDateFmt ? `<p>Based on data gathered as of ${iepDateFmt}, the following reflects ${interpolate("{name}'s")} present levels of performance.</p>` : ''}
        ${extraText ? `<p>${interpolate(extraText)}</p>` : ''}
        ${readingLines.map(s => `<p>${s}</p>`).join('')}
        ${sentences.map(s => `<p>${s}</p>`).join('')}
        <p><em>${needSentence}</em></p>
        ${accommHtml}
        ${standardsHtml}
      </div>
    `;
  });

  // Compliance summary in document
  const complianceRequired = COMPLIANCE_REQUIREMENTS.filter(r => r.category === 'required');
  const complianceCompleted = complianceRequired.filter(r => state.compliance[r.id]?.completed);
  const complianceTexts = COMPLIANCE_REQUIREMENTS.filter(r => state.compliance[r.id]?.text?.trim());
  if (complianceTexts.length > 0) {
    html += `<div class="doc-section"><h3>Additional Required Components</h3>`;
    complianceTexts.forEach(r => {
      html += `<p><strong>${r.label}:</strong> ${interpolate(state.compliance[r.id].text)}</p>`;
    });
    html += `</div>`;
  }

  preview.innerHTML = html;

  // Scroll the document preview into view so the user can see the result
  preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---- Print ---- */
function printDocument() {
  generateDocument();
  setTimeout(() => window.print(), 200);
}

/* ---- Copy to clipboard ---- */
function copyToClipboard() {
  generateDocument();
  const preview = document.getElementById('document-preview');
  const text = preview.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

/* ---- Tab navigation ---- */
function handleTabClick(e) {
  const tab = e.target.closest('.tab');
  if (!tab) return;

  const target = tab.dataset.section;

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
  const panel = document.querySelector(`.section-panel[data-section="${target}"]`);
  if (panel) panel.classList.add('active');
}

/* ---- Student info change listeners ---- */
function handleStudentInfoChange() {
  state.studentName = document.getElementById('studentName').value.trim();
  state.pronouns    = document.getElementById('pronouns').value;

  // Re-render all answered question sentences
  Object.entries(state.answers).forEach(([qid, val]) => {
    if (val && val !== 'na') updateQuestionSentence(qid, val);
  });

  // Refresh all section outputs
  Object.keys(SECTIONS).forEach(key => updateSectionOutput(key));
  renderCBMAddedList();
  updateSummary();
}

/* ---- Extra textarea listeners ---- */
function handleExtraTextChange(e) {
  const ta = e.target;
  if (!ta.tagName || ta.tagName !== 'TEXTAREA') return;
  const id = ta.id; // e.g. "academic-data"
  const sectionKey = id.replace('-data', '');
  if (SECTIONS[sectionKey]) updateSectionOutput(sectionKey);
}

/* ---- Init ---- */
function init() {
  buildQuestions();
  buildCBMPicker();
  buildComplianceChecklist();
  updateSummary();

  // Tab clicks
  document.getElementById('section-tabs').addEventListener('click', handleTabClick);

  // Yes/No button clicks (delegated)
  document.getElementById('sections-container').addEventListener('click', handleYesNo);

  // Need toggle
  document.getElementById('sections-container').addEventListener('change', handleNeedToggle);

  // Student info
  ['studentName', 'pronouns', 'dob', 'grade', 'school', 'teacher', 'iepDate', 'disability']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', handleStudentInfoChange);
    });

  // Extra textareas
  document.getElementById('sections-container').addEventListener('input', handleExtraTextChange);

  // Academic dropdowns (reading levels, fluency)
  ['ac-instr-level', 'ac-indep-level', 'ac-instr-wpm', 'ac-indep-wpm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => updateSectionOutput('academic'));
  });

  // CBM assessment picker
  const cbmPicker = document.getElementById('cbm-picker');
  if (cbmPicker) cbmPicker.addEventListener('change', (e) => renderCBMFields(e.target.value));

  // Prior year comparison inputs
  ['prior-orf', 'current-orf', 'prior-math', 'current-math', 'prior-reading', 'current-reading'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      renderPriorYearOutput();
      updateSectionOutput('academic');
    });
  });

  // Progress monitoring
  const pmAddBtn = document.getElementById('pm-add-btn');
  if (pmAddBtn) pmAddBtn.addEventListener('click', addProgressPoint);

  // Ensure pronouns changes are captured via both input and change events
  const pronounsEl = document.getElementById('pronouns');
  if (pronounsEl) pronounsEl.addEventListener('change', handleStudentInfoChange);

  // Document actions
  document.getElementById('generate-btn').addEventListener('click', generateDocument);
  document.getElementById('parent-friendly-btn').addEventListener('click', generateParentFriendly);
  document.getElementById('print-btn').addEventListener('click', printDocument);
  document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

  // Parent-friendly print/copy
  const parentPrintBtn = document.getElementById('parent-print-btn');
  if (parentPrintBtn) parentPrintBtn.addEventListener('click', () => {
    generateParentFriendly();
    setTimeout(() => window.print(), 200);
  });
  const parentCopyBtn = document.getElementById('parent-copy-btn');
  if (parentCopyBtn) parentCopyBtn.addEventListener('click', () => {
    generateParentFriendly();
    const text = document.getElementById('parent-friendly-preview').innerText;
    navigator.clipboard.writeText(text).then(() => {
      parentCopyBtn.textContent = 'Copied!';
      setTimeout(() => { parentCopyBtn.textContent = 'Copy to Clipboard'; }, 2000);
    }).catch(() => {});
  });
}

document.addEventListener('DOMContentLoaded', init);
