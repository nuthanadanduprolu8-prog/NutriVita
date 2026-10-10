/**
 * NutriVita Nutrition Awareness Education Hub
 * Curated evidence-based educational datasets:
 * - Articles
 * - Indian Superfoods
 * - Seasonal Nutrition Handbooks
 * - Myth vs Fact
 * - Healthy Habits
 * - Community Actions & Activity Planning
 */

// ========================================================
// 1. NUTRITION EDUCATION ARTICLES (10 Comprehensive Articles)
// ========================================================
export const awarenessArticles = [
  {
    id: 'balanced-diet-basics',
    title: 'Balanced Diet Basics: The 50:25:25 Plate Method',
    teluguTitle: 'సమతుల్య ఆహార ప్రాథమిక సూత్రాలు: 50:25:25 పద్ధతి',
    category: 'Fundamentals',
    readTime: '4 min read',
    shortDescription: 'Discover how dividing your plate into wholesome vegetables, unpolished grains, and clean proteins creates effortless, lifelong metabolic health.',
    teluguDescription: 'మీ భోజన ప్లేట్‌ను కూరగాయలు, తృణధాన్యాలు మరియు ప్రోటీన్‌గా విభజించడం ద్వారా దీర్ఘకాలిక ఆరోగ్యాన్ని ఎలా కాపాడుకోవాలో తెలుసుకోండి.',
    content: `A truly balanced meal is not about restrictive calorie counting, but about proportional nutrient diversity. The Indian Council of Medical Research (ICMR) and global dietary guidelines endorse the visual plate model: 

1. Half Your Plate (50%): Colorful seasonal vegetables, greens, and fruits. These provide cellular hydration, antioxidant bioflavonoids, potassium, and soluble prebiotic fiber that feeds your gut microbiome without causing blood sugar spikes.
2. One Quarter of Your Plate (25%): Unrefined complex carbohydrates like whole millets (Ragi, Jowar, Bajra), brown rice, or whole wheat atta. Unlike white polished flour, whole grains release glucose steadily, avoiding energy crashes.
3. One Quarter of Your Plate (25%): Quality protein sources such as lentils, chickpeas, paneer, sprouts, curd, eggs, or lean meats. Protein triggers satiety hormones and provides essential amino acids needed for continuous muscle and tissue repair.

Adding a small teaspoon of healthy unrefined fats (cold-pressed mustard, groundnut, or sesame oil, or moderate ghee) completes the plate by enabling fat-soluble vitamins (A, D, E, and K) to be properly absorbed into the bloodstream.`,
    teluguContent: `సమతుల్య భోజనం అంటే తక్కువ తినడం కాదు; సరైన నిష్పత్తిలో పోషకాలను ఎంచుకోవడం:

1. సగం ప్లేట్ (50%): రంగురంగుల కూరగాయలు, తాజా ఆకుకూరలు మరియు పండ్లు. ఇవి రక్తంలో చక్కెరను నియంత్రించే పీచు పదార్థం, విటమిన్లు మరియు యాంటీఆక్సిడెంట్లను అందిస్తాయి.
2. పావు భాగం (25%): ముడి ధాన్యాలు లేదా చిరుధాన్యాలు (రాగులు, జొన్నలు, సజ్జలు, దంపుడు బియ్యం). ఇవి రోజంతా సరిపడా శక్తిని స్థిరంగా విడుదల చేస్తాయి.
3. మరో పావు భాగం (25%): ప్రొటీన్ మూలాలు (కందిపప్పు, శనగలు, మొలకలు, పెరుగు, గుడ్లు). ఇవి కండరాల నిర్మాణానికి, ఆకలి నియంత్రణకు అవసరం.

ఈ సమతుల్య పద్ధతి ద్వారా అధిక బరువు, మధుమేహం మరియు విటమిన్ లోపాలను సులభంగా నివారించవచ్చు.`,
    keyTakeaways: [
      'Fill half your plate with colorful vegetables and raw salad.',
      'One quarter should consist of complex whole grains or regional millets.',
      'One quarter must provide quality protein for tissue maintenance.',
      'Healthy fats in moderation are essential for absorbing vitamins A, D, E, and K.'
    ],
    teluguKeyTakeaways: [
      'ప్లేట్‌లో సగం భాగం కూరగాయలు మరియు పండ్లతో నింపండి.',
      'పావు భాగం ముడి ధాన్యాలు లేదా చిరుధాన్యాలకు కేటాయించండి.',
      'పావు భాగం తప్పనిసరిగా ప్రోటీన్ (పప్పులు/గుడ్లు) కలిగి ఉండాలి.',
      'విటమిన్లు ఒంటపట్టడానికి స్వచ్ఛమైన నూనెలు లేదా నెయ్యి మితంగా వాడాలి.'
    ],
    practicalTips: [
      'Start each lunch and dinner with a bowl of cucumber, carrot, or fresh tomato slices.',
      'Swap polished white rice for a 50:50 mix of brown rice and foxtail millet twice a week.',
      'Always pair vegetarian meals with lemon juice to maximize iron bio-availability.'
    ],
    teluguPracticalTips: [
      'భోజనానికి ముందు దోసకాయ, క్యారెట్ లేదా టమోటా ముక్కలను తినడం అలవాటు చేసుకోండి.',
      'వారంలో రెండుసార్లు తెల్ల బియ్యానికి బదులుగా రాగులు లేదా జొన్నలను వాడండి.',
      'ఆకుకూరలు తిన్నప్పుడు నిమ్మరసం పిండుకుంటే ఐరన్ త్వరగా ఒంటపడుతుంది.'
    ]
  },
  {
    id: 'understanding-deficiencies',
    title: 'Understanding Hidden Hunger: Recognizing Early Vitamin Deficiencies',
    teluguTitle: 'విటమిన్ లోపాలను గుర్తించడం & నివారించడం',
    category: 'Micronutrients',
    readTime: '5 min read',
    shortDescription: 'Hidden hunger affects millions who consume adequate calories but lack essential micronutrients. Learn to recognize early physical clues.',
    teluguDescription: 'కడుపు నిండా తిన్నా శరీరానికి అవసరమైన సూక్ష్మ పోషకాలు అందకపోవడాన్ని హిడెన్ హంగర్ అంటారు. ప్రారంభ సంకేతాలను తెలుసుకోండి.',
    content: `A person may eat enough food to feel full and energetic, yet suffer from "Hidden Hunger"—the clinical term for chronic micronutrient deficiencies. Because vitamins and minerals are needed in microgram and milligram quantities, gaps develop quietly over months before clinical disease emerges:

- Pale inner eyelids, brittle nails, and chronic fatigue often point toward insufficient iron or folate needed for hemoglobin.
- Bleeding gums during toothbrushing, poor wound healing, and rough skin frequently connect to inadequate Vitamin C intake.
- Tingling or "pins-and-needles" sensations in fingers and toes with mental fog may indicate sub-optimal Vitamin B12.
- Frequent respiratory infections and night visual strain suggest low Vitamin A or Zinc reserves.
- Bone tenderness and leg muscle aches are prominent signs of Vitamin D and Calcium depletion.

Recognizing these physical signs provides early educational awareness to adjust dietary diversity before irreversible health damage occurs.`,
    teluguContent: `మనం కడుపునిండా తింటున్నప్పటికీ శరీరానికి అవసరమైన విటమిన్లు, ఖనిజాలు అందకపోవడాన్ని 'హిడెన్ హంగర్' అంటారు:

- తెల్లబారిన కళ్ళు, పెళుసైన గోళ్ళు మరియు తీవ్రమైన అలసట ఐరన్ లోపానికి సంకేతం కావచ్చు.
- బ్రష్ చేసినప్పుడు చిగుళ్ల నుండి రక్తం కారడం విటమిన్ సి లోపాన్ని సూచించవచ్చు.
- కాళ్ళు, చేతులలో తిమ్మిర్లు మరియు నరాల బలహీనత విటమిన్ బి12 లోపం వల్ల రావచ్చు.
- ఎముకల నొప్పులు, కండరాల బలహీనత విటమిన్ డి మరియు కాల్షియం కొరత వల్ల కలుగుతాయి.

ఈ ప్రారంభ సంకేతాలను గమనించి సరైన సమతుల్య ఆహారం తీసుకోవడం ద్వారా లోపాలను ముందుగానే అరికట్టవచ్చు.`,
    keyTakeaways: [
      'Calories alone do not prevent deficiency; micronutrient diversity is critical.',
      'Physical signs like pale conjunctiva and mouth ulcers are early warning indicators.',
      'Mild symptoms can often be corrected by consistent whole-food dietary adjustments.',
      'Severe or persistent symptoms warrant professional medical laboratory evaluation.'
    ],
    teluguKeyTakeaways: [
      'కేవలం కడుపు నిండటం సరిపోదు; సూక్ష్మ పోషకాలు అత్యంత ముఖ్యం.',
      'చిగుళ్ల నుండి రక్తం, అలసట శరీరంలో లోపాలను తెలిపే ముందస్తు సంకేతాలు.',
      'సహజ ఆహారాల ద్వారా ప్రారంభ లోపాలను సులభంగా సరిచేయవచ్చు.',
      'లక్షణాలు తీవ్రంగా ఉంటే వెంటనే వైద్యుడిని సంప్రదించి పరీక్షలు చేయించుకోవాలి.'
    ],
    practicalTips: [
      'Incorporate at least three different natural food colors into your daily diet.',
      'Keep a weekly dietary log to ensure legumes, green vegetables, and dairy/eggs are represented.',
      'Spend 15-20 minutes in morning sunlight with exposed arms to maintain natural Vitamin D.'
    ],
    teluguPracticalTips: [
      'రోజువారీ ఆహారంలో కనీసం మూడు రకాల రంగుల సహజ ఆహారాలను చేర్చండి.',
      'వారంలో కనీసం మూడు రోజులు ఆకుకూరలు మరియు పప్పుధాన్యాలు ఉండేలా చూసుకోండి.',
      'ఉదయపు ఎండలో 15-20 నిమిషాలు గడపడం ద్వారా విటమిన్ డి సహజంగా అందుతుంది.'
    ]
  },
  {
    id: 'importance-of-protein',
    title: 'The Power of Protein: Building Blocks for Energy and Immunity',
    teluguTitle: 'ప్రోటీన్ ప్రాముఖ్యత: శక్తి మరియు రోగనిరోధక శక్తికి మూలం',
    category: 'Macronutrients',
    readTime: '4 min read',
    shortDescription: 'Why Indian diets frequently run low on quality protein and practical ways to hit your daily 0.8g to 1g per kg bodyweight target.',
    teluguDescription: 'భారతీయ భోజనంలో ప్రోటీన్ ఎందుకు తక్కువగా ఉంటుంది? రోజువారీ అవసరాలను ఎలా తీర్చుకోవాలో సరళమైన చిట్కాలు.',
    content: `Studies by the Indian Dietetic Association estimate that up to 70% of urban and rural Indian diets are deficient in protein. Typical meals are dominated by heavy carbohydrates—rice, rotis, potatoes—with only a small spoonful of diluted dal.

Why Protein Matters:
Every antibody that fights viral infections, every hormone regulating metabolism, and every muscle fiber maintaining posture is synthesized from dietary amino acids. Adults generally require 0.8g to 1.0g of protein per kilogram of ideal body weight daily (approx. 50g–65g for average adults).

Achieving Protein on a Plant-Based Diet:
1. Combine Grains and Legumes: Rice and wheat are limited in the amino acid lysine, while lentils are limited in methionine. Combining them (like Idli/Dosa with Sambar, or Khichdi with Curd) creates complete protein.
2. Sprouted Pulses: Sprouting green gram (Moong) increases protein bioavailability and doubles Vitamin C content.
3. Paneer & Soya: 100g of paneer yields ~18g protein, while roasted Bengal gram (Sattu/Chana) provides an inexpensive, portable protein powerhouse.`,
    teluguContent: `భారతీయ ఆహారంలో పిండి పదార్థాలు ఎక్కువై ప్రోటీన్ లోపించడం సర్వసాధారణం. ప్రోటీన్ ఎందుకు ముఖ్యమంటే:

- మన శరీరంలో రోగనిరోధక కణాలు, హార్మోన్లు మరియు కండరాలు అన్నీ ప్రోటీన్ ద్వారానే తయారవుతాయి.
- సాధారణ వ్యక్తికి శరీర బరువులోని ప్రతి కేజీకి 0.8 నుండి 1 గ్రాము ప్రోటీన్ ప్రతిరోజూ అవసరం (దాదాపు 50-60 గ్రాములు).

శాకాహారంలో ప్రోటీన్ పెంచుకునే మార్గాలు:
1. ధాన్యాలు మరియు పప్పులు కలపడం: అన్నం + పప్పు, ఇడ్లీ + సాంబార్ కలయిక సంపూర్ణ ప్రోటీన్‌ను ఇస్తుంది.
2. మొలకెత్తిన పెసలు: మొలకలలో ప్రోటీన్ సులభంగా జీర్ణమవుతుంది.
3. వేయించిన శనగలు, పల్లీలు, పన్నీర్, పెరుగు ప్రతిరోజూ ఆహారంలో ఉండేలా చూసుకోవాలి.`,
    keyTakeaways: [
      'Up to 70% of regular diets lack sufficient protein density.',
      'Aim for 0.8g to 1.0g of protein per kg of body weight daily.',
      'Pairing cereal grains with pulses creates complete amino acid profiles.',
      'Eggs, sprouted moong, sattu, and paneer are superior natural protein sources.'
    ],
    teluguKeyTakeaways: [
      'భారతదేశంలో 70% మంది ఆహారంలో తగినంత ప్రోటీన్ ఉండటం లేదు.',
      'శరీర బరువు ప్రకారం రోజుకు 50-60 గ్రాముల ప్రోటీన్ అవసరం.',
      'పప్పు మరియు ధాన్యం కలిపి తింటే సంపూర్ణ ప్రోటీన్ లభిస్తుంది.',
      'మొలకలు, వేయించిన శనగలు మరియు గుడ్లు చవకైన మేలైన ప్రోటీన్ మూలాలు.'
    ],
    practicalTips: [
      'Add a hard-boiled egg or half a cup of sprouts to your morning breakfast.',
      'Replace afternoon tea biscuits with a fistful of roasted chickpeas (Chana) and peanuts.',
      'Thicken daily sambar and rasam with cooked crushed lentils rather than plain water.'
    ],
    teluguPracticalTips: [
      'ఉదయం అల్పాహారంతో పాటు ఉడకబెట్టిన గుడ్డు లేదా గుప్పెడు మొలకలు తీసుకోండి.',
      'సాయంత్రం బిస్కెట్లకు బదులుగా వేయించిన శనగలు లేదా పల్లీలు తినండి.',
      'పప్పు చారు లేదా సాంబార్‌లో పప్పు మోతాదును ఎక్కువగా ఉండేలా చూసుకోండి.'
    ]
  },
  {
    id: 'iron-rich-foods',
    title: 'Combating Anemia: Essential Iron-Rich Indian Foods & Synergies',
    teluguTitle: 'రక్తహీనత నివారణ: ఐరన్ సమృద్ధిగా ఉండే ఆహారాలు & నిమ్మరసం ప్రభావం',
    category: 'Micronutrients',
    readTime: '5 min read',
    shortDescription: 'Nutritional strategies to tackle iron-deficiency anemia in women, adolescent girls, and children using affordable local superfoods.',
    teluguDescription: 'మహిళలు మరియు పిల్లలలో రక్తహీనతను అరికట్టడానికి ఐరన్ అధికంగా ఉండే స్థానిక ఆహారాలు మరియు శోషణ చిట్కాలు.',
    content: `Iron-deficiency anemia remains one of the most widespread public nutritional challenges in South Asia, particularly impacting young children and pregnant women. Hemoglobin relies directly on iron to transport oxygen to the brain and vital organs.

The Iron Absorption Secret:
Plant-based (non-heme) iron found in spinach, moringa, ragi, and jaggery has an absorption rate of only 2% to 10% on its own. However, when consumed simultaneously with Vitamin C, absorption increases dramatically (up to 300%).

Top Affordable Iron Champions:
- Drumstick Leaves (Moringa): 100g provides 4.0mg iron—far higher than common greens.
- Garden Cress Seeds (Aliv / Halim): Over 100mg iron per 100g; a single teaspoon in lemon water or kheer provides a major boost.
- Jaggery with Roasted Peanuts (Chikki): Natural iron combined with healthy fats and protein.
- Cooking in Cast Iron Cookware: Cooking acidic dishes like tomato curries or dal in cast-iron vessels naturally infuses bioavailable dietary iron.`,
    teluguContent: `రక్తహీనత (ఎనీమియా) వల్ల నీరసం, తలతిరగడం, ఏకాగ్రత లోపించడం వంటి సమస్యలు వస్తాయి. దీనిని నివారించడానికి:

ఐరన్ శోషణ రహస్యం:
మొక్కల నుండి లభించే ఐరన్ శరీరం గ్రహించాలంటే విటమిన్ సి తప్పనిసరి. ఆకుకూరలు తిన్నప్పుడు నిమ్మరసం పిండడం వల్ల ఐరన్ శోషణ 300% పెరుగుతుంది!

అద్భుతమైన ఐరన్ ఆహారాలు:
- మునగాకు: పాలకూర కంటే ఎక్కువ ఐరన్ అందిస్తుంది.
- బెల్లం మరియు వేరుశెనగ పప్పు (చిక్కీ): రోజువారీ రక్తవృద్ధికి మంచి చిరుతిండి.
- రాగులు మరియు మొలకెత్తిన గింజలు.
- ఇనుప బాండీలలో వంట చేయడం: కూరలలోకి సహజంగా ఐరన్ చేరడానికి తోడ్పడుతుంది.`,
    keyTakeaways: [
      'Plant non-heme iron requires Vitamin C to be absorbed efficiently.',
      'Moringa, garden cress seeds, ragi, and jaggery are superior local iron sources.',
      'Avoid drinking tea or coffee within one hour of meals, as tannins block iron uptake.',
      'Traditional cast-iron cookware increases dietary iron content naturally.'
    ],
    teluguKeyTakeaways: [
      'మొక్కల ఐరన్ అందాలంటే విటమిన్ సి (నిమ్మరసం/ఉసిరి) తప్పనిసరి.',
      'మునగాకు, రాగులు, బెల్లం రక్తవృద్ధికి అద్భుత ఔషధాలు.',
      'భోజనం చేసిన వెంటనే టీ లేదా కాఫీ త్రాగకూడదు; అవి ఐరన్‌ను అడ్డుకుంటాయి.',
      'ఇనుప పాత్రలలో వండటం ద్వారా ఆహారంలో ఐరన్ సహజంగా పెరుగుతుంది.'
    ],
    practicalTips: [
      'Squeeze half a fresh lemon over your dal or cooked sabzi right before eating.',
      'Eat a small piece of jaggery with roasted peanuts after your midday meal.',
      'Wait at least 60 minutes after lunch before having tea or coffee.'
    ],
    teluguPracticalTips: [
      'భోజనం చేసే ముందు పప్పు లేదా కూరపై కాస్త నిమ్మరసం పిండుకోండి.',
      'మధ్యాహ్న భోజనం తర్వాత చిన్న బెల్లం ముక్క, పల్లీలు తినండి.',
      'భోజనం తర్వాత కనీసం గంట వరకు టీ, కాఫీలకు దూరంగా ఉండండి.'
    ]
  },
  {
    id: 'calcium-vitamin-d',
    title: 'Calcium and Vitamin D: The Dynamic Duo for Lifelong Bone Strength',
    teluguTitle: 'కాల్షియం మరియు విటమిన్ డి: బలమైన ఎముకలకు సహజ జోడి',
    category: 'Bone Health',
    readTime: '4 min read',
    shortDescription: 'Why calcium is useless without Vitamin D, and how traditional millets and sunlight exposure build unbreakable bone density.',
    teluguDescription: 'విటమిన్ డి లేకుండా కాల్షియం ఎముకలకు చేరదు. సూర్యరశ్మి మరియు రాగుల ద్వారా ఎముకల ఆరోగ్యాన్ని ఎలా కాపాడుకోవాలో తెలుసుకోండి.',
    content: `Calcium is the primary architectural mineral of bones and teeth, while Vitamin D is the biochemical "key" that unlocks the intestinal door for calcium absorption. Without sufficient circulating Vitamin D, the body absorbs less than 15% of the calcium you consume.

The Dual Defense:
1. Safe Sunlight Exposure: Synthesizing Vitamin D requires UVB solar rays. Spending 15 to 25 minutes outdoors between 9:00 AM and 11:30 AM with arms and face uncovered provides the body with thousands of international units (IU) of natural Vitamin D3.
2. Dietary Calcium Sources: 
- Ragi (Finger Millet): Contains 344mg calcium per 100g—surpassing cow milk on a weight basis!
- White Sesame Seeds (Til): An astonishing 975mg calcium per 100g.
- Curd and Paneer: Readily bioavailable dairy calcium with beneficial probiotics.

Protecting Bone Density:
Peak bone mass is achieved before age 30. Ensuring regular calcium and Vitamin D in childhood and young adulthood acts as financial savings against osteoporosis and fractures in later life.`,
    teluguContent: `ఎముకలు మరియు దంతాల నిర్మాణానికి కాల్షియం పునాది అయితే, దానిని శరీరం పీల్చుకోవడానికి విటమిన్ డి తాళంచెవి లాంటిది:

1. సూర్యరశ్మి ద్వారా విటమిన్ డి: ఉదయం 9 నుండి 11 గంటల మధ్య 15-20 నిమిషాలు ఎండలో ఉండటం వల్ల శరీరం సహజంగా విటమిన్ డి3ని తయారుచేసుకుంటుంది.
2. కాల్షియం అధికంగా ఉండే ఆహారాలు:
- రాగులు: పాల కంటే ఎక్కువ కాల్షియం కలిగి ఉండే అద్భుత చిరుధాన్యం.
- నువ్వులు: ఒక్క చెంచా నువ్వులలో అపారమైన కాల్షియం ఉంటుంది.
- పాలు, పెరుగు మరియు పన్నీర్.

30 ఏళ్ల లోపు ఎముకల బలాన్ని పెంచుకుంటే వృద్ధాప్యంలో కీళ్ల నొప్పులు, ఎముకలు విరిగే ప్రమాదం తప్పుతుంది.`,
    keyTakeaways: [
      'Calcium cannot be absorbed effectively without adequate Vitamin D.',
      'Morning sunlight exposure is the primary natural source of Vitamin D3.',
      'Ragi and sesame seeds are champion non-dairy plant calcium sources.',
      'Peak bone mass built before age 30 prevents osteoporosis in later years.'
    ],
    teluguKeyTakeaways: [
      'విటమిన్ డి లేకుండా కాల్షియంను శరీరం గ్రహించలేదు.',
      'ఉదయపు సూర్యరశ్మి విటమిన్ డి కి అతిపెద్ద ఉచిత సహజ వనరు.',
      'రాగులు మరియు నువ్వులు అద్భుతమైన కాల్షియం నిల్వలు.',
      'చిన్నవయస్సులోనే బలమైన ఎముకలను నిర్మించుకోవడం భవిష్యత్తుకు రక్షణ.'
    ],
    practicalTips: [
      'Drink a glass of warm ragi malt (Ambali) sweetened with jaggery in the morning.',
      'Sprinkle roasted sesame seeds over vegetable curries or salads daily.',
      'Take a 20-minute brisk walk outdoors in the mid-morning sun without sunscreen on arms.'
    ],
    teluguPracticalTips: [
      'ఉదయాన్నే రాగి జావ లేదా అంబలి త్రాగడం అలవాటు చేసుకోండి.',
      'కూరలలో వేయించిన నువ్వుల పొడిని చల్లుకోవడం మంచిది.',
      'ఉదయం ఎండలో 20 నిమిషాలు నడవడం వల్ల విటమిన్ డి లభిస్తుంది.'
    ]
  },
  {
    id: 'vitamin-b12-awareness',
    title: 'Vitamin B12 Awareness for Vegetarians and Plant-Forward Eaters',
    teluguTitle: 'శాకాహారులకు విటమిన్ బి12 అవగాహన & మార్గదర్శకాలు',
    category: 'Vitamins',
    readTime: '4 min read',
    shortDescription: 'Understanding the unique bacterial origin of Vitamin B12 and ensuring nerve protection and red blood cell health on plant diets.',
    teluguDescription: 'శాకాహారంలో విటమిన్ బి12 ఎందుకు అరుదుగా ఉంటుంది? నరాల ఆరోగ్యం మరియు రక్తవృద్ధికి ముఖ్యమైన సలహాలు.',
    content: `Vitamin B12 (Cobalamin) is distinct from all other vitamins because it is neither produced by plants nor animals, but solely synthesized by specific microorganisms and bacteria. Because modern hygienic food processing washes away bacterial soil residue, unfortified plant foods contain zero active Vitamin B12.

Why B12 is Non-Negotiable:
- Myelin Sheath Protection: B12 maintains the protective insulation coating around nerves. Chronic deficiency leads to irreversible numbness, loss of balance, and memory fog.
- Megaloblastic Anemia: Without B12, red blood cells become abnormally large and cannot divide properly, causing debilitating exhaustion.

What Vegetarians Can Do:
1. Dairy Sources: Regular intake of fresh curd, paneer, and milk provides moderate B12 (approx. 0.4mcg to 1.2mcg per serving).
2. Fortified Foods: Nutritional yeast flakes and fortified plant milks often contain active cobalamin.
3. Periodic Screening & Medical Guidance: Strict vegans and long-term vegetarians should undergo an annual serum B12 blood check and take oral cyanocobalamin or methylcobalamin supplements under doctor guidance.`,
    teluguContent: `విటమిన్ బి12 నరాల వ్యవస్థకు మరియు ఎర్ర రక్త కణాల తయారీకి అత్యంత కీలకమైన విటమిన్:

- ఇది మొక్కల ద్వారా సహజంగా లభించదు. కేవలం సూక్ష్మజీవుల ద్వారా ఉత్పత్తి అవుతుంది.
- పాలు, పెరుగు, పన్నీర్ మరియు గుడ్లలో ఇది లభిస్తుంది.
- బి12 లోపం వల్ల కాళ్ళు, చేతులలో తిమ్మిర్లు, మతిమరుపు, తీవ్రమైన నీరసం వస్తాయి.

సంపూర్ణ శాకాహారులు (వీగన్స్) మరియు పాలు తక్కువగా తీసుకునేవారు వైద్యుల సలహాతో బి12 పరీక్ష చేయించుకుని, అవసరమైతే సప్లిమెంట్లను వాడటం క్షేమకరం.`,
    keyTakeaways: [
      'Plants do not produce Vitamin B12 naturally.',
      'B12 is essential for nerve insulation (myelin) and red blood cell division.',
      'Dairy products like curd and paneer offer modest vegetarian amounts.',
      'Annual screening and doctor-advised supplementation protect vegetarians from neuropathy.'
    ],
    teluguKeyTakeaways: [
      'మొక్కలలో సహజంగా విటమిన్ బి12 లభించదు.',
      'నరాల ఆరోగ్యానికి మరియు రక్త కణాల విభజనకు ఇది చాలా అవసరం.',
      'పాలు, పెరుగు, పన్నీర్ ద్వారా కొంతవరకు బి12 పొందవచ్చు.',
      'శాకాహారులు క్రమం తప్పకుండా పరీక్ష చేయించుకుని వైద్యుల సలహా తీసుకోవాలి.'
    ],
    practicalTips: [
      'Include at least two servings of fresh homemade curd or buttermilk in your daily routine.',
      'Look for the "+F" fortification logo on packaged milk and nutritional cereals.',
      'Consult a primary care physician for a serum Vitamin B12 test if experiencing chronic tingling.'
    ],
    teluguPracticalTips: [
      'రోజూ కనీసం రెండు పూటలా తాజా పెరుగు లేదా మజ్జిగ తీసుకోండి.',
      'పాల ప్యాకెట్లపై బలవర్ధక గుర్తులను (+F) గమనించండి.',
      'కాళ్ళలో తిమ్మిర్లు లేదా తీవ్ర నీరసం ఉంటే వైద్యుడిని సంప్రదించండి.'
    ]
  },
  {
    id: 'vitamin-c-immunity',
    title: 'Vitamin C & Natural Immunity: Daily Protection from Seasonal Illness',
    teluguTitle: 'విటమిన్ సి & సహజ రోగనిరోధక శక్తి: సీజనల్ వ్యాధుల నుండి రక్షణ',
    category: 'Vitamins',
    readTime: '4 min read',
    shortDescription: 'Why this water-soluble antioxidant cannot be stored by the human body and must be replenished daily through local fruits and vegetables.',
    teluguDescription: 'విటమిన్ సి శరీరంలో నిల్వ ఉండదు; రోజూ ఆహారం ద్వారా ఎందుకు తీసుకోవాలో మరియు రోగనిరోధక శక్తికి ఎలా ఉపయోగపడుతుందో తెలుసుకోండి.',
    content: `Unlike most mammals, humans lack the enzyme L-gulonolactone oxidase required to synthesize Vitamin C internally. Furthermore, because Vitamin C (Ascorbic Acid) is water-soluble, any excess is gently excreted in urine daily. You cannot "store" Vitamin C for next week; it must be consumed fresh every single day.

Crucial Roles in the Human Body:
1. White Blood Cell Production: Stimulates the synthesis and mobility of phagocytes and lymphocytes that engulf infectious microbes.
2. Collagen Architecture: Vital for collagen synthesis that seals wounds, maintains blood vessels, and keeps gums firm.
3. Potent Antioxidant: Neutralizes free radicals generated by environmental pollution and metabolic stress.

Top Everyday Sources (Far Surpassing Oranges):
- Fresh Amla (Indian Gooseberry): 600mg per 100g—nearly 10 times your daily RDA in a single fruit!
- Guava (Amrood / Jama): 228mg per 100g—over three times more Vitamin C than an orange.
- Lemon / Lime Juice: Inexpensive and instantly versatile.
- Green Bell Peppers & Moringa Leaves: Rich plant sources easily cooked into daily curries.`,
    teluguContent: `విటమిన్ సి శరీరంలో నిల్వ ఉండని నీటిలో కరిగే విటమిన్. కాబట్టి దీనిని ప్రతిరోజూ ఆహారం ద్వారా తీసుకోవడం తప్పనిసరి:

- రోగనిరోధక కణాలను ఉత్తేజపరిచి జలుబు, ఇన్ఫెక్షన్ల నుండి రక్షిస్తుంది.
- గాయాలు త్వరగా మానడానికి, చిగుళ్ళు మరియు చర్మం దృఢంగా ఉండటానికి కొల్లాజెన్‌ను ఉత్పత్తి చేస్తుంది.
- కాలుష్యం వల్ల కణాలకు జరిగే నష్టాన్ని నివారిస్తుంది.

శ్రేష్ఠమైన ఆహారాలు:
- ఉసిరికాయ: నారింజ కంటే 20 రెట్లు ఎక్కువ విటమిన్ సి కలిగి ఉంటుంది!
- జామకాయ: చవకైనది మరియు నారింజ కంటే 3 రెట్లు ఎక్కువ విటమిన్ సి అందిస్తుంది.
- నిమ్మకాయ, టమోటాలు, క్యాప్సికమ్ మరియు మునగాకు.`,
    keyTakeaways: [
      'Humans cannot synthesize or store Vitamin C; it must be consumed daily.',
      'A single fresh Amla or Guava provides multiple days of required Vitamin C.',
      'Vitamin C is heat-sensitive; consume citrus fruits raw or add lemon after cooking.',
      'Promotes rapid wound healing and prevents gum hemorrhage.'
    ],
    teluguKeyTakeaways: [
      'విటమిన్ సి శరీరంలో నిల్వ ఉండదు, రోజూ తినడం అవసరం.',
      'ఒక్క ఉసిరికాయ లేదా జామకాయ తింటే శరీరానికి సరిపడా విటమిన్ సి లభిస్తుంది.',
      'వేడికి విటమిన్ సి నశిస్తుంది; వంట పూర్తయ్యాకే నిమ్మరసం పిండాలి.',
      'గాయాలు మానడానికి మరియు దంతాల చిగుళ్ళ ఆరోగ్యానికి ఇది అవసరం.'
    ],
    practicalTips: [
      'Eat one raw guava or amla piece as a daily mid-morning snack.',
      'Always add lemon juice to curries after turning off the stove burner, as high heat degrades Vitamin C.',
      'Include fresh raw tomato and coriander leaves in daily dal and salads.'
    ],
    teluguPracticalTips: [
      'రోజూ ఉదయం ఒక జామకాయ లేదా చిన్న ఉసిరి ముక్క తినండి.',
      'పొయ్యి ఆపిన తర్వాత మాత్రమే కూరలో లేదా సాంబార్‌లో నిమ్మరసం పిండండి.',
      'తాజా టమోటా, కొత్తిమీరను ప్రతిరోజూ ఆహారంలో భాగం చేసుకోండి.'
    ]
  },
  {
    id: 'reading-nutrition-labels',
    title: 'Demystifying Packaged Food Labels: A Shopper’s Guide to Hidden Sugars and Sodium',
    teluguTitle: 'ప్యాకేజ్డ్ ఫుడ్ లేబుల్స్ చదవడం ఎలా: దాగి ఉన్న చక్కెర మరియు ఉప్పును గుర్తించండి',
    category: 'Label Literacy',
    readTime: '5 min read',
    shortDescription: 'Learn to decode ingredient lists, understand per-serving metrics, and spot misleading health claims on packaged snack aisles.',
    teluguDescription: 'ప్యాకెట్ల వెనుక ఉండే పోషక పట్టికను చదవడం నేర్చుకోండి; అధిక చక్కెర, ఉప్పు మరియు అనారోగ్యకర కొవ్వులను గుర్తించండి.',
    content: `Marketing slogans on the front of food packaging—such as "Made with Real Fruit", "Zero Cholesterol", or "Immunity Booster"—are designed to sell products. The true nutritional reality lives on the back in the mandatory Nutrition Facts table and Ingredient List.

Key Rules for Label Literacy:
1. Always Check the "Serving Size": A package of potato crisps may advertise only 120 calories, but the fine print reveals the tiny bag contains 3.5 servings (totalling over 420 calories)!
2. Decode Hidden Sugar Names: Manufacturers frequently split sugars into multiple aliases so sugar doesn't appear as the first ingredient. Watch out for: High Fructose Corn Syrup, Maltodextrin, Dextrose, Invert Syrup, Concentrated Fruit Juice Puree, Cane Sugar, and Malt Extract.
3. The 5/20 Rule:
- 5% Daily Value or less of a nutrient is LOW (great for saturated fat, sodium, and added sugars).
- 20% Daily Value or more of a nutrient is HIGH (great for dietary fiber, protein, and calcium; dangerous for sodium and added sugar).
4. Beware of Trans Fats: If the ingredient list mentions "Partially Hydrogenated Vegetable Oil", the food contains harmful industrial trans-fats even if the front claims "0g Trans Fat".`,
    teluguContent: `ప్యాకెట్ ముందు భాగంలో ఉండే ఆకర్షణీయమైన ప్రకటనలను కాకుండా, వెనుక ఉండే న్యూట్రిషన్ లేబుల్‌ను పరిశీలించండి:

1. 'సర్వింగ్ సైజు' గమనించండి: ప్యాకెట్ మొత్తం కలిపి ఎన్ని సర్వింగ్స్ ఉన్నాయో చూసి క్యాలరీలను లెక్కించండి.
2. దాగి ఉన్న చక్కెరల పేర్లు: మాల్టోడెక్స్ట్రిన్, హై ఫ్రక్టోజ్ సిరప్, ఇన్వర్ట్ షుగర్ వంటి పేర్లతో చక్కెరలను కలుపుతారు.
3. అధిక ఉప్పు (సోడియం): ఒక్క సర్వింగ్‌కు 400 మి.గ్రా కంటే ఎక్కువ సోడియం ఉంటే అది రక్తపోటుకు హానికరం.
4. హైడ్రోజనేటెడ్ నూనెలు (ట్రాన్స్ ఫ్యాట్స్): పదార్థాల జాబితాలో ఇవి ఉంటే ఆ ఆహారం గుండె ఆరోగ్యానికి మంచిది కాదు.`,
    keyTakeaways: [
      'Front-of-package claims are marketing; the back panel tells the objective truth.',
      'Check serving size before evaluating calories and sugar totals.',
      'More than 10g added sugar or 400mg sodium per serving warrants caution.',
      'Ingredients are listed in order of weight; if sugar is in the top 3, it is primarily candy.'
    ],
    teluguKeyTakeaways: [
      'ముందు భాగంలోని ప్రకటనలు నమ్మకండి; వెనుక పట్టికను చూడండి.',
      'సర్వింగ్ సైజు ఆధారంగా మొత్తం క్యాలరీలను లెక్కించండి.',
      '10 గ్రాముల కంటే ఎక్కువ చక్కెర లేదా 400 మి.గ్రా ఉప్పు ఉంటే తగ్గించాలి.',
      'పదార్థాల జాబితాలో మొదటి 3 స్థానాల్లో చక్కెర లేదా పామాయిల్ ఉంటే అది అనారోగ్యకరం.'
    ],
    practicalTips: [
      'Use the NutriVita Label Lens tool on your phone to scan and grade any packaged item instantly.',
      'Look at the first three ingredients: if sugar, palm oil, or refined flour appears first, reconsider.',
      'Compare similar brands and choose the one with higher dietary fiber and lower sodium.'
    ],
    teluguPracticalTips: [
      'న్యూట్రివిటా లేబుల్ లెన్స్ (Label Lens) ద్వారా ప్యాకెట్‌ను స్కాన్ చేసి గ్రేడ్ చూడండి.',
      'మొదటి మూడు పదార్థాలలో మైదా, చక్కెర లేదా పామాయిల్ ఉంటే జాగ్రత్తపడండి.',
      'పీచు పదార్థం ఎక్కువగా ఉండి, ఉప్పు తక్కువగా ఉన్న బ్రాండ్లను ఎంచుకోండి.'
    ]
  },
  {
    id: 'healthy-eating-budget',
    title: 'Nutritious Eating on a Budget: Affordable Indian Staples That Pack Maximum Nutrients',
    teluguTitle: 'తక్కువ ఖర్చుతో పౌష్టికాహారం: చవకైన సాంప్రదాయ పోషక నిధులు',
    category: 'Community Wellness',
    readTime: '4 min read',
    shortDescription: 'You do not need expensive imported berries or exotic seeds to eat healthy. Local seasonal staples deliver world-class nutrition at modest cost.',
    teluguDescription: 'ఖరీదైన పండ్లు అక్కర్లేదు; మన ఊరిలోనే లభించే ఉసిరి, జామ, పల్లీలు, రాగుల ద్వారా తక్కువ ఖర్చుతో గొప్ప ఆరోగ్యం పొందవచ్చు.',
    content: `A common myth in modern wellness is that healthy eating requires expensive imported superfoods—quinoa, kale, chia seeds, and avocados. In reality, traditional indigenous Indian foods provide identical or superior nutritional density at a fraction of the cost:

1. Amla vs Blueberries: Fresh Indian Gooseberry (Amla) costs a few rupees per piece and provides up to 20 times more Vitamin C and cellular antioxidants than imported blueberries.
2. Ragi vs Quinoa: Finger millet provides more than 10 times the calcium of quinoa, comparable fiber, and is grown locally by Indian farmers at affordable prices.
3. Roasted Peanuts vs Almonds: Peanuts (Groundnuts) offer equal protein and monounsaturated healthy fats to almonds at one-fourth the market price.
4. Drumstick Leaves (Moringa) vs Kale: Moringa grows abundantly in home backyards across villages and towns, offering triple the iron, calcium, and beta-carotene of expensive foreign greens.

Community Nutrition Tip:
Buying seasonal, locally grown fruits and purchasing whole pulses in bulk directly supports local farmers while keeping household grocery budgets completely sustainable.`,
    teluguContent: `ఆరోగ్యంగా ఉండటానికి ఖరీదైన విదేశీ పండ్లు, గింజలు అవసరం లేదు. మన పరిసరాలలోనే దొరికే సాంప్రదాయ ఆహారాలు అత్యంత బలమైనవి:

1. ఉసిరి vs బ్లూబెర్రీస్: మార్కెట్లో చవకగా దొరికే ఉసిరిలో ఖరీదైన పండ్ల కంటే 20 రెట్లు ఎక్కువ విటమిన్ సి ఉంటుంది.
2. రాగులు vs క్వినోవా: రాగులలో క్వినోవా కంటే 10 రెట్లు ఎక్కువ కాల్షియం ఉంటుంది.
3. వేరుశెనగలు vs బాదం: పల్లీలు బాదం పప్పుతో సమానమైన ప్రోటీన్ మరియు మంచి కొవ్వులను అతి తక్కువ ఖర్చుతో అందిస్తాయి.
4. మునగాకు: పెరట్లోనే దొరికే మునగాకులో ఐరన్, కాల్షియం మరియు విటమిన్ ఎ అపారంగా ఉంటాయి.

స్థానికంగా పండే సీజనల్ కూరగాయలు, పండ్లు కొనడం వల్ల జేబుకు భారం లేకుండా సంపూర్ణ ఆరోగ్యం లభిస్తుంది.`,
    keyTakeaways: [
      'Expensive imported foods are not required for world-class nutrition.',
      'Amla, guava, ragi, and peanuts match or exceed exotic superfood profiles.',
      'Moringa leaves provide exceptional free/low-cost micronutrient density.',
      'Eating local and seasonal saves household money while improving nutritional freshness.'
    ],
    teluguKeyTakeaways: [
      'ఖరీదైన ఆహారాలు తింటేనే ఆరోగ్యం వస్తుందనేది అపోహ మాత్రమే.',
      'జామ, ఉసిరి, రాగులు, పల్లీలు ప్రపంచ స్థాయి పోషక విలువలను కలిగి ఉన్నాయి.',
      'పెరటి మునగాకు పేదరికాన్ని జయించే అద్భుత పోషక నిధి.',
      'సీజనల్ ఆహారాలు కొనడం వల్ల ఖర్చు తగ్గుతుంది, ఆరోగ్యం పెరుగుతుంది.'
    ],
    practicalTips: [
      'Plant a moringa tree in your backyard or residential society for a free year-round greens harvest.',
      'Choose in-season fruits: Guava and papaya in winter; watermelon and musk melon in summer.',
      'Buy whole unpolished pulses and grains in monthly bulk sacks from local agricultural mandis.'
    ],
    teluguPracticalTips: [
      'పెరట్లో లేదా ఇంటి ముందర మునగ చెట్టును నాటండి; ఏడాది పొడవునా ఉచిత ఆకుకూర లభిస్తుంది.',
      'సీజన్ ప్రకారం వచ్చే జామ, బొప్పాయి, పుచ్చకాయలను కొనుగోలు చేయండి.',
      'స్థానిక రైతు బజార్లలో తాజా కూరగాయలను కొనుగోలు చేయడం అలవాటు చేసుకోండి.'
    ]
  },
  {
    id: 'student-nutrition-habits',
    title: 'Brain Fuel: Healthy Eating & Focus Habits for Students and Young Adults',
    teluguTitle: 'విద్యార్థులకు పోషకాహార అలవాట్లు: ఏకాగ్రత మరియు పరీక్షల ఒత్తిడికి ఆహార మార్గదర్శి',
    category: 'Youth & Focus',
    readTime: '4 min read',
    shortDescription: 'How stable blood sugar, omega fatty acids, and mindful hydration eliminate brain fog and power long study sessions.',
    teluguDescription: 'పరీక్షల సమయంలో ఏకాగ్రత పెరగడానికి, బద్ధకం మరియు ఒత్తిడి తగ్గడానికి విద్యార్థులకు అవసరమైన ఆహార నియమాలు.',
    content: `During intensive study sessions and exam preparation, students often turn to high-sugar energy drinks, instant noodles, and caffeine. While these provide a temporary 30-minute spike, they trigger a steep insulin surge followed by an intense afternoon brain fog and fatigue crash.

Nutritional Principles for Peak Cognitive Performance:
1. Steady Glucose Supply: The brain consumes 20% of the body's glucose. Complex carbs like oatmeal, ragi malt, or whole wheat rotis release glucose slowly and steadily, sustaining mental concentration for hours.
2. Brain-Boosting Healthy Fats: The brain is nearly 60% fat. Consuming walnuts, groundnuts, flaxseed powder, and whole eggs supports synaptic membrane elasticity and memory retention.
3. Combatting Dehydration Headaches: Even mild 1.5% dehydration reduces memory recall, slows processing speed, and triggers tension headaches. Keep a filled water bottle on your study desk.
4. Iron & B-Vitamins for Alertness: Iron carries oxygen to brain cells, while B-vitamins synthesize neurotransmitters like dopamine and serotonin.`,
    teluguContent: `పరీక్షల సమయంలో విద్యార్థులు టీ, కాఫీలు, జంక్ ఫుడ్ మరియు చక్కెర పదార్థాలను ఎక్కువగా తీసుకుంటారు. ఇవి తాత్కాలిక ఉత్సాహాన్ని ఇచ్చి వెంటనే తీవ్ర అలసటకు గురిచేస్తాయి:

ఏకాగ్రత పెంచే పోషకాహార సూత్రాలు:
1. మెదడుకు స్థిరమైన గ్లూకోజ్: రాగి జావ, ఓట్స్ లేదా గోధుమ రొట్టెలు రోజంతా నిలకడైన ఏకాగ్రతను ఇస్తాయి.
2. జ్ఞాపకశక్తికి మేలైన కొవ్వులు: వేరుశెనగలు, వాల్‌నట్స్, అవిసె గింజలు మరియు గుడ్లు మెదడు కణాల చురుకుదనానికి అవసరం.
3. తగినంత నీరు త్రాగడం: శరీరంలో నీరు తగ్గితే తలనొప్పి, బద్ధకం మరియు మతిమరుపు వస్తాయి. చదివే బల్లపై నీళ్ళ సీసాను ఉంచుకోండి.
4. పప్పులు, ఆకుకూరల ద్వారా ఐరన్ అందడం వల్ల మెదడుకు ఆక్సిజన్ బాగా సరఫరా అవుతుంది.`,
    keyTakeaways: [
      'Sugary snacks and caffeine create rapid energy crashes during study sessions.',
      'Complex carbohydrates supply continuous, steady glucose to the brain.',
      'Healthy fats from nuts and seeds support memory retention and synaptic speed.',
      'Staying hydrated prevents tension headaches and cognitive fatigue.'
    ],
    teluguKeyTakeaways: [
      'చక్కెర పదార్థాలు మరియు కెఫీన్ తాత్కాలిక శక్తిని ఇచ్చి తీవ్ర నీరసాన్ని కలిగిస్తాయి.',
      'ముడి ధాన్యాలు మెదడుకు స్థిరమైన గ్లూకోజ్‌ను అందిస్తాయి.',
      'గింజలు, పల్లీలు జ్ఞాపకశక్తిని మరియు మెదడు పనితీరును మెరుగుపరుస్తాయి.',
      'రోజంతా నీరు త్రాగడం వల్ల తలనొప్పి మరియు అలసట రాకుండా ఉంటాయి.'
    ],
    practicalTips: [
      'Keep a jar of roasted peanuts and roasted chana on your study desk instead of potato chips.',
      'Drink a glass of water every time you take a 5-minute study break.',
      'Never skip morning breakfast on an exam day; choose an egg or sprout sandwich with fruit.'
    ],
    teluguPracticalTips: [
      'చదివేటప్పుడు చిప్స్‌కు బదులుగా వేయించిన శనగలు, పల్లీలు తినండి.',
      'ప్రతి అర్ధగంట చదువు తర్వాత ఒక గ్లాసు నీరు త్రాగడం అలవాటు చేసుకోండి.',
      'పరీక్ష రోజు ఉదయం టిఫిన్ మానకండి; గుడ్డు లేదా పండ్లతో కూడిన బలమైన ఆహారం తీసుకోండి.'
    ]
  }
];

