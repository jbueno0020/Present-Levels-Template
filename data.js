/* =========================================================
   data.js – Question bank, sentence templates, goal bank,
             and Curriculum-Based Measurement (CBM) definitions
   =========================================================
   Each question has:
     id       – unique key
     text     – question shown to user
     yesSentence  – sentence used when answer = YES (not an area of concern)
     noSentence   – sentence used when answer = NO  (area of need)

   Pronouns are substituted at render time:
     {name}  – student first name
     {he}    – he/she/they
     {his}   – his/her/their
     {him}   – him/her/them
     {He}    – capitalised he/she/they
     {His}   – capitalised his/her/their
   ========================================================= */

/* ----------------------------------------------------------
   CBM ASSESSMENTS – Curriculum-Based Measurement Tools
   Each assessment defines:
     id       – unique key
     name     – display name
     category – subject area(s)
     grades   – grade range
     fields   – array of input fields
       id          – field key (unique within the assessment)
       label       – display label
       type        – 'select' | 'number' | 'text'
       options     – (select only) array of { value, label }
       placeholder – (number/text) placeholder text
       suffix      – (optional) unit label appended to the value
       sentence    – template string; {value} is replaced with the
                     user-entered data, plus pronoun tokens
   ---------------------------------------------------------- */
const CBM_ASSESSMENTS = [

  /* ---- DIBELS 8th Edition ---- */
  {
    id: 'dibels',
    name: 'DIBELS 8th Edition',
    category: 'Reading',
    grades: 'K–8',
    fields: [
      {
        id: 'composite',
        label: 'Composite Score Level',
        type: 'select',
        options: [
          { value: 'At/Above Benchmark', label: 'At/Above Benchmark' },
          { value: 'Below Benchmark', label: 'Below Benchmark' },
          { value: 'Well Below Benchmark', label: 'Well Below Benchmark' }
        ],
        sentence: 'On the DIBELS 8th Edition, {name} scored at the {value} level on the Composite Score.'
      },
      {
        id: 'orf_wcpm',
        label: 'Oral Reading Fluency (WCPM)',
        type: 'number',
        placeholder: 'e.g. 45',
        suffix: 'WCPM',
        sentence: '{name} read {value} words correct per minute (WCPM) on the DIBELS Oral Reading Fluency measure.'
      },
      {
        id: 'orf_accuracy',
        label: 'ORF Accuracy (%)',
        type: 'number',
        placeholder: 'e.g. 92',
        suffix: '%',
        sentence: '{name} demonstrated {value}% accuracy on the DIBELS Oral Reading Fluency measure.'
      },
      {
        id: 'nwf_cls',
        label: 'Nonsense Word Fluency — Correct Letter Sounds',
        type: 'number',
        placeholder: 'e.g. 30',
        sentence: '{name} produced {value} correct letter sounds per minute on the DIBELS Nonsense Word Fluency measure.'
      },
      {
        id: 'nwf_wrc',
        label: 'Nonsense Word Fluency — Whole Words Read',
        type: 'number',
        placeholder: 'e.g. 8',
        sentence: '{name} read {value} whole words correctly per minute on the DIBELS Nonsense Word Fluency measure.'
      },
      {
        id: 'psf',
        label: 'Phoneme Segmentation Fluency',
        type: 'number',
        placeholder: 'e.g. 40',
        sentence: '{name} correctly segmented {value} phonemes per minute on the DIBELS Phoneme Segmentation Fluency measure.'
      },
      {
        id: 'lnf',
        label: 'Letter Naming Fluency',
        type: 'number',
        placeholder: 'e.g. 35',
        sentence: '{name} named {value} letters per minute on the DIBELS Letter Naming Fluency measure.'
      },
      {
        id: 'wrf',
        label: 'Word Reading Fluency',
        type: 'number',
        placeholder: 'e.g. 25',
        sentence: '{name} read {value} words correctly per minute on the DIBELS Word Reading Fluency measure.'
      },
      {
        id: 'maze',
        label: 'Maze (Comprehension)',
        type: 'number',
        placeholder: 'e.g. 12',
        sentence: '{name} answered {value} maze items correctly on the DIBELS Maze comprehension measure.'
      }
    ]
  },

  /* ---- Acadience Reading ---- */
  {
    id: 'acadience',
    name: 'Acadience Reading',
    category: 'Reading',
    grades: 'K–6',
    fields: [
      {
        id: 'composite',
        label: 'Composite Score Level',
        type: 'select',
        options: [
          { value: 'At/Above Benchmark', label: 'At/Above Benchmark' },
          { value: 'Below Benchmark', label: 'Below Benchmark' },
          { value: 'Well Below Benchmark', label: 'Well Below Benchmark' }
        ],
        sentence: 'On the Acadience Reading assessment, {name} scored at the {value} level on the Composite Score.'
      },
      {
        id: 'orf_wcpm',
        label: 'Oral Reading Fluency (WCPM)',
        type: 'number',
        placeholder: 'e.g. 55',
        suffix: 'WCPM',
        sentence: '{name} read {value} words correct per minute (WCPM) on the Acadience Oral Reading Fluency measure.'
      },
      {
        id: 'orf_accuracy',
        label: 'ORF Accuracy (%)',
        type: 'number',
        placeholder: 'e.g. 95',
        suffix: '%',
        sentence: '{name} demonstrated {value}% accuracy on the Acadience Oral Reading Fluency measure.'
      },
      {
        id: 'nwf_cls',
        label: 'Nonsense Word Fluency — Correct Letter Sounds',
        type: 'number',
        placeholder: 'e.g. 28',
        sentence: '{name} produced {value} correct letter sounds per minute on the Acadience Nonsense Word Fluency measure.'
      },
      {
        id: 'maze',
        label: 'Maze (Comprehension)',
        type: 'number',
        placeholder: 'e.g. 10',
        sentence: '{name} answered {value} maze items correctly on the Acadience Maze comprehension measure.'
      }
    ]
  },

  /* ---- AIMSweb Plus ---- */
  {
    id: 'aimsweb',
    name: 'aimswebPlus',
    category: 'Reading & Math',
    grades: 'K–8',
    fields: [
      {
        id: 'rcbm',
        label: 'Reading CBM — Oral Reading Fluency (WCPM)',
        type: 'number',
        placeholder: 'e.g. 60',
        suffix: 'WCPM',
        sentence: '{name} read {value} words correct per minute on the aimswebPlus Reading CBM (R-CBM) measure.'
      },
      {
        id: 'maze',
        label: 'Maze — Correct Responses',
        type: 'number',
        placeholder: 'e.g. 14',
        sentence: '{name} correctly identified {value} maze items on the aimswebPlus Maze comprehension measure.'
      },
      {
        id: 'mcomp',
        label: 'Math Computation (M-COMP) — Digits Correct',
        type: 'number',
        placeholder: 'e.g. 22',
        sentence: '{name} answered {value} digits correct on the aimswebPlus Math Computation (M-COMP) measure.'
      },
      {
        id: 'mcap',
        label: 'Math Concepts & Applications (M-CAP) — Correct',
        type: 'number',
        placeholder: 'e.g. 18',
        sentence: '{name} answered {value} items correctly on the aimswebPlus Math Concepts and Applications (M-CAP) measure.'
      },
      {
        id: 'percentile',
        label: 'National Percentile Rank',
        type: 'number',
        placeholder: 'e.g. 35',
        sentence: '{name} scored at the {value}th national percentile on the aimswebPlus assessment.'
      },
      {
        id: 'tier',
        label: 'Benchmark Status / Tier',
        type: 'select',
        options: [
          { value: 'Tier 1 (low risk — at or above benchmark)', label: 'Tier 1 — At/Above Benchmark' },
          { value: 'Tier 2 (some risk — below benchmark)', label: 'Tier 2 — Below Benchmark' },
          { value: 'Tier 3 (high risk — well below benchmark)', label: 'Tier 3 — Well Below Benchmark' }
        ],
        sentence: '{name} is currently placed at {value} on the aimswebPlus assessment.'
      }
    ]
  },

  /* ---- easyCBM ---- */
  {
    id: 'easycbm',
    name: 'easyCBM',
    category: 'Reading & Math',
    grades: 'K–8',
    fields: [
      {
        id: 'prf',
        label: 'Passage Reading Fluency (WCPM)',
        type: 'number',
        placeholder: 'e.g. 52',
        suffix: 'WCPM',
        sentence: '{name} read {value} words correct per minute on the easyCBM Passage Reading Fluency measure.'
      },
      {
        id: 'reading_score',
        label: 'Reading Comprehension Score',
        type: 'number',
        placeholder: 'e.g. 12',
        sentence: '{name} scored {value} on the easyCBM Reading Comprehension measure.'
      },
      {
        id: 'math_score',
        label: 'Math Score',
        type: 'number',
        placeholder: 'e.g. 10',
        sentence: '{name} scored {value} on the easyCBM Mathematics measure.'
      },
      {
        id: 'risk',
        label: 'Risk Level',
        type: 'select',
        options: [
          { value: 'Low Risk (at or above grade-level benchmark)', label: 'Low Risk' },
          { value: 'Some Risk (approaching grade-level benchmark)', label: 'Some Risk' },
          { value: 'High Risk (below grade-level benchmark)', label: 'High Risk' }
        ],
        sentence: 'Based on the easyCBM assessment, {name} is identified as {value}.'
      }
    ]
  },

  /* ---- FAST (FastBridge) ---- */
  {
    id: 'fast',
    name: 'FAST (FastBridge)',
    category: 'Reading & Math',
    grades: 'K–8',
    fields: [
      {
        id: 'cbmreading',
        label: 'CBMreading — Oral Reading Fluency (WCPM)',
        type: 'number',
        placeholder: 'e.g. 48',
        suffix: 'WCPM',
        sentence: '{name} read {value} words correct per minute on the FAST CBMreading measure.'
      },
      {
        id: 'areading',
        label: 'aReading Scaled Score',
        type: 'number',
        placeholder: 'e.g. 475',
        sentence: '{name} earned a scaled score of {value} on the FAST aReading adaptive assessment.'
      },
      {
        id: 'cbmmath',
        label: 'CBMmath Score',
        type: 'number',
        placeholder: 'e.g. 20',
        sentence: '{name} scored {value} on the FAST CBMmath measure.'
      },
      {
        id: 'amath',
        label: 'aMath Scaled Score',
        type: 'number',
        placeholder: 'e.g. 210',
        sentence: '{name} earned a scaled score of {value} on the FAST aMath adaptive assessment.'
      },
      {
        id: 'risk',
        label: 'Risk Level',
        type: 'select',
        options: [
          { value: 'Low Risk (at or above benchmark)', label: 'Low Risk' },
          { value: 'Some Risk (approaching benchmark)', label: 'Some Risk' },
          { value: 'High Risk (below benchmark)', label: 'High Risk' }
        ],
        sentence: 'Based on the FAST assessment, {name} is identified as {value}.'
      }
    ]
  },

  /* ---- i-Ready (Curriculum Associates) ---- */
  {
    id: 'iready',
    name: 'i-Ready Diagnostic',
    category: 'Reading & Math',
    grades: 'K–12',
    fields: [
      {
        id: 'reading_scale',
        label: 'Reading Scale Score',
        type: 'number',
        placeholder: 'e.g. 450',
        sentence: '{name} earned a reading scale score of {value} on the i-Ready Diagnostic assessment.'
      },
      {
        id: 'reading_placement',
        label: 'Reading Grade-Level Placement',
        type: 'select',
        options: [
          { value: 'On or Above Grade Level in Reading', label: 'On or Above Grade Level' },
          { value: 'One Grade Level Below in Reading', label: 'One Grade Below' },
          { value: 'Two or More Grade Levels Below in Reading', label: 'Two or More Grades Below' }
        ],
        sentence: '{name} is currently performing {value} based on the i-Ready Diagnostic.'
      },
      {
        id: 'math_scale',
        label: 'Math Scale Score',
        type: 'number',
        placeholder: 'e.g. 420',
        sentence: '{name} earned a math scale score of {value} on the i-Ready Diagnostic assessment.'
      },
      {
        id: 'math_placement',
        label: 'Math Grade-Level Placement',
        type: 'select',
        options: [
          { value: 'On or Above Grade Level in Math', label: 'On or Above Grade Level' },
          { value: 'One Grade Level Below in Math', label: 'One Grade Below' },
          { value: 'Two or More Grade Levels Below in Math', label: 'Two or More Grades Below' }
        ],
        sentence: '{name} is currently performing {value} based on the i-Ready Diagnostic.'
      },
      {
        id: 'overall_level',
        label: 'Overall Performance Level',
        type: 'select',
        options: [
          { value: 'Exceeds Standards', label: 'Exceeds Standards' },
          { value: 'Meets Standards', label: 'Meets Standards' },
          { value: 'Approaching Standards', label: 'Approaching Standards' },
          { value: 'Needs Support', label: 'Needs Support' }
        ],
        sentence: 'Overall, {name} is performing at the {value} level on the i-Ready Diagnostic assessment.'
      }
    ]
  },

  /* ---- MAP Growth (NWEA) ---- */
  {
    id: 'map',
    name: 'MAP Growth (NWEA)',
    category: 'Reading & Math',
    grades: 'K–12',
    fields: [
      {
        id: 'reading_rit',
        label: 'Reading RIT Score',
        type: 'number',
        placeholder: 'e.g. 195',
        sentence: '{name} earned a RIT score of {value} on the MAP Growth Reading assessment.'
      },
      {
        id: 'reading_percentile',
        label: 'Reading Percentile Rank',
        type: 'number',
        placeholder: 'e.g. 42',
        sentence: '{name} scored at the {value}th percentile in Reading on the MAP Growth assessment.'
      },
      {
        id: 'math_rit',
        label: 'Math RIT Score',
        type: 'number',
        placeholder: 'e.g. 205',
        sentence: '{name} earned a RIT score of {value} on the MAP Growth Mathematics assessment.'
      },
      {
        id: 'math_percentile',
        label: 'Math Percentile Rank',
        type: 'number',
        placeholder: 'e.g. 38',
        sentence: '{name} scored at the {value}th percentile in Mathematics on the MAP Growth assessment.'
      },
      {
        id: 'language_rit',
        label: 'Language Usage RIT Score',
        type: 'number',
        placeholder: 'e.g. 200',
        sentence: '{name} earned a RIT score of {value} on the MAP Growth Language Usage assessment.'
      }
    ]
  },

  /* ---- Star Assessments (Renaissance) ---- */
  {
    id: 'star',
    name: 'Star Assessments (Renaissance)',
    category: 'Reading & Math',
    grades: 'K–12',
    fields: [
      {
        id: 'reading_ss',
        label: 'Star Reading Scaled Score',
        type: 'number',
        placeholder: 'e.g. 450',
        sentence: '{name} earned a scaled score of {value} on the Star Reading assessment.'
      },
      {
        id: 'reading_ge',
        label: 'Star Reading Grade Equivalent',
        type: 'text',
        placeholder: 'e.g. 3.5',
        sentence: '{name} is reading at a {value} grade equivalent on the Star Reading assessment.'
      },
      {
        id: 'reading_pr',
        label: 'Star Reading Percentile Rank',
        type: 'number',
        placeholder: 'e.g. 40',
        sentence: '{name} scored at the {value}th percentile on the Star Reading assessment.'
      },
      {
        id: 'math_ss',
        label: 'Star Math Scaled Score',
        type: 'number',
        placeholder: 'e.g. 520',
        sentence: '{name} earned a scaled score of {value} on the Star Math assessment.'
      },
      {
        id: 'math_ge',
        label: 'Star Math Grade Equivalent',
        type: 'text',
        placeholder: 'e.g. 2.8',
        sentence: '{name} is performing at a {value} grade equivalent on the Star Math assessment.'
      },
      {
        id: 'math_pr',
        label: 'Star Math Percentile Rank',
        type: 'number',
        placeholder: 'e.g. 35',
        sentence: '{name} scored at the {value}th percentile on the Star Math assessment.'
      }
    ]
  },

  /* ---- Star CBM (Renaissance) ---- */
  {
    id: 'starcbm',
    name: 'Star CBM (Renaissance)',
    category: 'Reading & Math',
    grades: 'K–6',
    fields: [
      {
        id: 'reading_wcpm',
        label: 'Star CBM Reading — Oral Reading Fluency (WCPM)',
        type: 'number',
        placeholder: 'e.g. 55',
        suffix: 'WCPM',
        sentence: '{name} read {value} words correct per minute on the Star CBM Reading measure.'
      },
      {
        id: 'reading_benchmark',
        label: 'Star CBM Reading — Benchmark Status',
        type: 'select',
        options: [
          { value: 'At/Above Benchmark', label: 'At/Above Benchmark' },
          { value: 'On Watch', label: 'On Watch' },
          { value: 'Intervention', label: 'Intervention' },
          { value: 'Urgent Intervention', label: 'Urgent Intervention' }
        ],
        sentence: '{name} is performing at the {value} level on the Star CBM Reading assessment.'
      },
      {
        id: 'math_score',
        label: 'Star CBM Math Score',
        type: 'number',
        placeholder: 'e.g. 18',
        sentence: '{name} scored {value} on the Star CBM Math assessment.'
      },
      {
        id: 'math_benchmark',
        label: 'Star CBM Math — Benchmark Status',
        type: 'select',
        options: [
          { value: 'At/Above Benchmark', label: 'At/Above Benchmark' },
          { value: 'On Watch', label: 'On Watch' },
          { value: 'Intervention', label: 'Intervention' },
          { value: 'Urgent Intervention', label: 'Urgent Intervention' }
        ],
        sentence: '{name} is performing at the {value} level on the Star CBM Math assessment.'
      }
    ]
  },

  /* ---- Woodcock-Johnson IV (WJ-IV) ---- */
  {
    id: 'wjiv',
    name: 'Woodcock-Johnson IV (WJ-IV)',
    category: 'Achievement',
    grades: 'K–12+',
    fields: [
      {
        id: 'reading_ss',
        label: 'Broad Reading — Standard Score',
        type: 'number',
        placeholder: 'e.g. 85',
        sentence: '{name} earned a standard score of {value} in Broad Reading on the Woodcock-Johnson IV Tests of Achievement.'
      },
      {
        id: 'reading_ge',
        label: 'Broad Reading — Grade Equivalent',
        type: 'text',
        placeholder: 'e.g. 2.5',
        sentence: '{name} is performing at a {value} grade equivalent in Broad Reading on the Woodcock-Johnson IV.'
      },
      {
        id: 'reading_pr',
        label: 'Broad Reading — Percentile Rank',
        type: 'number',
        placeholder: 'e.g. 16',
        sentence: '{name} scored at the {value}th percentile in Broad Reading on the Woodcock-Johnson IV.'
      },
      {
        id: 'math_ss',
        label: 'Broad Mathematics — Standard Score',
        type: 'number',
        placeholder: 'e.g. 90',
        sentence: '{name} earned a standard score of {value} in Broad Mathematics on the Woodcock-Johnson IV Tests of Achievement.'
      },
      {
        id: 'math_ge',
        label: 'Broad Mathematics — Grade Equivalent',
        type: 'text',
        placeholder: 'e.g. 3.2',
        sentence: '{name} is performing at a {value} grade equivalent in Broad Mathematics on the Woodcock-Johnson IV.'
      },
      {
        id: 'math_pr',
        label: 'Broad Mathematics — Percentile Rank',
        type: 'number',
        placeholder: 'e.g. 25',
        sentence: '{name} scored at the {value}th percentile in Broad Mathematics on the Woodcock-Johnson IV.'
      },
      {
        id: 'writing_ss',
        label: 'Written Language — Standard Score',
        type: 'number',
        placeholder: 'e.g. 82',
        sentence: '{name} earned a standard score of {value} in Written Language on the Woodcock-Johnson IV Tests of Achievement.'
      }
    ]
  },

  /* ---- WIDA ACCESS (English Learners) ---- */
  {
    id: 'wida',
    name: 'WIDA ACCESS for ELLs',
    category: 'English Language Proficiency',
    grades: 'K–12',
    fields: [
      {
        id: 'overall',
        label: 'Overall Composite Proficiency Level',
        type: 'select',
        options: [
          { value: '1 — Entering', label: 'Level 1 — Entering' },
          { value: '2 — Emerging', label: 'Level 2 — Emerging' },
          { value: '3 — Developing', label: 'Level 3 — Developing' },
          { value: '4 — Expanding', label: 'Level 4 — Expanding' },
          { value: '5 — Bridging', label: 'Level 5 — Bridging' },
          { value: '6 — Reaching', label: 'Level 6 — Reaching' }
        ],
        sentence: '{name} earned an overall composite proficiency level of {value} on the WIDA ACCESS for ELLs assessment.'
      },
      {
        id: 'listening',
        label: 'Listening Proficiency Level',
        type: 'text',
        placeholder: 'e.g. 3.5',
        sentence: '{name} earned a {value} proficiency level in Listening on the WIDA ACCESS.'
      },
      {
        id: 'speaking',
        label: 'Speaking Proficiency Level',
        type: 'text',
        placeholder: 'e.g. 2.8',
        sentence: '{name} earned a {value} proficiency level in Speaking on the WIDA ACCESS.'
      },
      {
        id: 'reading',
        label: 'Reading Proficiency Level',
        type: 'text',
        placeholder: 'e.g. 3.2',
        sentence: '{name} earned a {value} proficiency level in Reading on the WIDA ACCESS.'
      },
      {
        id: 'writing',
        label: 'Writing Proficiency Level',
        type: 'text',
        placeholder: 'e.g. 2.5',
        sentence: '{name} earned a {value} proficiency level in Writing on the WIDA ACCESS.'
      }
    ]
  },

  /* ---- Math Excel CBM ---- */
  {
    id: 'mathexcel',
    name: 'Math Excel CBM',
    category: 'Math',
    grades: 'K–8',
    fields: [
      {
        id: 'level',
        label: 'Performance Level',
        type: 'select',
        options: [
          { value: 'the Intensive level (significantly below grade-level benchmark)', label: 'Intensive' },
          { value: 'the Strategic level (approaching grade-level benchmark)', label: 'Strategic' },
          { value: 'the Benchmark level (meeting grade-level expectations)', label: 'Benchmark' },
          { value: 'the Advanced level (exceeding grade-level expectations)', label: 'Advanced' }
        ],
        sentence: 'On the Math Excel mathematics curriculum-based measure (CBM), {name} performed at {value}.'
      }
    ]
  }
];


