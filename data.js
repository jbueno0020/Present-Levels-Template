/* =========================================================
   data.js – Question bank, sentence templates, and goal bank
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
