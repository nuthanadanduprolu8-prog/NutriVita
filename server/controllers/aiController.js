import { foodsData } from '../data/foodsData.js';
import { vitaminsData } from '../data/vitaminsData.js';

// Medical disclaimer strings
const CSP_DISCLAIMER_EN = 'Note: NutriVita provides preventive nutrition guidance for community health education and dietary awareness. This information is not a medical diagnosis or treatment plan. For persistent, severe, or unexplained symptoms, please consult a qualified healthcare professional.';
const CSP_DISCLAIMER_TE = 'గమనిక: న్యూట్రివిటా నివారణ పోషకాహార అవగాహన మరియు కమ్యూనిటీ ఆరోగ్య విద్యను మాత్రమే అందిస్తుంది. ఇది వైద్య నిర్ధారణ లేదా చికిత్స కాదు. తీవ్రమైన లేదా దీర్ఘకాలిక సమస్యల కోసం దయచేసి అర్హత కలిగిన వైద్యులను సంప్రదించండి.';

// Helper to check if text contains Telugu unicode characters
const isTeluguText = (text = '') => {
  return /[\u0C00-\u0C7F]/.test(text);
};

// Normalize query tokens
const tokenize = (text = '') => {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0C00-\u0C7F]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
};

// Deterministic Clinical & Preventive Nutrition Rule Engine
const generateDeterministicResponse = (userMessage, language = 'en', userProfile = {}) => {
  const isTelugu = language === 'te' || isTeluguText(userMessage);
  const qLower = userMessage.toLowerCase();
  const tokens = tokenize(userMessage);

  let responseText = '';
  let relatedFoods = [];
  let relatedVitamins = [];
  let suggestedFollowUps = [];

  // Helper to find food by id or name
  const findFood = (id) => foodsData.find(f => f.id === id);
  const findVitamin = (id) => vitaminsData.find(v => v.vitaminId === id);

  // 1. SYMPTOM / DEFICIENCY PHYSICAL SIGNS
  // Anemia / Fatigue / Weakness / Pale skin
  if (
    qLower.includes('fatigue') || qLower.includes('tired') || qLower.includes('weakness') ||
    qLower.includes('anemia') || qLower.includes('haemoglobin') || qLower.includes('hemoglobin') ||
    qLower.includes('అలసట') || qLower.includes('నీరసం') || qLower.includes('రక్తహీనత')
  ) {
    relatedVitamins = [findVitamin('mineral-iron'), findVitamin('vitamin-b12'), findVitamin('vitamin-b9')].filter(Boolean);
    relatedFoods = [findFood('drumstick_leaves'), findFood('spinach'), findFood('amla'), findFood('lentils'), findFood('ragi')].filter(Boolean);

    if (isTelugu) {
      responseText = `### అలసట, నీరసం మరియు రక్తహీనత నివారణ పోషకాహారం\n\n` +
        `శరీరంలో అలసట, బలహీనత లేదా త్వరగా ఆయాసం రావడం అనేది తరచుగా **ఐరన్ (Iron)**, **విటమిన్ B12**, లేదా **ఫోలేట్ (Folate/B9)** లోపంతో ముడిపడి ఉంటుంది. ఇవి ఎర్ర రక్త కణాల తయారీకి మరియు శరీర భాగాలకు ఆక్సిజన్ చేరవేయడానికి చాలా ముఖ్యం.\n\n` +
        `#### తీసుకోవాల్సిన సహజ ఆహారాలు:\n` +
        `* **మునగాకు (Moringa Leaves):** అత్యంత సమృద్ధిగా ఐరన్ లభించే సహజ ఆకుకూర.\n` +
        `* **పాలకూర & తోటకూర:** సహజ ఐరన్ మరియు ఫోలిక్ యాసిడ్ నిధి.\n` +
        `* **ఉసిరి (Amla) లేదా నిమ్మరసం:** ఐరన్ ఉన్న ఆహారాలతో పాటు విటమిన్ సి తీసుకుంటే శరీరంలో ఐరన్ శోషణ 300% పెరుగుతుంది!\n` +
        `* **రాగులు & కాయధాన్యాలు (Toor Dal, Chickpeas):** రోజువారీ హిమోగ్లోబిన్ అభివృద్ధికి ఉత్తమం.\n\n` +
        `> **ముఖ్య పోషక నియమం:** భోజనం చేసిన వెంటనే టీ లేదా కాఫీ తాగకండి; వాటిలోని టానిన్లు ఐరన్ శోషణను అడ్డుకుంటాయి.\n\n` +
        `*${CSP_DISCLAIMER_TE}*`;
      suggestedFollowUps = [
        'శాకాహారులకు విటమిన్ B12 ఎలా లభిస్తుంది?',
        'ఐరన్ శోషణకు విటమిన్ సి ఎలా సహాయపడుతుంది?',
        'మునగాకులోని పోషక విలువలు ఏమిటి?'
      ];
    } else {
      responseText = `### Nutrition Guidance for Fatigue, Energy, and Anemia Prevention\n\n` +
        `Feelings of constant fatigue, lethargy, or weakness are frequently associated with low **Iron**, **Vitamin B12**, or **Folate (B9)** intake, which are critical for healthy red blood cell synthesis and oxygen delivery throughout the body.\n\n` +
        `#### Key Whole Foods to Emphasize:\n` +
        `* **Moringa / Drumstick Leaves:** One of nature's richest plant-based iron and beta-carotene powerhouses.\n` +
        `* **Spinach (Palak) & Leafy Greens:** Rich in non-heme iron and essential folate.\n` +
        `* **Indian Gooseberry (Amla) & Citrus:** Vitamin C boosts plant-iron absorption by up to 300%!\n` +
        `* **Finger Millet (Ragi) & Cooked Lentils/Dal:** Exceptional mineral density for steady vitality.\n\n` +
        `> **Synergy Tip:** Avoid drinking black tea or coffee within 1 hour of meals, as tannins and polyphenols significantly inhibit iron uptake.\n\n` +
        `*${CSP_DISCLAIMER_EN}*`;
      suggestedFollowUps = [
        'How can vegetarians get sufficient Vitamin B12?',
        'What foods have the highest iron and Vitamin C synergy?',
        'Can you generate a balanced high-iron meal plan?'
      ];
    }
  }

  // Nutrient Synergy & Absorption Question
  else if (
    qLower.includes('synergy') || qLower.includes('pair') || qLower.includes('absorption') ||
    (qLower.includes('iron') && (qLower.includes('vitamin c') || qLower.includes('vit c'))) ||
    (qLower.includes('ఐరన్') && qLower.includes('విటమిన్ సి')) ||
    qLower.includes('సమన్వయం') || qLower.includes('శోషణ')
  ) {
    relatedVitamins = [findVitamin('mineral-iron'), findVitamin('vitamin-c'), findVitamin('mineral-calcium'), findVitamin('vitamin-d')].filter(Boolean);
    relatedFoods = [findFood('amla'), findFood('spinach'), findFood('curd'), findFood('ragi')].filter(Boolean);

    if (isTelugu) {
      responseText = `### పోషకాల సహకారం (Nutrient Synergy) & శోషణ అంటే ఏమిటి?\n\n` +
        `ఒకే పోషకాన్ని విడిగా తీసుకోవడం కంటే, సరైన ఇతర పోషకాలతో జతచేసి తీసుకున్నప్పుడు శరీరం వాటిని మరింత సమర్థవంతంగా శోషించుకుంటుంది:\n\n` +
        `* **ఐరన్ + విటమిన్ సి (Iron + Vitamin C Synergy):** పాలకూర లేదా పప్పు తిన్నప్పుడు నిమ్మరసం లేదా ఉసిరి తీసుకుంటే నాన్-హీమ్ ఐరన్ శోషణ 300% పెరుగుతుంది.\n` +
        `* **కాల్షియం + విటమిన్ డి (Calcium + Vitamin D):** విటమిన్ డి సహాయం లేకుండా ప్రేగులు కాల్షియంను రక్తంలోకి తీసుకోలేవు.\n` +
        `* **విటమిన్ ఎ/డి/ఇ/కె + ఆరోగ్యకరమైన కొవ్వులు:** కొవ్వులో కరిగే విటమిన్లను కొద్దిగా నెయ్యి లేదా నూనెతో వండినప్పుడే శరీరానికి అందుతాయి.\n` +
        `* **పసుపు + మిరియాలు (Curcumin + Piperine):** నల్ల మిరియాలలోని పైప్రిన్ పసుపులోని కర్కుమిన్ శోషణను 2000% పెంచుతుంది.\n\n` +
        `*${CSP_DISCLAIMER_TE}*`;
      suggestedFollowUps = [
        'ఐరన్ శోషణను అడ్డుకునే ఆహారాలు ఏవి?',
        'విటమిన్ డి మరియు కాల్షియంల సంబంధం ఏమిటి?',
        'కొవ్వులో కరిగే విటమిన్లు ఏవి?'
      ];
    } else {
      responseText = `### The Science of Nutrient Synergy & Bioavailability\n\n` +
        `Nutrients work as collaborative biochemical teams rather than isolated compounds. Pairing complementary foods elevates absorption dramatically:\n\n` +
        `* **Iron + Vitamin C Synergy:** Non-heme plant iron is converted to the more soluble, absorbable ferrous state in the presence of ascorbic acid (Vitamin C), boosting absorption by up to 300%!\n` +
        `* **Calcium + Vitamin D:** Vitamin D stimulates active calcium-binding transport proteins across the intestinal brush border.\n` +
        `* **Carotenoids (Vit A/E) + Healthy Lipids:** Fat-soluble vitamins require lipid micelles to cross the gut wall; always sauté greens in cold-pressed oil, seeds, or a teaspoon of ghee.\n` +
        `* **Turmeric + Black Pepper:** Piperine in black pepper amplifies curcumin bioavailability by over 2000%!\n\n` +
        `*${CSP_DISCLAIMER_EN}*`;
      suggestedFollowUps = [
        'What foods block nutrient absorption?',
        'How does Vitamin D activate Calcium absorption?',
        'Which vitamins are fat-soluble versus water-soluble?'
      ];
    }
  }

  // Bleeding gums / Scurvy signs / Vitamin C
  else if (
    qLower.includes('bleeding gum') || qLower.includes('gum') || qLower.includes('teeth') ||
    qLower.includes('vitamin c') || qLower.includes('scurvy') || qLower.includes('దంతాలు') ||
    qLower.includes('చిగుళ్ళు') || qLower.includes('విటమిన్ సి')
  ) {
    relatedVitamins = [findVitamin('vitamin-c')].filter(Boolean);
    relatedFoods = [findFood('amla'), findFood('guava'), findFood('lemon'), findFood('papaya')].filter(Boolean);

    if (isTelugu) {
      responseText = `### చిగుళ్ల ఆరోగ్యం మరియు విటమిన్ సి ప్రాముఖ్యత\n\n` +
        `పళ్ళు తోమేటప్పుడు చిగుళ్ల నుండి రక్తం కారడం, చిగుళ్లు వాపు రావడం సాధారణంగా **విటమిన్ సి (Ascorbic Acid)** లోపం సంకేతం కావచ్చు. విటమిన్ సి కొల్లాజెన్ తయారీకి, కణజాలాల మరమ్మత్తుకు మరియు రోగనిరోధక రక్షణకు అత్యవసరం.\n\n` +
        `#### విటమిన్ సి సమృద్ధిగా లభించే ఆహారాలు:\n` +
        `* **ఉసిరికాయ (Amla):** ఒక్క తాజా ఉసిరికాయలోనే సుమారు 600mg విటమిన్ సి ఉంటుంది (రోజువారీ అవసరం కంటే 10 రెట్లు ఎక్కువ!).\n` +
        `* **జామకాయ (Guava):** నారింజ కంటే 3 రెట్లు ఎక్కువ విటమిన్ సి మరియు ఫైబర్ కలిగి ఉంటుంది.\n` +
        `* **నిమ్మకాయ (Lemon):** రోజువారీ ఆహారంలో లేదా సలాడ్‌లలో నిమ్మరసం పిండుకోవడం శ్రేయస్కరం.\n` +
        `* **బొప్పాయి (Papaya):** కంటి ఆరోగ్యంతో పాటు విటమిన్ సి ని సమృద్ధిగా అందిస్తుంది.\n\n` +
        `> **వంట చిట్కా:** విటమిన్ సి వేడికి నశిస్తుంది, కాబట్టి ఉసిరి, జామ, నిమ్మరసాన్ని పచ్చిగా లేదా వండిన ఆహారం చల్లారిన తర్వాత వాడండి.\n\n` +
        `*${CSP_DISCLAIMER_TE}*`;
      suggestedFollowUps = [
        'ఉసిరికాయ తింటే కలిగే ముఖ్య ఆరోగ్య ప్రయోజనాలు ఏమిటి?',
        'ఐరన్ మరియు విటమిన్ సి ల సమన్వయం ఏమిటి?',
        'రోజువారీ విటమిన్ సి అవసరం ఎంత?'
      ];
    } else {
      responseText = `### Gum Health, Collagen Support, and Vitamin C\n\n` +
        `Bleeding gums or slow oral wound recovery are classic early signals often associated with suboptimal **Vitamin C (Ascorbic Acid)** intake. Vitamin C is indispensable for collagen synthesis, capillary strength, and gum tissue integrity.\n\n` +
        `#### Top Whole Food Sources:\n` +
        `* **Indian Gooseberry (Amla):** One single fresh amla provides over 600mg of Vitamin C—nearly 10 times your daily minimum requirement!\n` +
        `* **Fresh Guava:** Contains roughly 228mg of Vitamin C per 100g (more than 3 times that of oranges) plus digestive dietary fiber.\n` +
        `* **Lemon & Citrus:** Easy to squeeze over cooked lentils and salads daily.\n` +
        `* **Papaya & Bell Peppers:** Rich in natural carotenoids and water-soluble ascorbic acid.\n\n` +
        `> **Culinary Tip:** Vitamin C is heat-sensitive. Avoid boiling amla or lemons excessively; consume them fresh or squeezed onto warm meals just before eating.\n\n` +
        `*${CSP_DISCLAIMER_EN}*`;
      suggestedFollowUps = [
        'What are the health benefits of eating fresh Amla daily?',
        'How does Vitamin C pair with iron for absorption?',
        'What is the recommended daily allowance for Vitamin C?'
      ];
    }
  }

  // Vitamin B12 / Vegetarian sources / Neuropathy / Numbness
  else if (
    qLower.includes('b12') || qLower.includes('cobalamin') || qLower.includes('tingling') ||
    qLower.includes('numbness') || qLower.includes('బి12') || qLower.includes('నరాల')
  ) {
    relatedVitamins = [findVitamin('vitamin-b12'), findVitamin('vitamin-b6')].filter(Boolean);
    relatedFoods = [findFood('curd'), findFood('paneer'), findFood('milk'), findFood('egg')].filter(Boolean);

    if (isTelugu) {
      responseText = `### విటమిన్ B12 (కోబాలమిన్) & నరాల ఆరోగ్యం\n\n` +
        `**విటమిన్ B12** నరాల పనితీరు, మెదడు చురుకుదనం మరియు ఎర్ర రక్త కణాల తయారీకి ప్రాణాధారం. దీని లోపం వల్ల కాళ్లు, చేతుల్లో సూదులతో గుచ్చినట్లు అనిపించడం (Tingling), జ్ఞాపకశక్తి తగ్గడం మరియు తీవ్ర అలసట కలగవచ్చు.\n\n` +
        `#### శాకాహారులకు సహజ ఆహార వనరులు:\n` +
        `* **తాజా పెరుగు (Curd/Dahi):** జీర్ణక్రియను మెరుగుపరచడంతో పాటు B12 అందిస్తుంది.\n` +
        `* **పనీర్ (Paneer) & దేశీ పాలు:** అధిక ప్రోటీన్ మరియు B12 ను కలిగి ఉంటాయి.\n` +
        `* **పులియబెట్టిన ఆహారాలు (Fermented foods):** ఇడ్లీ, దోశ పిండిలో స్వల్ప పరిమాణంలో బి-విటమిన్లు తయారవుతాయి.\n` +
        `* **గుడ్లు (Eggetarians):** గుడ్డు సొనలో సహజ B12 పుష్కలంగా ఉంటుంది.\n\n` +
        `> **శాకాహారులకు సూచన:** స్వచ్ఛమైన వీగన్ డైట్ పాటించేవారికి మొక్కల ద్వారా B12 లభించడం చాలా కష్టం; కాబట్టి ఫోర్టిఫైడ్ ఆహారాలు లేదా వైద్యుల సలహా తీసుకోవాలి.\n\n` +
        `*${CSP_DISCLAIMER_TE}*`;
      suggestedFollowUps = [
        'శాకాహార డైట్‌లో B12 తగినంతగా ఎలా పొందాలి?',
        'పెరుగు మరియు పనీర్ లోని పోషక వ్యత్యాసాలు ఏమిటి?',
        'విటమిన్ B12 రోజువారీ అవసరం ఎంత?'
      ];
    } else {
      responseText = `### Vitamin B12: Nerve Protection & Red Cell Synthesis\n\n` +
        `**Vitamin B12 (Cobalamin)** is vital for the myelin sheath insulating nerves, DNA formation, and neurological health. Early deficiency signals can include tingling in hands or feet (pins and needles), memory haze, and macrocytic anemia.\n\n` +
        `#### Vegetarian & Whole Food Sources:\n` +
        `* **Fresh Curd / Dahi:** Fermentation aids bioavailability of trace B-vitamins while supporting gut flora.\n` +
        `* **Cottage Cheese (Paneer) & Organic Milk:** Excellent source of both calcium and bioavailable B12.\n` +
        `* **Whole Eggs (if lacto-ovo vegetarian):** Concentrated in the yolk along with choline and lutein.\n` +
        `* **Fortified Plant Milks & Nutritional Yeast:** Recommended for strict vegans since land plants do not synthesize B12.\n\n` +
        `> **Awareness Note:** Vitamin B12 absorption requires adequate gastric acid and intrinsic factor; older adults and strict vegans are at heightened risk of depletion.\n\n` +
        `*${CSP_DISCLAIMER_EN}*`;
      suggestedFollowUps = [
        'How can strict vegans satisfy their B12 needs?',
        'What are the neurological signs of B12 deficiency?',
        'Does curd provide enough daily B12?'
      ];
    }
  }

  // Vitamin D / Calcium / Bones / Joints
  else if (
    qLower.includes('vitamin d') || qLower.includes('calcium') || qLower.includes('bone') ||
    qLower.includes('joint') || qLower.includes('sunshine') || qLower.includes('కాల్షియం') ||
    qLower.includes('ఎముకలు') || qLower.includes('విటమిన్ డి')
  ) {
    relatedVitamins = [findVitamin('vitamin-d'), findVitamin('mineral-calcium')].filter(Boolean);
    relatedFoods = [findFood('ragi'), findFood('curd'), findFood('sesame_seeds'), findFood('paneer'), findFood('almonds')].filter(Boolean);

    if (isTelugu) {
      responseText = `### ఎముకల బలం, కాల్షియం మరియు విటమిన్ డి సమన్వయం\n\n` +
        `ఎముకలు మరియు దంతాలు బలంగా ఉండటానికి **కాల్షియం** అవసరం, అయితే శరీరంలో విటమిన్ డి లేకపోతే మనం తీసుకున్న కాల్షియంను శరీరం శోషించుకోలేదు (Absorb చేసుకోలేదు).\n\n` +
        `#### ముఖ్య ఆహారాలు & నివారణ చిట్కాలు:\n` +
        `* **రాగులు (Ragi / Finger Millet):** 100 గ్రాముల రాగులలో 344mg కాల్షియం ఉంటుంది! ఇది పాలు కంటే 3 రెట్లు ఎక్కువ కాల్షియం కలిగిన అద్భుత చిరుధాన్యం.\n` +
        `* **నువ్వులు (Sesame Seeds / Nuvvulu):** సహజ ప్లాంట్ కాల్షియం మరియు ఆరోగ్యకరమైన కొవ్వులకు ప్రధాన వనరు.\n` +
        `* **పెరుగు & పాలు:** దైనందిన కాల్షియం మరియు ప్రోటీన్ అవసరాలకు తోడ్పడతాయి.\n` +
        `* **సూర్యరశ్మి (Sunlight):** ఉదయం 8:00 నుండి 10:00 గంటల మధ్య 15-20 నిమిషాలు ఎండలో గడపడం ద్వారా చర్మం సహజంగా విటమిన్ డి ని తయారు చేసుకుంటుంది.\n\n` +
        `*${CSP_DISCLAIMER_TE}*`;
      suggestedFollowUps = [
        'రాగులతో కాల్షియం పొందడం ఎలా?',
        'నువ్వులలోని కాల్షియం విలువ ఎంత?',
        'విటమిన్ డి కోసం ఎండలో ఎంతసేపు ఉండాలి?'
      ];
    } else {
      responseText = `### Bone Density Synergy: Calcium & The Sunshine Vitamin (Vitamin D)\n\n` +
        `**Calcium** provides the structural matrix of bones and teeth, but **Vitamin D** acts as the crucial biochemical key that enables the intestines to absorb calcium. Without adequate Vitamin D, dietary calcium is largely eliminated unutilized.\n\n` +
        `#### Outstanding Food & Lifestyle Sources:\n` +
        `* **Finger Millet (Ragi):** An Indian staple marvel containing ~344mg of calcium per 100g—over 3 times that of dairy milk!\n` +
        `* **White & Black Sesame Seeds:** One tablespoon delivers over 85mg of plant calcium along with beneficial minerals like zinc.\n` +
        `* **Fresh Curd (Dahi) & Paneer:** Readily bioavailable dairy calcium with complete amino acids.\n` +
        `* **Sunlight Exposure:** 15–20 minutes of midday sunlight on arms and legs stimulates cutaneous cholecalciferol (Vitamin D3) production.\n\n` +
        `*${CSP_DISCLAIMER_EN}*`;
      suggestedFollowUps = [
        'What are the best dairy-free calcium foods?',
        'How much calcium is in Ragi versus milk?',
        'Can food alone meet my Vitamin D requirements?'
      ];
    }
  }

  // Vitamin A / Eyes / Vision / Night blindness
  else if (
    qLower.includes('vitamin a') || qLower.includes('eye') || qLower.includes('vision') ||
    qLower.includes('night blind') || qLower.includes('కంటి') || qLower.includes('చూపు') ||
    qLower.includes('విటమిన్ ఎ')
  ) {
    relatedVitamins = [findVitamin('vitamin-a')].filter(Boolean);
    relatedFoods = [findFood('carrot'), findFood('sweet_potato'), findFood('papaya'), findFood('spinach'), findFood('drumstick_leaves')].filter(Boolean);

    if (isTelugu) {
      responseText = `### కంటి చూపు, రేచీకటి నివారణ మరియు విటమిన్ ఎ\n\n` +
        `**విటమిన్ ఎ (బీటా-కెరోటిన్)** రెటీనాలోని రోడోప్సిన్ వర్ణద్రవ్యం తయారీకి అత్యవసరం, ఇది మసక వెలుతురులో చూడటానికి సహాయపడుతుంది. దీని లోపం వల్ల రేచీకటి మరియు కళ్ళు పొడిబారడం సంభవించవచ్చు.\n\n` +
        `#### విటమిన్ ఎ సమృద్ధిగా గల ఆహారాలు:\n` +
        `* **క్యారెట్ (Carrots):** సహజ బీటా-కెరోటిన్ నిధి.\n` +
        `* **చిలగడదుంప (Sweet Potato):** అధిక పీచుపదార్థం మరియు విటమిన్ ఎ కలిగి ఉంటుంది.\n` +
        `* **బొప్పాయి & మామిడి:** రుచికరమైన పసుపు/నారింజ రంగు పండ్లు.\n` +
        `* **మునగాకు & పాలకూర:** ముదురు ఆకుపచ్చని ఆకుకూరలు.\n\n` +
        `> **శోషణ చిట్కా:** విటమిన్ ఎ కొవ్వులో కరిగే విటమిన్. క్యారెట్ కూర లేదా పాలకూర వండేటప్పుడు 1 చెంచా నెయ్యి లేదా నూనె వాడితే శరీరంలో విటమిన్ ఎ శోషణ గణనీయంగా పెరుగుతుంది.\n\n` +
        `*${CSP_DISCLAIMER_TE}*`;
      suggestedFollowUps = [
        'క్యారెట్లలో ఎంత విటమిన్ ఎ ఉంటుంది?',
        'చిలగడదుంపల ఆరోగ్య ప్రయోజనాలు ఏమిటి?',
        'కంటి చూపు మెరుగుపడటానికి ఏ ఆహారాలు తినాలి?'
      ];
    } else {
      responseText = `### Vision Health, Retinal Protection & Vitamin A\n\n` +
        `**Vitamin A (Retinol & Beta-Carotene)** is indispensable for synthesizing rhodopsin—the photoreceptor pigment in your retina that allows vision in low light. Deficiency manifests as night blindness (nyctalopia) and dry eyes (xerophthalmia).\n\n` +
        `#### Outstanding Food Sources:\n` +
        `* **Carrots:** Classic, high-density source of provitamin A carotenoids.\n` +
        `* **Sweet Potatoes:** One baked sweet potato provides more than 100% of an adult's daily Vitamin A target.\n` +
        `* **Papaya & Mango:** Sweet tropical fruits rich in zeaxanthin and beta-carotene.\n` +
        `* **Moringa & Dark Leafy Greens:** Abundant chlorophyll masking deep carotenoid reserves.\n\n` +
        `> **Bioavailability Tip:** As a fat-soluble nutrient, carotenoids absorb poorly on empty, fat-free stomachs. Always pair with healthy dietary fats like a drizzle of cold-pressed oil, seeds, or ghee.\n\n` +
        `*${CSP_DISCLAIMER_EN}*`;
      suggestedFollowUps = [
        'How does beta-carotene convert to Vitamin A?',
        'What foods relieve dry eyes naturally?',
        'What are the symptoms of Vitamin A deficiency?'
      ];
    }
  }

  // Hair loss / Brittle nails / Skin / Zinc / Biotin
  else if (
    qLower.includes('hair') || qLower.includes('nail') || qLower.includes('skin') ||
    qLower.includes('biotin') || qLower.includes('zinc') || qLower.includes('జుట్టు') ||
    qLower.includes('గోర్లు') || qLower.includes('చర్మం')
  ) {
    relatedVitamins = [findVitamin('mineral-iron'), findVitamin('vitamin-e'), findVitamin('vitamin-c')].filter(Boolean);
    relatedFoods = [findFood('almonds'), findFood('flaxseeds'), findFood('lentils'), findFood('egg'), findFood('curd')].filter(Boolean);

    if (isTelugu) {
      responseText = `### జుట్టు రాలడం, గోర్లు మరియు చర్మ సంరక్షణ పోషకాహారం\n\n` +
        `జుట్టు రాలడం లేదా గోర్లు పెళుసుగా మారడం అనేది కేవలం బాహ్య సమస్య కాదు; అది తరచుగా శరీరంలో **ఐరన్**, **జింక్**, **విటమిన్ ఇ**, మరియు **ప్రోటీన్** కొరతను సూచిస్తుంది.\n\n` +
        `#### సహజ పోషక ఆహారాలు:\n` +
        `* **బాదం పప్పు (Almonds):** విటమిన్ ఇ మరియు మెగ్నీషియం నిధి; కణాల దెబ్బతినకుండా కాపాడుతుంది.\n` +
        `* **అవిసె గింజలు (Flaxseeds):** ఒమేగా-3 ఫ్యాటీ యాసిడ్స్ జుట్టు కుదుళ్లను బలోపేతం చేస్తాయి.\n` +
        `* **పప్పుధాన్యాలు & మొలకలు:** కెరాటిన్ తయారీకి కావలసిన అమైనో ఆమ్లాలు మరియు జింక్ అందిస్తాయి.\n` +
        `* **గుడ్లు & పెరుగు:** నాణ్యమైన ప్రోటీన్ మరియు బయోటిన్ అందిస్తాయి.\n\n` +
        `*${CSP_DISCLAIMER_TE}*`;
      suggestedFollowUps = [
        'అవిసె గింజలు తినే సరైన పద్ధతి ఏమిటి?',
        'బాదంపప్పులోని విటమిన్ ఇ విలువ ఎంత?',
        'జుట్టు ఒత్తుగా పెరగడానికి ఏ ఆహారాలు సహాయపడతాయి?'
      ];
    } else {
      responseText = `### Nutritional Foundation for Hair, Nails, and Skin Health\n\n` +
        `Excessive hair shedding, brittle ridged nails, or dull skin are commonly linked to insufficient **Iron / Ferritin**, **Biotin (B7)**, **Zinc**, or **High-Quality Protein**—the building blocks of keratin and collagen.\n\n` +
        `#### Key Nutritional Staples:\n` +
        `* **Soaked Almonds & Walnuts:** Rich in Vitamin E (alpha-tocopherol) which fights follicular oxidative stress.\n` +
        `* **Roasted Flaxseeds (Alsi):** Exceptional plant source of Alpha-Linolenic Acid (ALA Omega-3) to nourish scalp hydration.\n` +
        `* **Sprouted Moong & Cooked Dal:** Delivers sulfur-containing amino acids essential for strong keratin synthesis.\n` +
        `* **Curd & Whole Eggs:** Bioavailable zinc, biotin, and micro-minerals that anchor hair roots.\n\n` +
        `*${CSP_DISCLAIMER_EN}*`;
      suggestedFollowUps = [
        'What is the best way to consume flaxseeds daily?',
        'How does low ferritin trigger hair shedding?',
        'Which vitamins strengthen brittle nails?'
      ];
    }
  }

  // Balanced Plate / Meal Balancing / Portion Sizes
  else if (
    qLower.includes('balance') || qLower.includes('plate') || qLower.includes('portion') ||
    qLower.includes('meal') || qLower.includes('diet') || qLower.includes('ప్లేట్') ||
    qLower.includes('ఆహారం') || qLower.includes('భోజనం')
  ) {
    relatedFoods = [findFood('spinach'), findFood('lentils'), findFood('ragi'), findFood('curd'), findFood('amla')].filter(Boolean);

    if (isTelugu) {
      responseText = `### న్యూట్రివిటా సమతుల్య భోజన సూత్రం (50:25:25 పద్ధతి)\n\n` +
        `ఆరోగ్యకరమైన భోజనం కోసం మీ ప్లేట్‌ను ఈ క్రింది నిష్పత్తిలో విభజించండి:\n\n` +
        `1. **50% కూరగాయలు & ఆకుకూరలు (Vegetables & Greens):** పాలకూర, బీరకాయ, క్యారెట్, టొమాటో వంటివి ఫైబర్ మరియు విటమిన్లను అందిస్తాయి.\n` +
        `2. **25% ప్రోటీన్ ఆహారాలు (Proteins & Pulses):** కందిపప్పు, శనగలు, పనీర్, లేదా గుడ్లు కండరాల పుష్టికి సహాయపడతాయి.\n` +
        `3. **25% ముడి ధాన్యాలు (Whole Grains / Millets):** రాగులు, జొన్నలు, లేదా బ్రౌన్ రైస్ స్థిరమైన శక్తినిస్తాయి.\n\n` +
        `> **పోషక సమతుల్యత:** భోజనం చివరలో ఒక కప్పు పెరుగు మరియు నిమ్మరసం లేదా ఉసిరిని చేర్చుకోవడం వల్ల సంపూర్ణ పోషక శోషణ సాధ్యమవుతుంది.\n\n` +
        `*${CSP_DISCLAIMER_TE}*`;
      suggestedFollowUps = [
        'ప్లేట్ బ్యాలెన్సర్ టూల్ ఎలా పనిచేస్తుంది?',
        'శాకాహార డైట్‌లో ఉత్తమ ప్రోటీన్ ఆహారాలు ఏమిటి?',
        'చిరుధాన్యాలు (Millets) తినడం వల్ల కలిగే లాభాలు ఏమిటి?'
      ];
    } else {
      responseText = `### The NutriVita Ideal Balanced Plate Framework (50:25:25 Method)\n\n` +
        `To ensure optimal micronutrient density and sustained metabolic satiety, construct your daily plate using this golden ratio:\n\n` +
        `1. **50% Non-Starchy Vegetables & Leafy Greens:** Palak, carrots, cabbage, cucumbers—loaded with dietary fiber, polyphenols, and micronutrients.\n` +
        `2. **25% High-Quality Protein:** Toor dal, boiled chickpeas, paneer, eggs, or sprouted pulses for steady tissue maintenance.\n` +
        `3. **25% Complex Carbohydrates / Millets:** Ragi, jowar, whole wheat roti, or brown rice for sustained low-glycemic energy.\n\n` +
        `> **Synergy Booster:** Add a side of fresh dahi (probiotics + calcium) and a squeeze of fresh lemon (Vitamin C for iron absorption) to complete the plate.\n\n` +
        `*${CSP_DISCLAIMER_EN}*`;
      suggestedFollowUps = [
        'How does the Balance My Meal plate visualizer calculate scores?',
        'What are the best Indian whole-grain millet alternatives?',
        'Can you recommend a balanced vegetarian lunch?'
      ];
    }
  }


  // Greeting / General Introduction
  else {
    relatedFoods = [findFood('amla'), findFood('ragi'), findFood('drumstick_leaves'), findFood('spinach')].filter(Boolean);
    relatedVitamins = [findVitamin('vitamin-c'), findVitamin('mineral-iron')].filter(Boolean);

    if (isTelugu) {
      responseText = `నమస్కారం! నేను **విటామేట్ (VitaMate)** — మీ వ్యక్తిగత పోషకాహార మరియు విటమిన్ అవగాహన సహాయకుడిని. 🌿\n\n` +
        `నేను మీకు ఈ విషయాలలో సహాయపడగలను:\n` +
        `* శరీరానికి అవసరమైన విటమిన్లు మరియు ఖనిజాల వివరాలు తెలుసుకోవడం\n` +
        `* స్థానిక సహజ ఆహారాల (ఉసిరి, మునగాకు, రాగులు, మొదలైనవి) పోషక విలువలు\n` +
        `* పోషక లోపాల ముందస్తు సంకేతాలు మరియు నివారణ ఆహారాలు\n` +
        `* సమతుల్య భోజన ప్రణాళికను నిర్మించడం\n\n` +
        `దయచేసి మీ ప్రశ్నను అడగండి లేదా మైక్రోఫోన్ బటన్ నొక్కి మాట్లాడండి!\n\n` +
        `*${CSP_DISCLAIMER_TE}*`;
      suggestedFollowUps = [
        'అలసట నివారణకు ఏ ఆహారాలు తినాలి?',
        'శాకాహారులకు విటమిన్ B12 ఎలా లభిస్తుంది?',
        'ఎముకల బలానికి కాల్షియం ఎందులో ఎక్కువగా ఉంటుంది?'
      ];
    } else {
      responseText = `Hello! I am **VitaMate**, your NutriVita preventive nutrition and vitamin wellness assistant. 🌿\n\n` +
        `I can help you with:\n` +
        `* Understanding essential vitamins, minerals, and daily RDA targets\n` +
        `* Discovering nutrient-dense whole foods (like Amla, Moringa, Ragi, and Lentils)\n` +
        `* Recognizing dietary deficiency signals and preventive food adjustments\n` +
        `* Balancing your daily meals with optimal macro and micronutrient splits\n` +
        `* Unlocking nutrient synergies (e.g. Iron + Vitamin C pairing)\n\n` +
        `Feel free to type your question or click the microphone to speak!\n\n` +
        `*${CSP_DISCLAIMER_EN}*`;
      suggestedFollowUps = [
        'What are the best vegetarian sources of Vitamin B12?',
        'Which foods boost iron and hemoglobin naturally?',
        'How does Vitamin C enhance Iron absorption?'
      ];
    }
  }

  return {
    success: true,
    message: responseText,
    language: isTelugu ? 'te' : 'en',
    relatedFoods: relatedFoods.map(f => ({
      id: f.id,
      name: f.name,
      teluguName: f.teluguName,
      category: f.category,
      imageUrl: f.imageUrl,
      calories: f.calories,
      richIn: f.tags?.[0] || 'nutrient_dense'
    })),
    relatedVitamins: relatedVitamins.map(v => ({
      vitaminId: v.vitaminId,
      nameEn: v.nameEn,
      nameTe: v.nameTe,
      type: v.type
    })),
    suggestedFollowUps,
    disclaimer: isTelugu ? CSP_DISCLAIMER_TE : CSP_DISCLAIMER_EN,
    engine: 'NutriVita Clinical Knowledge Engine (Deterministic & Guardrailed)'
  };
};