/* ----------------------------------------------------------
   BENCHMARK NORMS – Grade-level benchmark expectations
   Structured: assessment_id → subtest_id → grade → { fall, winter, spring }
   Sources: Published benchmark guides (approximate reference values).
   ---------------------------------------------------------- */
const BENCHMARK_NORMS = {

  /* DIBELS 8 */
  dibels: {
    orf_wcpm: {
      1: { fall: null, winter: 23,  spring: 47  },
      2: { fall: 52,   winter: 72,  spring: 87  },
      3: { fall: 70,   winter: 86,  spring: 104 },
      4: { fall: 93,   winter: 108, spring: 120 },
      5: { fall: 104,  winter: 118, spring: 132 },
      6: { fall: 111,  winter: 125, spring: 140 },
      7: { fall: 120,  winter: 131, spring: 145 },
      8: { fall: 126,  winter: 136, spring: 150 }
    },
    nwf_cls: {
      1: { fall: 17, winter: 42, spring: 58 },
      2: { fall: 54, winter: 62, spring: 68 }
    },
    psf: {
      0: { fall: null, winter: 20, spring: 40 },
      1: { fall: 40,   winter: 45, spring: null }
    },
    lnf: {
      0: { fall: 8,  winter: 27, spring: 42 },
      1: { fall: 42, winter: 50, spring: null }
    },
    maze: {
      3: { fall: 6.5,  winter: 10.5, spring: 13.5 },
      4: { fall: 9.5,  winter: 13.5, spring: 16.5 },
      5: { fall: 11,   winter: 15.5, spring: 19   },
      6: { fall: 13,   winter: 17,   spring: 21   }
    }
  },

  /* Acadience Reading */
  acadience: {
    orf_wcpm: {
      1: { fall: null, winter: 23,  spring: 47  },
      2: { fall: 52,   winter: 72,  spring: 87  },
      3: { fall: 70,   winter: 86,  spring: 104 },
      4: { fall: 93,   winter: 108, spring: 120 },
      5: { fall: 104,  winter: 118, spring: 132 },
      6: { fall: 111,  winter: 125, spring: 140 }
    }
  },

  /* MAP Growth / NWEA – Median RIT by grade */
  mapgrowth: {
    reading_rit: {
      0: { fall: 141, winter: 151, spring: 158 },
      1: { fall: 162, winter: 173, spring: 177 },
      2: { fall: 175, winter: 184, spring: 188 },
      3: { fall: 188, winter: 195, spring: 198 },
      4: { fall: 198, winter: 203, spring: 205 },
      5: { fall: 206, winter: 209, spring: 211 },
      6: { fall: 211, winter: 214, spring: 215 },
      7: { fall: 214, winter: 217, spring: 218 },
      8: { fall: 217, winter: 219, spring: 220 }
    },
    math_rit: {
      0: { fall: 140, winter: 151, spring: 159 },
      1: { fall: 162, winter: 173, spring: 180 },
      2: { fall: 178, winter: 186, spring: 192 },
      3: { fall: 190, winter: 198, spring: 203 },
      4: { fall: 200, winter: 207, spring: 211 },
      5: { fall: 209, winter: 215, spring: 219 },
      6: { fall: 214, winter: 219, spring: 222 },
      7: { fall: 220, winter: 224, spring: 226 },
      8: { fall: 225, winter: 228, spring: 230 }
    }
  },

  /* i-Ready Diagnostic – Typical scale score ranges (mid-grade) */
  iready: {
    reading_scale: {
      0: { fall: 346, winter: 371, spring: 395 },
      1: { fall: 396, winter: 425, spring: 449 },
      2: { fall: 449, winter: 474, spring: 495 },
      3: { fall: 491, winter: 510, spring: 524 },
      4: { fall: 519, winter: 535, spring: 546 },
      5: { fall: 541, winter: 554, spring: 563 },
      6: { fall: 558, winter: 568, spring: 575 },
      7: { fall: 570, winter: 578, spring: 584 },
      8: { fall: 580, winter: 586, spring: 591 }
    },
    math_scale: {
      0: { fall: 355, winter: 376, spring: 394 },
      1: { fall: 389, winter: 413, spring: 432 },
      2: { fall: 429, winter: 451, spring: 467 },
      3: { fall: 462, winter: 480, spring: 493 },
      4: { fall: 490, winter: 504, spring: 514 },
      5: { fall: 510, winter: 522, spring: 530 },
      6: { fall: 527, winter: 536, spring: 543 },
      7: { fall: 540, winter: 547, spring: 553 },
      8: { fall: 550, winter: 556, spring: 561 }
    }
  },

  /* Star Reading & Math – Approximate scaled-score benchmarks */
  star: {
    reading_ss: {
      1: { fall: 72,  winter: 148, spring: 206 },
      2: { fall: 173, winter: 230, spring: 278 },
      3: { fall: 245, winter: 296, spring: 339 },
      4: { fall: 319, winter: 371, spring: 407 },
      5: { fall: 390, winter: 432, spring: 465 },
      6: { fall: 441, winter: 476, spring: 501 },
      7: { fall: 478, winter: 506, spring: 525 },
      8: { fall: 505, winter: 528, spring: 544 }
    },
    math_ss: {
      1: { fall: 218, winter: 306, spring: 379 },
      2: { fall: 354, winter: 424, spring: 481 },
      3: { fall: 452, winter: 510, spring: 556 },
      4: { fall: 528, winter: 577, spring: 616 },
      5: { fall: 594, winter: 632, spring: 663 },
      6: { fall: 640, winter: 669, spring: 693 },
      7: { fall: 674, winter: 699, spring: 718 },
      8: { fall: 702, winter: 722, spring: 738 }
    }
  }
};