// ========================================================
// 2. LOCAL & INDIAN SUPERFOODS GUIDE (12 Verified Foods)
// ========================================================
export const superfoods = [
  {
    id: 'moringa',
    name: 'Drumstick Leaves (Moringa)',
    teluguName: 'మునగాకు (Munagaku)',
    category: 'Greens',
    nutrients: 'Iron, Calcium, Vitamin A, Vitamin C, Protein',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    benefits: 'Contains triple the iron of spinach and exceptional plant-based calcium for bone and blood vitality.',
    teluguBenefits: 'పాలకూర కంటే 3 రెట్లు ఎక్కువ ఐరన్ మరియు ఎముకల బలానికి అవసరమైన సహజ కాల్షియం అందిస్తుంది.',
    howToEat: 'Add fresh leaves to daily dal, saute with onion and coconut, or dry and crush into powders.',
    teluguHowToEat: 'పప్పులో కలిపి వండుకోవచ్చు లేదా ఉల్లిపాయ, కొబ్బరి పొడితో వేపుడు చేసుకోవచ్చు.',
    communityTip: 'Moringa trees grow rapidly from cuttings in home backyards with minimal water, providing free community nutrition year-round.',
    teluguCommunityTip: 'ఇంటి పెరట్లో ఒక మునగ చెట్టు కొమ్మను నాటితే ఏడాది పొడవునా ఉచితంగా పౌష్టికాహారం లభిస్తుంది.'
  },
  {
    id: 'amla',
    name: 'Indian Gooseberry (Amla)',
    teluguName: 'ఉసిరికాయ (Usirikaya)',
    category: 'Fruits',
    nutrients: 'Vitamin C, Polyphenols, Bioflavonoids',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    benefits: 'Phenomenal Vitamin C reservoir (600mg/100g) that strengthens gums, immunity, and iron absorption.',
    teluguBenefits: 'నారింజ కంటే 20 రెట్లు ఎక్కువ విటమిన్ సి కలిగిన అమృత ఫలం; చిగుళ్ల రక్తస్రావాన్ని నివారిస్తుంది.',
    howToEat: 'Eat raw with a pinch of salt, blend into daily green juice, or make traditional amla murabba.',
    teluguHowToEat: 'ఉప్పుతో పచ్చిగా తినవచ్చు, రసం తీసి త్రాగవచ్చు లేదా సాంప్రదాయ ఊరగాయగా తీసుకోవచ్చు.',
    communityTip: 'Preserve whole amla in salt water during the peak winter harvest to consume natural Vitamin C all year.',
    teluguCommunityTip: 'శీతాకాలంలో చవకగా దొరికే ఉసిరికాయలను ఉప్పు నీటిలో నిల్వ చేసుకుని ఏడాది పొడవునా వాడుకోవచ్చు.'
  },
  {
    id: 'ragi',
    name: 'Finger Millet (Ragi)',
    teluguName: 'రాగులు (Ragulu / Taidalu)',
    category: 'Millets',
    nutrients: 'Calcium (344mg/100g), Iron, Dietary Fiber',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    benefits: 'Richest calcium density among all cereals, preventing childhood rickets and adult osteoporosis.',
    teluguBenefits: 'ధాన్యాలన్నింటిలోకెల్లా అత్యధిక కాల్షియం కలిగి ఉండి ఎముకలు మరియు దంతాలను దృఢపరుస్తుంది.',
    howToEat: 'Cook into warm morning ragi ambali (malt), savory ragi dosas, or steamed ragi mudde.',
    teluguHowToEat: 'మజ్జిగతో రాగి అంబలి లేదా బెల్లంతో రాగి మాల్ట్, రాగి రొట్టెలు మరియు రాగి సంకటి రూపంలో తినవచ్చు.',
    communityTip: 'Ragi porridge is an ideal first weaning food for infants due to its high digestibility and rich calcium.',
    teluguCommunityTip: 'పిల్లలకు మొదటి ఆహారంగా రాగి జావను అందించడం వల్ల ఎముకలు బలంగా ఎదుగుతాయి.'
  },
  {
    id: 'palak',
    name: 'Spinach (Palak)',
    teluguName: 'పాలకూర (Palakura)',
    category: 'Greens',
    nutrients: 'Folate, Iron, Vitamin K, Carotenoids',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    benefits: 'Abundant natural folate (194mcg) supporting red blood cell formation and healthy pregnancy.',
    teluguBenefits: 'రక్తకణాల వృద్ధికి మరియు గర్భిణులకు అవసరమైన సహజ ఫోలిక్ యాసిడ్ అందిస్తుంది.',
    howToEat: 'Cook in palak dal, blend into soups, or lightly steam with garlic and cumin.',
    teluguHowToEat: 'పాలకూర పప్పు, కూర లేదా వెల్లుల్లితో తేలికపాటి వేపుడు రూపంలో తీసుకోవచ్చు.',
    communityTip: 'Always squeeze fresh lemon over cooked spinach to enhance its plant iron absorption up to threefold.',
    teluguCommunityTip: 'పాలకూర తిన్నప్పుడు నిమ్మరసం పిండుకుంటే ఐరన్ శోషణ మూడు రెట్లు పెరుగుతుంది.'
  },
  {
    id: 'sprouts',
    name: 'Sprouted Moong (Green Gram)',
    teluguName: 'మొలకెత్తిన పెసలు (Molakalu)',
    category: 'Pulses',
    nutrients: 'Bioavailable Protein, Vitamin C, Fiber, Folate',
    imageUrl: '/images/foods/sprouts.jpg',
    benefits: 'Sprouting multiplies active Vitamin C and enzymes while breaking down anti-nutrients for easy digestion.',
    teluguBenefits: 'మొలకల వల్ల ప్రోటీన్ మరియు విటమిన్ సి రెట్టింపు అవుతాయి, జీర్ణక్రియ చాలా సులభం అవుతుంది.',
    howToEat: 'Eat raw as a crunchy salad with lemon, tomato, and cucumber, or lightly steam for 2 minutes.',
    teluguHowToEat: 'టమోటా, దోసకాయ, నిమ్మరసం కలిపి సలాడ్ లాగా లేదా 2 నిమిషాలు ఆవిరిపై ఉడికించి తినవచ్చు.',
    communityTip: 'Sprouting green gram at home requires only a bowl and a clean damp cloth—zero cooking fuel needed!',
    teluguCommunityTip: 'ఒక గిన్నె మరియు తడి గుడ్డ ఉంటే చాలు; ఎలాంటి గ్యాస్ ఖర్చు లేకుండా ఇంట్లోనే మొలకలు తయారుచేసుకోవచ్చు.'
  },
  {
    id: 'groundnuts',
    name: 'Groundnuts (Peanuts)',
    teluguName: 'వేరుశెనగ పప్పు / పల్లీలు (Pallilu)',
    category: 'Nuts & Seeds',
    nutrients: 'Protein (25g/100g), Monounsaturated Fats, Niacin',
    imageUrl: '/images/foods/groundnuts.jpg',
    benefits: 'Affordable plant protein powerhouse matching almonds in healthy fats at one-fourth the market price.',
    teluguBenefits: 'బాదం పప్పుతో సమానమైన ప్రోటీన్ మరియు మంచి కొవ్వులను అతి తక్కువ ఖర్చుతో అందించే బలవర్ధక ఆహారం.',
    howToEat: 'Enjoy roasted as an evening snack, boil with a pinch of salt, or blend into peanut podi.',
    teluguHowToEat: 'వేయించి బెల్లంతో లేదా ఉడకబెట్టి చిరుతిండిగా, పల్లీ పొడి రూపంలో వాడుకోవచ్చు.',
    communityTip: 'Pairing roasted peanuts with jaggery (traditional chikki) provides energy, iron, and protein in one bite.',
    teluguCommunityTip: 'పల్లీ పట్టీ (చిక్కీ) పిల్లలకు బలమైన శక్తిని, ఐరన్ మరియు ప్రోటీన్‌ను అందిస్తుంది.'
  },
  {
    id: 'sesame',
    name: 'Sesame Seeds (Til / Nuvvulu)',
    teluguName: 'నువ్వులు (Nuvvulu)',
    category: 'Nuts & Seeds',
    nutrients: 'Calcium (975mg/100g), Iron (14.6mg), Zinc',
    imageUrl: '/images/foods/sesame_seeds.jpg',
    benefits: 'Unbelievable plant calcium and iron concentration supporting joint lubrication and bone mass.',
    teluguBenefits: '100 గ్రాములకు 975 మి.గ్రా కాల్షియం కలిగిన అద్భుత గింజలు; కీళ్ల నొప్పులు రాకుండా కాపాడుతాయి.',
    howToEat: 'Make traditional til laddoos with jaggery, sprinkle on vegetable stir-fries, or use in chutneys.',
    teluguHowToEat: 'నువ్వుల ఉండలు (చిమ్మిలి) చేసుకోవచ్చు లేదా కూరలలో నువ్వుల పొడిని చల్లుకోవచ్చు.',
    communityTip: 'Eating one small sesame-jaggery laddoo daily during winter warms the body and fuels bone health.',
    teluguCommunityTip: 'శీతాకాలంలో రోజూ ఒక చిన్న నువ్వుల ఉండ తినడం వల్ల శరీరానికి వెచ్చదనం, ఎముకలకు బలం లభిస్తుంది.'
  },
  {
    id: 'curd',
    name: 'Fresh Homemade Curd (Dahi)',
    teluguName: 'తాజా పెరుగు (Perugu / Dahi)',
    category: 'Dairy',
    nutrients: 'Probiotics, Calcium, Protein, Vitamin B12',
    imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80',
    benefits: 'Delivers millions of live gut-friendly lactic acid bacteria, bioavailable calcium, and Vitamin B12.',
    teluguBenefits: 'జీర్ణక్రియకు మేలు చేసే మంచి బ్యాక్టీరియా (ప్రోబయోటిక్స్), కాల్షియం మరియు విటమిన్ బి12 అందిస్తుంది.',
    howToEat: 'Consume with meals as curd rice, drink spiced buttermilk with curry leaves, or make raita.',
    teluguHowToEat: 'మజ్జిగలో కరివేపాకు, అల్లం వేసి త్రాగవచ్చు లేదా భోజనంలో పెరుగు అన్నంగా తీసుకోవచ్చు.',
    communityTip: 'Diluting curd into thin spiced buttermilk (Chaas/Majjiga) provides perfect summer rehydration and digestion.',
    teluguCommunityTip: 'మజ్జిగ ఎండవేడిమి నుండి శరీరాన్ని చల్లబరిచే అత్యుత్తమ సహజ ఓఆర్ఎస్ (ORS) పానీయం.'
  },
  {
    id: 'eggs',
    name: 'Farm Eggs (Guddu)',
    teluguName: 'కోడిగుడ్డు (Guddu)',
    category: 'Proteins',
    nutrients: 'Complete Protein (6g), Vitamin B12, Choline, Vitamin D',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    benefits: 'The gold standard complete protein source with all 9 essential amino acids and brain-nourishing choline.',
    teluguBenefits: 'శరీరానికి అవసరమైన 9 రకాల ఎమినో ఆమ్లాలు, విటమిన్ బి12 మరియు విటమిన్ డి కలిగిన సంపూర్ణ ఆహారం.',
    howToEat: 'Hard-boil, scramble with turmeric and onions, or poach for a quick breakfast protein boost.',
    teluguHowToEat: 'ఉడకబెట్టి లేదా ఉల్లిపాయ, పసుపుతో గుడ్డు పొరుటు చేసుకుని తినవచ్చు.',
    communityTip: 'One boiled egg daily in school mid-day meal programs has drastically reduced childhood stunting across India.',
    teluguCommunityTip: 'బడి పిల్లలకు రోజూ ఒక ఉడకబెట్టిన గుడ్డు ఇవ్వడం వల్ల ఎదుగుదల లోపాలు పూర్తిగా తగ్గుతాయి.'
  },
  {
    id: 'guava',
    name: 'Fresh Guava (Jama / Amrood)',
    teluguName: 'జామకాయ (Jamakaya)',
    category: 'Fruits',
    nutrients: 'Vitamin C (228mg), Dietary Fiber (5.4g), Lycopene',
    imageUrl: '/images/foods/guava.jpg',
    benefits: 'Contains over 4 times the Vitamin C of oranges and exceptional pectin fiber for gut regularity and blood sugar balance.',
    teluguBenefits: 'నారింజ కంటే 4 రెట్లు ఎక్కువ విటమిన్ సి మరియు అద్భుతమైన పీచు పదార్థం; షుగర్ ఉన్నవారికి మేలైనది.',
    howToEat: 'Slice and eat fresh with a pinch of rock salt and chili powder, or blend into fresh smoothies.',
    teluguHowToEat: 'తాజాగా కోసి ఉప్పు, కారంతో లేదా పచ్చిగానే ముక్కలుగా తినడం చాలా మంచిది.',
    communityTip: 'Guava is an inexpensive seasonal fruit that can be safely enjoyed by people with diabetes due to its low glycemic load.',
    teluguCommunityTip: 'జామకాయ తక్కువ గ్లైసిమిక్ ఇండెక్స్ కలిగి ఉండటం వల్ల మధుమేహం ఉన్నవారు కూడా నిరభ్యంతరంగా తినవచ్చు.'
  },
  {
    id: 'millets',
    name: 'Mixed Millets (Jowar / Bajra)',
    teluguName: 'చిరుధాన్యాలు (జొన్నలు, సజ్జలు)',
    category: 'Millets',
    nutrients: 'Complex Carbs, B-Vitamins, Magnesium, Iron',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    benefits: 'Drought-resilient grains delivering slow-release glucose, protecting against type 2 diabetes and hypertension.',
    teluguBenefits: 'రక్తంలో గ్లూకోజ్‌ను నెమ్మదిగా విడుదల చేసి మధుమేహం మరియు రక్తపోటును అదుపులో ఉంచుతాయి.',
    howToEat: 'Make soft jowar/bajra rotis, replace rice with foxtail millet, or prepare savory millet upma.',
    teluguHowToEat: 'జొన్న రొట్టెలు, సజ్జ రొట్టెలు లేదా కొర్రలతో ఉప్మా మరియు కిచిడీ తయారుచేసుకోవచ్చు.',
    communityTip: 'Millets require very little water and fertilizer to cultivate, making them eco-friendly for farmers and climate resilient.',
    teluguCommunityTip: 'చిరుధాన్యాల సాగుకు తక్కువ నీరు అవసరం; పర్యావరణానికి మరియు ఆరోగ్యానికి రెండింటికీ మేలు.'
  },
  {
    id: 'lentils',
    name: 'Yellow & Split Lentils (Dal)',
    teluguName: 'పప్పుధాన్యాలు (కందిపప్పు / పెసరపప్పు)',
    category: 'Pulses',
    nutrients: 'Plant Protein (22g), Folate (456mcg), Iron, Potassium',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    benefits: 'The backbone of daily vegetarian protein and the premier dietary source of natural folate.',
    teluguBenefits: 'శాకాహారులకు ముఖ్యమైన ప్రోటీన్ ఆధారం; ఫోలిక్ యాసిడ్, ఐరన్ మరియు పొటాషియం సమృద్ధి.',
    howToEat: 'Cook with tomatoes and greens into dal tadka, prepare south Indian sambar, or make moong dal chilla.',
    teluguHowToEat: 'కూరగాయలతో సాంబార్, ఆకుకూరల పప్పు లేదా పెసరట్లు రూపంలో తీసుకోవచ్చు.',
    communityTip: 'Always combine dal with grains (like rice or roti) to assemble a complete protein containing all essential amino acids.',
    teluguCommunityTip: 'పప్పును అన్నం లేదా రొట్టెతో కలిపి తిన్నప్పుడు మాత్రమే సంపూర్ణ ప్రోటీన్ శరీరానికి అందుతుంది.'
  }
];

