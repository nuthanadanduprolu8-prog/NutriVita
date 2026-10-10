/**
 * NutriVita - VitaQuiz Nutrition Awareness Question Bank
 * Evidence-based, educational nutrition and vitamin deficiency awareness questions.
 * Bilingual: English and Telugu.
 */

export const quizQuestions = [
  {
    id: 'q1',
    nutrient: 'Vitamin C',
    category: 'Vitamins',
    question: 'Which of the following is considered one of the richest natural Indian sources of Vitamin C?',
    teluguQuestion: 'ఈ క్రింది వాటిలో విటమిన్ సి అత్యధికంగా లభించే సహజ భారతీయ మూలం ఏది?',
    options: [
      'Amla (Indian Gooseberry)',
      'White Rice',
      'Refined Wheat Flour',
      'Butter'
    ],
    teluguOptions: [
      'ఉసిరి (ఆమ్లా)',
      'తెల్ల బియ్యం',
      'మైదా పిండి',
      'వెన్న'
    ],
    correctAnswer: 0,
    explanation: 'Amla provides up to 600-800 mg of Vitamin C per 100g (nearly 20 times more than an orange), promoting immune health and collagen synthesis.',
    teluguExplanation: 'ఉసిరిలో 100 గ్రాములకు 600-800 మి.గ్రా విటమిన్ సి లభిస్తుంది (నారింజ కంటే దాదాపు 20 రెట్లు ఎక్కువ). ఇది రోగనిరోధక శక్తికి, కొల్లాజెన్ ఉత్పత్తికి ఎంతో మేలు చేస్తుంది.'
  },
  {
    id: 'q2',
    nutrient: 'Vitamin D',
    category: 'Vitamins',
    question: 'Why is Vitamin D often called the "Sunshine Vitamin"?',
    teluguQuestion: 'విటమిన్ డి ని "సూర్యరశ్మి విటమిన్" (Sunshine Vitamin) అని ఎందుకు పిలుస్తారు?',
    options: [
      'The body synthesizes it when skin is exposed to UVB sunlight',
      'It gives our skin a glowing yellow color',
      'It can only be digested during daytime hours',
      'It comes from eating yellow vegetables only'
    ],
    teluguOptions: [
      'చర్మంపై సూర్యరశ్మి (UVB కిరణాలు) పడినప్పుడు శరీరం దీనిని స్వయంగా తయారుచేసుకుంటుంది',
      'ఇది చర్మానికి పసుపు రంగును అందిస్తుంది',
      'ఇది పగటి వేళల్లో మాత్రమే జీర్ణం అవుతుంది',
      'ఇది పసుపు రంగు కూరగాయల నుండి మాత్రమే లభిస్తుంది'
    ],
    correctAnswer: 0,
    explanation: 'When skin is exposed to morning UVB sunlight, 7-dehydrocholesterol in the skin is converted into Vitamin D3, essential for bone density and calcium absorption.',
    teluguExplanation: 'ఉదయపు సూర్యరశ్మి చర్మంపై పడినప్పుడు శరీరం సహజంగా విటమిన్ డి3ని ఉత్పత్తి చేస్తుంది. ఇది ఎముకల బలానికి మరియు కాల్షియం శోషణకు చాలా ముఖ్యం.'
  },
  {
    id: 'q3',
    nutrient: 'Iron',
    category: 'Minerals',
    question: 'Which nutrient significantly enhances the absorption of non-heme (plant-based) iron in the body?',
    teluguQuestion: 'మొక్కల ద్వారా లభించే ఐరన్ (ఇనుము) శరీరం చక్కగా గ్రహించడానికి ఏ పోషకం తోడ్పడుతుంది?',
    options: [
      'Vitamin C (Ascorbic acid)',
      'High Caffeine in Tea',
      'Refined Sugar',
      'Saturated Fat'
    ],
    teluguOptions: [
      'విటమిన్ సి (ఆస్కార్బిక్ ఆమ్లం)',
      'టీలోని కెఫీన్',
      'శుద్ధి చేసిన చక్కెర',
      'సంతృప్త కొవ్వు'
    ],
    correctAnswer: 0,
    explanation: 'Vitamin C converts ferric iron into the more soluble ferrous form, increasing plant-based iron absorption from lentils and greens by up to 3 times.',
    teluguExplanation: 'విటమిన్ సి మొక్కల నుండి లభించే ఐరన్‌ను శరీరం సులభంగా పీల్చుకునే రూపంలోకి మారుస్తుంది. నిమ్మరసం లేదా ఉసిరిని ఆకుకూరలతో తీసుకోవడం చాలా మంచిది.'
  },
  {
    id: 'q4',
    nutrient: 'Calcium',
    category: 'Minerals',
    question: 'Which traditional Indian millet is exceptionally rich in natural Calcium for bone health?',
    teluguQuestion: 'ఎముకల ఆరోగ్యానికి అవసరమైన కాల్షియం అధికంగా ఉండే సాంప్రదాయ భారతీయ చిరుధాన్యం ఏది?',
    options: [
      'Ragi (Finger Millet)',
      'Polished White Rice',
      'Semolina (Sooji)',
      'Tapioca (Sago)'
    ],
    teluguOptions: [
      'రాగులు (తైదలు)',
      'పాలిష్ చేసిన తెల్ల బియ్యం',
      'ఉప్మా రవ్వ (సూజీ)',
      'సగ్గుబియ్యం'
    ],
    correctAnswer: 0,
    explanation: 'Ragi contains approximately 344 mg of calcium per 100g—over thirty times more calcium than polished rice—making it ideal for skeletal wellness.',
    teluguExplanation: 'రాగులలో 100 గ్రాములకు దాదాపు 344 మి.గ్రా కాల్షియం ఉంటుంది. ఇది తెల్ల బియ్యం కంటే 30 రెట్లు ఎక్కువ కాల్షియంను అందించి ఎముకలకు బలాన్నిస్తుంది.'
  },
  {
    id: 'q5',
    nutrient: 'Vitamin B12',
    category: 'Vitamins',
    question: 'Why are individuals following a strict vegetarian or vegan diet at higher risk of Vitamin B12 deficiency?',
    teluguQuestion: 'శాకాహారులు విటమిన్ బి12 లోపానికి గురయ్యే అవకాశం ఎందుకు ఎక్కువగా ఉంటుంది?',
    options: [
      'Vitamin B12 is produced by bacteria and absent in unfortified plant foods',
      'Vegetables destroy Vitamin B12 in the stomach',
      'Vitamin B12 is only found in sunlight',
      'Vegetarians require twice as much Vitamin B12'
    ],
    teluguOptions: [
      'విటమిన్ బి12 సహజంగా జంతు సంబంధిత ఆహారాలలో లేదా బలవర్ధక ఆహారాలలో మాత్రమే లభిస్తుంది',
      'కూరగాయలు కడుపులోని విటమిన్ బి12ని నాశనం చేస్తాయి',
      'విటమిన్ బి12 సూర్యరశ్మిలో మాత్రమే లభిస్తుంది',
      'శాకాహారులకు రెట్టింపు మోతాదులో విటమిన్ బి12 అవసరం'
    ],
    correctAnswer: 0,
    explanation: 'Vitamin B12 is synthesized by microorganisms and naturally occurs in animal products and dairy. Strict plant-based eaters benefit from fortified foods or supplements.',
    teluguExplanation: 'విటమిన్ బి12 సహజంగా పాలు, పెరుగు లేదా బలవర్ధక ఆహారాలలో ఉంటుంది. పాలు తీసుకోని సంపూర్ణ శాకాహారులు వైద్యుల సలహాతో సప్లిమెంట్లను పరిగణించాలి.'
  },
  {
    id: 'q6',
    nutrient: 'Protein',
    category: 'Macronutrients',
    question: 'What is the primary role of dietary protein in the human body?',
    teluguQuestion: 'మానవ శరీరంలో ఆహార ప్రోటీన్ యొక్క ముఖ్యమైన విధి ఏమిటి?',
    options: [
      'Building and repairing muscles, enzymes, and bodily tissues',
      'Providing instant bursts of simple sugar energy',
      'Preventing the skin from sweating',
      'Replacing the need to drink water'
    ],
    teluguOptions: [
      'కండరాల నిర్మాణం, కణాల మరమ్మత్తు మరియు ఎంజైమ్‌ల ఉత్పత్తి',
      'తక్షణ సాధారణ చక్కెర శక్తిని అందించడం',
      'చర్మంపై చెమట పట్టకుండా నిరోధించడం',
      'నీరు త్రాగవలసిన అవసరాన్ని తొలగించడం'
    ],
    correctAnswer: 0,
    explanation: 'Proteins are composed of amino acids required for cellular repair, immune antibodies, muscle maintenance, hormones, and enzyme synthesis.',
    teluguExplanation: 'ప్రోటీన్లు కండరాల పెరుగుదలకు, దెబ్బతిన్న కణజాలాల మరమ్మత్తుకు, ఎంజైమ్‌లు మరియు హార్మోన్ల తయారీకి పునాది లాంటివి.'
  },
  {
    id: 'q7',
    nutrient: 'Vitamin A',
    category: 'Deficiency Signs',
    question: 'Difficulty seeing in dim light or darkness (night blindness) is an early physical sign associated with which nutrient gap?',
    teluguQuestion: 'మసక వెలుతురులో లేదా రాత్రివేళల్లో సరిగ్గా కనిపించకపోవడం (రేచీకటి) ఏ విటమిన్ లోపం వల్ల వచ్చే అవకాశం ఉంది?',
    options: [
      'Vitamin A (Retinol / Beta-Carotene)',
      'Vitamin K',
      'Phosphorus',
      'Sodium'
    ],
    teluguOptions: [
      'విటమిన్ ఎ (రెటినాల్ / బీటా-కెరోటిన్)',
      'విటమిన్ కె',
      'భాస్వరం (ఫాస్ఫరస్)',
      'సోడియం'
    ],
    correctAnswer: 0,
    explanation: 'Vitamin A is required to produce rhodopsin, the light-absorbing pigment in retinal rod cells. Carrots, papaya, and moringa are rich in pro-vitamin A.',
    teluguExplanation: 'కంటిలోని రెటీనా కణాలు కాంతిని గ్రహించడానికి విటమిన్ ఎ అవసరం. క్యారెట్లు, బొప్పాయి, మునగాకు మరియు పాలకూరలలో విటమిన్ ఎ పుష్కలంగా ఉంటుంది.'
  },
  {
    id: 'q8',
    nutrient: 'Balanced Diet',
    category: 'Balanced Nutrition',
    question: 'According to the healthy plate method (Balance My Meal), roughly what portion of your plate should consist of colorful vegetables and fruits?',
    teluguQuestion: 'సమతుల్య ఆహార ప్లేట్ విధానం ప్రకారం, ప్లేట్‌లో దాదాపు ఎంత భాగం రంగురంగుల కూరగాయలు మరియు పండ్లతో నిండాలి?',
    options: [
      'About 50% (Half of the plate)',
      'Less than 5%',
      '100% of every meal',
      'Only 10%'
    ],
    teluguOptions: [
      'దాదాపు 50% (సగం ప్లేట్)',
      '5% కంటే తక్కువ',
      'ప్రతి భోజనంలో 100%',
      'కేవలం 10% మాత్రమే'
    ],
    correctAnswer: 0,
    explanation: 'Filling half your plate with diverse, seasonal vegetables and fruits ensures adequate dietary fiber, potassium, and protective antioxidants with low calorie density.',
    teluguExplanation: 'ప్లేట్‌లో సగం భాగం కూరగాయలు మరియు పండ్లతో నింపడం వల్ల శరీరానికి అవసరమైన పీచు పదార్థం, విటమిన్లు మరియు యాంటీఆక్సిడెంట్లు పుష్కలంగా అందుతాయి.'
  },
  {
    id: 'q9',
    nutrient: 'Nutrition Labels',
    category: 'Label Literacy',
    question: 'When reading a packaged food nutrition facts panel, which of the following is considered an indicator of high sodium per serving?',
    teluguQuestion: 'ప్యాక్ చేసిన ఆహార లేబుల్ చూసేటప్పుడు, సర్వింగ్‌కు ఎంత సోడియం ఉంటే అది "అధిక సోడియం"గా పరిగణించబడుతుంది?',
    options: [
      'More than 400 mg sodium per serving',
      'Exactly 10 mg sodium',
      '0 mg sodium',
      '50 mg sodium'
    ],
    teluguOptions: [
      'ఒక్క సర్వింగ్‌కు 400 మిల్లీగ్రాముల కంటే ఎక్కువ సోడియం ఉండటం',
      'ఖచ్చితంగా 10 మిల్లీగ్రాములు ఉండటం',
      '0 మిల్లీగ్రాముల సోడియం ఉండటం',
      '50 మిల్లీగ్రాముల సోడియం ఉండటం'
    ],
    correctAnswer: 0,
    explanation: 'Foods providing more than 400 mg of sodium per serving contribute significantly toward the 2,000 mg maximum recommended daily limit for adults.',
    teluguExplanation: 'ఒక్క సర్వింగ్‌కు 400 మి.గ్రా కంటే ఎక్కువ సోడియం ఉంటే అది రోజువారీ పరిమితిలో 20% కంటే ఎక్కువ. అధిక ఉప్పు రక్తపోటుపై ప్రభావం చూపుతుంది.'
  },
  {
    id: 'q10',
    nutrient: 'Dietary Fiber',
    category: 'Healthy Habits',
    question: 'What is a major nutritional advantage of consuming whole grains and millets compared to polished white rice?',
    teluguQuestion: 'పాలిష్ చేసిన తెల్ల బియ్యంతో పోలిస్తే చిరుధాన్యాలు (మిల్లెట్స్) మరియు ముడి ధాన్యాలు తీసుకోవడం వల్ల కలిగే ప్రధాన ప్రయోజనం ఏమిటి?',
    options: [
      'Higher dietary fiber content that slows glucose release and aids gut health',
      'They contain zero carbohydrates',
      'They can be cooked without any heat',
      'They stay in the stomach for several days without digesting'
    ],
    teluguOptions: [
      'అధిక పీచు పదార్థం (ఫైబర్) వల్ల రక్తంలో గ్లూకోజ్ నెమ్మదిగా విడుదలవుతుంది మరియు జీర్ణక్రియ మెరుగుపడుతుంది',
      'వాటిలో పిండి పదార్థాలు (కార్బోహైడ్రేట్లు) అస్సలు ఉండవు',
      'వాటిని వేడి చేయకుండానే వండవచ్చు',
      'అవి జీర్ణం కాకుండా చాలా రోజులు కడుపులోనే ఉంటాయి'
    ],
    correctAnswer: 0,
    explanation: 'The bran and germ retained in whole grains deliver insoluble and prebiotic soluble fiber, stabilizing blood sugar peaks and feeding beneficial gut microbiota.',
    teluguExplanation: 'ముడి ధాన్యాలు మరియు చిరుధాన్యాలలో ఉండే పీచు పదార్థం కడుపు నిండిన భావనను కలిగిస్తుంది, మలబద్ధకాన్ని నివారిస్తుంది మరియు చక్కెర స్థాయిలను నిలకడగా ఉంచుతుంది.'
  },
  {
    id: 'q11',
    nutrient: 'Folate (Vitamin B9)',
    category: 'Vitamins',
    question: 'Why is Folate (Vitamin B9), found in green leafy vegetables and lentils, especially vital during early pregnancy?',
    teluguQuestion: 'ఆకుకూరలు మరియు పప్పుధాన్యాలలో లభించే ఫోలేట్ (విటమిన్ బి9) గర్భధారణ సమయంలో ఎందుకు అత్యంత ముఖ్యమైనది?',
    options: [
      'It supports rapid cell division and helps prevent neural tube defects in the developing baby',
      'It changes the baby’s eye color',
      'It replaces the need for protein during pregnancy',
      'It causes premature loss of baby teeth'
    ],
    teluguOptions: [
      'కణ విభజనకు మరియు పిండం నాడీ వ్యవస్థ (న్యూరల్ ట్యూబ్) సరిగ్గా అభివృద్ధి చెందడానికి తోడ్పడుతుంది',
      'ఇది శిశువు కంటి రంగును మారుస్తుంది',
      'ఇది గర్భధారణలో ప్రోటీన్ అవసరాన్ని భర్తీ చేస్తుంది',
      'ఇది పాల పళ్ళు రాలిపోయేలా చేస్తుంది'
    ],
    correctAnswer: 0,
    explanation: 'Folate is essential for DNA synthesis and neural tube closure in the first weeks of embryonic development. Sprouted moong and spinach are rich dietary sources.',
    teluguExplanation: 'ఫోలేట్ DNA సంశ్లేషణకు మరియు గర్భస్థ శిశువు మెదడు, వెన్నుపాము సరైన ఎదుగుదలకు అవసరం. మొలకెత్తిన పెసలు, పాలకూరలలో ఇది సమృద్ధిగా లభిస్తుంది.'
  },
  {
    id: 'q12',
    nutrient: 'Iodine',
    category: 'Minerals',
    question: 'Which common household dietary item in India is universally fortified to prevent iodine deficiency and thyroid enlargement (goiter)?',
    teluguQuestion: 'థైరాయిడ్ సమస్యలు మరియు గాయిటర్ రాకుండా నివారించడానికి భారతదేశంలో విస్తృతంగా బలవర్ధకం చేయబడిన గృహ ఆహార పదార్థం ఏది?',
    options: [
      'Iodized Table Salt',
      'Refined Sunflower Oil',
      'White Granulated Sugar',
      'Ground Black Pepper'
    ],
    teluguOptions: [
      'అయోడైజ్డ్ ఉప్పు',
      'శుద్ధి చేసిన పొద్దుతిరుగుడు నూనె',
      'తెల్ల చక్కెర',
      'నల్ల మిరియాల పొడి'
    ],
    correctAnswer: 0,
    explanation: 'Universal salt iodization in India ensures consistent microgram amounts of iodine needed for thyroid hormone (T3/T4) production and cognitive development.',
    teluguExplanation: 'అయోడిన్ లోపం వల్ల వచ్చే గాయిటర్ సమస్యను అరికట్టడానికి ఉప్పుకు అయోడిన్ కలపడం (అయోడైజ్డ్ ఉప్పు) ఒక విజయవంతమైన ప్రజా ఆరోగ్య చర్య.'
  },
  {
    id: 'q13',
    nutrient: 'Vitamin B1 (Thiamine)',
    category: 'Deficiency Signs',
    question: 'Extensively polished and washed white rice loses most of its outer bran layer, which can lead to a deficiency of which B-vitamin?',
    teluguQuestion: 'ఎక్కువగా పాలిష్ చేసిన తెల్ల బియ్యం తినడం వల్ల బియ్యం పొట్టుతో పాటు ఏ బి-విటమిన్ కోల్పోయే ప్రమాదం ఉంది?',
    options: [
      'Vitamin B1 (Thiamine)',
      'Vitamin D3',
      'Vitamin C',
      'Calcium'
    ],
    teluguOptions: [
      'విటమిన్ బి1 (థయామిన్)',
      'విటమిన్ డి3',
      'విటమిన్ సి',
      'కాల్షియం'
    ],
    correctAnswer: 0,
    explanation: 'Thiamine resides primarily in the cereal germ and bran. Excessive polishing and milling removes Thiamine, historically linked to beriberi weakness.',
    teluguExplanation: 'ధాన్యాల పైపొట్టులో విటమిన్ బి1 (థయామిన్) ఉంటుంది. అధిక పాలిష్ చేయడం వల్ల ఇది తొలగిపోతుంది. ముడి బియ్యం లేదా దంపుడు బియ్యం వాడటం మంచిది.'
  },
  {
    id: 'q14',
    nutrient: 'Zinc',
    category: 'Minerals',
    question: 'Which of the following is a key health benefit of the trace mineral Zinc, found in pumpkin seeds, lentils, and nuts?',
    teluguQuestion: 'గుమ్మడి గింజలు, పప్పులు మరియు గింజలలో లభించే జింక్ ఖనిజం యొక్క ముఖ్యమైన ప్రయోజనం ఏమిటి?',
    options: [
      'Supporting immune defense, skin barrier integrity, and wound recovery',
      'Replacing red blood cells entirely',
      'Blocking the absorption of all water',
      'Causing immediate muscle loss'
    ],
    teluguOptions: [
      'రోగనిరోధక శక్తిని పెంచడం, చర్మ ఆరోగ్యం మరియు గాయాలు త్వరగా మానడానికి సహాయపడటం',
      'ఎర్ర రక్త కణాలను పూర్తిగా భర్తీ చేయడం',
      'శరీరం నీటిని పీల్చుకోకుండా ఆపడం',
      'కండరాలు త్వరగా క్షీణించేలా చేయడం'
    ],
    correctAnswer: 0,
    explanation: 'Zinc activates hundreds of cellular enzymes, supports white blood cell function during immune challenges, and aids skin tissue repair.',
    teluguExplanation: 'జింక్ శరీరంలో వందలాది ఎంజైమ్‌లను చురుకుగా ఉంచుతుంది, రోగనిరోధక కణాలను బలపరుస్తుంది మరియు చర్మ గాయాలు నయమవ్వడానికి తోడ్పడుతుంది.'
  },
  {
    id: 'q15',
    nutrient: 'Hydration & Nutrition',
    category: 'Healthy Habits',
    question: 'Why is drinking adequate plain water throughout the day critical for nutrient utilization?',
    teluguQuestion: 'శరీరంలో పోషకాల సమర్థవంతమైన వినియోగానికి తగినంత స్వచ్ఛమైన నీరు త్రాగడం ఎందుకు అత్యవసరం?',
    options: [
      'Water transports water-soluble vitamins, aids digestion, and flushes metabolic waste',
      'Water removes all calories from whatever food you ate',
      'Water permanently stops hunger so you never need food again',
      'Water freezes fats in the stomach into solid bone'
    ],
    teluguOptions: [
      'నీరు నీటిలో కరిగే విటమిన్లను శరీరమంతటా రవాణా చేస్తుంది, జీర్ణక్రియను మెరుగుపరుస్తుంది మరియు వ్యర్థాలను బయటకు పంపుతుంది',
      'నీరు తిన్న ఆహారంలోని క్యాలరీలన్నింటినీ పూర్తిగా తొలగిస్తుంది',
      'నీరు ఆకలిని శాశ్వతంగా ఆపివేస్తుంది',
      'నీరు కడుపులోని కొవ్వును ఎముకలుగా మారుస్తుంది'
    ],
    correctAnswer: 0,
    explanation: 'Water provides the aqueous solvent needed for blood plasma to circulate nutrients to cells, maintain electrolyte balance, and support renal filtration.',
    teluguExplanation: 'రక్తంలో పోషకాలను కణాలకు చేరవేయడానికి, జీవక్రియల వ్యర్థాలను తొలగించడానికి మరియు శరీర ఉష్ణోగ్రతను నియంత్రించడానికి తగినంత నీరు త్రాగడం అత్యవసరం.'
  },
  {
    id: 'q16',
    nutrient: 'Vitamin K',
    category: 'Vitamins',
    question: 'Green leafy vegetables like spinach, fenugreek (methi), and cabbage are excellent sources of Vitamin K. What is its vital function?',
    teluguQuestion: 'పాలకూర, మెంతికూర మరియు క్యాబేజీ వంటి ఆకుకూరలలో లభించే విటమిన్ కె యొక్క ముఖ్యమైన విధి ఏమిటి?',
    options: [
      'Normal blood clotting and bone protein mineralization',
      'Creating artificial artificial sugar in the kidneys',
      'Preventing hair from growing',
      'Cooling the body down to freezing point'
    ],
    teluguOptions: [
      'రక్తం గడ్డకట్టడానికి (బ్లడ్ క్లాటింగ్) మరియు ఎముకల ప్రోటీన్ ఖనిజీకరణకు తోడ్పడటం',
      'మూత్రపిండాలలో కృత్రిమ చక్కెరను తయారుచేయడం',
      'జుట్టు పెరగకుండా నిరోధించడం',
      'శరీరాన్ని గడ్డకట్టే స్థాయికి చల్లబరచడం'
    ],
    correctAnswer: 0,
    explanation: 'Vitamin K acts as an essential cofactor for carboxylating prothrombin and osteocalcin, enabling normal blood coagulation and bone structure.',
    teluguExplanation: 'గాయాలు అయినప్పుడు రక్తం అధికంగా పోకుండా రక్తం గడ్డకట్టడానికి మరియు ఎముకల పటిష్టతకు విటమిన్ కె చాలా అవసరం.'
  }
];

