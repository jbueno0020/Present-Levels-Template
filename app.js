/* =========================================================
   app.js – Present Levels Generator Application Logic
   ========================================================= */

/* ---- State ---- */
const state = {
  pronouns: 'he',
  studentName: '',
  answers: {},   // { questionId: 'yes' | 'no' | 'na' }
  needs: {}      // { sectionKey: boolean }
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

/* ---- IEP date formatter ---- */
function formatIEPDate() {
  const val = document.getElementById('iepDate').value;
  if (!val) return '';
  return new Date(val + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ---- Academic data sentences (reading levels, fluency, CBMs) ---- */
function getAcademicDataSentences() {
  const instrLevel  = document.getElementById('ac-instr-level');
  const indepLevel  = document.getElementById('ac-indep-level');
  const instrWPM    = document.getElementById('ac-instr-wpm');
  const indepWPM    = document.getElementById('ac-indep-wpm');
  const mathExcel   = document.getElementById('ac-math-excel');
  const mapMath     = document.getElementById('ac-map-math');
  const mapReading  = document.getElementById('ac-map-reading');
  const out = [];
  if (instrLevel?.value)  out.push(interpolate(`{name} reads instructionally at ${instrLevel.value}.`));
  if (indepLevel?.value)  out.push(interpolate(`{name} reads independently at ${indepLevel.value}.`));
  if (instrWPM?.value)    out.push(interpolate(`{name}'s oral reading fluency at the instructional level is ${instrWPM.value}.`));
  if (indepWPM?.value)    out.push(interpolate(`{name}'s oral reading fluency at the independent level is ${indepWPM.value}.`));
  if (mathExcel?.value)   out.push(interpolate(`On the Math Excel mathematics curriculum-based measure (CBM), {name} performed at ${mathExcel.value}.`));
  if (mapMath?.value)     out.push(interpolate(`{name} earned a RIT score of ${mapMath.value} on the MAP Growth Mathematics assessment.`));
  if (mapReading?.value)  out.push(interpolate(`{name} earned a RIT score of ${mapReading.value} on the MAP Growth Reading assessment.`));
  return out;
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

    html += `
      <div class="doc-section">
        <h3 class="${flagged ? 'need-section' : ''}">${section.label}${flagged ? ' ★ Area of Need' : ''}</h3>
        ${iepDateFmt ? `<p>Based on data gathered as of ${iepDateFmt}, the following reflects ${interpolate("{name}'s")} present levels of performance.</p>` : ''}
        ${extraText ? `<p>${interpolate(extraText)}</p>` : ''}
        ${readingLines.map(s => `<p>${s}</p>`).join('')}
        ${sentences.map(s => `<p>${s}</p>`).join('')}
        <p><em>${needSentence}</em></p>
      </div>
    `;
  });

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

  // Academic dropdowns (reading levels, fluency, CBMs)
  ['ac-instr-level', 'ac-indep-level', 'ac-instr-wpm', 'ac-indep-wpm',
   'ac-math-excel', 'ac-map-math', 'ac-map-reading'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => updateSectionOutput('academic'));
  });

  // Ensure pronouns changes are captured via both input and change events
  const pronounsEl = document.getElementById('pronouns');
  if (pronounsEl) pronounsEl.addEventListener('change', handleStudentInfoChange);

  // Document actions
  document.getElementById('generate-btn').addEventListener('click', generateDocument);
  document.getElementById('print-btn').addEventListener('click', printDocument);
  document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
}

document.addEventListener('DOMContentLoaded', init);