// ========================================================
// 3. SEASONAL NUTRITION HANDBOOK (Summer, Monsoon, Winter)
// ========================================================
export const seasonalGuides = {
  summer: {
    id: 'summer',
    title: 'Summer Nutrition Handbook (మార్చి - జూన్)',
    teluguTitle: 'వేసవి పోషకాహార మార్గదర్శి',
    seasonName: 'Summer',
    teluguSeasonName: 'వేసవి కాలం',
    themeColor: 'amber',
    iconName: 'Sun',
    focus: 'Electrolyte balance, core hydration, cellular cooling, and food freshness.',
    teluguFocus: 'ఎలక్ట్రోలైట్ సమతుల్యత, నిర్జలీకరణ నివారణ, శరీరాన్ని చల్లబరచడం మరియు ఆహార భద్రత.',
    recommendedFoods: [
      { name: 'Spiced Buttermilk (Majjiga)', teluguName: 'మజ్జిగ', desc: 'Natural hydration with probiotics, ginger, and curry leaves.' },
      { name: 'Watermelon & Muskmelon', teluguName: 'పుచ్చకాయ & ఖర్బూజా', desc: '92% water content loaded with lycopene and potassium.' },
      { name: 'Cucumber & Bottle Gourd (Sorakaya)', teluguName: 'దోసకాయ & సొరకాయ', desc: 'Hydrating, low-calorie vegetables with cooling properties.' },
      { name: 'Tender Coconut Water', teluguName: 'కొబ్బరి నీళ్ళు', desc: 'Pure isotonic electrolyte hydration straight from nature.' },
      { name: 'Sabja Seeds (Sweet Basil)', teluguName: 'సబ్జా గింజలు', desc: 'Internal cooling and soluble fiber soaked in lemon water.' }
    ],
    hydrationGuidance: 'Drink 2.5 to 3.5 liters of fluids daily. Do not wait until you feel thirsty. Supplement plain water with light salted buttermilk, lemon-mint water, and coconut water to prevent heat exhaustion.',
    teluguHydrationGuidance: 'రోజుకు 2.5 నుండి 3.5 లీటర్ల నీరు త్రాగండి. దాహం వేసే వరకు ఆగవద్దు. ఎండలో తిరిగినప్పుడు మజ్జిగ, కొబ్బరి నీళ్ళు లేదా నిమ్మరసం తీసుకోవడం వల్ల వడదెబ్బ తగలకుండా ఉంటుంది.',
    foodSafetyTips: [
      'Cooked food spoils twice as fast in high heat; refrigerate leftovers within 90 minutes.',
      'Wash fresh summer produce thoroughly to remove field dust and heat-thriving bacteria.',
      'Avoid unhygienic roadside cut fruit platters exposed to heat and street flies.'
    ],
    teluguFoodSafetyTips: [
      'ఎండల వల్ల వండిన ఆహారం త్వరగా పాడవుతుంది; వండిన 2 గంటల లోపు తినడం లేదా ఫ్రిజ్‌లో ఉంచడం మంచిది.',
      'కూరగాయలు మరియు పండ్లను శుభ్రమైన నీటితో బాగా కడగాలి.',
      'రోడ్ల పక్కన ఈగలు వాలే కోసిన పండ్లను తినకూడదు.'
    ],
    dailyHabits: [
      'Carry a reusable stainless-steel water bottle whenever stepping outdoors.',
      'Eat lighter, more frequent meals with less oil to prevent sluggish digestion.',
      'Sip cool buttermilk with crushed mint and black salt after lunch.'
    ],
    teluguDailyHabits: [
      'బయటకు వెళ్ళేటప్పుడు ఎల్లప్పుడూ మంచినీటి సీసాను వెంట ఉంచుకోండి.',
      'నూనె, మసాలాలు తగ్గించి తేలికగా జీర్ణమయ్యే ఆహారాన్ని తీసుకోండి.',
      'మధ్యాహ్న భోజనం తర్వాత చల్లని మజ్జిగ త్రాగడం అలవాటు చేసుకోండి.'
    ]
  },
  monsoon: {
    id: 'monsoon',
    title: 'Monsoon Nutrition Handbook (జూలై - సెప్టెంబర్)',
    teluguTitle: 'వర్షాకాల పోషకాహార మార్గదర్శి',
    seasonName: 'Monsoon',
    teluguSeasonName: 'వర్షాకాలం',
    themeColor: 'teal',
    iconName: 'CloudRain',
    focus: 'Waterborne disease prevention, gut immunity, freshly prepared warm foods, and food hygiene.',
    teluguFocus: 'నీటి ద్వారా వచ్చే వ్యాధుల నివారణ, జీర్ణవ్యవస్థ రక్షణ, వేడి ఆహారం మరియు పరిశుభ్రత.',
    recommendedFoods: [
      { name: 'Warm Ginger & Turmeric Soups', teluguName: 'అల్లం, పసుపు రసం / సూప్', desc: 'Anti-inflammatory and antimicrobial defenses.' },
      { name: 'Steamed Corn (Bhutta / Mokkajonna)', teluguName: 'మొక్కజొన్న కండీలు', desc: 'Wholesome prebiotic fiber and lutein for immunity.' },
      { name: 'Cooked Bottle Gourd & Ridge Gourd', teluguName: 'సొరకాయ & బీరకాయ', desc: 'Gentle on the sluggish monsoon digestive tract.' },
      { name: 'Garlic & Pepper Rasam', teluguName: 'మిరియాల చారు', desc: 'Promotes gastric acid secretion and fights microbial infections.' },
      { name: 'Roasted Spiced Seeds & Nuts', teluguName: 'వేయించిన గింజలు', desc: 'Healthy zinc and selenium to maintain white blood cells.' }
    ],
    hydrationGuidance: 'Monsoon weather cools the air, reducing thirst sensation. You still require 2 liters of fluid daily. Always boil drinking water for at least 5 minutes to kill waterborne typhoidal and cholera microbes.',
    teluguHydrationGuidance: 'చలి వల్ల దాహం తక్కువగా అనిపిస్తుంది, కానీ రోజుకు కనీసం 2 లీటర్ల నీరు అవసరం. నీటి ద్వారా వచ్చే డయేరియా, టైఫాయిడ్ నివారణకు కాచి చల్లార్చిన నీటిని మాత్రమే త్రాగాలి.',
    foodSafetyTips: [
      'Avoid raw unwashed street salads, chutneys, and roadside pani puri during rains.',
      'Ensure leafy greens are washed in warm water with salt or vinegar to remove insect eggs and mud.',
      'Eat freshly cooked warm food; avoid eating cold rice or curries left uncovered.'
    ],
    teluguFoodSafetyTips: [
      'వర్షాకాలంలో రోడ్డు పక్కన పానీపూరి, కట్ ఫ్రూట్స్ తినడం పూర్తిగా మానుకోండి.',
      'ఆకుకూరలను ఉప్పు నీటిలో బాగా కడిగి, పూర్తిగా ఉడికించి మాత్రమే తినాలి.',
      'వేడిగా ఉన్నప్పుడే వండిన తాజా ఆహారాన్ని తినండి.'
    ],
    dailyHabits: [
      'Drink warm water or herbal tulsi-ginger decoction (kashayam) in the morning.',
      'Keep raw and cooked food strictly separated in the kitchen.',
      'Wash hands thoroughly with soap for 20 seconds before touching food.'
    ],
    teluguDailyHabits: [
      'ఉదయాన్నే తులసి, అల్లం వేసిన గోరువెచ్చని కషాయం త్రాగండి.',
      'వంటగదిలో ఆహార పాత్రలపై ఎల్లప్పుడూ మూతలు ఉంచండి.',
      'భోజనానికి ముందు చేతులను సబ్బుతో శుభ్రంగా కడుక్కోండి.'
    ]
  },
  winter: {
    id: 'winter',
    title: 'Winter Nutrition Handbook (అక్టోబర్ - ఫిబ్రవరి)',
    teluguTitle: 'శీతాకాల పోషకాహార మార్గదర్శి',
    seasonName: 'Winter',
    teluguSeasonName: 'శీతాకాలం',
    themeColor: 'blue',
    iconName: 'Snowflake',
    focus: 'Thermogenesis, healthy fats, joint nourishment, Vitamin D synthesis, and deep cellular energy.',
    teluguFocus: 'శరీర వెచ్చదనం, ఆరోగ్యకరమైన కొవ్వులు, కీళ్ల రక్షణ, విటమిన్ డి మరియు రోగనిరోధక శక్తి.',
    recommendedFoods: [
      { name: 'Sesame & Jaggery Laddoos', teluguName: 'నువ్వుల ఉండలు (చిమ్మిలి)', desc: 'Calcium, iron, and warming monounsaturated fats.' },
      { name: 'Bajra (Pearl Millet) Rotis', teluguName: 'సజ్జ రొట్టెలు', desc: 'Thermogenic slow-burning energy loaded with phosphorus.' },
      { name: 'Fresh Amla & Citrus', teluguName: 'ఉసిరికాయ & నారింజ', desc: 'Peak seasonal harvest protecting against dry skin and viral flu.' },
      { name: 'Methi (Fenugreek) & Mustard Greens', teluguName: 'మెంతికూర & ఆవాలు', desc: 'Rich in dietary fiber and warming chlorophyll.' },
      { name: 'Hot Turmeric Pepper Milk', teluguName: 'పసుపు పాలు (గోల్డెన్ మిల్క్)', desc: 'Curcumin absorption for joints and restful sleep.' }
    ],
    hydrationGuidance: 'Cold weather causes blood vessels to constrict, masking dehydration. Dry winter air robs moisture through breathing. Drink warm herbal infusions and soups to stay hydrated without feeling chilled.',
    teluguHydrationGuidance: 'చలికాలంలో చర్మం పొడిబారకుండా ఉండటానికి దాహం లేకపోయినా గోరువెచ్చని నీరు త్రాగాలి. వేడి సూప్‌లు మరియు హెర్బల్ టీలు మంచి ఎంపిక.',
    foodSafetyTips: [
      'Winter brings festive fried foods; balance treats with raw vegetable salads and fiber.',
      'Keep winter green vegetables dry in cotton bags to prevent fungal mildew from humidity.',
      'Ensure eggs and poultry are thoroughly cooked to internal safety temperatures.'
    ],
    teluguFoodSafetyTips: [
      'పండుగల వేపుడు పిండివంటలు తిన్నప్పుడు సమతుల్యత కోసం పీచు ఉండే కూరగాయలు కూడా తినండి.',
      'ఆకుకూరలు తేమ వల్ల కుళ్ళిపోకుండా పొడిగా ఉంచి భద్రపరచండి.',
      'ఆహారాన్ని సరిగ్గా ఉడికించి తినండి.'
    ],
    dailyHabits: [
      'Spend 20 minutes in mid-morning winter sunlight to synthesize vital Vitamin D.',
      'Consume a small piece of jaggery with roasted peanuts or sesame after lunch.',
      'Drink a warm glass of milk with a pinch of turmeric and black pepper before bed.'
    ],
    teluguDailyHabits: [
      'ఉదయం 10 గంటల ఎండలో 20 నిమిషాలు కూర్చుని విటమిన్ డి పొందండి.',
      'భోజనం తర్వాత చిన్న నువ్వుల ఉండ లేదా పల్లీ పట్టీ తినండి.',
      'పడుకునే ముందు పసుపు, మిరియాల పొడి వేసిన వేడి పాలు త్రాగండి.'
    ]
  }
};