/**
 * Fisher-Yates shuffle array utility
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generates a randomized quiz instance:
 * 1. Shuffles question order
 * 2. Shuffles option order for each question
 * 3. Preserves exact correct answer mapping without corruption
 */
export const getRandomizedQuiz = (count = 15) => {
  const questionsToUse = shuffleArray(quizQuestions).slice(0, count);

  return questionsToUse.map((q) => {
    // Combine options with their Telugu counterparts and correctness flag
    const optionPairs = q.options.map((opt, idx) => ({
      text: opt,
      teluguText: q.teluguOptions[idx] || opt,
      isCorrect: idx === q.correctAnswer
    }));

    // Randomize option order
    const shuffledOptions = shuffleArray(optionPairs);

    // Find new correct index
    const newCorrectIndex = shuffledOptions.findIndex((o) => o.isCorrect);

    return {
      id: q.id,
      nutrient: q.nutrient,
      category: q.category,
      question: q.question,
      teluguQuestion: q.teluguQuestion,
      options: shuffledOptions.map((o) => o.text),
      teluguOptions: shuffledOptions.map((o) => o.teluguText),
      correctAnswer: newCorrectIndex,
      explanation: q.explanation,
      teluguExplanation: q.teluguExplanation
    };
  });
};

/**
 * Performance message calculation based on score percentage
 */