// Optional External LLM Integration (e.g., Gemini API) with automatic fallback
const callExternalLLM = async (userMessage, history = [], language = 'en') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const isTelugu = language === 'te' || isTeluguText(userMessage);
    const systemPrompt = `You are VitaMate, an evidence-based clinical and community nutrition guide for NutriVita.
Your mission is preventive nutritional education, dietary wellness, and vitamin awareness.
CRITICAL MANDATES:
1. NEVER claim to medically diagnose a disease, condition, or vitamin deficiency.
2. NEVER claim that symptoms alone definitively confirm a deficiency. Always state symptoms are potential indicators for preventive health awareness.
3. For serious, chronic, or distressing symptoms, advise consulting a qualified healthcare professional or obtaining diagnostic blood tests.
4. Promote natural, whole foods (especially Indian staples like Amla, Ragi, Moringa, Spinach, Lentils, Curd).
5. Explain nutrient synergy (such as Iron + Vitamin C, Calcium + Vitamin D).
6. Format your response cleanly using Markdown (bold headings, bullet points).
7. Respond in ${isTelugu ? 'Telugu (తెలుగు)' : 'English'}.
8. Always conclude with a concise preventive community health disclaimer.`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...history.slice(-6).map(h => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      })),
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let candidateText = null;

    for (const model of modelsToTry) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
        });

        if (response.status === 404) continue;
        if (!response.ok) {
          console.warn(`[Gemini API ${model}] Call failed with status ${response.status}.`);
          continue;
        }

        const data = await response.json();
        candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) break;
      } catch (err) {
        console.warn(`[Gemini API ${model}] notice:`, err.message);
      }
    }

    if (!candidateText) {
      console.warn(`[Gemini API] All model attempts exhausted. Falling back to deterministic engine.`);
      return null;
    }

    return {
      success: true,
      message: candidateText,
      language: isTelugu ? 'te' : 'en',
      engine: 'Gemini 1.5 Flash (Cloud LLM Guardrailed)',
      disclaimer: isTelugu ? CSP_DISCLAIMER_TE : CSP_DISCLAIMER_EN,
    };
  } catch (err) {
    console.warn(`[Gemini API Error] ${err.message}. Using deterministic fallback.`);
    return null;
  }
};

