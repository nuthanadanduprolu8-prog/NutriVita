// Verified evidence-based Symptom dataset mapped to essential vitamins and minerals
export const symptomsData = [
  // --- ENERGY & FATIGUE ---
  {
    symptomId: 'fatigue',
    id: 'fatigue',
    titleEn: 'Fatigue & Low Energy',
    titleTe: 'అలసట & తక్కువ శక్తి',
    category: 'energy_fatigue',
    shortDescriptionEn: 'Constant tiredness or sluggishness even after adequate sleep and rest.',
    shortDescriptionTe: 'సరిపడా నిద్రపోయినప్పటికీ నిరంతరం అలసట లేదా బద్ధకంగా అనిపించడం.',
    iconName: 'battery-low',
    associatedDeficiencies: [
      { vitaminId: 'mineral-iron', likelihoodWeight: 0.92 },
      { vitaminId: 'vitamin-b12', likelihoodWeight: 0.88 },
      { vitaminId: 'vitamin-d', likelihoodWeight: 0.75 },
      { vitaminId: 'vitamin-b9', likelihoodWeight: 0.70 },
      { vitaminId: 'vitamin-b1', likelihoodWeight: 0.60 }
    ],
    educationalExplanationEn: 'Iron and Vitamin B12 are critical for synthesizing hemoglobin and healthy red blood cells that transport oxygen throughout your body. Vitamin D and B-complex vitamins also regulate cellular mitochondrial energy production.',
    educationalExplanationTe: 'శరీరమంతటా ఆక్సిజన్‌ను మోసుకెళ్ళే హిమోగ్లోబిన్ మరియు ఎర్ర రక్త కణాల తయారీకి ఐరన్ మరియు విటమిన్ B12 చాలా అవసరం. విటమిన్ డి మరియు బి-విటమిన్లు కణాల శక్తి ఉత్పత్తికి తోడ్పడతాయి.',
    recommendedActionEn: 'Prioritize leafy greens (moringa, spinach), lentils, fortified curd, and check vitamin D levels with sensible morning sun exposure.',
    recommendedActionTe: 'మునగాకు, పాలకూర, పప్పుధాన్యాలు, పెరుగును ఆహారంలో చేర్చుకోండి మరియు ఉదయపు ఎండ ద్వారా విటమిన్ డి పొందండి.'
  },
  {
    symptomId: 'weakness',
    id: 'weakness',
    titleEn: 'General Physical Weakness',
    titleTe: 'శారీరక బలహీనత',
    category: 'energy_fatigue',
    shortDescriptionEn: 'Reduced muscle strength or difficulty performing everyday physical activities.',
    shortDescriptionTe: 'కండరాల బలం తగ్గడం లేదా రోజువారీ శారీరక పనులు చేయడం కష్టంగా ఉండటం.',
    iconName: 'activity',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-b12', likelihoodWeight: 0.88 },
      { vitaminId: 'mineral-iron', likelihoodWeight: 0.85 },
      { vitaminId: 'vitamin-d', likelihoodWeight: 0.80 },
      { vitaminId: 'mineral-calcium', likelihoodWeight: 0.65 }
    ],
    educationalExplanationEn: 'Muscular integrity and motor transmission depend heavily on Vitamin D, Calcium, and bioavailable Vitamin B12. Low systemic oxygen from iron depletion can also cause general weakness.',
    educationalExplanationTe: 'కండరాల బలం మరియు నరాల ప్రేరణలు విటమిన్ డి, కాల్షియం మరియు విటమిన్ B12 పై ఆధారపడి ఉంటాయి. ఐరన్ తగ్గడం వల్ల కూడా బలహీనత వస్తుంది.',
    recommendedActionEn: 'Incorporate ragi, dairy or fortified alternatives, paneer, and soaked nuts into meals.',
    recommendedActionTe: 'రాగులు, పాలు, పెరుగు, పనీర్ మరియు నానబెట్టిన బాదం వంటి వాటిని ఆహారంలో చేర్చుకోండి.'
  },
  {
    symptomId: 'dizziness',
    id: 'dizziness',
    titleEn: 'Dizziness & Lightheadedness',
    titleTe: 'తలతిరగడం & కళ్ళు తిరగడం',
    category: 'energy_fatigue',
    shortDescriptionEn: 'Feeling faint, unsteady, or woozy when standing up or exerting yourself.',
    shortDescriptionTe: 'లేచినప్పుడు లేదా నడిచినప్పుడు తల తిరగడం లేదా తూలిపోతున్నట్లు అనిపించడం.',
    iconName: 'rotate-cw',
    associatedDeficiencies: [
      { vitaminId: 'mineral-iron', likelihoodWeight: 0.88 },
      { vitaminId: 'vitamin-b12', likelihoodWeight: 0.82 },
      { vitaminId: 'vitamin-b9', likelihoodWeight: 0.65 }
    ],
    educationalExplanationEn: 'Reduced oxygen delivery to the cerebral cortex due to low iron or B12-related anemia is a frequent nutritional contributor to lightheadedness.',
    educationalExplanationTe: 'ఐరన్ లేదా B12 లోపం వల్ల మెదడుకు ఆక్సిజన్ సరఫరా తగ్గడం తలతిరగడానికి ఒక సాధారణ కారణం.',
    recommendedActionEn: 'Pair iron-rich foods with Vitamin C (such as lemon on dal or amla) to boost absorption.',
    recommendedActionTe: 'ఐరన్ ఉన్న పప్పు, ఆకుకూరలతో పాటు నిమ్మరసం లేదా ఉసిరిని కలిపి తీసుకోవడం వల్ల శోషణ పెరుగుతుంది.'
  },
  {
    symptomId: 'headache',
    id: 'headache',
    titleEn: 'Frequent Mild Headaches',
    titleTe: 'తరచుగా వచ్చే తలనొప్పి',
    category: 'energy_fatigue',
    shortDescriptionEn: 'Recurring dull headaches, head heaviness, or tension across temples.',
    shortDescriptionTe: 'తరచుగా తల దిమ్ముగా ఉండటం లేదా నుదిటి భాగంలో నొప్పి రావడం.',
    iconName: 'frown',
    associatedDeficiencies: [
      { vitaminId: 'mineral-iron', likelihoodWeight: 0.78 },
      { vitaminId: 'vitamin-b2', likelihoodWeight: 0.72 },
      { vitaminId: 'vitamin-b12', likelihoodWeight: 0.68 }
    ],
    educationalExplanationEn: 'Iron deficiency anemia reduces cranial arterial oxygenation. Riboflavin (Vitamin B2) is also widely studied for maintaining normal mitochondrial cerebrovascular tone.',
    educationalExplanationTe: 'రక్తహీనత వల్ల మెదడు రక్తనాళాలకు ఆక్సిజన్ అందకపోవడం తలనొప్పికి దారితీస్తుంది. విటమిన్ B2 కూడా మెదడు ఆరోగ్యానికి అవసరం.',
    recommendedActionEn: 'Stay well-hydrated, consume almonds, whole grains, and dark green leafy vegetables.',
    recommendedActionTe: 'మంచి నీరు ఎక్కువగా తాగండి, బాదం, ముడి ధాన్యాలు మరియు ఆకుకూరలు తీసుకోండి.'
  },
  {
    symptomId: 'difficulty-concentrating',
    id: 'difficulty-concentrating',
    titleEn: 'Brain Fog & Focus Difficulties',
    titleTe: 'ఏకాగ్రత లోపించడం & బ్రెయిన్ ఫాగ్',
    category: 'energy_fatigue',
    shortDescriptionEn: 'Trouble focusing, mental cloudiness, or feeling cognitively sluggish.',
    shortDescriptionTe: 'పనులపై ఏకాగ్రత కుదరకపోవడం లేదా జ్ఞాపకశక్తి మందగించినట్లు అనిపించడం.',
    iconName: 'brain',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-b12', likelihoodWeight: 0.86 },
      { vitaminId: 'mineral-iron', likelihoodWeight: 0.80 },
      { vitaminId: 'vitamin-b1', likelihoodWeight: 0.68 },
      { vitaminId: 'vitamin-b6', likelihoodWeight: 0.65 }
    ],
    educationalExplanationEn: 'Vitamin B12 is essential for myelin sheath integrity around neural axons. Iron is a cofactor for enzymes synthesizing neurotransmitters like dopamine and serotonin.',
    educationalExplanationTe: 'మెదడు నరాల రక్షణకు విటమిన్ B12 చాలా ముఖ్యం. న్యూరోట్రాన్స్మిటర్ల తయారీకి ఐరన్ అవసరం.',
    recommendedActionEn: 'Include fermented curd, paneer, whole eggs, nuts, and complex millets.',
    recommendedActionTe: 'పెరుగు, పనీర్, గుడ్లు, గింజలు మరియు చిరుధాన్యాలను ఆహారంలో చేర్చండి.'
  },

  // --- SKIN & HAIR ---
  {
    symptomId: 'pale-skin',
    id: 'pale-skin',
    titleEn: 'Pale Skin & Pallor',
    titleTe: 'చర్మం పాలిపోవడం',
    category: 'skin_hair',
    shortDescriptionEn: 'Noticeable loss of natural skin tone, pale inner eyelids, or pale nail beds.',
    shortDescriptionTe: 'చర్మం, కనురెప్పల లోపలి భాగం లేదా గోర్లు ఎరుపు రంగు కోల్పోయి పాలిపోయినట్లు ఉండటం.',
    iconName: 'user',
    associatedDeficiencies: [
      { vitaminId: 'mineral-iron', likelihoodWeight: 0.96 },
      { vitaminId: 'vitamin-b12', likelihoodWeight: 0.82 },
      { vitaminId: 'vitamin-b9', likelihoodWeight: 0.75 }
    ],
    educationalExplanationEn: 'Hemoglobin gives blood its red color and gives skin a healthy pinkish flush. Suboptimal iron stores reduce microvascular hemoglobin concentration.',
    educationalExplanationTe: 'రక్తానికి ఎరుపు రంగునిచ్చే హిమోగ్లోబిన్ తగ్గడం వల్ల చర్మం సహజ కాంతిని కోల్పోయి పాలిపోతుంది.',
    recommendedActionEn: 'Incorporate iron superfoods like moringa curry, beetroot, pomegranate, and sprouted lentils.',
    recommendedActionTe: 'మునగాకు, బీట్‌రూట్, దానిమ్మ మరియు మొలకెత్తిన పప్పులను తీసుకోండి.'
  },
  {
    symptomId: 'hair-fall',
    id: 'hair-fall',
    titleEn: 'Excessive Hair Fall & Thinning',
    titleTe: 'తీవ్రమైన జుట్టు రాలడం',
    category: 'skin_hair',
    shortDescriptionEn: 'Unusual shedding while brushing or washing, thinning hairline, or brittle hair strands.',
    shortDescriptionTe: 'దువ్వినప్పుడు లేదా తలస్నానం చేసినప్పుడు జుట్టు ఎక్కువగా రాలడం మరియు పలుచబడటం.',
    iconName: 'scissors',
    associatedDeficiencies: [
      { vitaminId: 'mineral-iron', likelihoodWeight: 0.86 },
      { vitaminId: 'vitamin-d', likelihoodWeight: 0.80 },
      { vitaminId: 'vitamin-e', likelihoodWeight: 0.76 },
      { vitaminId: 'vitamin-c', likelihoodWeight: 0.65 }
    ],
    educationalExplanationEn: 'Hair follicles require high cellular turnover supported by ferritin (stored iron) and Vitamin D receptors. Vitamin E and C shield follicle lipids from oxidative degradation.',
    educationalExplanationTe: 'జుట్టు కుదుళ్లకు ఫెర్రిటిన్ (ఐరన్) మరియు విటమిన్ డి అవసరం. విటమిన్ ఇ మరియు సి జుట్టును రక్షిస్తాయి.',
    recommendedActionEn: 'Eat roasted flaxseeds, soaked almonds, boiled eggs, and iron-dense greens.',
    recommendedActionTe: 'అవిసె గింజలు, నానబెట్టిన బాదం, గుడ్లు మరియు ఆకుకూరలను క్రమం తప్పకుండా తినండి.'
  },
  {
    symptomId: 'dry-skin',
    id: 'dry-skin',
    titleEn: 'Dry, Rough, or Flaky Skin',
    titleTe: 'పొడిబారిన & గరుకైన చర్మం',
    category: 'skin_hair',
    shortDescriptionEn: 'Rough skin patches, peeling, or tiny bumps on upper arms (follicular hyperkeratosis).',
    shortDescriptionTe: 'చర్మం పొడిబారడం, పొట్టు రాలడం లేదా చేతులపై చిన్న చిన్న గరుకు దద్దుర్లు రావడం.',
    iconName: 'sun',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-a', likelihoodWeight: 0.88 },
      { vitaminId: 'vitamin-e', likelihoodWeight: 0.82 },
      { vitaminId: 'vitamin-c', likelihoodWeight: 0.72 }
    ],
    educationalExplanationEn: 'Vitamin A regulates epithelial cell differentiation and sebum production. Vitamin E maintains lipid epidermal barrier integrity preventing trans-epidermal water loss.',
    educationalExplanationTe: 'విటమిన్ ఎ చర్మ కణాల పునరుత్పత్తికి, విటమిన్ ఇ చర్మంలోని తేమను కాపాడటానికి సహాయపడతాయి.',
    recommendedActionEn: 'Consume carrots, sweet potatoes, papaya, nuts, and healthy cold-pressed oils.',
    recommendedActionTe: 'క్యారెట్లు, చిలగడదుంపలు, బొప్పాయి, గింజలు మరియు మంచి నూనెలను వాడండి.'
  },

  // --- MOUTH & GUMS ---
  {
    symptomId: 'bleeding-gums',
    id: 'bleeding-gums',
    titleEn: 'Bleeding or Swollen Gums',
    titleTe: 'చిగుళ్ళ నుండి రక్తం కారడం',
    category: 'mouth_gums',
    shortDescriptionEn: 'Gums bleed readily while brushing or flossing; tender or inflamed gum margins.',
    shortDescriptionTe: 'పళ్ళు తోముతున్నప్పుడు చిగుళ్ల నుండి రక్తం రావడం లేదా చిగుళ్లు వాపు ఉండటం.',
    iconName: 'smile',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-c', likelihoodWeight: 0.96 },
      { vitaminId: 'vitamin-k', likelihoodWeight: 0.78 }
    ],
    educationalExplanationEn: 'Ascorbic acid (Vitamin C) is the rate-limiting enzyme cofactor for collagen peptide hydroxylation. Weak collagen makes capillary walls in gums fragile.',
    educationalExplanationTe: 'కొల్లాజెన్ తయారీకి విటమిన్ సి చాలా ముఖ్యం. విటమిన్ సి తగ్గితే చిగుళ్లలోని రక్తనాళాలు బలహీనపడతాయి.',
    recommendedActionEn: 'Eat fresh Indian gooseberry (amla), guava, citrus fruits, and raw bell peppers.',
    recommendedActionTe: 'ఉసిరికాయ, జామకాయ, నిమ్మరసం మరియు తాజా పండ్లను రోజూ తీసుకోండి.'
  },
  {
    symptomId: 'mouth-ulcers',
    id: 'mouth-ulcers',
    titleEn: 'Mouth Ulcers & Cracks at Lip Corners',
    titleTe: 'నోటి పూత & పెదవుల పగుళ్లు',
    category: 'mouth_gums',
    shortDescriptionEn: 'Canker sores inside cheeks, sore tongue, or painful fissures at corners of the mouth.',
    shortDescriptionTe: 'నోటిలో పుండ్లు (నోటి పూత), నాలుక ఎర్రబడటం లేదా పెదవుల మూలల్లో పగుళ్లు రావడం.',
    iconName: 'alert-circle',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-b2', likelihoodWeight: 0.88 },
      { vitaminId: 'vitamin-b12', likelihoodWeight: 0.84 },
      { vitaminId: 'vitamin-b9', likelihoodWeight: 0.80 },
      { vitaminId: 'vitamin-b3', likelihoodWeight: 0.75 },
      { vitaminId: 'mineral-iron', likelihoodWeight: 0.70 }
    ],
    educationalExplanationEn: 'Angular cheilitis (cracked mouth corners) and recurrent aphthous ulcers are strongly correlated with B-complex deficiencies (B2 Riboflavin, B9 Folate, B12) and iron depletion.',
    educationalExplanationTe: 'పెదవుల మూలల్లో పగుళ్లు మరియు నోటి పూత సాధారణంగా విటమిన్ B2, B9, B12 మరియు ఐరన్ లోపంతో సంబంధం కలిగి ఉంటాయి.',
    recommendedActionEn: 'Eat fresh curd, soaked fenugreek seeds, green vegetables, and whole pulses.',
    recommendedActionTe: 'తాజా పెరుగు, మెంతులు, ఆకుకూరలు మరియు పప్పుధాన్యాలను ఆహారంలో భాగం చేసుకోండి.'
  },
  {
    symptomId: 'poor-wound-healing',
    id: 'poor-wound-healing',
    titleEn: 'Slow Wound & Cut Healing',
    titleTe: 'గాయాలు ఆలస్యంగా మానడం',
    category: 'mouth_gums',
    shortDescriptionEn: 'Minor scratches, scrapes, or skin abrasions take an unusually long time to heal.',
    shortDescriptionTe: 'చిన్న చిన్న దెబ్బలు లేదా గీతలు మానడానికి ఎక్కువ సమయం పట్టడం.',
    iconName: 'shield',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-c', likelihoodWeight: 0.90 },
      { vitaminId: 'vitamin-a', likelihoodWeight: 0.78 }
    ],
    educationalExplanationEn: 'Wound closure requires rapid fibroblast proliferation, collagen scaffolding (Vitamin C), and cellular epithelialization (Vitamin A).',
    educationalExplanationTe: 'గాయం మానడానికి కొత్త కణజాలం మరియు కొల్లాజెన్ తయారవ్వాలి, దీనికి విటమిన్ సి మరియు విటమిన్ ఎ అవసరం.',
    recommendedActionEn: 'Focus on Vitamin C rich fruits and Vitamin A rich vegetables like drumstick leaves and carrots.',
    recommendedActionTe: 'ఉసిరి, జామ, క్యారెట్లు మరియు మునగాకు వంటి ఆహారాలను ఎక్కువగా తీసుకోండి.'
  },

  // --- BONES & JOINTS ---
  {
    symptomId: 'bone-weakness',
    id: 'bone-weakness',
    titleEn: 'Bone Aches & Joint Sensitivity',
    titleTe: 'ఎముకల నొప్పులు & కీళ్ల అసౌకర్యం',
    category: 'bones_joints',
    shortDescriptionEn: 'Deep aching sensations in lower back, ribs, shins, or persistent joint discomfort.',
    shortDescriptionTe: 'నడుము, కాళ్లు లేదా పక్కటెముకల్లో లోపల నుండి వచ్చే ఎముకల నొప్పులు.',
    iconName: 'shield-alert',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-d', likelihoodWeight: 0.95 },
      { vitaminId: 'mineral-calcium', likelihoodWeight: 0.90 },
      { vitaminId: 'vitamin-k', likelihoodWeight: 0.70 }
    ],
    educationalExplanationEn: 'Inadequate 25(OH)D impairs intestinal calcium absorption, leading to unmineralized bone matrix osteomalacia. Vitamin K activates osteocalcin to bind calcium in bone.',
    educationalExplanationTe: 'విటమిన్ డి లేకపోతే శరీరం కాల్షియంను శోషించుకోలేదు, దీనివల్ల ఎముకల సాంద్రత తగ్గి నొప్పులు వస్తాయి.',
    recommendedActionEn: 'Incorporate ragi porridge, sesame seeds, curd, paneer, and regular morning sun exposure.',
    recommendedActionTe: 'రాగి జావ, నువ్వులు, పాలు, పనీర్ మరియు ఉదయపు ఎండ తగిలేలా చూసుకోండి.'
  },
  {
    symptomId: 'muscle-cramps',
    id: 'muscle-cramps',
    titleEn: 'Frequent Muscle Cramps & Spasms',
    titleTe: 'కండరాల తిమ్మిర్లు & నొప్పులు',
    category: 'bones_joints',
    shortDescriptionEn: 'Sudden involuntary contractions in calves, feet, or eyelids twitching.',
    shortDescriptionTe: 'పిక్కలు లేదా పాదాలలో అకస్మాత్తుగా కండరాలు పట్టేయడం (తిమ్మిర్లు).',
    iconName: 'zap',
    associatedDeficiencies: [
      { vitaminId: 'mineral-calcium', likelihoodWeight: 0.88 },
      { vitaminId: 'vitamin-d', likelihoodWeight: 0.82 },
      { vitaminId: 'vitamin-b1', likelihoodWeight: 0.65 }
    ],
    educationalExplanationEn: 'Calcium ions mediate neuromuscular actin-myosin contractility. Hypocalcemia or altered electrolyte flux causes motor neuron hypersensitivity and spasms.',
    educationalExplanationTe: 'కండరాల సంకోచ వ్యాకోచాలను కాల్షియం నియంత్రిస్తుంది. కాల్షియం లేదా విటమిన్ డి తగ్గినప్పుడు తిమ్మిర్లు వస్తాయి.',
    recommendedActionEn: 'Add dairy curd, ragi, bananas (potassium), and leafy greens to the daily diet.',
    recommendedActionTe: 'పెరుగు, రాగులు, అరటిపండ్లు మరియు ఆకుకూరలను రోజూ ఆహారంలో చేర్చండి.'
  },

  // --- VISION & EYES ---
  {
    symptomId: 'night-vision',
    id: 'night-vision',
    titleEn: 'Difficulty Seeing in Dim Light / Dry Eyes',
    titleTe: 'మసక వెలుతురులో కంటిచూపు మందగించడం / రేచీకటి',
    category: 'vision_eyes',
    shortDescriptionEn: 'Trouble adjusting vision when stepping into low-light rooms, or dry gritty sensation in eyes.',
    shortDescriptionTe: 'చీకట్లో లేదా మసక వెలుతురులో వస్తువులు సరిగ్గా కనిపించకపోవడం, కళ్ళు పొడిబారడం.',
    iconName: 'eye',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-a', likelihoodWeight: 0.98 },
      { vitaminId: 'vitamin-c', likelihoodWeight: 0.60 }
    ],
    educationalExplanationEn: 'Retinol is directly converted into 11-cis-retinal, which forms the light-absorbing pigment rhodopsin in retinal rod cells. Deficiency causes nyctalopia and xerophthalmia.',
    educationalExplanationTe: 'చీకట్లో చూడటానికి అవసరమైన రోడోప్సిన్ తయారీకి విటమిన్ ఎ ప్రాణాధారం. దీని లోపం రేచీకటికి కారణమవుతుంది.',
    recommendedActionEn: 'Consume orange and deep green produce: sweet potato, carrots, ripe papaya, and spinach.',
    recommendedActionTe: 'క్యారెట్లు, చిలగడదుంపలు, పండిన బొప్పాయి, మామిడి మరియు పాలకూర తినండి.'
  },

  // --- IMMUNITY & INFECTIONS ---
  {
    symptomId: 'frequent-infections',
    id: 'frequent-infections',
    titleEn: 'Frequent Colds & Catching Infections',
    titleTe: 'తరచుగా జలుబు & ఇన్ఫెక్షన్లు రావడం',
    category: 'immunity_infections',
    shortDescriptionEn: 'Catching seasonal colds, sore throats, or respiratory flu unusually frequently.',
    shortDescriptionTe: 'తరచుగా దగ్గు, జలుబు, గొంతు నొప్పి లేదా వైరల్ ఇన్ఫెక్షన్లకు గురికావడం.',
    iconName: 'thermometer',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-c', likelihoodWeight: 0.88 },
      { vitaminId: 'vitamin-d', likelihoodWeight: 0.85 },
      { vitaminId: 'vitamin-a', likelihoodWeight: 0.78 }
    ],
    educationalExplanationEn: 'Vitamins C, D, and A maintain mucosal epithelial barrier defenses and promote phagocyte and lymphocyte immune proliferation.',
    educationalExplanationTe: 'విటమిన్ సి, డి మరియు ఎ రోగనిరోధక వ్యవస్థను బలోపేతం చేసి ఇన్ఫెక్షన్లతో పోరాడే తెల్ల రక్త కణాలకు శక్తినిస్తాయి.',
    recommendedActionEn: 'Drink warm water with amla or lemon, consume drumstick leaves, and enjoy morning sunshine.',
    recommendedActionTe: 'ఉసిరి, నిమ్మరసం, మునగాకు మరియు ఉదయపు ఎండ ద్వారా సహజ రోగనిరోధక శక్తిని పెంచుకోండి.'
  },
  {
    symptomId: 'tingling-numbness',
    id: 'tingling-numbness',
    titleEn: 'Pins & Needles (Tingling / Numbness)',
    titleTe: 'కాళ్ళు చేతుల్లో సూదులు గుచ్చినట్లు అనిపించడం',
    category: 'energy_fatigue',
    shortDescriptionEn: 'Tingling, burning, or numb sensations in fingers, toes, hands, or feet.',
    shortDescriptionTe: 'చేతులు, కాళ్ల వేళ్లలో సూదులతో గుచ్చినట్లు లేదా తిమ్మిరిగా అనిపించడం.',
    iconName: 'sparkles',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-b12', likelihoodWeight: 0.95 },
      { vitaminId: 'vitamin-b6', likelihoodWeight: 0.80 },
      { vitaminId: 'vitamin-b1', likelihoodWeight: 0.72 }
    ],
    educationalExplanationEn: 'Peripheral neuropathy and myelin sheath degradation are classic hallmarks of protracted Vitamin B12 and B6 imbalances.',
    educationalExplanationTe: 'నరాల పైపొర (మైలిన్ షీత్) ఆరోగ్యంగా ఉండటానికి విటమిన్ B12 మరియు B6 అవసరం. వీటి లోపం వల్ల నరాల తిమ్మిరి వస్తుంది.',
    recommendedActionEn: 'Incorporate fermented curd, paneer, fortified cereals, and consult a doctor for a B12 blood check.',
    recommendedActionTe: 'పెరుగు, పనీర్ వంటి ఆహారాలు తీసుకోండి మరియు అవసరమైతే విటమిన్ B12 రక్త పరీక్ష చేయించుకోండి.'
  },
  {
    symptomId: 'loss-of-appetite',
    id: 'loss-of-appetite',
    titleEn: 'Poor Appetite & Digestive Sluggishness',
    titleTe: 'ఆకలి మందగించడం',
    category: 'energy_fatigue',
    shortDescriptionEn: 'Lack of natural hunger cues or early satiety during routine meals.',
    shortDescriptionTe: 'సమయానికి ఆకలి కాకపోవడం లేదా కొద్దిగా తినగానే కడుపు నిండినట్లు అనిపించడం.',
    iconName: 'utensils',
    associatedDeficiencies: [
      { vitaminId: 'vitamin-b1', likelihoodWeight: 0.85 },
      { vitaminId: 'vitamin-b12', likelihoodWeight: 0.72 },
      { vitaminId: 'mineral-iron', likelihoodWeight: 0.65 }
    ],
    educationalExplanationEn: 'Thiamine (Vitamin B1) regulates hunger center signaling in the hypothalamus and carbohydrate metabolism. Deficiency induces early anorexia.',
    educationalExplanationTe: 'విటమిన్ B1 ఆకలిని ప్రేరేపించే మెదడు కేంద్రాలకు అవసరం. దీని కొరత వల్ల ఆకలి మందగిస్తుంది.',
    recommendedActionEn: 'Consume whole wheat, unpolished millets, peanuts, and legumes.',
    recommendedActionTe: 'ముడి గోధుమలు, పల్లీలు, పప్పులు మరియు చిరుధాన్యాలు తీసుకోండి.'
  }
];

export const symptomCategories = [
  { id: 'all', nameEn: 'All Symptoms', nameTe: 'అన్ని లక్షణాలు' },
  { id: 'energy_fatigue', nameEn: 'Energy & Fatigue', nameTe: 'శక్తి & అలసట' },
  { id: 'skin_hair', nameEn: 'Skin & Hair', nameTe: 'చర్మం & జుట్టు' },
  { id: 'mouth_gums', nameEn: 'Mouth & Gums', nameTe: 'నోరు & చిగుళ్ళు' },
  { id: 'bones_joints', nameEn: 'Bones & Joints', nameTe: 'ఎముకలు & కీళ్ళు' },
  { id: 'vision_eyes', nameEn: 'Vision & Eyes', nameTe: 'కంటి చూపు' },
  { id: 'immunity_infections', nameEn: 'Immunity & Health', nameTe: 'రోగనిరోధకత' },
];