/* Mapping: which CBM_ASSESSMENT fields connect to which BENCHMARK_NORMS entry */
const CBM_BENCHMARK_MAP = {
  dibels:    { orf_wcpm: 'dibels.orf_wcpm', nwf_cls: 'dibels.nwf_cls', psf: 'dibels.psf', lnf: 'dibels.lnf', maze: 'dibels.maze' },
  acadience: { orf_wcpm: 'acadience.orf_wcpm' },
  mapgrowth: { reading_rit: 'mapgrowth.reading_rit', math_rit: 'mapgrowth.math_rit' },
  iready:    { reading_scale: 'iready.reading_scale', math_scale: 'iready.math_scale' },
  star:      { reading_ss: 'star.reading_ss', math_ss: 'star.math_ss' }
};


/* ----------------------------------------------------------
   COMPLIANCE REQUIREMENTS – Required IEP / PLAAFP components
   (based on IDEA 34 CFR §300.320 and best-practice guidance)
   ---------------------------------------------------------- */
const COMPLIANCE_REQUIREMENTS = [
  {
    id: 'strengths',
    label: 'Student Strengths',
    description: 'The present levels must include a statement of the student\'s strengths.',
    prompt: 'What are the student\'s academic, social, or behavioral strengths?',
    category: 'required'
  },
  {
    id: 'parent_input',
    label: 'Parent / Guardian Input',
    description: 'Parent concerns and input must be documented in the IEP.',
    prompt: 'What concerns or input has the parent/guardian shared?',
    category: 'required'
  },
  {
    id: 'gen_ed_impact',
    label: 'Impact on General Education',
    description: 'The IEP must describe how the disability affects involvement and progress in the general education curriculum.',
    prompt: 'How does the student\'s disability affect their involvement and progress in the general education curriculum?',
    category: 'required'
  },
  {
    id: 'baseline_data',
    label: 'Baseline Data for Goals',
    description: 'Current performance levels must provide measurable baseline data that directly connects to proposed IEP goals.',
    prompt: 'What current measurable data will serve as the baseline for IEP goals?',
    category: 'required'
  },
  {
    id: 'evaluation_data',
    label: 'Current Evaluation / Assessment Data',
    description: 'Results from recent evaluations, assessments, and progress monitoring should be cited.',
    prompt: 'What recent evaluation or assessment results are available?',
    category: 'required'
  },
  {
    id: 'classroom_performance',
    label: 'Classroom-Based Performance',
    description: 'Information about how the student performs in daily classroom activities, including teacher observations.',
    prompt: 'How does the student perform in daily classroom activities?',
    category: 'best_practice'
  },
  {
    id: 'student_input',
    label: 'Student Input (Age-Appropriate)',
    description: 'When appropriate, the student\'s own perspective and self-assessment should be included.',
    prompt: 'What has the student shared about their own learning, goals, or preferences?',
    category: 'best_practice'
  },
  {
    id: 'transition_needs',
    label: 'Transition Needs (Age 14/16+)',
    description: 'For students at transition age, present levels must address post-secondary goals and transition assessment results.',
    prompt: 'What are the student\'s post-secondary goals and transition assessment results?',
    category: 'conditional'
  },
  {
    id: 'assistive_tech',
    label: 'Assistive Technology Considered',
    description: 'The IEP team must document whether assistive technology devices or services were considered.',
    prompt: 'Has assistive technology been considered? What devices or services are in use or were evaluated?',
    category: 'required'
  },
  {
    id: 'ell_linguistic',
    label: 'Linguistic / ELL Factors',
    description: 'If the student is an English learner, language proficiency and its impact must be addressed.',
    prompt: 'What is the student\'s language background and how does it affect performance?',
    category: 'conditional'
  }
];