// ========================================================
// 4. NUTRITION MYTH VS FACT (10 Evidence-Based Items)
// ========================================================
export const nutritionMyths = [
  {
    id: 'myth-skipping-meals',
    category: 'Weight & Metabolism',
    myth: 'Skipping meals (especially breakfast) is the fastest and healthiest way to lose weight.',
    teluguMyth: 'భోజనం మానేయడం (ముఖ్యంగా టిఫిన్ తినకపోవడం) బరువు తగ్గడానికి వేగవంతమైన మంచి మార్గం.',
    fact: 'Skipping meals slows resting metabolic rate and triggers evening binge eating of refined carbs.',
    teluguFact: 'భోజనం మానేస్తే జీవక్రియ మందగిస్తుంది మరియు సాయంత్రం ఆకలి ఎక్కువై అధికంగా తినే ప్రమాదం ఉంది.',
    explanation: 'When you starve the body, ghrelin (hunger hormone) spikes while thyroid metabolism down-regulates to conserve fat. Sustainable fat loss comes from eating portion-controlled, nutrient-dense meals with adequate protein.',
    teluguExplanation: 'భోజనం మానేయడం వల్ల శరీరం శక్తిని నిల్వ చేయడానికి కొవ్వును కరిగించడం ఆపేస్తుంది. సరైన సమయంలో సమతుల్య ఆహారం తినడమే బరువు తగ్గడానికి శాస్త్రీయ మార్గం.'
  },
  {
    id: 'myth-all-fats-bad',
    category: 'Fats & Lipids',
    myth: 'All dietary fats are bad for you and must be completely cut out for a healthy heart.',
    teluguMyth: 'కొవ్వులన్నీ హానికరం; గుండె ఆరోగ్యంగా ఉండాలంటే ఆహారంలో కొవ్వులను పూర్తిగా మానేయాలి.',
    fact: 'Healthy unsaturated fats are essential for brain function, hormone synthesis, and absorbing vitamins A, D, E, and K.',
    teluguFact: 'మంచి కొవ్వులు మెదడుకు, హార్మోన్ల సమతుల్యతకు మరియు విటమిన్లు ఎ, డి, ఇ, కె ఒంటపట్టడానికి అత్యవసరం.',
    explanation: 'Harmful fats are industrial trans-fats (found in hydrogenated bakery shortening and reused frying oil) and excessive saturated fats. Natural monounsaturated and omega-3 fats from groundnuts, sesame seeds, and fish protect cardiovascular vessels.',
    teluguExplanation: 'హానికరమైనవి కేవలం రీ-యూజ్డ్ నూనెలు మరియు బేకరీ ట్రాన్స్ ఫ్యాట్స్ మాత్రమే. పల్లీలు, నువ్వులు మరియు సహజ నూనెలలోని మంచి కొవ్వులు గుండెను రక్షిస్తాయి.'
  },
  {
    id: 'myth-zero-carbs',
    category: 'Carbohydrates',
    myth: 'Carbohydrates are the enemy of health and must be completely avoided.',
    teluguMyth: 'కార్బోహైడ్రేట్లు (పిండి పదార్థాలు) శరీరానికి శత్రువులు; వాటిని పూర్తిగా తినకూడదు.',
    fact: 'The problem is ultra-processed refined carbs, not fiber-rich whole grains and millets.',
    teluguFact: 'సమస్య ముడి ధాన్యాలతో కాదు, కేవలం మైదా, తెల్ల చక్కెర వంటి శుద్ధి చేసిన పిండి పదార్థాలతోనే.',
    explanation: 'The human brain and red blood cells rely on glucose as primary fuel. Whole grains (Ragi, Jowar, brown rice) and tubers deliver glucose packaged alongside vital B-vitamins and prebiotic fiber that nourishes the gut barrier.',
    teluguExplanation: 'మెదడు మరియు ఎర్ర రక్త కణాలు పనిచేయడానికి గ్లూకోజ్ ప్రాథమిక ఇంధనం. ముడి ధాన్యాలు మరియు చిరుధాన్యాల నుండి వచ్చే కార్బోహైడ్రేట్లు శరీరానికి స్థిరమైన శక్తినిస్తాయి.'
  },
  {
    id: 'myth-more-supplements-better',
    category: 'Supplements',
    myth: 'Taking high-dose multivitamin pills is always safe and replaces the need for fresh fruits and vegetables.',
    teluguMyth: 'మల్టీవిటమిన్ మాత్రలు ఎంత ఎక్కువ వేసుకుంటే అంత మంచిది; అవి పండ్లు, కూరగాయలకు ప్రత్యామ్నాయం.',
    fact: 'Mega-dosing fat-soluble vitamins (A, D, E, K) can cause severe toxicity, and pills lack the complex food matrix.',
    teluguFact: 'విటమిన్ మాత్రలు అతిగా వాడితే కాలేయానికి విషపూరితం కావచ్చు; పండ్లలోని ఫైబర్, యాంటీఆక్సిడెంట్లను మాత్రలు భర్తీ చేయలేవు.',
    explanation: 'Whole foods provide hundreds of synergistic phytonutrients that work together. Fat-soluble vitamins build up in liver tissue when over-supplemented, potentially leading to hypervitaminosis.',
    teluguExplanation: 'సహజ ఆహారంలోని విటమిన్లు శరీరం సురక్షితంగా గ్రహిస్తుంది. వైద్యుల సిఫార్సు లేకుండా అధిక మోతాదులో సప్లిమెంట్లు వేసుకోవడం క్షేమకరం కాదు.'
  },
  {
    id: 'myth-fruit-at-night',
    category: 'Food Timing',
    myth: 'Eating fruit after sunset turns immediately into belly fat and should be completely avoided.',
    teluguMyth: 'సూర్యాస్తమయం తర్వాత పండ్లు తింటే అవి వెంటనే కొవ్వుగా మారుతాయి.',
    fact: 'The human body digests and burns calories the exact same way at night as during the day.',
    teluguFact: 'శరీర జీర్ణవ్యవస్థ పగలు, రాత్రి ఒకే విధంగా పనిచేస్తుంది; పండ్ల వల్ల రాత్రికి రాత్రే కొవ్వు పెరగదు.',
    explanation: 'A piece of whole fruit at night is infinitely healthier than cookies, chips, or fried namkeen. While individuals with severe acid reflux may avoid acidic citrus right before bed, fruit calories do not magically behave differently after dark.',
    teluguExplanation: 'రాత్రిపూట బిస్కెట్లు, చిప్స్ తినడం కంటే ఒక పండు తినడం ఎంతో మేలు. పండ్లలోని క్యాలరీలు రాత్రి వేళ అదనపు కొవ్వుగా మారవు.'
  },
  {
    id: 'myth-brown-sugar-healthy',
    category: 'Sugars',
    myth: 'Brown sugar and raw honey can be consumed in unlimited quantities because they are 100% healthy.',
    teluguMyth: 'బ్రౌన్ షుగర్ లేదా తేనె ఎంత తిన్నా పర్వాలేదు, ఎందుకంటే వాటి వల్ల ఎలాంటి హానీ జరగదు.',
    fact: 'Brown sugar and honey have almost the exact same glycemic impact and calories as white sugar.',
    teluguFact: 'బ్రౌన్ షుగర్, తేనె మరియు తెల్ల చక్కెర అన్నీ రక్తంలో గ్లూకోజ్ స్థాయిలను సమానంగా పెంచుతాయి.',
    explanation: 'While raw honey and jaggery contain trace minerals absent in bleached white sugar, they are still 85% to 95% simple sucrose and fructose. They impact insulin and blood sugar similarly and must be used with conscious moderation.',
    teluguExplanation: 'బెల్లం లేదా తేనెలో స్వల్పంగా ఖనిజాలు ఉన్నప్పటికీ, అవి కూడా రక్తంలో చక్కెరను పెంచుతాయి. మధుమేహం ఉన్నవారు వీటిని కూడా మితంగానే తీసుకోవాలి.'
  },
  {
    id: 'myth-water-replaces-diet',
    category: 'Hydration',
    myth: 'Drinking 6 liters of water daily detoxifies the body and can make up for an unhealthy diet.',
    teluguMyth: 'రోజుకు 6 లీటర్ల నీరు త్రాగితే శరీరం డీటాక్స్ అవుతుంది, చెడు ఆహారం తిన్నా నష్టం ఉండదు.',
    fact: 'Excessive water intake does not replace balanced nutrition and can dangerously dilute blood sodium (hyponatremia).',
    teluguFact: 'అతిగా నీరు త్రాగడం వల్ల రక్తంలో సోడియం తగ్గి ప్రమాదం జరుగుతుంది; నీరు సమతుల్య ఆహారాన్ని భర్తీ చేయలేదు.',
    explanation: 'The liver and kidneys handle natural detoxification effortlessly when provided with proper micronutrients. Over-drinking water forces the kidneys to overwork and can dilute critical blood electrolytes.',
    teluguExplanation: 'శరీరానికి రోజుకు 2.5 నుండి 3 లీటర్ల నీరు సరిపోతుంది. అంతకంటే ఎక్కువగా బలవంతంగా త్రాగడం వల్ల కిడ్నీలపై భారం పడుతుంది.'
  },
  {
    id: 'myth-protein-for-athletes-only',
    category: 'Protein',
    myth: 'Protein is only necessary for muscular bodybuilders, gym-goers, and elite athletes.',
    teluguMyth: 'ప్రోటీన్ కేవలం జిమ్ చేసే బాడీబిల్డర్లకు మరియు క్రీడాకారులకు మాత్రమే అవసరం.',
    fact: 'Every human—especially growing children, homemakers, and elderly adults—requires daily protein for immunity and cellular repair.',
    teluguFact: 'ప్రతి ఒక్కరికీ—ముఖ్యంగా వృద్ధులు, మహిళలు మరియు పిల్లలకు రోగనిరోధక శక్తి మరియు కండరాల కోసం ప్రోటీన్ అవసరం.',
    explanation: 'Elderly individuals lose 1% to 2% of muscle mass annually (sarcopenia) without adequate protein. Homemakers and students need protein just as much as athletes to maintain bone integrity and enzyme synthesis.',
    teluguExplanation: 'వృద్ధాప్యంలో కండరాలు క్షీణించకుండా ఉండటానికి, మహిళల్లో నీరసం రాకుండా ఉండటానికి రోజూ పప్పులు, గుడ్లు లేదా మొలకల ద్వారా ప్రోటీన్ అవసరం.'
  },
  {
    id: 'myth-tired-means-deficiency',
    category: 'Deficiency Signs',
    myth: 'Every feeling of daytime tiredness is guaranteed to be a vitamin deficiency.',
    teluguMyth: 'పగటిపూట అలసటగా అనిపించిన ప్రతిసారీ కచ్చితంగా విటమిన్ లోపమే కారణం.',
    fact: 'Fatigue can stem from inadequate sleep, chronic dehydration, emotional stress, or metabolic imbalance.',
    teluguFact: 'అలసటకు తగినంత నిద్ర లేకపోవడం, నీరు త్రాగకపోవడం, ఒత్తిడి లేదా ఇతర ఆరోగ్య సమస్యలు కారణం కావచ్చు.',
    explanation: 'While iron or B12 gaps certainly cause lethargy, poor sleep quality, chronic dehydration, and lack of physical movement are equally frequent triggers. Always assess lifestyle before assuming a medical deficiency.',
    teluguExplanation: 'విటమిన్ లోపం ఒక కారణం కావచ్చినప్పటికీ, తక్కువ నిద్ర మరియు మానసిక ఒత్తిడి కూడా ప్రధాన కారణాలు. జీవనశైలిని సరిచేసుకుని, అవసరమైతే వైద్యుడిని సంప్రదించాలి.'
  },
  {
    id: 'myth-natural-means-unlimited',
    category: 'Herbal & Natural',
    myth: 'Because something is natural or herbal, it is automatically 100% safe to consume in unlimited amounts.',
    teluguMyth: 'ఆయుర్వేద లేదా సహజ మూలికలు ఏవైనా సరే ఎంత మోతాదులో తీసుకున్నా ఎప్పటికీ హానికరం కాదు.',
    fact: 'Even natural substances contain potent active biochemical compounds that can overload the liver and kidneys in excess.',
    teluguFact: 'సహజ పదార్థాలలో కూడా క్రియాశీల రసాయనాలు ఉంటాయి; అతిగా తీసుకుంటే కాలేయం మరియు మూత్రపిండాలపై ప్రభావం చూపుతాయి.',
    explanation: 'Everything in biology follows Paracelsus’s rule: "The dose makes the poison." Consuming excessive raw fenugreek, bitter gourd juice, or herbal decoctions without dosage guidance can alter blood pressure or irritate digestive linings.',
    teluguExplanation: 'ఏదైనా సరే మితంగా తీసుకున్నప్పుడే అమృతం. మోతాదు మించితే సహజ పదార్థాలు కూడా జీర్ణవ్యవస్థపై మరియు అవయవాలపై ప్రతికూల ప్రభావం చూపుతాయి.'
  }
];