export const getPerformanceFeedback = (percentage, isTelugu = false) => {
  if (percentage >= 85) {
    return {
      level: 'excellent',
      badge: isTelugu ? 'పోషకాహార నిపుణత' : 'Master of Nutrition',
      title: isTelugu ? 'అద్భుతమైన పోషకాహార అవగాహన!' : 'Outstanding Nutrition Awareness!',
      message: isTelugu
        ? 'మీకు విటమిన్లు, ఖనిజాలు మరియు సమతుల్య ఆహార నియమాలపై అసాధారణమైన పరిజ్ఞానం ఉంది.'
        : 'You possess exceptional knowledge about essential vitamins, rich food sources, and balanced dietary principles.',
      color: 'emerald'
    };
  } else if (percentage >= 70) {
    return {
      level: 'good',
      badge: isTelugu ? 'మంచి అవగాహన' : 'Proficient Learner',
      title: isTelugu ? 'చాలా మంచి ఫలితం!' : 'Great Nutritional Knowledge!',
      message: isTelugu
        ? 'మీకు పోషకాహారం మరియు లోప సంకేతాలపై మంచి పట్టు ఉంది. కొన్ని ముఖ్య విషయాలను మరింత తెలుసుకోండి.'
        : 'You have a solid grasp of core vitamins and healthy eating habits. A quick review of the explanations will solidify your wellness knowledge.',
      color: 'teal'
    };
  } else if (percentage >= 50) {
    return {
      level: 'moderate',
      badge: isTelugu ? 'మధ్యస్థ అవగాహన' : 'Developing Awareness',
      title: isTelugu ? 'మంచి ప్రయత్నం — ఇంకా నేర్చుకోవచ్చు!' : 'Good Effort — Room to Grow!',
      message: isTelugu
        ? 'మీకు కొన్ని ప్రాథమిక విషయాలు తెలుసు. మా విటమిన్ ఎన్‌సైక్లోపీడియా మరియు ఫుడ్ ఎక్స్‌ప్లోరర్ చూడటం మరింత ప్రయోజనకరం.'
        : 'You know some fundamental nutrition concepts. Exploring the Vitamin Encyclopedia and Food Explorer will help you bridge remaining knowledge gaps.',
      color: 'amber'
    };
  } else {
    return {
      level: 'needs-improvement',
      badge: isTelugu ? 'ఆరంభ దశ' : 'Beginner Explorer',
      title: isTelugu ? 'నేర్చుకునే దిశగా తొలి అడుగు!' : 'Beginning Your Wellness Journey!',
      message: isTelugu
        ? 'నిరుత్సాహపడకండి! క్రింది సమాధానాల సమీక్షను చదివి, పోషకాల గురించి తెలుసుకుని మళ్ళీ ప్రయత్నించండి.'
        : 'Do not be discouraged! Review the detailed explanations below to discover how daily foods protect against deficiencies, then give it another try.',
      color: 'rose'
    };
  }
};