/* ----------------------------------------------------------
   ACCOMMODATIONS & SDI – Suggested accommodations and
   Specially Designed Instruction mapped to skill areas
   ---------------------------------------------------------- */
const ACCOMMODATIONS_SDI = {
  reading_fluency: {
    label: 'Reading Fluency',
    sdi: [
      'Specially Designed Instruction in reading fluency using evidence-based methods (e.g., repeated reading, phrase-cued text, partner reading)',
      'Explicit instruction in decoding and word-attack strategies to improve automaticity',
      'Guided oral reading practice with corrective feedback at the student\'s instructional level'
    ],
    accommodations: [
      'Extended time (1.5x) on reading-based assignments and assessments',
      'Audio versions of grade-level text provided alongside print materials',
      'Reduced reading load on assignments while maintaining grade-level rigor of content',
      'Use of a reading guide or line tracker to support tracking during reading',
      'Access to text-to-speech software for grade-level content'
    ]
  },
  reading_comprehension: {
    label: 'Reading Comprehension',
    sdi: [
      'Specially Designed Instruction in reading comprehension strategies (e.g., graphic organizers, summarization, questioning, visualization)',
      'Explicit instruction in identifying main idea, text structure, and making inferences',
      'Pre-teaching of vocabulary and background knowledge before grade-level reading'
    ],
    accommodations: [
      'Graphic organizers provided for reading response activities',
      'Simplified or chunked directions on reading-based tasks',
      'Access to highlighted or annotated text to support comprehension',
      'Preferential seating to minimize distractions during reading tasks',
      'Check-ins after reading passages to verify understanding before proceeding'
    ]
  },
  written_expression: {
    label: 'Written Expression',
    sdi: [
      'Specially Designed Instruction in written expression (e.g., sentence construction, paragraph organization, editing/revision)',
      'Explicit instruction in the writing process: planning, drafting, revising, and publishing',
      'Use of structured writing templates and graphic organizers for written tasks'
    ],
    accommodations: [
      'Access to word processing / keyboarding for written assignments',
      'Use of speech-to-text software for longer writing tasks',
      'Extended time on written assignments and essay-based assessments',
      'Reduced written output requirements while maintaining content expectations',
      'Provide sentence starters or writing frames to scaffold responses'
    ]
  },
  math_computation: {
    label: 'Math Computation',
    sdi: [
      'Specially Designed Instruction in math computation (e.g., number sense, fact fluency, multi-digit operations)',
      'Use of Concrete-Representational-Abstract (CRA) instructional sequence for math concepts',
      'Systematic instruction in math fact fluency with daily practice opportunities'
    ],
    accommodations: [
      'Access to a calculator for complex calculations (when computation is not the assessed skill)',
      'Use of multiplication/addition charts or reference sheets',
      'Extended time on math assessments',
      'Graph paper or lined paper turned sideways to support column alignment',
      'Reduced number of practice problems while maintaining skill variety'
    ]
  },
  math_concepts: {
    label: 'Math Concepts & Problem Solving',
    sdi: [
      'Specially Designed Instruction in math reasoning and problem-solving strategies',
      'Explicit instruction in word problem analysis (identifying key information, choosing operations)',
      'Use of manipulatives and visual models to build conceptual understanding'
    ],
    accommodations: [
      'Read-aloud of word problems and math directions',
      'Visual models and step-by-step exemplars posted for reference',
      'Extended time on math assessments involving multi-step problems',
      'Chunked or scaffolded multi-step problems'
    ]
  },
  communication: {
    label: 'Communication / Language',
    sdi: [
      'Specially Designed Instruction in receptive and/or expressive language skills',
      'Speech-language therapy addressing articulation, fluency, or language goals',
      'Explicit instruction in vocabulary development and oral language skills'
    ],
    accommodations: [
      'Visual supports (e.g., visual schedule, picture cues) paired with verbal instructions',
      'Simplified or restated verbal directions',
      'Extra wait time (5–10 seconds) for oral responses',
      'Access to AAC device or communication board as appropriate',
      'Preferential seating near the instructor for auditory access'
    ]
  },
  social_emotional: {
    label: 'Social / Emotional / Behavioral',
    sdi: [
      'Specially Designed Instruction in social skills (e.g., structured social skills curriculum, social thinking)',
      'Specially Designed Instruction in self-regulation and coping strategies',
      'Implementation of a Behavior Intervention Plan (BIP) based on Functional Behavior Assessment data'
    ],
    accommodations: [
      'Access to a calm-down area or sensory break space',
      'Check-in/check-out system with a trusted adult',
      'Structured breaks during the school day (e.g., every 30 minutes)',
      'Visual behavior expectations posted and reviewed daily',
      'Advance notice of schedule changes or transitions'
    ]
  },
  motor: {
    label: 'Motor Skills (Fine/Gross)',
    sdi: [
      'Specially Designed Instruction in fine motor skills (e.g., handwriting, cutting, manipulation of small objects)',
      'Occupational therapy to address fine motor and/or visual-motor integration needs',
      'Physical therapy to address gross motor, balance, and/or coordination needs'
    ],
    accommodations: [
      'Use of adapted writing tools (e.g., pencil grip, slant board)',
      'Access to keyboarding as an alternative to handwriting for longer assignments',
      'Adapted scissors and other classroom tools as needed',
      'Extra time for activities requiring fine or gross motor skills',
      'Modified PE activities to support safe participation'
    ]
  },
  adaptive: {
    label: 'Adaptive / Daily Living Skills',
    sdi: [
      'Specially Designed Instruction in daily living skills (e.g., personal hygiene, meal preparation, money skills)',
      'Community-based instruction to practice functional skills in real-world settings',
      'Task analysis and systematic instruction for multi-step self-care routines'
    ],
    accommodations: [
      'Visual checklists for daily routines and self-care tasks',
      'Visual or picture-based schedules for transitions between activities',
      'Peer buddy system for navigating school environment',
      'Prompting hierarchy (visual → verbal → physical) for independence building'
    ]
  },
  attention_executive: {
    label: 'Attention / Executive Functioning',
    sdi: [
      'Specially Designed Instruction in executive functioning skills (e.g., organization, planning, task initiation)',
      'Explicit instruction in self-monitoring and self-regulation strategies',
      'Structured organizational systems taught and practiced daily'
    ],
    accommodations: [
      'Preferential seating away from distractions and near the teacher',
      'Assignments broken into smaller steps with check-in points',
      'Extended time on tests and assignments',
      'Use of a planner or organizational app checked daily by staff',
      'Frequent reminders and prompts to stay on task',
      'Reduce number of items per page or section'
    ]
  }
};