// ========================================================
// 5. HEALTHY DAILY HABITS (8 Practical Action Habits)
// ========================================================
export const healthyHabits = [
  {
    id: 'habit-1',
    number: '01',
    title: 'The Half-Plate Vegetable Rule',
    teluguTitle: 'సగం ప్లేట్ కూరగాయల నియమం',
    explanation: 'Make half of your lunch and dinner plate fresh seasonal vegetables, dark leafy greens, or cucumber salad.',
    teluguExplanation: 'మధ్యాహ్న మరియు రాత్రి భోజనంలో సగం భాగం తాజా కూరగాయలు, ఆకుకూరలు లేదా సలాడ్‌తో నింపండి.',
    action: 'Place raw cucumber and carrot slices on your plate before serving rice or rotis.',
    teluguAction: 'అన్నం వడ్డించుకునే ముందే ప్లేట్‌లో దోసకాయ, క్యారెట్ ముక్కలను ఉంచుకోండి.'
  },
  {
    id: 'habit-2',
    number: '02',
    title: 'Include Protein in Every Meal',
    teluguTitle: 'ప్రతి భోజనంలో ప్రోటీన్ చేర్చడం',
    explanation: 'Avoid carbohydrate-only meals. Balance grains with lentils, boiled eggs, curd, sprouts, or paneer.',
    teluguExplanation: 'కేవలం అన్నం మాత్రమే తినకుండా పప్పు, ఉడకబెట్టిన గుడ్డు, పెరుగు లేదా మొలకలను జతచేయండి.',
    action: 'Add a boiled egg or a cup of fresh sprouted moong to your daily breakfast.',
    teluguAction: 'రోజూ ఉదయం అల్పాహారంతో పాటు ఒక ఉడకబెట్టిన గుడ్డు లేదా మొలకలను తినండి.'
  },
  {
    id: 'habit-3',
    number: '03',
    title: 'Adopt Regional Millets Twice a Week',
    teluguTitle: 'వారంలో రెండుసార్లు చిరుధాన్యాలు',
    explanation: 'Swap polished white rice for whole finger millet (Ragi), jowar, or foxtail millet to boost calcium and fiber.',
    teluguExplanation: 'తెల్ల బియ్యానికి బదులుగా రాగులు, జొన్నలు లేదా కొర్రలను వారంలో కనీసం రెండుసార్లు వాడండి.',
    action: 'Prepare a warm morning glass of ragi malt or substitute dinner with two jowar rotis.',
    teluguAction: 'ఉదయాన్నే రాగి జావ లేదా రాత్రి వేళ రెండు జొన్న రొట్టెలు తినడం ప్రారంభించండి.'
  },
  {
    id: 'habit-4',
    number: '04',
    title: 'Mindful Daily Hydration',
    teluguTitle: 'క్రమం తప్పకుండా నీరు త్రాగడం',
    explanation: 'Drink 2.5 to 3 liters of clean drinking water daily to transport water-soluble vitamins and flush renal wastes.',
    teluguExplanation: 'విటమిన్లు శరీరమంతటా చేరడానికి మరియు వ్యర్థాలను తొలగించడానికి రోజుకు 2.5 నుండి 3 లీటర్ల నీరు త్రాగండి.',
    action: 'Keep a 1-liter reusable bottle by your work or study desk and finish three refills throughout the day.',
    teluguAction: 'మీ బల్లపై ఒక లీటర్ నీళ్ళ సీసాను ఉంచి, రోజుకు 3 సార్లు నింపి త్రాగండి.'
  },
  {
    id: 'habit-5',
    number: '05',
    title: 'Inspect Packaged Nutrition Labels',
    teluguTitle: 'ప్యాకెట్ న్యూట్రిషన్ లేబుల్స్ చదవడం',
    explanation: 'Never trust front-panel health marketing claims alone. Check serving size, added sugars, and sodium per serving.',
    teluguExplanation: 'ప్యాకెట్ ముందు ఉండే ప్రకటనలను నమ్మకండి. వెనుక ఉండే చక్కెర, ఉప్పు మరియు క్యాలరీల వివరాలు చూడండి.',
    action: 'Use the NutriVita Label Lens camera scanner before purchasing commercial packaged snacks.',
    teluguAction: 'స్నాక్స్ కొనే ముందు న్యూట్రివిటా లేబుల్ లెన్స్ ద్వారా స్కాన్ చేసి నాణ్యతను తనిఖీ చేయండి.'
  },
  {
    id: 'habit-6',
    number: '06',
    title: 'Limit Deep-Fried Snacks and Sugary Drinks',
    teluguTitle: 'వేపుళ్ళు & శీతల పానీయాలు తగ్గించడం',
    explanation: 'Commercial deep-fried items contain reused industrial fats that trigger arterial inflammation.',
    teluguExplanation: 'బయటి వేపుడు తినుబండారాలలో ఉండే చెడు నూనెలు గుండె మరియు రక్తనాళాలకు హానికరం.',
    action: 'Replace packaged chips and cola with roasted peanuts and spiced homemade buttermilk (Majjiga).',
    teluguAction: 'చిప్స్, కూల్‌డ్రింక్స్‌కు బదులుగా వేయించిన పల్లీలు మరియు తాజా మజ్జిగను ఎంచుకోండి.'
  },
  {
    id: 'habit-7',
    number: '07',
    title: 'Maintain Consistent Meal Timings',
    teluguTitle: 'నిర్దిష్ట సమయానికి భోజనం చేయడం',
    explanation: 'Eating at regular predictable hours synchronizes your circadian metabolic clocks and prevents acid reflux.',
    teluguExplanation: 'రోజూ ఒకే సమయానికి తినడం వల్ల జీర్ణక్రియ సజావుగా సాగుతుంది మరియు గ్యాస్ రాకుండా ఉంటుంది.',
    action: 'Eat dinner at least 2 hours before bedtime to allow optimal gastrointestinal digestion.',
    teluguAction: 'పడుకోవడానికి కనీసం 2 గంటల ముందే రాత్రి భోజనం ముగించండి.'
  },
  {
    id: 'habit-8',
    number: '08',
    title: 'Combine Nutrition with Morning Sunlight',
    teluguTitle: 'ఉదయపు ఎండ & నడక అలవాటు',
    explanation: 'Nutrition and physical activity are partners. Morning sunlight triggers endogenous Vitamin D production.',
    teluguExplanation: 'ఆహారంతో పాటు శారీరక శ్రమ ముఖ్యం. ఉదయపు సూర్యరశ్మి ద్వారా సహజ విటమిన్ డి లభిస్తుంది.',
    action: 'Take a 20-minute brisk walk outdoors between 8:30 AM and 10:30 AM with uncovered arms.',
    teluguAction: 'ఉదయం పూట 20 నిమిషాలు ఎండలో నడవడం అలవాటు చేసుకోండి.'
  }
];

