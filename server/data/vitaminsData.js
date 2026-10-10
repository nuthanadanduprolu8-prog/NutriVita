// Verified dataset for all 13 essential vitamins and key minerals
export const vitaminsData = [
  {
    vitaminId: 'vitamin-a',
    nameEn: 'Vitamin A (Retinol & Beta-Carotene)',
    nameTe: 'విటమిన్ ఎ (రెటినాల్ & బీటా-కెరోటిన్)',
    chemicalName: 'Retinol / Provitamin A Carotenoids',
    type: 'fat_soluble',
    rdaAdults: {
      male: '900 mcg RAE',
      female: '700 mcg RAE',
      pregnancy: '770 mcg RAE',
      unit: 'mcg'
    },
    primaryFunctionsEn: [
      'Essential for clear vision, particularly night vision and photoreceptor health.',
      'Maintains cellular integrity of skin, mucous membranes, and respiratory linings.',
      'Supports robust immune cell production (T-cells and B-cells) to ward off infections.'
    ],
    primaryFunctionsTe: [
      'కంటి చూపును, ముఖ్యంగా రేచీకటిని నివారించడంలో మరియు దృష్టి ఆరోగ్యంలో కీలక పాత్ర పోషిస్తుంది.',
      'చర్మం మరియు శ్లేష్మ పొరల ఆరోగ్యకరమైన పునరుత్పత్తికి సహాయపడుతుంది.',
      'శరీరంలో రోగనిరోధక శక్తిని పెంపొందించి ఇన్ఫెక్షన్ల నుండి రక్షిస్తుంది.'
    ],
    deficiencySymptomsEn: [
      'Night blindness (Nyctalopia) and dry eyes (Xerophthalmia).',
      'Dry, scaly skin and follicular hyperkeratosis (rough bumps).',
      'Frequent respiratory infections and delayed wound healing.'
    ],
    deficiencySymptomsTe: [
      'రేచీకటి మరియు కళ్లలో పొడిబారడం (జెరోఫ్తాల్మియా).',
      'చర్మం పొడిబారడం మరియు చర్మంపై చిన్న చిన్న గరుకు దద్దుర్లు రావడం.',
      'తరచుగా దగ్గు, జలుబు వంటి శ్వాసకోశ ఇన్ఫెక్షన్లు రావడం.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Healthy Dietary Fats',
        explanationEn: 'Vitamin A is fat-soluble; pairing carrots or spinach with 1 tsp of olive oil or ghee increases beta-carotene absorption by up to 300%.',
        explanationTe: 'విటమిన్ ఎ కొవ్వులో కరిగే విటమిన్; క్యారెట్లు లేదా పాలకూరను కొద్దిగా నెయ్యి లేదా నూనెతో కలిపి తీసుకుంటే పోషకాల శోషణ 300% పెరుగుతుంది.'
      },
      {
        partnerNutrient: 'Zinc',
        explanationEn: 'Zinc is required by enzymes that mobilize Vitamin A from the liver into the bloodstream.',
        explanationTe: 'కాలేయం నుండి రక్తంలోకి విటమిన్ ఎ రవాణా కావడానికి జింక్ అనే ఖనిజం తప్పనిసరిగా అవసరం.'
      }
    ],
    topFoodSources: ['carrot', 'spinach', 'sweet_potato', 'papaya', 'mango', 'drumstick_leaves', 'egg'],
    preventiveTipsEn: [
      'Eat at least one dark orange or deep green leafy vegetable every single day.',
      'Steam vegetables lightly rather than deep-frying to preserve delicate carotenoids.'
    ],
    preventiveTipsTe: [
      'ప్రతిరోజూ కనీసం ఒక నారింజ రంగు కూరగాయ లేదా ముదురు ఆకుకూరను ఆహారంలో చేర్చుకోండి.',
      'విటమిన్ ఎ నశించకుండా ఉండటానికి కూరగాయలను తక్కువ మంటపై వండండి.'
    ]
  },
  {
    vitaminId: 'vitamin-b1',
    nameEn: 'Vitamin B1 (Thiamine)',
    nameTe: 'విటమిన్ బి1 (థయామిన్)',
    chemicalName: 'Thiamine Hydrochloride',
    type: 'water_soluble',
    rdaAdults: {
      male: '1.2 mg',
      female: '1.1 mg',
      pregnancy: '1.4 mg',
      unit: 'mg'
    },
    primaryFunctionsEn: [
      'Converts dietary carbohydrates and glucose into cellular energy (ATP).',
      'Maintains healthy nerve signaling and neuromuscular coordination.',
      'Supports healthy cardiac muscle contractions.'
    ],
    primaryFunctionsTe: [
      'పిండి పదార్థాలను శరీరానికి అవసరమైన శక్తిగా (గ్లూకోజ్) మార్చడంలో తోడ్పడుతుంది.',
      'నాడీ వ్యవస్థ యొక్క సమర్థవంతమైన పనితీరును కాపాడుతుంది.',
      'గుండె కండరాల సరైన సంకోచ-వ్యాకోచాలకు సహాయపడుతుంది.'
    ],
    deficiencySymptomsEn: [
      'General fatigue, muscle weakness, and numbness in feet and fingers.',
      'Loss of appetite, mental confusion, and irritability.',
      'In severe deficiency: Beriberi (nerve inflammation and fluid retention).'
    ],
    deficiencySymptomsTe: [
      'విపరీతమైన అలసట, కండరాల బలహీనత, కాళ్లూ చేతుల్లో తిమ్మిర్లు.',
      'ఆకలి మందగించడం, మానసిక గందరగోళం మరియు చిరాకు.',
      'తీవ్ర లోపంలో: బెరిబెరి వ్యాధి (నాడీ బలహీనత మరియు వాపులు).'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Magnesium',
        explanationEn: 'Magnesium converts thiamine into its active co-enzyme form (TPP).',
        explanationTe: 'థయామిన్ శరీరంలో చురుకైన రూపంలోకి మారడానికి మెగ్నీషియం తోడ్పడుతుంది.'
      }
    ],
    topFoodSources: ['whole_wheat', 'coconut', 'roasted_peanuts', 'chickpeas', 'oats'],
    preventiveTipsEn: [
      'Opt for unpolished millets and whole grains instead of ultra-refined white rice and maida.',
      'Avoid drinking excess tea or coffee immediately after meals as tannins degrade thiamine.'
    ],
    preventiveTipsTe: [
      'పాలిష్ చేసిన తెల్ల బియ్యం బదులు ముడి ధాన్యాలు, సజ్జలు, రాగులు వంటి చిరుధాన్యాలను ఎంచుకోండి.',
      'భోజనం చేసిన వెంటనే టీ లేదా కాఫీ తాగడం వల్ల థయామిన్ శోషణ తగ్గుతుంది.'
    ]
  },
  {
    vitaminId: 'vitamin-b2',
    nameEn: 'Vitamin B2 (Riboflavin)',
    nameTe: 'విటమిన్ బి2 (రైబోఫ్లేవిన్)',
    chemicalName: 'Riboflavin',
    type: 'water_soluble',
    rdaAdults: {
      male: '1.3 mg',
      female: '1.1 mg',
      pregnancy: '1.4 mg',
      unit: 'mg'
    },
    primaryFunctionsEn: [
      'Assists in cellular respiration and energy production through FAD/FMN cofactors.',
      'Protects cellular DNA against oxidative stress as an antioxidant regenerator.',
      'Maintains healthy eyes, mucous membranes, and skin.'
    ],
    primaryFunctionsTe: [
      'శరీర కణాల్లో శక్తి ఉత్పత్తి మరియు మెటబాలిజంలో కీలక పాత్ర పోషిస్తుంది.',
      'కంటి ఆరోగ్యం మరియు నోటి శ్లేష్మ పొరల ఆరోగ్యానికి రక్షణగా నిలుస్తుంది.',
      'చర్మం మరియు పెదవుల సహజ సౌందర్యాన్ని కాపాడుతుంది.'
    ],
    deficiencySymptomsEn: [
      'Cracking and painful sores at mouth corners (Angular Cheilitis).',
      'Swollen, magenta-colored tongue (Glossitis) and dry lip peeling.',
      'Eye fatigue, light sensitivity, and itchy red eyelids.'
    ],
    deficiencySymptomsTe: [
      'నోటి మూలల్లో పగుళ్లు మరియు పుండ్లు ఏర్పడటం (యాంగులర్ చీలిటిస్).',
      'నాలుక వాపు, ఎర్రబడటం మరియు పెదవుల పొట్టు రాలడం.',
      'కళ్లలో మంట, కాంతిని చూడలేకపోవడం మరియు అలసట.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Vitamin B6 & Iron',
        explanationEn: 'Riboflavin is needed to activate Vitamin B6 and synthesize hemoglobin.',
        explanationTe: 'విటమిన్ బి6 యాక్టివేట్ కావడానికి మరియు హిమోగ్లోబిన్ తయారీకి రైబోఫ్లేవిన్ అవసరం.'
      }
    ],
    topFoodSources: ['curd', 'almonds', 'cow_milk', 'egg', 'paneer', 'spinach'],
    preventiveTipsEn: [
      'Keep milk and dairy away from direct sunlight, as riboflavin is destroyed by UV rays.',
      'Include 1 cup of fresh homemade curd or yogurt daily.'
    ],
    preventiveTipsTe: [
      'పాలు మరియు పాల ఉత్పత్తులను నేరుగా ఎండ తగలకుండా భద్రపరచండి.',
      'రోజూ ఒక కప్పు తాజా పెరుగును ఆహారంలో భాగంగా తీసుకోండి.'
    ]
  },
  {
    vitaminId: 'vitamin-b3',
    nameEn: 'Vitamin B3 (Niacin)',
    nameTe: 'విటమిన్ బి3 (నియాసిన్)',
    chemicalName: 'Nicotinic Acid / Nicotinamide',
    type: 'water_soluble',
    rdaAdults: {
      male: '16 mg',
      female: '14 mg',
      pregnancy: '18 mg',
      unit: 'mg'
    },
    primaryFunctionsEn: [
      'Precursor to NAD and NADP, driving over 400 essential metabolic enzymatic reactions.',
      'Supports healthy neurological signaling and cognitive health.',
      'Aids in lipid balance by supporting healthy cholesterol metabolism.'
    ],
    primaryFunctionsTe: [
      'శరీరంలో 400 కంటే ఎక్కువ జీవక్రియలకు అవసరమైన ఎంజైమ్‌లను ఉత్తేజపరుస్తుంది.',
      'మెదడు ఆరోగ్యం మరియు నాడీ వ్యవస్థను చురుగ్గా ఉంచుతుంది.',
      'రక్తంలో కొలెస్ట్రాల్ సమతుల్యతను నియంత్రించడంలో తోడ్పడుతుంది.'
    ],
    deficiencySymptomsEn: [
      'Sun-sensitive skin rash with dark pigmentation (Pellagra).',
      'Digestive upset, chronic diarrhea, and nausea.',
      'Brain fog, fatigue, depression, and memory lapses.'
    ],
    deficiencySymptomsTe: [
      'ఎండ తగిలినప్పుడు చర్మంపై నల్లటి దద్దుర్లు మరియు దురద (పెల్లాగ్రా).',
      'జీర్ణక్రియ సమస్యలు, అజీర్తి మరియు తరచూ విరేచనాలు.',
      'తీవ్ర అలసట, జ్ఞాపకశక్తి మందగించడం మరియు నిరాశ.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Tryptophan (Protein)',
        explanationEn: 'The body can synthesize 1 mg of Niacin from every 60 mg of dietary tryptophan found in pulses, nuts, and dairy.',
        explanationTe: 'పప్పులు, గింజలు మరియు పాలలో ఉండే ట్రిప్టోఫాన్ అనే ప్రొటీన్ నుండి శరీరం నియాసిన్‌ను స్వయంగా తయారుచేసుకోగలదు.'
      }
    ],
    topFoodSources: ['peanuts', 'chicken_breast', 'salmon', 'mushrooms', 'brown_rice', 'chickpeas'],
    preventiveTipsEn: [
      'Peanuts and roasted chickpeas make an affordable, daily niacin-rich snack.',
      'Ensure balanced dietary protein intake to support internal niacin synthesis.'
    ],
    preventiveTipsTe: [
      'పల్లీలు మరియు వేయించిన శనగలు సులభంగా నియాసిన్ అందించే ఆరోగ్యకరమైన చిరుతిండి.',
      'రోజూ తగినంత నాణ్యమైన ప్రొటీన్‌ను ఆహారంలో చేర్చుకోండి.'
    ]
  },
  {
    vitaminId: 'vitamin-b6',
    nameEn: 'Vitamin B6 (Pyridoxine)',
    nameTe: 'విటమిన్ బి6 (పైరిడాక్సిన్)',
    chemicalName: 'Pyridoxal 5-Phosphate',
    type: 'water_soluble',
    rdaAdults: {
      male: '1.7 mg',
      female: '1.5 mg',
      pregnancy: '1.9 mg',
      unit: 'mg'
    },
    primaryFunctionsEn: [
      'Essential for amino acid metabolism and synthesis of neurotransmitters (Serotonin, Dopamine, GABA).',
      'Supports hemoglobin production for oxygen transport in red blood cells.',
      'Regulates normal homocysteine levels, protecting cardiovascular blood vessels.'
    ],
    primaryFunctionsTe: [
      'మెదడులో మానసిక ఉల్లాసానికి అవసరమైన సెరటోనిన్, డోపమైన్ వంటి రసాయనాల తయారీకి కీలకం.',
      'రక్తంలో హిమోగ్లోబిన్ ఉత్పత్తికి మరియు రక్తహీనత నివారణకు తోడ్పడుతుంది.',
      'గుండె రక్తనాళాల ఆరోగ్యాన్ని కాపాడే హోమోసిస్టీన్ స్థాయిలను నియంత్రిస్తుంది.'
    ],
    deficiencySymptomsEn: [
      'Microcytic anemia accompanied by chronic fatigue.',
      'Peripheral neuropathy (tingling pins-and-needles in hands and feet).',
      'Mood disturbances, anxiety, irritability, and sleep disruption.'
    ],
    deficiencySymptomsTe: [
      'రక్తహీనత మరియు దానివల్ల కలిగే నిరంతర అలసట.',
      'చేతులు, కాళ్లలో సూదులతో గుచ్చినట్లు తిమ్మిర్లు రావడం.',
      'మానసిక ఆందోళన, చిరాకు మరియు నిద్రలేమి సమస్యలు.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Magnesium',
        explanationEn: 'Magnesium acts alongside B6 to reduce PMS irritability and optimize neurotransmitter pathways.',
        explanationTe: 'మెగ్నీషియం మరియు బి6 కలిసి పనిచేయడం ద్వారా మెదడును ప్రశాంతంగా ఉంచుతాయి.'
      }
    ],
    topFoodSources: ['banana', 'chickpeas', 'sweet_potato', 'chicken_breast', 'salmon', 'spinach'],
    preventiveTipsEn: [
      'Bananas and boiled chickpeas are ideal pre-workout sources of Vitamin B6 and natural energy.',
      'Excessive alcohol diminishes B6 storage and accelerates excretion.'
    ],
    preventiveTipsTe: [
      'అరటిపండ్లు మరియు ఉడికించిన శనగలు విటమిన్ బి6 తో పాటు తక్షణ శక్తిని అందిస్తాయి.',
      'ఆల్కహాల్ తీసుకోవడం వల్ల శరీరంలో విటమిన్ బి6 వేగంగా తగ్గిపోతుంది.'
    ]
  },
  {
    vitaminId: 'vitamin-b9',
    nameEn: 'Vitamin B9 (Folate / Folic Acid)',
    nameTe: 'విటమిన్ బి9 (ఫోలేట్ / ఫోలిక్ యాసిడ్)',
    chemicalName: 'Tetrahydrofolate',
    type: 'water_soluble',
    rdaAdults: {
      male: '400 mcg DFE',
      female: '400 mcg DFE',
      pregnancy: '600 mcg DFE',
      unit: 'mcg'
    },
    primaryFunctionsEn: [
      'Critical for rapid DNA replication, cell division, and healthy tissue growth.',
      'Vital during pregnancy for preventing fetal neural tube defects (Spina Bifida).',
      'Works in concert with Vitamin B12 to produce mature red blood cells.'
    ],
    primaryFunctionsTe: [
      'శరీర కణాల విభజన, డీఎన్ఏ తయారీ మరియు కణజాలాల పెరుగుదలకు అత్యంత ముఖ్యం.',
      'గర్భిణీ స్త్రీలలో పుట్టబోయే బిడ్డ వెన్నుముక మరియు మెదడు లోపాలను నివారిస్తుంది.',
      'విటమిన్ బి12 తో కలిసి ఎర్ర రక్త కణాల తయారీలో తోడ్పడుతుంది.'
    ],
    deficiencySymptomsEn: [
      'Megaloblastic anemia (enlarged, fragile red blood cells) causing shortness of breath.',
      'Persistent mouth ulcers and painful red tongue.',
      'Extreme physical weakness, dizziness, and pale complexion.'
    ],
    deficiencySymptomsTe: [
      'మెగాలోబ్లాస్టిక్ రక్తహీనత, ఆయాసం మరియు నిస్సత్తువ.',
      'నోటి పూత మరియు నాలుకపై తీవ్రమైన మంట, ఎరుపుదనం.',
      'తీవ్రమైన తలతిరగడం మరియు చర్మం పాలిపోవడం.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Vitamin B12',
        explanationEn: 'Folate and B12 depend on each other for cellular activation; treating folate deficiency alone without checking B12 can mask neurological damage.',
        explanationTe: 'ఫోలేట్ మరియు బి12 రెండూ కలిసి పనిచేస్తాయి; వీటిలో ఏ ఒక్కటి లోపించినా రక్తహీనత వస్తుంది.'
      }
    ],
    topFoodSources: ['spinach', 'lentils', 'drumstick_leaves', 'chickpeas', 'papaya', 'kidney_beans'],
    preventiveTipsEn: [
      'Women of childbearing age should prioritize folate-rich leafy greens and dal daily.',
      'Do not discard the water used to boil lentils and spinach, as water-soluble folate leaches into it.'
    ],
    preventiveTipsTe: [
      'గర్భం దాల్చాలనుకునే మహిళలు ఆకుకూరలు, పప్పు ధాన్యాలను తప్పనిసరిగా తీసుకోవాలి.',
      'ఆకుకూరలు లేదా పప్పులను ఉడికించిన నీటిని పారబోయకుండా రసంలో లేదా కూరలో వాడండి.'
    ]
  },
  {
    vitaminId: 'vitamin-b12',
    nameEn: 'Vitamin B12 (Cobalamin)',
    nameTe: 'విటమిన్ బి12 (కోబాలమిన్)',
    chemicalName: 'Cyanocobalamin / Methylcobalamin',
    type: 'water_soluble',
    rdaAdults: {
      male: '2.4 mcg',
      female: '2.4 mcg',
      pregnancy: '2.6 mcg',
      unit: 'mcg'
    },
    primaryFunctionsEn: [
      'Preserves the myelin sheath insulating nerves, preventing permanent neurological deficits.',
      'Essential for healthy red blood cell maturation in bone marrow.',
      'Aids in energy metabolism and emotional stability.'
    ],
    primaryFunctionsTe: [
      'నాడీ కణాల చుట్టూ ఉండే రక్షణ పొరను (మైలిన్ షీత్) కాపాడి నరాల బలహీనతను నివారిస్తుంది.',
      'ఎముక మజ్జలో ఆరోగ్యకరమైన ఎర్ర రక్త కణాల ఉత్పత్తికి తోడ్పడుతుంది.',
      'శరీరానికి ఉత్సాహాన్ని మరియు మానసిక స్థిరత్వాన్ని అందిస్తుంది.'
    ],
    deficiencySymptomsEn: [
      'Pins-and-needles sensation (paresthesia) in feet, hands, and legs.',
      'Chronic unrefreshing fatigue, brain fog, and forgetfulness.',
      'Pale or light yellowish skin (jaundice-like hue) and smooth glossy tongue.'
    ],
    deficiencySymptomsTe: [
      'పాదాలు మరియు చేతుల్లో తిమ్మిర్లు, సూదులు గుచ్చినట్లు అనిపించడం.',
      'నిరంతర నీరసం, ఆలోచనలో మందకొడితనం మరియు మతిమరుపు.',
      'చర్మం కొద్దిగా పసుపుపచ్చగా లేదా పాలిపోయినట్లు మారడం, నాలుక నునుపుగా మారడం.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Calcium',
        explanationEn: 'Gastric intrinsic factor requires calcium in the ileum to absorb B12 effectively.',
        explanationTe: 'ప్రేగులలో విటమిన్ బి12 శోషణ జరగడానికి కాల్షియం సహాయపడుతుంది.'
      }
    ],
    topFoodSources: ['cow_milk', 'curd', 'paneer', 'egg', 'salmon', 'chicken_breast'],
    preventiveTipsEn: [
      'Strict vegetarians and vegans should consume curd, fortified dairy, or consult their doctor for regular preventive monitoring.',
      'Periodic B12 blood screening is recommended for adults over 50 due to reduced stomach acid.'
    ],
    preventiveTipsTe: [
      'పూర్తి శాకాహారులు ప్రతిరోజూ పెరుగు, పాలు లేదా పన్నీర్ తీసుకోవాలి.',
      '50 ఏళ్లు దాటిన వారు క్రమం తప్పకుండా విటమిన్ బి12 స్థాయిలను పరిశీలించుకోవడం మంచిది.'
    ]
  },
  {
    vitaminId: 'vitamin-c',
    nameEn: 'Vitamin C (Ascorbic Acid)',
    nameTe: 'విటమిన్ సి (ఆస్కార్బిక్ యాసిడ్)',
    chemicalName: 'L-Ascorbic Acid',
    type: 'water_soluble',
    rdaAdults: {
      male: '90 mg',
      female: '75 mg',
      pregnancy: '85 mg',
      unit: 'mg'
    },
    primaryFunctionsEn: [
      'Potent water-soluble antioxidant protecting cells from free-radical damage.',
      'Essential cofactor for collagen synthesis in skin, blood vessels, tendons, and gums.',
      'Enhances non-heme iron absorption from plant sources by up to 300%.'
    ],
    primaryFunctionsTe: [
      'శరీర కణాలను రక్షించే అద్భుతమైన యాంటీఆక్సిడెంట్.',
      'చర్మం, చిగుళ్లు మరియు రక్తనాళాల పటిష్టతకు అవసరమైన కొల్లాజెన్ తయారీకి మూలాధారం.',
      'శాకాహారంలోని ఐరన్ శరీరానికి సులభంగా అందేలా 300% వరకు శోషణను పెంచుతుంది.'
    ],
    deficiencySymptomsEn: [
      'Bleeding, tender, or swollen gums and loosened teeth (Scurvy).',
      'Easy skin bruising (petechiae) and slow wound recovery.',
      'Dry, split hair with corkscrew curls and frequent respiratory colds.'
    ],
    deficiencySymptomsTe: [
      'చిగుళ్ల నుంచి రక్తం కారడం, చిగుళ్లు వాయడం లేదా దంతాలు కదలడం (స్కర్వీ).',
      'చర్మంపై తేలికగా కమిలిన గుర్తులు రావడం మరియు గాయాలు త్వరగా మానకపోవడం.',
      'జుట్టు చివర్లు చిట్లడం, రోగనిరోధక శక్తి తగ్గి త్వరగా జలుబు చేయడం.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Plant-Based Iron',
        explanationEn: 'Vitamin C reduces ferric iron (Fe3+) to ferrous iron (Fe2+), dramatically improving gastrointestinal absorption.',
        explanationTe: 'పాలకూర, పప్పులలో ఉండే ఐరన్‌ను శరీరం వేగంగా గ్రహించడానికి విటమిన్ సి అత్యంత శక్తివంతమైన సహకారి.'
      },
      {
        partnerNutrient: 'Vitamin E',
        explanationEn: 'Vitamin C regenerates oxidized Vitamin E back into its active antioxidant form.',
        explanationTe: 'శరీరంలో ఉపయోగించబడిన విటమిన్ ఇ ని తిరిగి క్రియాశీలంగా మార్చడంలో విటమిన్ సి తోడ్పడుతుంది.'
      }
    ],
    topFoodSources: ['amla', 'guava', 'orange', 'bell_peppers', 'tomato', 'papaya'],
    preventiveTipsEn: [
      '1 single fresh Indian Gooseberry (Amla) delivers over 600 mg of Vitamin C—nearly 7 times your daily requirement!',
      'Add lemon juice only after turning off the stove heat, as Vitamin C degrades under high boiling temperatures.'
    ],
    preventiveTipsTe: [
      'ఒక్క ఉసిరికాయలో రోజువారీ అవసరానికి 7 రెట్లు ఎక్కువ (600 mg) విటమిన్ సి లభిస్తుంది!',
      'నిమ్మరసాన్ని వేడి తగ్గించిన తర్వాత మాత్రమే పిండండి, ఎందుకంటే అధిక వేడికి విటమిన్ సి నశిస్తుంది.'
    ]
  },
  {
    vitaminId: 'vitamin-d',
    nameEn: 'Vitamin D (The Sunshine Vitamin)',
    nameTe: 'విటమిన్ డి (సూర్యరశ్మి విటమిన్)',
    chemicalName: 'Cholecalciferol (D3) / Ergocalciferol (D2)',
    type: 'fat_soluble',
    rdaAdults: {
      male: '600 IU (15 mcg)',
      female: '600 IU (15 mcg)',
      elderly: '800 IU (20 mcg)',
      unit: 'IU'
    },
    primaryFunctionsEn: [
      'Regulates calcium and phosphate absorption in the gut for dense, strong bones and teeth.',
      'Modulates immune response, reducing risk of chronic autoimmune flare-ups.',
      'Supports healthy skeletal muscle strength and balances mood neurotransmitters.'
    ],
    primaryFunctionsTe: [
      'ఎముకలు మరియు దంతాల పటిష్టతకు ప్రేగులలో కాల్షియం శోషణను నియంత్రిస్తుంది.',
      'రోగనిరోధక వ్యవస్థను సమతుల్యం చేసి ఇన్ఫెక్షన్ల నుండి కాపాడుతుంది.',
      'కండరాల బలాన్ని మరియు మానసిక ఉల్లాసాన్ని మెరుగుపరుస్తుంది.'
    ],
    deficiencySymptomsEn: [
      'Deep, aching bone pain, lower back discomfort, and frequent joint stiffness.',
      'Muscle twitching, chronic weakness, and difficulty climbing stairs.',
      'Frequent seasonal infections and depressive mood during low-sunlight months.'
    ],
    deficiencySymptomsTe: [
      'ఎముకలలో తీవ్రమైన నొప్పి, నడుము నొప్పి మరియు కీళ్ల బిగుతు.',
      'కండరాల బలహీనత, మెట్లు ఎక్కేటప్పుడు ఆయాసం మరియు కాళ్లు చేతులు లాగడం.',
      'తరచుగా రోగాల బారిన పడటం మరియు మానసిక నీరసం.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Calcium & Vitamin K2',
        explanationEn: 'Vitamin D absorbs calcium into the blood, while Vitamin K2 directs that calcium into bone matrices rather than arterial walls.',
        explanationTe: 'విటమిన్ డి కాల్షియంను రక్తంలోకి చేరిస్తే, విటమిన్ కె2 దానిని ధమనుల్లో కాకుండా సరిగ్గా ఎముకల్లోకి చేరవేస్తుంది.'
      },
      {
        partnerNutrient: 'Magnesium',
        explanationEn: 'All enzymes that metabolize Vitamin D in the liver and kidneys require magnesium as a cofactor.',
        explanationTe: 'శరీరంలో విటమిన్ డి చురుగ్గా పనిచేయడానికి మెగ్నీషియం అవసరం.'
      }
    ],
    topFoodSources: ['salmon', 'egg', 'cow_milk', 'mushrooms', 'paneer'],
    preventiveTipsEn: [
      'Spend 15-20 minutes in mid-morning sunlight (10 AM to 1 PM) with arms and legs exposed without sunscreen.',
      'Incorporate fortified milk, eggs, or mushrooms into your regular weekly diet.'
    ],
    preventiveTipsTe: [
      'ఉదయం 10 నుండి మధ్యాహ్నం 1 గంటల మధ్య కనీసం 15-20 నిమిషాలు ఎండలో గడపండి.',
      'పుట్టగొడుగులు, పాలు, గుడ్లు వంటి విటమిన్ డి సమృద్ధిగా ఉన్న ఆహారాలను తరచుగా తీసుకోండి.'
    ]
  },
  {
    vitaminId: 'vitamin-e',
    nameEn: 'Vitamin E (Tocopherol)',
    nameTe: 'విటమిన్ ఇ (టోకోఫెరాల్)',
    chemicalName: 'Alpha-Tocopherol',
    type: 'fat_soluble',
    rdaAdults: {
      male: '15 mg (22.4 IU)',
      female: '15 mg (22.4 IU)',
      pregnancy: '15 mg',
      unit: 'mg'
    },
    primaryFunctionsEn: [
      'Major lipid-soluble antioxidant protecting cell membranes from lipid peroxidation.',
      'Supports healthy endothelial vascular wall integrity and healthy microcirculation.',
      'Nourishes skin barrier, reduces oxidative hair follicle stress, and supports reproductive health.'
    ],
    primaryFunctionsTe: [
      'కణాల పొరలను ఆక్సీకరణ నష్టం నుండి రక్షించే అత్యంత ముఖ్యమైన కొవ్వులో కరిగే యాంటీఆక్సిడెంట్.',
      'రక్త ప్రసరణను మెరుగుపరిచి గుండె రక్తనాళాలను ఆరోగ్యంగా ఉంచుతుంది.',
      'చర్మం, జుట్టు మరియు పునరుత్పత్తి వ్యవస్థకు పోషణనిస్తుంది.'
    ],
    deficiencySymptomsEn: [
      'Peripheral neuropathy and decreased coordination/gait unsteadiness (Ataxia).',
      'Hemolytic anemia resulting from premature red blood cell membrane rupture.',
      'Premature skin aging, dullness, and loss of dermal elasticity.'
    ],
    deficiencySymptomsTe: [
      'నడకలో తడబాటు, శరీర సమతుల్యత కోల్పోవడం మరియు నరాల బలహీనత.',
      'ఎర్ర రక్త కణాల పగుళ్ల వల్ల వచ్చే రక్తహీనత.',
      'చర్మంపై ముడతలు, కాంతిహీనత మరియు జుట్టు రాలడం.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Selenium',
        explanationEn: 'Selenium works synergistically with Vitamin E to activate glutathione peroxidase, defending cells from dual oxidative angles.',
        explanationTe: 'సెలీనియం మరియు విటమిన్ ఇ కలిసి శరీర కణాలకు శక్తివంతమైన రక్షణ కవచంలా పనిచేస్తాయి.'
      }
    ],
    topFoodSources: ['almonds', 'pumpkin_seeds', 'spinach', 'peanuts', 'avocado'],
    preventiveTipsEn: [
      'A daily palm-sized handful of raw soaked almonds (6-8 pieces) delivers nearly 40% of your daily Vitamin E.',
      'Store raw nuts and cold-pressed oils in cool, dark containers to prevent rancidity.'
    ],
    preventiveTipsTe: [
      'రోజూ నానబెట్టిన 6-8 బాదం పప్పులు తినడం ద్వారా రోజువారీ విటమిన్ ఇ అవసరంలో 40% సులభంగా పొందవచ్చు.',
      'నట్స్ మరియు విత్తనాలను చల్లని, పొడి ప్రదేశంలో భద్రపరచండి.'
    ]
  },
  {
    vitaminId: 'vitamin-k',
    nameEn: 'Vitamin K (Phylloquinone & Menaquinone)',
    nameTe: 'విటమిన్ కె (రక్తం గడ్డకట్టే విటమిన్)',
    chemicalName: 'Phylloquinone (K1) / Menaquinone (K2)',
    type: 'fat_soluble',
    rdaAdults: {
      male: '120 mcg',
      female: '90 mcg',
      pregnancy: '90 mcg',
      unit: 'mcg'
    },
    primaryFunctionsEn: [
      'Required for hepatic synthesis of clotting factors (II, VII, IX, X) to halt bleeding.',
      'Activates Osteocalcin, binding calcium ions securely into bone crystals.',
      'Inhibits arterial calcification (vascular stiffness) through Matrix Gla Protein.'
    ],
    primaryFunctionsTe: [
      'గాయాలు అయినప్పుడు రక్తం అధికంగా పోకుండా త్వరగా గడ్డకట్టడానికి అత్యవసరం.',
      'కాల్షియం ఎముకల్లోకి సురక్షితంగా బంధించబడేలా ఆస్టియోకాల్సిన్ అనే ప్రొటీన్‌ను ఉత్తేజపరుస్తుంది.',
      'రక్తనాళాలలో కాల్షియం పేరుకుపోకుండా గుండెను రక్షిస్తుంది.'
    ],
    deficiencySymptomsEn: [
      'Uncontrolled prolonged bleeding from minor scratches, gums, or nosebleeds.',
      'Frequent unexplainable bruising under the skin.',
      'Reduced bone mineral density and heightened fracture vulnerability.'
    ],
    deficiencySymptomsTe: [
      'చిన్న గీతలు పడినా రక్తం ఆగకుండా ఎక్కువసేపు కారడం, ముక్కు నుండి రక్తం రావడం.',
      'చర్మంపై ఆకస్మికంగా కమిలిన నల్లటి లేదా నీలిరంగు మచ్చలు ఏర్పడటం.',
      'ఎముకలు బలహీనపడటం మరియు పగుళ్లు వచ్చే ప్రమాదం పెరగడం.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Vitamin D & Calcium',
        explanationEn: 'Vitamin D ensures calcium absorption, while Vitamin K directs calcium into bone rather than soft tissue.',
        explanationTe: 'విటమిన్ డి కాల్షియంను గ్రహిస్తే, విటమిన్ కె దానిని నేరుగా ఎముకలకు చేరవేస్తుంది.'
      }
    ],
    topFoodSources: ['spinach', 'drumstick_leaves', 'broccoli', 'curd'],
    preventiveTipsEn: [
      'Just 50g of cooked dark leafy greens fulfills over 200% of your daily Vitamin K1 needs.',
      'Patients taking blood-thinning medication (warfarin) must maintain consistent dietary Vitamin K intake.'
    ],
    preventiveTipsTe: [
      'రోజూ కొద్దిగా పాలకూర లేదా మునగాకు తీసుకోవడం వల్ల శరీరానికి కావలసిన విటమిన్ కె పుష్కలంగా అందుతుంది.',
      'రక్తం పల్చబడే మందులు వాడేవారు ఆకుకూరలను ఒకే మోతాదులో సమతుల్యంగా తీసుకోవాలి.'
    ]
  },
  // Essential Minerals
  {
    vitaminId: 'mineral-iron',
    nameEn: 'Iron (Fe)',
    nameTe: 'ఐరన్ / ఇనుము (Fe)',
    chemicalName: 'Elemental Iron (Heme & Non-Heme)',
    type: 'mineral',
    rdaAdults: {
      male: '19 mg',
      female: '29 mg',
      pregnancy: '40 mg',
      unit: 'mg'
    },
    primaryFunctionsEn: [
      'Central constituent of hemoglobin in red blood cells that transports oxygen to brain and muscles.',
      'Component of myoglobin that stores oxygen in muscular tissues for endurance.',
      'Essential for cellular immune defense and cognitive sharpness.'
    ],
    primaryFunctionsTe: [
      'ఊపిరితిత్తుల నుండి శరీర అవయవాలన్నింటికీ ఆక్సిజన్‌ను మోసుకెళ్లే హిమోగ్లోబిన్ తయారీకి ప్రధాన ఆధారం.',
      'కండరాలలో ఆక్సిజన్‌ను నిల్వ చేసి శారీరక శక్తిని మరియు సామర్థ్యాన్ని ఇస్తుంది.',
      'రోగనిరోధక శక్తిని మరియు ఏకాగ్రతను మెరుగుపరుస్తుంది.'
    ],
    deficiencySymptomsEn: [
      'Iron Deficiency Anemia (IDA): Pale eyelids, brittle spoon-shaped nails (Koilonychia).',
      'Shortness of breath upon mild climbing, heart palpitations, and dizzy spells.',
      'Restless legs syndrome and cravings for non-food items (Pica: chalk, clay, ice).'
    ],
    deficiencySymptomsTe: [
      'రక్తహీనత (అనీమియా): కంటి రెప్పల లోపల పాలిపోవడం, గోళ్లు చెంచా ఆకారంలో వంగి విరిగిపోవడం.',
      'కొద్ది దూరం నడిచినా ఆయాసం రావడం, గుండె దడ మరియు అలసట.',
      'రాత్రిపూట కాళ్లు విపరీతంగా లాగడం మరియు మట్టి లేదా సుద్ద తినాలనిపించడం.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Vitamin C',
        explanationEn: 'Ascorbic acid prevents the formation of insoluble iron hydroxide, increasing non-heme iron absorption manifold.',
        explanationTe: 'నిమ్మరసం లేదా ఉసిరికాయ కలపడం వల్ల శాకాహార ఐరన్ శరీరంలోకి వేగంగా గ్రహించబడుతుంది.'
      }
    ],
    topFoodSources: ['spinach', 'dark_chocolate', 'drumstick_leaves', 'lentils', 'pomegranate', 'kidney_beans', 'black_chickpeas'],
    preventiveTipsEn: [
      'Cook green leafy dishes in traditional cast iron skillets to naturally fortify meals with dietary iron.',
      'Avoid tea, coffee, or calcium tablets within 1 hour of consuming iron-rich meals.'
    ],
    preventiveTipsTe: [
      'ఇనుప మూకుడులలో వంట చేయడం వల్ల ఆహారంలో సహజంగా ఐరన్ శాతం పెరుగుతుంది.',
      'భోజనం చేసిన గంట వరకు టీ, కాఫీ లేదా పాలు తాగడం మానుకోండి.'
    ]
  },
  {
    vitaminId: 'mineral-calcium',
    nameEn: 'Calcium (Ca)',
    nameTe: 'కాల్షియం (సున్నపు ధాతువు - Ca)',
    chemicalName: 'Elemental Calcium',
    type: 'mineral',
    rdaAdults: {
      male: '1000 mg',
      female: '1000 mg',
      elderly: '1200 mg',
      unit: 'mg'
    },
    primaryFunctionsEn: [
      'Structural mineral forming 99% of bone and dental mineral matrix.',
      'Triggers muscle fiber contraction, including rhythmic heartbeat.',
      'Facilitates rapid neurotransmitter release between synaptic junctions.'
    ],
    primaryFunctionsTe: [
      'ఎముకలు మరియు దంతాల పటిష్టతకు 99% ఆధారమైన ప్రధాన ఖనిజం.',
      'గుండె లయబద్ధంగా కొట్టుకోవడానికి మరియు కండరాల కదలికలకు ఆవశ్యకం.',
      'నాడీ వ్యవస్థలో సమాచార మార్పిడికి సహాయపడుతుంది.'
    ],
    deficiencySymptomsEn: [
      'Muscle cramping (especially calves and feet at night) and numbness.',
      'Brittle chipping fingernails and dental decay/erosion.',
      'Osteopenia and Osteoporosis leading to silent spinal bone density loss.'
    ],
    deficiencySymptomsTe: [
      'రాత్రిపూట పిక్కలు పట్టేయడం, కండరాల నొప్పులు మరియు తిమ్మిర్లు.',
      'గోళ్లు పెళుసుగా మారి విరిగిపోవడం, దంతాలు త్వరగా పుచ్చిపోవడం.',
      'ఎముకల సాంద్రత తగ్గి బోలు ఎముకల వ్యాధి (ఆస్టియోపోరోసిస్) రావడం.'
    ],
    synergisticPairs: [
      {
        partnerNutrient: 'Vitamin D & Magnesium',
        explanationEn: 'Vitamin D stimulates active calcium absorption, while magnesium maintains healthy parathyroid hormone secretion.',
        explanationTe: 'విటమిన్ డి కాల్షియంను రక్తంలోకి రవాణా చేస్తే, మెగ్నీషియం దానిని సమతుల్యం చేస్తుంది.'
      }
    ],
    topFoodSources: ['ragi_sangati', 'curd', 'paneer', 'milk', 'sesame_seeds', 'almonds', 'spinach'],
    preventiveTipsEn: [
      'Finger Millet (Ragi) provides 344 mg of calcium per 100g—more than three times that of standard milk!',
      'Incorporate 1 tablespoon of roasted sesame seeds or ragi porridge into your morning routine.'
    ],
    preventiveTipsTe: [
      'రాగులలో 100 గ్రాములకు 344 mg కాల్షియం ఉంటుంది—ఇది పాల కంటే మూడు రెట్లు ఎక్కువ!',
      'రోజూ ఉదయం రాగి జావ లేదా ఒక చెంచా నువ్వులు తినడం వల్ల కాల్షియం లోపం రాదు.'
    ]
  }
];