/* Mapping: question IDs → accommodation categories for auto-suggestion */
const QUESTION_ACCOMMODATION_MAP = {
  ac_reading:      ['reading_fluency', 'reading_comprehension'],
  ac_writing:      ['written_expression'],
  ac_math:         ['math_computation', 'math_concepts'],
  ac_directions:   ['attention_executive'],
  ac_task:         ['attention_executive'],
  ac_homework:     ['attention_executive'],
  co_express:      ['communication'],
  co_receptive:    ['communication'],
  co_articulation: ['communication'],
  co_social_comm:  ['communication', 'social_emotional'],
  mo_fine:         ['motor'],
  mo_gross:        ['motor'],
  mo_writing_legib:['motor', 'written_expression'],
  se_emotions:     ['social_emotional'],
  se_peers:        ['social_emotional'],
  se_transitions:  ['social_emotional'],
  se_self_reg:     ['social_emotional'],
  se_conflict:     ['social_emotional'],
  ad_self_care:    ['adaptive'],
  ad_safety:       ['adaptive'],
  ad_routines:     ['adaptive']
};


/* ----------------------------------------------------------
   COMMON CORE STATE STANDARDS – Mapped to skill areas
   Abbreviated references for auto-linking in present levels
   ---------------------------------------------------------- */
const STANDARDS_MAP = {
  reading_fluency: [
    { standard: 'CCSS.ELA-LITERACY.RF.1.4', description: 'Read with sufficient accuracy and fluency to support comprehension (Grade 1)' },
    { standard: 'CCSS.ELA-LITERACY.RF.2.4', description: 'Read with sufficient accuracy and fluency to support comprehension (Grade 2)' },
    { standard: 'CCSS.ELA-LITERACY.RF.3.4', description: 'Read with sufficient accuracy and fluency to support comprehension (Grade 3)' },
    { standard: 'CCSS.ELA-LITERACY.RF.4.4', description: 'Read with sufficient accuracy and fluency to support comprehension (Grade 4)' },
    { standard: 'CCSS.ELA-LITERACY.RF.5.4', description: 'Read with sufficient accuracy and fluency to support comprehension (Grade 5)' }
  ],
  reading_comprehension: [
    { standard: 'CCSS.ELA-LITERACY.RL.{grade}.1', description: 'Ask and answer questions about key details / cite textual evidence' },
    { standard: 'CCSS.ELA-LITERACY.RL.{grade}.2', description: 'Determine central message, lesson, or moral / theme' },
    { standard: 'CCSS.ELA-LITERACY.RI.{grade}.1', description: 'Ask and answer questions about key details in informational text' },
    { standard: 'CCSS.ELA-LITERACY.RI.{grade}.2', description: 'Identify the main topic / main idea of informational text' }
  ],
  written_expression: [
    { standard: 'CCSS.ELA-LITERACY.W.{grade}.1', description: 'Write opinion/argumentative pieces' },
    { standard: 'CCSS.ELA-LITERACY.W.{grade}.2', description: 'Write informative/explanatory texts' },
    { standard: 'CCSS.ELA-LITERACY.W.{grade}.3', description: 'Write narratives' },
    { standard: 'CCSS.ELA-LITERACY.L.{grade}.1', description: 'Demonstrate command of the conventions of standard English grammar' },
    { standard: 'CCSS.ELA-LITERACY.L.{grade}.2', description: 'Demonstrate command of the conventions of standard English capitalization, punctuation, and spelling' }
  ],
  math_computation: [
    { standard: 'CCSS.MATH.CONTENT.{grade}.OA', description: 'Operations and Algebraic Thinking' },
    { standard: 'CCSS.MATH.CONTENT.{grade}.NBT', description: 'Number and Operations in Base Ten' },
    { standard: 'CCSS.MATH.CONTENT.{grade}.NF', description: 'Number and Operations — Fractions (Grades 3–5)' }
  ],
  math_concepts: [
    { standard: 'CCSS.MATH.CONTENT.{grade}.OA', description: 'Operations and Algebraic Thinking' },
    { standard: 'CCSS.MATH.CONTENT.{grade}.MD', description: 'Measurement and Data' },
    { standard: 'CCSS.MATH.CONTENT.{grade}.G', description: 'Geometry' }
  ],
  communication: [
    { standard: 'CCSS.ELA-LITERACY.SL.{grade}.1', description: 'Participate in collaborative conversations / discussions' },
    { standard: 'CCSS.ELA-LITERACY.SL.{grade}.4', description: 'Describe / report on a topic with relevant details, speaking clearly' },
    { standard: 'CCSS.ELA-LITERACY.SL.{grade}.6', description: 'Speak in complete sentences / adapt speech to a variety of contexts' }
  ]
};