// ========================================================
// 6. COMMUNITY NUTRITION ACTIONS (7 Action Blueprints)
// ========================================================
export const communityActions = [
  {
    id: 'action-1',
    name: 'Village & Ward Nutrition Awareness Camp',
    teluguName: 'గ్రామ & వార్డు పోషకాహార అవగాహన సదస్సు',
    targetAudience: 'Families, Homemakers, and Elders',
    teluguTargetAudience: 'కుటుంబాలు, మహిళలు మరియు పెద్దలు',
    purpose: 'Educate local households on affordable balanced diets, early deficiency signs, and local superfoods.',
    teluguPurpose: 'చవకైన సమతుల్య ఆహారం, విటమిన్ లోప సంకేతాలు మరియు స్థానిక పోషక నిధులపై అవగాహన కల్పించడం.',
    howToConduct: 'Organize a 2-hour interactive community hall meeting with chart displays, whole-food exhibits, and Q&A.',
    teluguHowToConduct: 'కమ్యూనిటీ హాల్‌లో చార్టులు, స్థానిక ఆహార ప్రదర్శన మరియు చర్చా వేదికను ఏర్పాటు చేయడం.',
    expectedBenefit: 'Reduces reliance on expensive packaged foods and increases moringa and millet consumption in households.'
  },
  {
    id: 'action-2',
    name: 'School & College Food Literacy Workshop',
    teluguName: 'పాఠశాల & కళాశాల ఆహార అక్షరాస్యత వర్క్‌షాప్',
    targetAudience: 'Students (Grades 6–12 & College Youths)',
    teluguTargetAudience: 'పాఠశాల మరియు కళాశాల విద్యార్థులు',
    purpose: 'Empower students to reject ultra-processed junk snacks and understand nutrition labels.',
    teluguPurpose: 'విద్యార్థులు జంక్ ఫుడ్‌ను తిరస్కరించి, ప్యాకెట్ లేబుల్స్ చదవడం నేర్చుకునేలా ప్రోత్సహించడం.',
    howToConduct: 'Conduct a live label-reading demo using empty chip bags and sodas alongside healthy snack alternatives.',
    teluguHowToConduct: 'ఖాళీ చిప్స్ ప్యాకెట్లను చూపిస్తూ దాగి ఉన్న ఉప్పు, చక్కెరలను గుర్తించే ప్రయోగాత్మక ప్రదర్శన.',
    expectedBenefit: 'Builds lifelong consumer literacy, preventing youth obesity and dental caries.'
  },
  {
    id: 'action-3',
    name: 'Local Superfood Recipe & Cooking Demonstration',
    teluguName: 'స్థానిక సూపర్ ఫుడ్ వంటల ప్రత్యక్ష ప్రదర్శన',
    targetAudience: 'Community Cooks & Self-Help Groups (SHGs)',
    teluguTargetAudience: 'స్వయం సహాయక సంఘాలు (SHG) మరియు వంట చేసేవారు',
    purpose: 'Demonstrate traditional nutrient-dense recipes like Ragi Ambali, Drumstick leaf stir-fries, and Sprout salads.',
    teluguPurpose: 'రాగి జావ, మునగాకు వేపుడు, మొలకల సలాడ్ వంటి బలవర్ధక వంటకాలను సులభంగా తయారుచేయడం నేర్పించడం.',
    howToConduct: 'Hold a live demonstration in an anganwadi center or village square with recipe tasting samples.',
    teluguHowToConduct: 'అంగన్‌వాడీ కేంద్రంలో ప్రత్యక్ష వంట ప్రదర్శన మరియు రుచి చూసే అవకాశాన్ని కల్పించడం.',
    expectedBenefit: 'Bridges the gap between nutrition theory and daily home cooking practices.'
  },
  {
    id: 'action-4',
    name: 'Balanced Plate Visual Demonstration Drive',
    teluguName: 'సమతుల్య భోజన ప్లేట్ (50:25:25) ప్రదర్శన',
    targetAudience: 'General Public, Parents, and Youth',
    teluguTargetAudience: 'ప్రజలు, తల్లిదండ్రులు మరియు యువత',
    purpose: 'Teach the visual 50:25:25 plate rule using actual steel plates and real raw vegetables and grains.',
    teluguPurpose: 'స్టీల్ ప్లేట్లలో కూరగాయలు, ధాన్యాలు, పప్పులను ఉంచి కంటికి కనిపించేలా సమతుల్యతను వివరించడం.',
    howToConduct: 'Set up an interactive booth at local weekly markets (shandies) where people assemble mock plates.',
    teluguHowToConduct: 'రైతు బజార్లు లేదా సంతలలో ఒక చిన్న స్టాల్‌ను ఏర్పాటు చేసి ప్లేట్ సమతుల్యతను వివరించడం.',
    expectedBenefit: 'Simplifies complex nutrition science into an unmistakable daily habit.'
  },
  {
    id: 'action-5',
    name: 'Packaged Food Label Reading Campaign',
    teluguName: 'ప్యాకేజ్డ్ ఫుడ్ లేబుల్ రీడింగ్ ప్రచారం',
    targetAudience: 'Shoppers, Youth, and Consumers',
    teluguTargetAudience: 'షాపింగ్ చేసేవారు, యువత మరియు వినియోగదారులు',
    purpose: 'Expose misleading front-of-package claims and train consumers on sodium and sugar thresholds.',
    teluguPurpose: 'ప్యాకెట్ల ముందు ఉండే ప్రకటనల మాయాజాలాన్ని వివరిస్తూ, ఉప్పు-చక్కెర పరిమితులను నేర్పించడం.',
    howToConduct: 'Distribute a 1-page pocket guideline flyer outside local supermarkets and neighborhood kirana stores.',
    teluguHowToConduct: 'కిరాణా దుకాణాలు మరియు సూపర్ మార్కెట్ల వద్ద చిన్న కరపత్రాల ద్వారా అవగాహన కల్పించడం.',
    expectedBenefit: 'Shifts community purchasing power toward healthier regional staples.'
  },
  {
    id: 'action-6',
    name: 'Women & Adolescent Anemia Awareness Drive',
    teluguName: 'మహిళలు & కిశోర బాలికల రక్తహీనత నివారణ డ్రైవ్',
    targetAudience: 'Adolescent Girls, Pregnant & Nursing Mothers',
    teluguTargetAudience: 'కిశోర బాలికలు, గర్భిణులు మరియు బాలింతలు',
    purpose: 'Spread awareness about iron-rich foods, Vitamin C synergy, and the importance of cast-iron cookware.',
    teluguPurpose: 'ఐరన్ ఆహారాలు, నిమ్మరసం ప్రభావం మరియు ఇనుప పాత్రలలో వంట చేయడంపై సమగ్ర అవగాహన.',
    howToConduct: 'Partner with local healthcare workers (ASHA/Anganwadi) to conduct peer-learning discussions.',
    teluguHowToConduct: 'ఆశా కార్యకర్తలు మరియు అంగన్‌వాడీ టీచర్లతో కలిసి చిన్న గ్రూప్ చర్చలను నిర్వహించడం.',
    expectedBenefit: 'Addresses the high regional prevalence of maternal and adolescent anemia at the grassroots.'
  },
  {
    id: 'action-7',
    name: 'Traditional Seasonal Millets Showcase',
    teluguName: 'సాంప్రదాయ చిరుధాన్యాల పునరుజ్జీవన ప్రచారం',
    targetAudience: 'Farmers, Households, and Urban Dwellers',
    teluguTargetAudience: 'రైతులు, పట్టణ ప్రజలు మరియు కుటుంబాలు',
    purpose: 'Revitalize climate-smart indigenous millets (Ragi, Jowar, Bajra, Korralu) in everyday urban and rural diets.',
    teluguPurpose: 'తక్కువ నీటితో పండే పోషక నిధులైన చిరుధాన్యాల వినియోగాన్ని పునరుద్ధరించడం.',
    howToConduct: 'Host a community millet festival with millet snacks, grain identification booths, and farmer interactions.',
    teluguHowToConduct: 'చిరుధాన్యాల ప్రదర్శన, వంటకాల పంపిణీ మరియు రైతులతో చర్చా సదస్సును ఏర్పాటు చేయడం.',
    expectedBenefit: 'Supports ecological agriculture while building community resilience against diabetes.'
  }
];