// @desc    Chat with VitaMate AI Nutrition Guide
// @route   POST /api/ai/chat
// @access  Public
export const chatWithVitaMate = async (req, res, next) => {
  try {
    const { message, history = [], language = 'en', userProfile = {} } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question or nutrition topic to discuss.',
      });
    }

    // Try external LLM first if configured
    let aiResponse = await callExternalLLM(message.trim(), history, language);

    // If external LLM is not configured or failed, use deterministic knowledge engine
    if (!aiResponse) {
      aiResponse = generateDeterministicResponse(message.trim(), language, userProfile);
    }

    res.status(200).json(aiResponse);
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested nutrition prompt chips
// @route   GET /api/ai/prompts
// @access  Public
export const getSuggestedPrompts = async (req, res, next) => {
  try {
    const lang = req.query.lang === 'te' ? 'te' : 'en';

    const prompts = lang === 'te' ? [
      { category: 'విటమిన్లు', text: 'శాకాహారులకు విటమిన్ B12 లభించే ఆహారాలు ఏమిటి?' },
      { category: 'ఐరన్ & రక్తం', text: 'రక్తహీనత మరియు అలసట నివారణకు ఏ ఆహారాలు మేలు?' },
      { category: 'శోషణ సమన్వయం', text: 'ఐరన్ శోషణకు విటమిన్ సి ఎలా సహాయపడుతుంది?' },
      { category: 'ఎముకల బలం', text: 'రాగులు మరియు నువ్వులలో ఎంత కాల్షియం ఉంటుంది?' },
      { category: 'రోగనిరోధక శక్తి', text: 'రోగనిరోధక శక్తి పెంచడానికి ఉసిరి ఎలా తోడ్పడుతుంది?' },
      { category: 'సమతుల్య భోజనం', text: '50:25:25 సమతుల్య భోజన ప్లేట్ ఎలా నిర్మించాలి?' },
    ] : [
      { category: 'Vitamins', text: 'What are the best vegetarian sources of Vitamin B12?' },
      { category: 'Iron & Energy', text: 'Which foods boost hemoglobin and prevent fatigue naturally?' },
      { category: 'Synergy', text: 'How does Vitamin C enhance non-heme iron absorption?' },
      { category: 'Bone Health', text: 'How does Ragi compare with milk for dietary calcium?' },
      { category: 'Immunity', text: 'What are the health benefits of eating fresh Amla daily?' },
      { category: 'Balanced Meals', text: 'How do I construct a balanced 50:25:25 meal plate?' },
    ];

    res.status(200).json({
      success: true,
      language: lang,
      data: prompts,
    });
  } catch (error) {
    next(error);
  }
};