/* Mapping: question IDs → standards categories */
const QUESTION_STANDARDS_MAP = {
  ac_reading:  ['reading_fluency', 'reading_comprehension'],
  ac_writing:  ['written_expression'],
  ac_math:     ['math_computation', 'math_concepts'],
  co_express:  ['communication'],
  co_receptive:['communication'],
  co_social_comm: ['communication']
};


/* ----------------------------------------------------------
   PARENT-FRIENDLY LANGUAGE – Templates that transform
   technical IEP language into plain, accessible language
   ---------------------------------------------------------- */
const PARENT_FRIENDLY_TEMPLATES = {
  reading_level: {
    technical: '{name} reads instructionally at {value}.',
    plain: '{name} is currently reading at a {value} level. This means that with some help from the teacher, {he} can read and understand books written for that grade.'
  },
  reading_fluency: {
    technical: 'oral reading fluency',
    plain: 'Reading fluency means how quickly, accurately, and smoothly your child reads out loud. We measure this in words per minute.'
  },
  wcpm: {
    technical: 'words correct per minute (WCPM)',
    plain: 'This is the number of words your child can read correctly in one minute. It helps us see how smoothly {he} reads.'
  },
  benchmark: {
    technical: 'At/Above Benchmark',
    plain: 'This means your child is performing at or above the level we expect for students in {his} grade at this time of year.'
  },
  below_benchmark: {
    technical: 'Below Benchmark / Well Below Benchmark',
    plain: 'This means your child is not yet performing at the level we expect for students in {his} grade. We have a plan to provide extra support.'
  },
  rit_score: {
    technical: 'RIT score',
    plain: 'A RIT score is a number that shows how much your child knows in reading or math. We use it to track growth over time. A higher number means more learning has happened.'
  },
  area_of_need: {
    technical: 'area of need',
    plain: 'This is a skill area where your child needs extra help and will receive specific instruction to improve.'
  },
  sdi: {
    technical: 'Specially Designed Instruction (SDI)',
    plain: 'This is teaching that is specifically planned and adjusted to meet your child\'s unique learning needs. It is different from the regular classroom instruction.'
  },
  iep_goal: {
    technical: 'IEP goal',
    plain: 'This is a specific, measurable target for what your child will work toward learning this year with the help of their teachers.'
  },
  accommodation: {
    technical: 'accommodation',
    plain: 'An accommodation is a change in how your child is taught or tested. It gives your child a fair chance to show what they know without changing what they are learning.'
  },
  cbm: {
    technical: 'Curriculum-Based Measurement (CBM)',
    plain: 'These are quick tests that teachers give regularly to see how your child is progressing in important school skills like reading and math.'
  },
  progress_monitoring: {
    technical: 'progress monitoring',
    plain: 'This means we check your child\'s skills regularly (usually every 1–2 weeks) to make sure the extra help is working and adjust if needed.'
  }
};