// ========================================================
// 7. EDUCATIONAL DISCLAIMER CONSTANTS
// ========================================================
export const DISCLAIMER_EN = "This Nutrition Awareness Hub provides educational information for preventive wellness. It does not provide medical diagnosis, treatment, or clinical advice.";
export const DISCLAIMER_TE = "ఈ పోషకాహార అవగాహన వేదిక నివారణ ఆరోగ్యం కోసం విద్యా సమాచారాన్ని మాత్రమే అందిస్తుంది. ఇది వైద్య నిర్ధారణ లేదా చికిత్సను అందించదు.";

// ========================================================
// 8. UTILITY & FILTERING HELPERS
// ========================================================
export const filterArticles = (articles = [], category = 'All', searchQuery = '') => {
  const query = (searchQuery || '').trim().toLowerCase();
  return articles.filter((article) => {
    const matchesCategory =
      !category || category === 'All' || article.category.toLowerCase() === category.toLowerCase();
    if (!matchesCategory) return false;
    if (!query) return true;
    return (
      article.title.toLowerCase().includes(query) ||
      (article.teluguTitle && article.teluguTitle.toLowerCase().includes(query)) ||
      article.shortDescription.toLowerCase().includes(query) ||
      (article.teluguDescription && article.teluguDescription.toLowerCase().includes(query)) ||
      article.category.toLowerCase().includes(query) ||
      (article.content && article.content.toLowerCase().includes(query))
    );
  });
};

