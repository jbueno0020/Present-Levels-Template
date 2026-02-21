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

  const name = state.studentName || 'The student';
  const isNeed = state.needs[sectionKey] || false;

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

  if (sentences.length === 0 && !extraText) {
    outputEl.innerHTML = '<span style="color:var(--gray-400);font-style:italic;">Answer the questions above to generate present level text.</span>';
  } else {
    let html = '';
    if (extraText) {
      html += `<p>${interpolate(extraText)}</p>`;
    }
    sentences.forEach(s => { html += `<p>${s}</p>`; });
    outputEl.innerHTML = html;
  }

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
    const hasNoAnswers = s.questions.some(q => state.answers[q.id] === 'no');
    const isNeed       = state.needs[key] || false;
    const flagged      = hasNoAnswers || isNeed;

    return `
      <div class="need-chip ${flagged ? 'is-need' : 'no-need'}">
        <span class="dot"></span>
        ${s.label}${flagged ? ' — <strong>Area of Need</strong>' : ''}
      </div>
    `;
  }).join('');

  summaryEl.innerHTML = `<div class="needs-summary-grid">${chips}</div>`;
}

/* ---- Generate full document ---- */
function generateDocument() {
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

  Object.entries(SECTIONS).forEach(([key, section]) => {
    const hasNoAnswers = section.questions.some(q => state.answers[q.id] === 'no');
    const isNeed       = state.needs[key] || false;
    const flagged      = hasNoAnswers || isNeed;

    const extraEl    = document.getElementById(`${key}-data`);
    const extraText  = extraEl ? extraEl.value.trim() : '';

    const sentences = section.questions
      .map(q => {
        const ans = state.answers[q.id];
        if (!ans || ans === 'na') return null;
        return interpolate(ans === 'yes' ? q.yesSentence : q.noSentence);
      })
      .filter(Boolean);

    if (sentences.length === 0 && !extraText && !flagged) return; // skip empty untouched sections

    html += `
      <div class="doc-section">
        <h3 class="${flagged ? 'need-section' : ''}">${section.label}${flagged ? ' ★ Area of Need' : ''}</h3>
        ${extraText ? `<p>${interpolate(extraText)}</p>` : ''}
        ${sentences.map(s => `<p>${s}</p>`).join('')}
        ${(sentences.length === 0 && !extraText) ? '<p><em>No information entered for this section.</em></p>' : ''}
      </div>
    `;
  });

  preview.innerHTML = html;
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

  // Document actions
  document.getElementById('generate-btn').addEventListener('click', generateDocument);
  document.getElementById('print-btn').addEventListener('click', printDocument);
  document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
}

document.addEventListener('DOMContentLoaded', init);