const SECTIONS = {

  /* ----------------------------------------------------------
     ACADEMIC / PREACADEMIC / FUNCTIONAL SKILLS
     ---------------------------------------------------------- */
  academic: {
    label: 'Preacademic / Academic / Functional Skills',
    questions: [
      {
        id: 'ac_reading',
        text: 'Can the student read and comprehend grade-level text independently?',
        yesSentence: '{name} is able to read and comprehend grade-level text independently, demonstrating appropriate reading skills for {his} current grade placement.',
        noSentence: 'Reading and reading comprehension at grade level is an area of need for {name}. {He} requires additional support to access grade-level text independently.'
      },
      {
        id: 'ac_writing',
        text: 'Can the student write sentences or paragraphs at grade level?',
        yesSentence: '{name} demonstrates the ability to write sentences and paragraphs at or near grade level without significant support.',
        noSentence: 'Written expression at grade level is an area of need for {name}. {He} requires targeted instruction and support in the area of writing.'
      },
      {
        id: 'ac_math',
        text: 'Can the student perform grade-level math computations and concepts?',
        yesSentence: '{name} is performing math computations and mathematical concepts at grade level and does not require additional intervention in this area.',
        noSentence: 'Mathematics is an identified area of need for {name}. {He} requires additional instruction and support to access grade-level math content.'
      },
      {
        id: 'ac_directions',
        text: 'Can the student follow multi-step directions independently?',
        yesSentence: '{name} is able to follow multi-step directions independently in the classroom setting.',
        noSentence: 'Following multi-step directions is an area of need for {name}. {He} benefits from visual supports and repeated instruction to follow directions successfully.'
      },
      {
        id: 'ac_tasks',
        text: 'Can the student initiate and complete classroom tasks independently?',
        yesSentence: '{name} initiates and completes classroom tasks independently with minimal redirection.',
        noSentence: 'Task initiation and completion is an area of need for {name}. {He} requires prompting and structured supports to begin and sustain work on classroom tasks.'
      },
      {
        id: 'ac_attention',
        text: 'Can the student maintain attention and focus during academic lessons?',
        yesSentence: '{name} demonstrates the ability to maintain attention and focus throughout academic lessons appropriate for {his} age.',
        noSentence: 'Maintaining attention and focus during academic lessons is an area of need for {name}. {He} benefits from frequent check-ins, movement breaks, and preferential seating.'
      },
      {
        id: 'ac_organization',
        text: 'Can the student organize materials and manage assignments?',
        yesSentence: '{name} is able to organize {his} materials and manage assignments without significant adult support.',
        noSentence: 'Organization of materials and assignment management is an area of need for {name}. {He} requires structured routines, checklists, and adult support to manage {his} academic responsibilities.'
      }
    ],
    goals: {
      reading: '{name} will read a grade-level passage and answer comprehension questions with 80% accuracy across 4 out of 5 trials, as measured by teacher-collected data.',
      writing: '{name} will independently write a 3-5 sentence paragraph with a topic sentence, supporting details, and a closing sentence with 80% accuracy across 4 out of 5 opportunities.',
      math: '{name} will solve grade-level math problems using appropriate strategies with 80% accuracy across 4 out of 5 trials.',
      tasks: '{name} will independently initiate and complete assigned classroom tasks within the allotted time period with no more than 1 verbal prompt, across 4 out of 5 opportunities.',
      attention: '{name} will remain on task during structured academic activities for at least [X] minutes with no more than 2 redirections, across 4 out of 5 observed sessions.'
    }
  },

  /* ----------------------------------------------------------
     COMMUNICATION DEVELOPMENT
     ---------------------------------------------------------- */
  communication: {
    label: 'Communication Development',
    questions: [
      {
        id: 'com_wants',
        text: 'Can the student communicate his/her wants and needs effectively?',
        yesSentence: '{name} is able to communicate {his} wants and needs effectively and this is not identified as an area of concern.',
        noSentence: 'Communicating wants and needs is an identified area of need for {name}. {He} requires supports and instruction to express {his} needs in an understandable and functional manner.'
      },
      {
        id: 'com_peers',
        text: 'Can the student communicate with peers appropriately?',
        yesSentence: '{name} communicates with peers in an age-appropriate manner and demonstrates adequate social communication skills with {his} peers.',
        noSentence: 'Peer communication is an area of need for {name}. {He} requires instruction and support to engage in appropriate conversations and interactions with {his} peers.'
      },
      {
        id: 'com_adults',
        text: 'Can the student communicate with adults appropriately?',
        yesSentence: '{name} communicates respectfully and appropriately with adults in the school setting.',
        noSentence: 'Appropriate communication with adults is an area of need for {name}. {He} requires supports to initiate and maintain appropriate interactions with teachers and other school staff.'
      },
      {
        id: 'com_understand',
        text: 'Can the student understand and follow verbal instructions?',
        yesSentence: '{name} demonstrates the ability to understand and follow verbal instructions within the classroom environment.',
        noSentence: 'Understanding and following verbal instructions is an area of need for {name}. {He} benefits from visual supports, repetition, and simplified language when receiving verbal directions.'
      },
      {
        id: 'com_vocab',
        text: 'Does the student have adequate vocabulary to access the curriculum?',
        yesSentence: '{name} demonstrates vocabulary skills sufficient to access the general education curriculum at {his} current grade level.',
        noSentence: 'Vocabulary development is an area of need for {name}. {He} requires explicit vocabulary instruction and supports to access grade-level curriculum and content.'
      },
      {
        id: 'com_aac',
        text: 'If applicable, does the student use an AAC device or other communication system consistently?',
        yesSentence: '{name} consistently and effectively uses {his} augmentative and alternative communication (AAC) system to communicate across settings.',
        noSentence: 'Consistent and effective use of an augmentative and alternative communication (AAC) system is an area of need for {name}. {He} requires ongoing support and training to use {his} communication device across all settings.'
      }
    ],
    goals: {
      wants: '{name} will independently communicate wants, needs, or refusals using words/phrases/AAC device with 80% accuracy across 4 out of 5 observed opportunities.',
      peers: '{name} will initiate and maintain a peer conversation for at least 3 exchanges on a given topic with 80% accuracy across 4 out of 5 observed interactions.',
      vocab: '{name} will demonstrate understanding and use of targeted academic vocabulary words by using them correctly in context with 80% accuracy across 4 out of 5 trials.',
      aac: '{name} will independently use {his} AAC device to make requests and respond to questions across 3 different settings with 80% accuracy, as measured by staff data collection.'
    }
  },

  /* ----------------------------------------------------------
     GROSS / FINE MOTOR DEVELOPMENT
     ---------------------------------------------------------- */
  motor: {
    label: 'Gross / Fine Motor Development',
    questions: [
      {
        id: 'mot_gross_mobility',
        text: 'Can the student navigate the school environment independently (walking, stairs, hallways)?',
        yesSentence: '{name} navigates the school environment independently, including hallways, stairs, and common areas, without physical assistance.',
        noSentence: 'Independent mobility throughout the school environment is an area of need for {name}. {He} requires physical assistance, adaptive equipment, or environmental modifications to navigate safely.'
      },
      {
        id: 'mot_gross_pe',
        text: 'Can the student participate in gross motor activities (PE, recess)?',
        yesSentence: '{name} participates in gross motor activities during physical education and recess at a level appropriate for {his} age.',
        noSentence: 'Participation in gross motor activities is an area of need for {name}. {He} requires modifications, adaptive PE supports, or physical therapy services to safely participate in movement-based activities.'
      },
      {
        id: 'mot_fine_pencil',
        text: 'Can the student hold and use a pencil/writing tool appropriately?',
        yesSentence: '{name} demonstrates an appropriate pencil grip and is able to use writing tools effectively for academic tasks.',
        noSentence: 'Pencil grip and use of writing tools is an area of need for {name}. {He} requires occupational therapy support and/or adaptive tools to write effectively.'
      },
      {
        id: 'mot_fine_scissors',
        text: 'Can the student use scissors and manipulate small objects with appropriate control?',
        yesSentence: '{name} uses scissors and manipulates small objects with age-appropriate fine motor control.',
        noSentence: 'Fine motor control, including use of scissors and manipulation of small objects, is an area of need for {name}. {He} requires occupational therapy services and adapted materials to improve {his} fine motor skills.'
      },
      {
        id: 'mot_keyboard',
        text: 'Can the student use a keyboard or tablet for academic tasks?',
        yesSentence: '{name} is able to use a keyboard or tablet device to complete academic tasks independently.',
        noSentence: 'Keyboarding and use of technology for academic tasks is an area of need for {name}. {He} requires instruction and practice to use these tools effectively for schoolwork.'
      },
      {
        id: 'mot_stamina',
        text: 'Does the student have adequate physical endurance to participate throughout the school day?',
        yesSentence: '{name} demonstrates adequate physical stamina and endurance to participate fully throughout the school day.',
        noSentence: 'Physical endurance and stamina throughout the school day is an area of need for {name}. {He} may require scheduled rest periods, modified schedules, or medical supports to participate fully.'
      }
    ],
    goals: {
      pencil: '{name} will demonstrate a functional pencil grip and produce legible handwriting samples with 80% of letter formations within acceptable range across 4 out of 5 opportunities.',
      keyboard: '{name} will use a keyboard or tablet to type written responses of at least [X] sentences independently with 80% accuracy across 4 out of 5 opportunities.',
      fine: '{name} will complete fine motor tasks (cutting, folding, fastening) using adaptive tools as needed with 80% accuracy across 4 out of 5 observed trials.',
      gross: '{name} will independently navigate designated school routes and participate in structured gross motor activities with no more than 1 verbal prompt across 4 out of 5 opportunities.'
    }
  },

  /* ----------------------------------------------------------
     SOCIAL EMOTIONAL / BEHAVIORAL
     ---------------------------------------------------------- */
  socialemotional: {
    label: 'Social Emotional / Behavioral',
    questions: [
      {
        id: 'se_peers',
        text: 'Can the student interact appropriately with peers in structured settings?',
        yesSentence: '{name} interacts appropriately with peers in structured classroom settings and demonstrates adequate social skills in these environments.',
        noSentence: 'Appropriate peer interaction in structured settings is an area of need for {name}. {He} requires social skills instruction and support to engage positively with {his} peers.'
      },
      {
        id: 'se_unstructured',
        text: 'Can the student interact appropriately with peers in unstructured settings (lunch, recess)?',
        yesSentence: '{name} demonstrates appropriate social interactions with peers during unstructured settings such as lunch and recess.',
        noSentence: 'Appropriate peer interaction during unstructured settings (lunch, recess) is an area of need for {name}. {He} requires additional supervision and social skills coaching during less structured parts of the day.'
      },
      {
        id: 'se_emotions',
        text: 'Can the student identify and manage his/her emotions appropriately?',
        yesSentence: '{name} demonstrates the ability to identify and manage {his} emotions in an age-appropriate manner.',
        noSentence: 'Emotional identification and regulation is an area of need for {name}. {He} requires explicit instruction in recognizing and managing {his} emotions, as well as access to coping strategies and supports.'
      },
      {
        id: 'se_conflict',
        text: 'Can the student resolve conflicts with peers appropriately?',
        yesSentence: '{name} is able to resolve minor conflicts with peers in an appropriate manner with minimal adult support.',
        noSentence: 'Conflict resolution with peers is an area of need for {name}. {He} requires adult support and direct instruction in problem-solving strategies to handle peer conflicts appropriately.'
      },
      {
        id: 'se_frustration',
        text: 'Can the student manage frustration and tolerate non-preferred tasks without behavioral escalation?',
        yesSentence: '{name} manages frustration and engages with non-preferred tasks without significant behavioral escalation.',
        noSentence: 'Managing frustration and tolerating non-preferred tasks without behavioral escalation is an area of need for {name}. {He} requires a behavior support plan, coping strategies, and adult guidance to respond to frustration in an appropriate manner.'
      },
      {
        id: 'se_transitions',
        text: 'Can the student transition between activities and settings without difficulty?',
        yesSentence: '{name} transitions between activities and settings with minimal difficulty and does not require additional supports in this area.',
        noSentence: 'Transitioning between activities and settings is an area of need for {name}. {He} requires advance warning, visual schedules, and/or adult support to transition successfully.'
      },
      {
        id: 'se_rules',
        text: 'Does the student follow classroom and school rules consistently?',
        yesSentence: '{name} follows classroom and school-wide rules consistently and responds appropriately to adult redirection when needed.',
        noSentence: 'Consistent adherence to classroom and school rules is an area of need for {name}. {He} requires positive behavior supports, clear expectations, and consistent reinforcement strategies to follow rules across settings.'
      }
    ],
    goals: {
      emotions: '{name} will independently identify his/her emotional state and select an appropriate coping strategy from a provided menu with 80% accuracy across 4 out of 5 observed opportunities.',
      peers: '{name} will engage in cooperative peer interactions during structured activities, demonstrating positive social behaviors (sharing, taking turns, using kind words) with 80% accuracy across 4 out of 5 observed sessions.',
      frustration: '{name} will use a self-regulation strategy (e.g., deep breathing, asking for a break) when experiencing frustration rather than engaging in disruptive behavior, in 4 out of 5 observed opportunities.',
      transitions: '{name} will transition between activities and settings with no more than 1 adult prompt and without engaging in challenging behaviors across 4 out of 5 observed transitions.'
    }
  },

  /* ----------------------------------------------------------
     VOCATIONAL
     ---------------------------------------------------------- */
  vocational: {
    label: 'Vocational',
    questions: [
      {
        id: 'voc_tasks',
        text: 'Can the student complete vocational/work tasks independently?',
        yesSentence: '{name} is able to complete designated vocational and work-related tasks independently with minimal adult redirection.',
        noSentence: 'Completing vocational and work-related tasks independently is an area of need for {name}. {He} requires task analysis, visual supports, and adult guidance to complete work tasks.'
      },
      {
        id: 'voc_quality',
        text: 'Does the student complete tasks with acceptable quality and attention to detail?',
        yesSentence: '{name} completes vocational tasks with acceptable quality and demonstrates appropriate attention to detail.',
        noSentence: 'Completing tasks with acceptable quality and attention to detail is an area of need for {name}. {He} requires instruction and monitoring supports to maintain work quality standards.'
      },
      {
        id: 'voc_stamina',
        text: 'Can the student maintain on-task behavior for an extended work period?',
        yesSentence: '{name} demonstrates the stamina and on-task behavior required to sustain work for an extended period of time.',
        noSentence: 'Maintaining on-task behavior for extended work periods is an area of need for {name}. {He} requires structured breaks, reinforcement systems, and adult supports to sustain work over time.'
      },
      {
        id: 'voc_workplace',
        text: 'Does the student demonstrate appropriate workplace behaviors (punctuality, following directions, appropriate communication)?',
        yesSentence: '{name} demonstrates appropriate workplace behaviors including punctuality, following instructions, and communicating professionally.',
        noSentence: 'Demonstrating appropriate workplace behaviors is an area of need for {name}. {He} requires explicit instruction and practice in workplace expectations including punctuality, following directions, and professional communication.'
      },
      {
        id: 'voc_safety',
        text: 'Does the student demonstrate awareness of workplace safety rules?',
        yesSentence: '{name} demonstrates awareness and adherence to workplace safety rules in vocational settings.',
        noSentence: 'Workplace safety awareness is an area of need for {name}. {He} requires direct instruction and ongoing monitoring to follow safety rules in vocational and community-based settings.'
      },
      {
        id: 'voc_goals',
        text: 'Has the student identified post-secondary vocational goals?',
        yesSentence: '{name} has identified post-secondary vocational interests and goals and actively participates in transition planning related to {his} career interests.',
        noSentence: 'Identifying post-secondary vocational goals is an area of need for {name}. {He} requires structured transition assessments, career exploration activities, and IEP team support to develop and articulate {his} vocational goals.'
      }
    ],
    goals: {
      tasks: '{name} will independently complete assigned vocational tasks using a task checklist with 80% accuracy across 4 out of 5 work sessions.',
      stamina: '{name} will remain on task during vocational activities for [X] consecutive minutes with no more than 2 adult prompts across 4 out of 5 observed sessions.',
      workplace: '{name} will demonstrate appropriate workplace behaviors (arriving on time, following supervisor directions, using professional communication) with 80% accuracy across 4 out of 5 observed opportunities.',
      safety: '{name} will accurately identify and follow all relevant safety rules in a vocational setting with 100% accuracy across 4 out of 5 trials.'
    }
  },

  /* ----------------------------------------------------------
     ADAPTIVE / DAILY LIVING SKILLS
     ---------------------------------------------------------- */
  adaptive: {
    label: 'Adaptive / Daily Living Skills',
    questions: [
      {
        id: 'adl_hygiene',
        text: 'Can the student maintain personal hygiene independently (handwashing, grooming)?',
        yesSentence: '{name} maintains personal hygiene, including handwashing and grooming, independently and without adult reminders.',
        noSentence: 'Personal hygiene and grooming is an area of need for {name}. {He} requires visual supports, verbal reminders, and/or adult assistance to maintain appropriate hygiene routines.'
      },
      {
        id: 'adl_dressing',
        text: 'Can the student dress and undress independently?',
        yesSentence: '{name} is able to dress and undress independently, including managing fasteners, appropriate for school and community settings.',
        noSentence: 'Independent dressing and undressing is an area of need for {name}. {He} requires adaptive clothing supports and/or adult assistance to manage clothing and fasteners.'
      },
      {
        id: 'adl_eating',
        text: 'Can the student feed him/herself independently and manage lunchtime routines?',
        yesSentence: '{name} independently manages {his} lunchtime routine, including opening food containers, using utensils, and cleaning up after eating.',
        noSentence: 'Independent feeding and lunchtime management is an area of need for {name}. {He} requires adaptive utensils, adult assistance, or modified food preparation to manage eating tasks at school.'
      },
      {
        id: 'adl_money',
        text: 'Can the student demonstrate basic money management skills?',
        yesSentence: '{name} demonstrates age-appropriate money management skills, including identifying coins/bills and making simple purchases.',
        noSentence: 'Basic money management is an area of need for {name}. {He} requires explicit instruction and practice in identifying money, making purchases, and managing financial transactions.'
      },
      {
        id: 'adl_time',
        text: 'Can the student tell time and manage a schedule independently?',
        yesSentence: '{name} can tell time and independently manage a daily schedule appropriate for {his} age and grade.',
        noSentence: 'Time telling and schedule management is an area of need for {name}. {He} requires visual schedules, timers, and adult support to understand and manage time across the school day.'
      },
      {
        id: 'adl_community',
        text: 'Can the student navigate community environments safely (crosswalks, stores, public transportation)?',
        yesSentence: '{name} demonstrates the ability to navigate common community environments safely and appropriately for {his} age.',
        noSentence: 'Safe navigation of community environments is an area of need for {name}. {He} requires direct instruction, supervised practice, and safety supports to navigate community settings independently.'
      },
      {
        id: 'adl_chores',
        text: 'Can the student complete basic household or classroom chores/tasks independently?',
        yesSentence: '{name} independently completes basic household and classroom tasks/chores as expected for {his} age.',
        noSentence: 'Independently completing basic household and classroom tasks is an area of need for {name}. {He} requires task analysis, visual supports, and adult guidance to complete these tasks successfully.'
      }
    ],
    goals: {
      hygiene: '{name} will independently complete a personal hygiene checklist (handwashing, teeth brushing, grooming) with 80% accuracy across 4 out of 5 observed opportunities without adult prompting.',
      money: '{name} will accurately count out the correct amount of money to make a purchase up to $[X] with 80% accuracy across 4 out of 5 trials in simulated or community-based settings.',
      time: '{name} will independently read a schedule and transition to the next activity at the correct time with no more than 1 prompt across 4 out of 5 observed opportunities.',
      community: '{name} will independently and safely navigate [specific community environment] demonstrating all relevant safety skills with 80% accuracy across 4 out of 5 observed outings.'
    }
  },

  /* ----------------------------------------------------------
     HEALTH
     ---------------------------------------------------------- */
  health: {
    label: 'Health',
    questions: [
      {
        id: 'hlt_attendance',
        text: 'Does the student have consistent attendance and is health generally not impacting school participation?',
        yesSentence: '{name} maintains consistent school attendance and {his} health does not significantly impact {his} ability to participate in school programming.',
        noSentence: 'Attendance and health-related impacts on school participation are areas of need for {name}. {He} has experienced health-related barriers that affect {his} consistent presence and participation in school.'
      },
      {
        id: 'hlt_medication',
        text: 'If applicable, is the student\'s medication managed appropriately at school?',
        yesSentence: '{name}\'s medication is managed appropriately at school in accordance with {his} health plan, and this does not negatively impact {his} school performance.',
        noSentence: 'Medication management at school is an area of need for {name}. {He} requires a formalized health plan and consistent coordination with school health staff to ensure {his} medication is administered correctly and on time.'
      },
      {
        id: 'hlt_vision',
        text: 'Has the student passed a vision screening or has corrected vision adequate for academic tasks?',
        yesSentence: '{name} has passed {his} most recent vision screening, and vision is not identified as an area of concern.',
        noSentence: 'Vision is an area of concern for {name}. {He} has not passed {his} most recent vision screening or requires corrective lenses/visual supports to access academic instruction effectively.'
      },
      {
        id: 'hlt_hearing',
        text: 'Has the student passed a hearing screening?',
        yesSentence: '{name} has passed {his} most recent hearing screening, and hearing is not identified as an area of concern.',
        noSentence: 'Hearing is an area of concern for {name}. {He} has not passed {his} most recent hearing screening and may require further audiological evaluation and/or hearing supports to access instruction.'
      },
      {
        id: 'hlt_selfcare',
        text: 'Can the student manage health-related self-care needs at school (e.g., managing allergies, diabetes, seizure awareness)?',
        yesSentence: '{name} manages {his} health-related self-care needs at school appropriately and {his} health condition does not significantly interfere with {his} daily school functioning.',
        noSentence: 'Health-related self-care at school is an area of need for {name}. {He} requires support from school health staff, a formalized health plan, and/or staff training to safely manage {his} health condition during the school day.'
      },
      {
        id: 'hlt_fatigue',
        text: 'Does the student demonstrate adequate energy and stamina throughout the school day?',
        yesSentence: '{name} demonstrates adequate energy and stamina to participate fully in the school day without health-related fatigue concerns.',
        noSentence: 'Physical stamina and fatigue are areas of concern for {name}. {He} experiences fatigue during the school day that impacts {his} ability to fully participate in academic and related activities, and may require a modified schedule or rest periods.'
      }
    ],
    goals: {
      attendance: '{name} will maintain school attendance at [X]% or above per grading period, with a documented plan to address health-related barriers to attendance, as monitored by the IEP team.',
      selfcare: '{name} will independently manage [specific health-related self-care task] using a visual checklist with 80% accuracy across 4 out of 5 observed opportunities.',
      medication: '{name} will independently go to the health office for medication at the scheduled time with no more than 1 adult prompt across 4 out of 5 school days.'
    }
  }
};