export const filterSuperfoods = (foods = [], searchQuery = '') => {
  const query = (searchQuery || '').trim().toLowerCase();
  if (!query) return foods;
  return foods.filter((food) => {
    const nutrientsStr = Array.isArray(food.nutrients)
      ? food.nutrients.join(', ')
      : (food.nutrients || '');
    return (
      food.name.toLowerCase().includes(query) ||
      (food.teluguName && food.teluguName.toLowerCase().includes(query)) ||
      food.category.toLowerCase().includes(query) ||
      nutrientsStr.toLowerCase().includes(query) ||
      (food.benefits && food.benefits.toLowerCase().includes(query)) ||
      (food.teluguBenefits && food.teluguBenefits.toLowerCase().includes(query))
    );
  });
};

export const filterMyths = (myths = [], searchQuery = '') => {
  const query = (searchQuery || '').trim().toLowerCase();
  if (!query) return myths;
  return myths.filter((item) => {
    return (
      item.myth.toLowerCase().includes(query) ||
      (item.teluguMyth && item.teluguMyth.toLowerCase().includes(query)) ||
      item.fact.toLowerCase().includes(query) ||
      (item.teluguFact && item.teluguFact.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.explanation && item.explanation.toLowerCase().includes(query))
    );
  });
};

export const validateCommunityPlan = ({ title, targetAudience, date, organizer, steps } = {}) => {
  const errors = {};
  if (!title || !title.trim()) {
    errors.title = 'Activity title is required.';
  }
  if (!targetAudience || !targetAudience.trim()) {
    errors.targetAudience = 'Please select a target community.';
  }
  if (!date || !date.trim()) {
    errors.date = 'Target date is required.';
  }
  if (!organizer || !organizer.trim()) {
    errors.organizer = 'Lead organizer / team name is required.';
  }
  if (!steps || !steps.trim()) {
    errors.steps = 'Please enter objectives and activity steps.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const createCommunityPlan = (data = {}) => {
  const validation = validateCommunityPlan(data);
  if (!validation.isValid) {
    throw new Error('Validation failed for community plan: ' + Object.values(validation.errors).join(', '));
  }
  return {
    id: `plan-${Date.now()}`,
    title: data.title.trim(),
    targetAudience: data.targetAudience.trim(),
    date: data.date.trim(),
    organizer: data.organizer.trim(),
    steps: data.steps.trim(),
    createdAt: new Date().toISOString()
  };
};
