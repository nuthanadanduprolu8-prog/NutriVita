/**
 * NutriVita Body Change Knowledge Base
 * Maps observable physical changes across 6 body areas to evidence-based
 * micronutrient correlations, biological mechanisms, red flags, and whole-food recommendations.
 */

export const BODY_AREAS = [
  {
    id: 'nails',
    nameEn: 'Fingernails & Toenails',
    nameTe: 'గోర్లు (Nails)',
    icon: 'Hand',
    descriptionEn: 'Brittleness, shape changes, discoloration, ridges, or white spots',
    descriptionTe: 'గోర్లు విరగడం, ఆకారం మారడం, రంగు మారడం లేదా తెల్లటి మచ్చలు',
    changes: [
      {
        id: 'spoon_nails',
        nameEn: 'Spoon-shaped Nails (Koilonychia)',
        nameTe: 'స్పూన్ ఆకారపు గోర్లు (Koilonychia)',
        descriptionEn: 'Nails curve inwards forming a hollow concave dip that could hold a drop of water',
        descriptionTe: 'గోర్లు లోపలికి గుంతలా మారి చెంచా ఆకారంలో కనిపించడం',
        nutrients: [
          { name: 'Iron', teluguName: 'ఐరన్', confidence: 'High', rationaleEn: 'Essential for nail bed capillary perfusion and keratin structural integrity. Koilonychia is a classic physical hallmark of prolonged iron deficiency anemia.', rationaleTe: 'గోరు కణజాలం మరియు కెరాటిన్ పటుత్వానికి ఐరన్ అత్యవసరం. ఇది ఐరన్ లోపం మరియు రక్తహీనతకు ప్రధాన సంకేతం.' },
          { name: 'Vitamin B12', teluguName: 'విటమిన్ బి12', confidence: 'Moderate', rationaleEn: 'Synergistic cofactor in erythrocyte synthesis; deficiency compromises microvascular oxygen delivery to the nail matrix.', rationaleTe: 'ఎర్ర రక్త కణాల తయారీకి తోడ్పడుతుంది; లోపిస్తే గోర్లకు ఆక్సిజన్ సరఫరా తగ్గుతుంది.' }
        ],
        severity: 'Moderate to High',
        recommendedFoodIds: ['spinach', 'drumstick_leaves', 'black_chickpeas', 'lentils', 'vegetable_pulao', 'roasted_chana', 'sprouts_salad', 'amla'],
        synergies: [
          { pair: 'Iron + Vitamin C', descriptionEn: 'Ascorbic acid from fresh citrus/amla converts ferric iron into absorbable ferrous iron.', descriptionTe: 'ఉసిరి, నిమ్మలలోని విటమిన్ సి పప్పుధాన్యాలలోని ఐరన్ గ్రహింపును 3 రెట్లు పెంచుతుంది.' }
        ],
        redFlags: [
          'Extreme persistent fatigue, breathlessness on mild exertion, or pale inner eyelids',
          'Dizziness, rapid heart palpitations, or unexplained cold hands and feet'
        ],
        redFlagsTe: [
          'విపరీతమైన నీరసం, నడిస్తే ఆయాసం రావడం లేదా కనురెప్పల లోపల పాలిపోవడం',
          'తలతిరగడం, గుండె దడ లేదా చేతులు, కాళ్ళు చల్లబడటం'
        ]
      },
      {
        id: 'brittle_nails',
        nameEn: 'Brittle, Cracking, or Peeling Nails',
        nameTe: 'పెళుసైన, విరిగిపోయే గోర్లు',
        descriptionEn: 'Nails snap, split easily, peel in layers, or fail to grow without breaking',
        descriptionTe: 'గోర్లు సులువుగా పగిలిపోవడం లేదా పొరలుగా ఊడిపోవడం',
        nutrients: [
          { name: 'Biotin (Vitamin B7)', teluguName: 'బయోటిన్ (విటమిన్ బి7)', confidence: 'High', rationaleEn: 'Biotin is essential for lipid and protein synthesis that bonds the keratin filaments of the nail plate.', rationaleTe: 'గోరు కెరాటిన్ పొరలను బంధించే ప్రొటీన్ సంశ్లేషణకు బయోటిన్ అత్యవసరం.' },
          { name: 'Iron', teluguName: 'ఐరన్', confidence: 'High', rationaleEn: 'Subclinical iron depletion reduces oxygen delivery to growing matrix cells before anemia develops.', rationaleTe: 'గోరు మూల కణాలకు ఆక్సిజన్ కొరత ఏర్పడి గోర్లు బలహీనపడతాయి.' },
          { name: 'Calcium & Zinc', teluguName: 'కాల్షియం మరియు జింక్', confidence: 'Moderate', rationaleEn: 'Structural minerals necessary for protein matrix density.', rationaleTe: 'గోరు నిర్మాణానికి తోడ్పడే ముఖ్యమైన ఖనిజాలు.' }
        ],
        severity: 'Mild to Moderate',
        recommendedFoodIds: ['egg', 'almonds', 'roasted_peanuts', 'sesame_seeds', 'ragi', 'curd', 'oats'],
        synergies: [
          { pair: 'Biotin + Healthy Fats', descriptionEn: 'Lipid-soluble micronutrients work synergistically with whole-food unsaturated fats from almonds and peanuts.', descriptionTe: 'బాదం మరియు పల్లీలలోని ఆరోగ్యకరమైన కొవ్వులు పోషకాల గ్రహింపుకు తోడ్పడతాయి.' }
        ],
        redFlags: [
          'Sudden cracking across all ten fingernails accompanied by unexplained joint pain',
          'Nails separating completely from the nail bed (onycholysis)'
        ],
        redFlagsTe: [
          'అన్ని గోర్లు ఒకేసారి పగలడం మరియు కీళ్ల నొప్పులు రావడం',
          'గోరు చర్మం నుండి పూర్తిగా విడిపోవడం'
        ]
      },
      {
        id: 'white_spots',
        nameEn: 'White Spots / Flecks (Leukonychia)',
        nameTe: 'గోర్లపై తెల్లటి మచ్చలు',
        descriptionEn: 'Small white spots or horizontal white bands appearing on the nail plate',
        descriptionTe: 'గోర్లపై చిన్న తెల్లటి మచ్చలు లేదా చారలు కనిపించడం',
        nutrients: [
          { name: 'Zinc', teluguName: 'జింక్', confidence: 'High', rationaleEn: 'Zinc is an enzymatic cofactor in rapid cellular division; deficiency manifests as parakeratosis in the nail matrix.', rationaleTe: 'కణ విభజనకు జింక్ అవసరం; లోపిస్తే గోరుపై తెల్లటి మచ్చలు ఏర్పడతాయి.' },
          { name: 'Calcium', teluguName: 'కాల్షియం', confidence: 'Moderate', rationaleEn: 'Mineral cofactor involved in hard tissue stabilization and keratin rigidity.', rationaleTe: 'గోరు గట్టిదనానికి కాల్షియం తోడ్పడుతుంది.' }
        ],
        severity: 'Mild',
        recommendedFoodIds: ['roasted_peanuts', 'chickpeas', 'sesame_seeds', 'curd', 'paneer', 'egg'],
        synergies: [
          { pair: 'Zinc + Vitamin A', descriptionEn: 'Vitamin A promotes zinc cellular uptake and skin/nail keratinization.', descriptionTe: 'విటమిన్ ఎ జింక్ శోషణను పెంచి గోర్ల ఆరోగ్యానికి మేలు చేస్తుంది.' }
        ],
        redFlags: [
          'White bands extending across all nails with facial swelling or kidney concerns'
        ],
        redFlagsTe: [
          'అన్ని గోర్లపై తెల్లటి చారలు మరియు ముఖంలో వాపు కనిపించడం'
        ]
      }
    ]
  },
  {
    id: 'hair',
    nameEn: 'Hair & Scalp',
    nameTe: 'జుట్టు & తల చర్మం (Hair & Scalp)',
    icon: 'Sparkles',
    descriptionEn: 'Excessive shedding, brittle strands, dry scalp, premature thinning',
    descriptionTe: 'జుట్టు రాలడం, పొడిబారడం లేదా చిన్న వయసులోనే నెరవడం',
    changes: [
      {
        id: 'hair_loss',
        nameEn: 'Excessive Diffuse Hair Shedding (Telogen Effluvium)',
        nameTe: 'విపరీతంగా జుట్టు రాలడం',
        descriptionEn: 'Noticeable hair loss while washing, brushing, or waking up on pillow (>100 strands/day)',
        descriptionTe: 'తలస్నానం చేసినప్పుడు లేదా దువ్వినప్పుడు ఎక్కువగా వెంట్రుకలు ఊడిపోవడం',
        nutrients: [
          { name: 'Iron (Ferritin)', teluguName: 'ఐరన్ (ఫెర్రిటిన్)', confidence: 'High', rationaleEn: 'Hair follicle matrix cells are among the fastest dividing in the human body; low serum ferritin prematurely shifts active anagen hairs into telogen shedding.', rationaleTe: 'జుట్టు కుదుళ్లకు రక్త ప్రసరణ మరియు ఆక్సిజన్ కొరత ఏర్పడి వెంట్రుకలు వేగంగా రాలిపోతాయి.' },
          { name: 'Vitamin D', teluguName: 'విటమిన్ డి', confidence: 'High', rationaleEn: 'Vitamin D nuclear receptors are directly involved in initiating the new anagen growth cycle of hair follicles.', rationaleTe: 'విటమిన్ డి జుట్టు కుదుళ్లలో కొత్త వెంట్రుకలు మొలకెత్తే ప్రక్రియను నియంత్రిస్తుంది.' },
          { name: 'Protein & Zinc', teluguName: 'ప్రొటీన్ మరియు జింక్', confidence: 'High', rationaleEn: 'Hair is composed of 90% keratin protein; zinc regulates follicle protein synthesis.', rationaleTe: 'జుట్టు 90% కెరాటిన్ ప్రొటీన్‌తో నిర్మితమైంది; జింక్ దీని తయారీకి అత్యవసరం.' }
        ],
        severity: 'Moderate',
        recommendedFoodIds: ['egg', 'roasted_peanuts', 'black_chickpeas', 'spinach', 'ragi', 'sprouts_salad', 'sesame_seeds'],
        synergies: [
          { pair: 'Protein + Iron', descriptionEn: 'Amino acids from lentils and eggs combine with bioavailable iron to build robust keratin shafts.', descriptionTe: 'గుడ్డు, పప్పులలోని ప్రొటీన్ మరియు ఐరన్ జుట్టు కుదుళ్లను పటిష్టం చేస్తాయి.' }
        ],
        redFlags: [
          'Coin-sized localized bald patches appearing overnight (Alopecia Areata)',
          'Hair loss accompanied by severe thyroid symptoms, sudden unexplained weight shifts, or neck swelling'
        ],
        redFlagsTe: [
          'గుండ్రటి బిళ్లలా జుట్టు పూర్తిగా రాలిపోవడం (అలోపేసియా)',
          'థైరాయిడ్ లక్షణాలు లేదా అకస్మాత్తుగా బరువులో హెచ్చుతగ్గులు రావడం'
        ]
      },
      {
        id: 'dry_brittle_hair',
        nameEn: 'Dry, Coarse, or Wire-like Hair',
        nameTe: 'పొడిబారిన, నిర్జీవమైన జుట్టు',
        descriptionEn: 'Strands lack natural shine, feel like straw, snap under tension, or exhibit split ends',
        descriptionTe: 'మెరుపు తగ్గి గడ్డిలా మారిపోయిన వెంట్రుకలు మరియు చివర్లు చిట్లడం',
        nutrients: [
          { name: 'Essential Fatty Acids (Omega-3)', teluguName: 'ఒమేగా-3 కొవ్వు ఆమ్లాలు', confidence: 'High', rationaleEn: 'Regulate scalp sebum production, waterproofing hair shafts and preventing moisture evaporative loss.', rationaleTe: 'తల చర్మంలో సహజ నూనెను సమకూర్చి జుట్టు పొడిబారకుండా తేమను కాపాడుతాయి.' },
          { name: 'Vitamin A', teluguName: 'విటమిన్ ఎ', confidence: 'Moderate', rationaleEn: 'Vital for cellular differentiation in the sebaceous glands to produce protective scalp sebum.', rationaleTe: 'తల చర్మ గ్రంథులు ఆరోగ్యకరమైన సెబమ్ నూనెను ఉత్పత్తి చేయడానికి విటమిన్ ఎ అవసరం.' }
        ],
        severity: 'Mild',
        recommendedFoodIds: ['coconut', 'almonds', 'carrot', 'sweet_potato', 'sesame_seeds', 'curd', 'salmon'],
        synergies: [
          { pair: 'Healthy Lipids + Vitamin E', descriptionEn: 'Coconut and almonds supply protective fatty acids and antioxidants that shield scalp lipid membranes.', descriptionTe: 'కొబ్బరి మరియు బాదం జుట్టు కుదుళ్ల కణాలకు తేమను మరియు యాంటీఆక్సిడెంట్ రక్షణనిస్తాయి.' }
        ],
        redFlags: [
          'Scalp scaling with thick silver plaques, weeping sores, or intense relentless burning'
        ],
        redFlagsTe: [
          'తల చర్మంపై దళసరి పొలుసులు, పుండ్లు లేదా తీవ్రమైన మంట ఉండటం'
        ]
      }
    ]
  },
  {
    id: 'eyes',
    nameEn: 'Eyes & Vision',
    nameTe: 'కళ్లు & దృష్టి (Eyes & Vision)',
    icon: 'Eye',
    descriptionEn: 'Night vision impairment, dry gritty sensation, conjunctival pallor',
    descriptionTe: 'రేచీకటి, కళ్లు పొడిబారడం లేదా కనురెప్పల లోపల పాలిపోవడం',
    changes: [
      {
        id: 'night_blindness',
        nameEn: 'Night Vision Difficulty (Nyctalopia)',
        nameTe: 'రేచీకటి / చీకట్లో సరిగ్గా కనిపించకపోవడం',
        descriptionEn: 'Significant trouble adapting vision in dim light, dusk, or dark corridors',
        descriptionTe: 'చీకట్లో లేదా మసక వెలుతురులో వస్తువులు స్పష్టంగా కనిపించకపోవడం',
        nutrients: [
          { name: 'Vitamin A (Retinol)', teluguName: 'విటమిన్ ఎ (రెటినాల్)', confidence: 'Very High', rationaleEn: 'Vitamin A is the direct chromophore precursor for rhodopsin, the biological photopigment in retinal rod photoreceptors responsible for low-light vision.', rationaleTe: 'కంటిలోని రాడ్ కణాలలో వెలుతురును గ్రహించే రోడాప్సిన్ వర్ణద్రవ్యం తయారీకి విటమిన్ ఎ కీలకం.' },
          { name: 'Zinc', teluguName: 'జింక్', confidence: 'Moderate', rationaleEn: 'Required for retinol dehydrogenase enzyme that mobilizes stored Vitamin A from hepatic reserves to the retina.', rationaleTe: 'కాలేయం నుండి విటమిన్ ఎ కంటికి చేరడానికి జింక్ ఉత్ప్రేరకంగా పనిచేస్తుంది.' }
        ],
        severity: 'Moderate to High',
        recommendedFoodIds: ['carrot', 'drumstick_leaves', 'spinach', 'papaya', 'mango', 'sweet_potato', 'egg'],
        synergies: [
          { pair: 'Beta-Carotene + Dietary Fats', descriptionEn: 'Carotenoids in carrots and greens are fat-soluble; consume with a dash of healthy oil or curd for optimal uptake.', descriptionTe: 'క్యారెట్ మరియు ఆకుకూరలలోని విటమిన్ ఎ కొవ్వులో కరుగుతుంది; పెరుగు లేదా కొద్దిగా నూనెతో కలిపి తింటే సులువుగా ఒంటపడుతుంది.' }
        ],
        redFlags: [
          'Sudden complete vision loss, dark curtain falling over visual field, or intense eye pain',
          'Foamy triangular plaques appearing on the white of the eye (Bitot\'s spots) requiring medical intervention'
        ],
        redFlagsTe: [
          'అకస్మాత్తుగా చూపు మందగించడం లేదా కంటిలో తీవ్రమైన నొప్పి రావడం',
          'కంటి తెల్లగుడ్డుపై తెల్లటి నురుగు వంటి మచ్చలు (బిటోట్స్ స్పాట్స్) కనిపించడం'
        ]
      },
      {
        id: 'conjunctival_pallor',
        nameEn: 'Pale Inner Eyelids (Conjunctival Pallor)',
        nameTe: 'కనురెప్పల లోపల పాలిపోవడం',
        descriptionEn: 'Lower inner eyelid mucosal lining appears pale pink or chalky white rather than vibrant red',
        descriptionTe: 'కింది కనురెప్ప లోపలి భాగం ఎర్రగా కాకుండా పాలిపోయిన గులాబీ లేదా తెల్లటి రంగులో ఉండటం',
        nutrients: [
          { name: 'Iron', teluguName: 'ఐరన్', confidence: 'Very High', rationaleEn: 'Direct physical manifestation of reduced circulating hemoglobin concentration inside mucosal capillary loops.', rationaleTe: 'రక్తంలో హిమోగ్లోబిన్ పరిమాణం తగ్గడం వల్ల సూక్ష్మ రక్తనాళాలలో రక్తం తక్కువగా కనిపించడం.' },
          { name: 'Folate (Vitamin B9)', teluguName: 'ఫోలేట్ (విటమిన్ బి9)', confidence: 'High', rationaleEn: 'Essential for megaloblastic erythrocyte maturation in community anemia.', rationaleTe: 'ఎర్ర రక్త కణాల పెరుగుదలకు మరియు రక్తహీనత నివారణకు ఫోలేట్ అవసరం.' }
        ],
        severity: 'Moderate',
        recommendedFoodIds: ['spinach', 'black_chickpeas', 'vegetable_pulao', 'drumstick_leaves', 'pomegranate', 'roasted_chana', 'sprouts_salad'],
        synergies: [
          { pair: 'Iron + Vitamin C', descriptionEn: 'Pairing iron-rich foods with amla or lemon boosts absorption up to threefold.', descriptionTe: 'ఉసిరి లేదా నిమ్మరసంతో ఐరన్ ఆహారాలు తీసుకోవడం వల్ల గ్రహింపు గణనీయంగా పెరుగుతుంది.' }
        ],
        redFlags: [
          'Dizziness upon standing, fainting, cold sweats, or resting shortness of breath'
        ],
        redFlagsTe: [
          'లేచి నిలబడితే కళ్లు తిరగడం, స్పృహ తప్పడం లేదా కూర్చున్నా ఆయాసం రావడం'
        ]
      }
    ]
  },
  {
    id: 'mouth_lips',
    nameEn: 'Mouth, Tongue & Lips',
    nameTe: 'నోరు, నాలుక & పెదవులు (Mouth, Tongue & Lips)',
    icon: 'Smile',
    descriptionEn: 'Cracked corners, bleeding gums, red swollen tongue, ulcers',
    descriptionTe: 'నోటి మూలల్లో పగుళ్లు, చిగుళ్ల రక్తస్రావం, నాలుక ఎర్రబడటం లేదా పూత',
    changes: [
      {
        id: 'angular_cheilitis',
        nameEn: 'Cracked Corners of the Mouth (Angular Cheilitis)',
        nameTe: 'నోటి మూలల్లో పగుళ్లు (Angular Cheilitis)',
        descriptionEn: 'Painful fissures, redness, crusting, or bleeding at the corners where upper and lower lips meet',
        descriptionTe: 'నోటి రెండు వైపులా మూలల్లో పగుళ్లు, మంట లేదా రక్తం కారడం',
        nutrients: [
          { name: 'Riboflavin (Vitamin B2)', teluguName: 'రిబోఫ్లేవిన్ (విటమిన్ బి2)', confidence: 'Very High', rationaleEn: 'B2 is a primary precursor for FAD/FMN coenzymes governing mucosal tissue epithelialization and energy metabolism.', rationaleTe: 'నోటి పొరల కణాల పునరుత్పత్తికి విటమిన్ బి2 అతి ముఖ్యమైన కోఎంజైమ్.' },
          { name: 'Iron & Vitamin B6', teluguName: 'ఐరన్ మరియు విటమిన్ బి6', confidence: 'High', rationaleEn: 'Low ferritin and B6 deplete mucosal cellular immunity, leaving oral commissures vulnerable to mechanical breakdown.', rationaleTe: 'ఐరన్ మరియు బి6 లోపం నోటి సున్నిత చర్మాన్ని బలహీనపరుస్తుంది.' },
          { name: 'Vitamin B12', teluguName: 'విటమిన్ బి12', confidence: 'Moderate', rationaleEn: 'Systemic B12 depletion often co-manifests with stomatitis and cheilitis.', rationaleTe: 'విటమిన్ బి12 లోపం నోటి మూలల పుండ్లకు ఒక ప్రధాన కారణం.' }
        ],
        severity: 'Moderate',
        recommendedFoodIds: ['curd', 'paneer', 'egg', 'almonds', 'spinach', 'oats', 'lentils'],
        synergies: [
          { pair: 'B-Complex Synergy', descriptionEn: 'B-vitamins function collaboratively as coenzymes; consuming varied whole grains and dairy delivers a full spectrum.', descriptionTe: 'బి-విటమిన్లు కలిసి పనిచేస్తాయి; పాలు, పెరుగు, తృణధాన్యాల ద్వారా సంపూర్ణంగా లభిస్తాయి.' }
        ],
        redFlags: [
          'Fissures spreading into large non-healing ulcers with systemic fever or swollen lymph nodes',
          'Inability to drink fluids due to agonizing oral ulcerations'
        ],
        redFlagsTe: [
          'పగుళ్లు పెద్ద పుండ్లుగా మారి జ్వరం లేదా మెడలో గడ్డలు రావడం',
          'నోటి నొప్పి వల్ల నీళ్లు కూడా త్రాగలేకపోవడం'
        ]
      },
      {
        id: 'bleeding_gums',
        nameEn: 'Spongy, Bleeding Gums on Brushing',
        nameTe: 'చిగుళ్ల నుండి రక్తం కారడం',
        descriptionEn: 'Gums bleed readily during brushing or flossing, appear swollen, tender, or purplish-red',
        descriptionTe: 'బ్రష్ చేసినప్పుడు చిగుళ్ల నుండి రక్తం రావడం, వాపు మరియు నొప్పి ఉండటం',
        nutrients: [
          { name: 'Vitamin C (Ascorbic Acid)', teluguName: 'విటమిన్ సి (ఆస్కార్బిక్ ఆమ్లం)', confidence: 'Very High', rationaleEn: 'Ascorbic acid is the essential cofactor for prolyl and lysyl hydroxylase enzymes that crosslink collagen helices. Depletion destabilizes capillary walls and periodontal ligaments.', rationaleTe: 'చిగుళ్లలోని కొల్లాజెన్ మరియు రక్తనాళాల పటిష్టతకు విటమిన్ సి అత్యవసరం. దీని లోపంతో చిగుళ్ల బలహీనత వస్తుంది.' },
          { name: 'Vitamin K', teluguName: 'విటమిన్ కె', confidence: 'Moderate', rationaleEn: 'Essential for synthesis of prothrombin and factors VII, IX, X in the hepatic clotting cascade.', rationaleTe: 'రక్తం గడ్డకట్టే గుణానికి విటమిన్ కె అవసరం.' }
        ],
        severity: 'Moderate',
        recommendedFoodIds: ['amla', 'guava', 'orange', 'bell_peppers', 'tomato', 'bendakaya_fry', 'sprouts_salad'],
        synergies: [
          { pair: 'Vitamin C + Bioflavonoids', descriptionEn: 'Natural whole fruits like amla and oranges contain rutin and bioflavonoids that protect capillary fragility.', descriptionTe: 'ఉసిరి, నారింజలలోని బయోఫ్లేవనాయిడ్స్ చిగుళ్ల రక్తనాళాలను పటిష్టం చేస్తాయి.' }
        ],
        redFlags: [
          'Loose teeth, foul odor, or spontaneous heavy bleeding without touch (Periodontitis/Scurvy signs)',
          'Bleeding gums accompanied by petechiae (pinpoint red skin spots) or joint swelling'
        ],
        redFlagsTe: [
          'పళ్లు వదులవడం, తీవ్రమైన నోటి దుర్వాసన లేదా విపరీతమైన రక్తస్రావం',
          'చిగుళ్ల రక్తస్రావంతో పాటు చర్మంపై ఎర్రటి మచ్చలు లేదా కీళ్ల వాపు రావడం'
        ]
      },
      {
        id: 'glossitis',
        nameEn: 'Smooth, Red, Painful Tongue (Glossitis)',
        nameTe: 'ఎర్రబారిన, నునుపైన నాలుక (Glossitis)',
        descriptionEn: 'Tongue appears glossy, swollen, "beefy red", with disappearance of normal rough surface papillae',
        descriptionTe: 'నాలుకపై సహజ మొగ్గలు నశించి ఎర్రగా, నునుపుగా మరియు మంటగా మారడం',
        nutrients: [
          { name: 'Vitamin B12', teluguName: 'విటమిన్ బి12', confidence: 'Very High', rationaleEn: 'Hunter’s glossitis is a pathognomonic presentation of severe B12 depletion due to papillae atrophy.', rationaleTe: 'నాలుకపై రుచి మొగ్గలు క్షీణించి ఎర్రబడటానికి విటమిన్ బి12 లోపం ప్రధాన కారణం.' },
          { name: 'Folate (Vitamin B9)', teluguName: 'ఫోలేట్ (విటమిన్ బి9)', confidence: 'High', rationaleEn: 'Rapidly dividing tongue epithelial cells depend on folate for DNA thymidylate synthesis.', rationaleTe: 'నాలుక కణాల పునరుత్పత్తికి ఫోలేట్ అత్యంత ఆవశ్యకం.' },
          { name: 'Iron', teluguName: 'ఐరన్', confidence: 'High', rationaleEn: 'Microvascular iron depletion produces lingual mucosal atrophy.', rationaleTe: 'ఐరన్ లోపం వల్ల నాలుక పొరలు పలచబడి మంట పుడుతుంది.' }
        ],
        severity: 'Moderate to High',
        recommendedFoodIds: ['curd', 'egg', 'spinach', 'lentils', 'paneer', 'chicken_curry'],
        synergies: [
          { pair: 'B12 + Folate Synergy', descriptionEn: 'These two B-vitamins function in a unified methyl-donation pathway for cell turnover.', descriptionTe: 'బి12 మరియు ఫోలేట్ కలిసి పనిచేసి కణాల ఆరోగ్యకరమైన విభజనకు తోడ్పడతాయి.' }
        ],
        redFlags: [
          'Tongue numbness, tingling in hands/feet, balance unsteadiness, or cognitive fog (B12 neurological signs)'
        ],
        redFlagsTe: [
          'నాలుక తిమ్మిరితో పాటు చేతులు, కాళ్లలో సూదులు గుచ్చినట్లు అనిపించడం, నడకలో తూలడం'
        ]
      }
    ]
  },
  {
    id: 'skin',
    nameEn: 'Skin & Complexion',
    nameTe: 'చర్మం & రంగు (Skin & Complexion)',
    icon: 'Shield',
    descriptionEn: 'Rough bumpy texture, easy bruising, delayed cut healing, dry flaking',
    descriptionTe: 'గరుకైన చర్మం, చిన్న దెబ్బలకే కమిలిపోవడం, గాయాలు ఆలస్యంగా మానడం',
    changes: [
      {
        id: 'bumpy_skin',
        nameEn: 'Rough, "Goosebump" Bumpy Skin (Follicular Hyperkeratosis)',
        nameTe: 'గరుకైన, గడ్డలు గడ్డలుగా ఉండే చర్మం (Follicular Hyperkeratosis)',
        descriptionEn: 'Rough sand-papery bumps around hair follicles, predominantly on the back of upper arms and thighs (phrynoderma)',
        descriptionTe: 'చేతులు మరియు తొడల వెనుక భాగంలో వెంట్రుకల కుదుళ్ల వద్ద చిన్న చిన్న గరుకు గడ్డలు ఏర్పడటం',
        nutrients: [
          { name: 'Vitamin A', teluguName: 'విటమిన్ ఎ', confidence: 'Very High', rationaleEn: 'Controls epidermal cell differentiation. In deficiency, abnormal keratin builds up inside hair follicle funnels, forming conical plugs.', rationaleTe: 'చర్మ కణాల సమతుల్యతకు విటమిన్ ఎ అవసరం. ఇది లోపిస్తే వెంట్రుకల కుదుళ్లలో కెరాటిన్ పేరుకుపోతుంది.' },
          { name: 'Essential Fatty Acids', teluguName: 'ఆరోగ్యకరమైన కొవ్వు ఆమ్లాలు', confidence: 'High', rationaleEn: 'Maintain stratum corneum hydration and cell wall fluidity.', rationaleTe: 'చర్మం మృదువుగా ఉండటానికి మరియు తేమను నిలుపుకోవడానికి తోడ్పడతాయి.' },
          { name: 'Vitamin C', teluguName: 'విటమిన్ సి', confidence: 'Moderate', rationaleEn: 'Cofactor in follicular tissue architecture; severe deficiency causes corkscrew hairs.', rationaleTe: 'చర్మ కణజాలం బలంగా ఉండటానికి విటమిన్ సి తోడ్పడుతుంది.' }
        ],
        severity: 'Mild to Moderate',
        recommendedFoodIds: ['carrot', 'sweet_potato', 'drumstick_leaves', 'papaya', 'flaxseeds', 'almonds', 'mango'],
        synergies: [
          { pair: 'Pro-Vitamin A + Good Fats', descriptionEn: 'Carotenoid bioavailability improves dramatically when paired with healthy fats like flaxseeds or almonds.', descriptionTe: 'క్యారెట్ లేదా బొప్పాయితో పాటు బాదం, అవిసె గింజలు తీసుకుంటే విటమిన్ ఎ శోషణ పెరుగుతుంది.' }
        ],
        redFlags: [
          'Bumps become infected pustules with widespread fever or severe eczema'
        ],
        redFlagsTe: [
          'గడ్డలు చీము పట్టి జ్వరం రావడం లేదా తీవ్రమైన చర్మ వ్యాధిగా మారడం'
        ]
      },
      {
        id: 'easy_bruising',
        nameEn: 'Easy Bruising with Minor Bumps (Ecchymosis)',
        nameTe: 'చిన్న దెబ్బలకే చర్మం కమిలిపోవడం (Bruising)',
        descriptionEn: 'Large purplish-blue skin discoloration appearing from minimal contact or without remembered trauma',
        descriptionTe: 'చిన్న తగిలికలకే లేదా ఏ దెబ్బ తగలకుండానే చర్మంపై నల్లటి/నీలి రంగు మచ్చలు పడటం',
        nutrients: [
          { name: 'Vitamin C', teluguName: 'విటమిన్ సి', confidence: 'High', rationaleEn: 'Weakened collagen in capillary basement membranes causes microvessel rupture under everyday hydrostatic pressure.', rationaleTe: 'రక్తనాళాల గోడలు బలహీనపడటం వల్ల కొద్దిపాటి ఒత్తిడికే రక్తం కారి చర్మం కింద కమిలిపోతుంది.' },
          { name: 'Vitamin K', teluguName: 'విటమిన్ కె', confidence: 'High', rationaleEn: 'Coagulation pathway dependence: prothrombin synthesis relies directly on Vitamin K gamma-carboxylation.', rationaleTe: 'రక్తం గడ్డకట్టడానికి అవసరమైన ప్రోథ్రాంబిన్ తయారీకి విటమిన్ కె అత్యవసరం.' }
        ],
        severity: 'Moderate',
        recommendedFoodIds: ['amla', 'guava', 'spinach', 'drumstick_leaves', 'bell_peppers', 'orange', 'tomato'],
        synergies: [
          { pair: 'Vitamin C + Vitamin K Greens', descriptionEn: 'Dark leafy greens supply both Vitamin K for coagulation and Vitamin C for vessel walls.', descriptionTe: 'పాలకూర, మునగాకు వంటి ఆకుకూరలు విటమిన్ కె మరియు సి రెండింటినీ సమకూరుస్తాయి.' }
        ],
        redFlags: [
          'Spontaneous pinpoint red spots (petechiae), nosebleeds, blood in urine or stools',
          'Bruises continuing to expand rapidly in size'
        ],
        redFlagsTe: [
          'చర్మంపై చిన్న ఎర్రటి చుక్కలు, ముక్కు నుండి రక్తం లేదా మూత్రం/మలంలో రక్తం కనిపించడం',
          'కమిలిన మచ్చలు వేగంగా పెద్దవి కావడం'
        ]
      },
      {
        id: 'slow_healing',
        nameEn: 'Delayed Wound / Cut Healing',
        nameTe: 'గాయాలు ఆలస్యంగా మానడం',
        descriptionEn: 'Minor scrapes, scratches, or cuts take weeks to close and remain persistently raw',
        descriptionTe: 'చిన్న గీతలు లేదా గాయాలు వారాల తరబడి మానకుండా పచ్చిగా ఉండటం',
        nutrients: [
          { name: 'Zinc', teluguName: 'జింక్', confidence: 'High', rationaleEn: 'Essential for DNA polymerase and metalloproteinases during cellular migration and wound re-epithelialization.', rationaleTe: 'గాయం పైభాగంలో కొత్త చర్మ కణాలు వేగంగా ఏర్పడటానికి జింక్ చాలా అవసరం.' },
          { name: 'Vitamin C', teluguName: 'విటమిన్ సి', confidence: 'High', rationaleEn: 'Required for fibroblast collagen deposition and tensile scar formation.', rationaleTe: 'గాయం మానేందుకు అవసరమైన కొల్లాజెన్ పీచు తయారీకి విటమిన్ సి అత్యవసరం.' },
          { name: 'Protein', teluguName: 'ప్రొటీన్', confidence: 'High', rationaleEn: 'Fundamental amino acid building blocks for tissue reconstruction.', rationaleTe: 'కణజాల మరమ్మతుకు అవసరమైన మూలస్తంభం ప్రొటీన్.' }
        ],
        severity: 'Moderate',
        recommendedFoodIds: ['amla', 'egg', 'roasted_peanuts', 'chickpeas', 'lentils', 'paneer'],
        synergies: [
          { pair: 'Zinc + Vitamin C', descriptionEn: 'Both are frontline partners in epithelial regeneration and local white blood cell defenses.', descriptionTe: 'జింక్ మరియు విటమిన్ సి కలయిక గాయాలను త్వరగా మాన్పి ఇన్ఫెక్షన్లను నివారిస్తుంది.' }
        ],
        redFlags: [
          'Spreading redness, foul pus drainage, throbbing warmth, or systemic fever (Bacterial Infection)',
          'Non-healing lower extremity ulcers in individuals with known or suspected diabetes'
        ],
        redFlagsTe: [
          'గాయం చుట్టూ ఎర్రగా మారి చీము పట్టడం, తీవ్రమైన వేడి లేదా జ్వరం రావడం',
          'షుగర్ ఉన్నవారిలో కాళ్లపై గాయాలు అస్సలు మానకపోవడం'
        ]
      }
    ]
  },
  {
    id: 'legs_joints',
    nameEn: 'Legs, Bones & Muscles',
    nameTe: 'కాళ్లు, ఎముకలు & కీళ్లు (Legs & Bones)',
    icon: 'Activity',
    descriptionEn: 'Night calf cramps, restless legs, bone tenderness, muscular weakness',
    descriptionTe: 'రాత్రి కాళ్లు పట్టేయడం, పిక్కల నొప్పులు, ఎముకల బలహీనత లేదా అలసట',
    changes: [
      {
        id: 'muscle_cramps',
        nameEn: 'Frequent Nocturnal Calf Cramps',
        nameTe: 'రాత్రిపూట పిక్కలు పట్టేయడం (Muscle Cramps)',
        descriptionEn: 'Sudden, painful, involuntary muscle spasms in calves or feet waking you from sleep',
        descriptionTe: 'నిద్రలో ఉన్నప్పుడు అకస్మాత్తుగా కాళ్ల పిక్కలు గట్టిగా పట్టేసి తీవ్రమైన నొప్పి కలగడం',
        nutrients: [
          { name: 'Magnesium', teluguName: 'మెగ్నీషియం', confidence: 'Very High', rationaleEn: 'Natural NMDA receptor blocker and intracellular calcium antagonist that facilitates muscle relaxation after contraction.', rationaleTe: 'కండరాలు సంకోచించిన తర్వాత విశ్రాంతి పొందేందుకు మెగ్నీషియం సహజ విరుగుడుగా పనిచేస్తుంది.' },
          { name: 'Potassium & Calcium', teluguName: 'పొటాషియం మరియు కాల్షియం', confidence: 'High', rationaleEn: 'Maintain extracellular electrolyte gradients along sarcolemmal motor membranes.', rationaleTe: 'కండరాల నరాల సంకేతాలను సమతుల్యంగా ఉంచే కీలక ఎలక్ట్రోలైట్లు.' },
          { name: 'Vitamin D', teluguName: 'విటమిన్ డి', confidence: 'Moderate', rationaleEn: 'Regulates systemic calcium and magnesium homeostasis.', rationaleTe: 'శరీరంలో కాల్షియం మరియు మెగ్నీషియం నిల్వలను సమతుల్యం చేస్తుంది.' }
        ],
        severity: 'Mild to Moderate',
        recommendedFoodIds: ['banana', 'spinach', 'almonds', 'ragi', 'curd', 'sweet_potato', 'roasted_peanuts'],
        synergies: [
          { pair: 'Magnesium + Potassium Hydration', descriptionEn: 'Combine mineral-rich bananas and spinach with generous water intake to replenish intracellular fluid balance.', descriptionTe: 'అరటిపండు, పాలకూరలతో పాటు సరిపడా నీరు త్రాగడం వల్ల కండరాల తిమ్మిర్లు తగ్గుతాయి.' }
        ],
        redFlags: [
          'Cramps localized strictly to one calf accompanied by visible swelling, warmth, and redness (possible DVT clot)',
          'Severe persistent muscle rigidity or inability to bear weight'
        ],
        redFlagsTe: [
          'ఒకే కాలు పిక్కలో తీవ్రమైన వాపు, వేడి మరియు ఎరుపుదనం ఉండటం (రక్తం గడ్డకట్టే ప్రమాదం)',
          'కండరాలు పూర్తిగా బిగుసుకుపోయి నడవలేకపోవడం'
        ]
      },
      {
        id: 'restless_legs',
        nameEn: 'Restless Legs Sensation (RLS)',
        nameTe: 'రెస్ట్‌లెస్ లెగ్స్ సిండ్రోమ్ (కాళ్లు ఊపాలనిపించడం)',
        descriptionEn: 'Irresistible urge to move the legs accompanied by crawling, tingling, or creeping sensations when resting',
        descriptionTe: 'పడుకున్నప్పుడు లేదా కూర్చున్నప్పుడు కాళ్లలో చీమలు పాకుతున్నట్లు అనిపించి కాళ్లు కదపాలనిపించడం',
        nutrients: [
          { name: 'Iron (Central Ferritin)', teluguName: 'ఐరన్ (సెంట్రల్ ఫెర్రిటిన్)', confidence: 'Very High', rationaleEn: 'Iron is a critical cofactor for tyrosine hydroxylase, the rate-limiting enzyme in central dopamine synthesis that controls involuntary motor inhibition.', rationaleTe: 'మెదడులో కండరాల కదలికలను నియంత్రించే డోపమైన్ తయారీకి ఐరన్ అత్యవసర ఉత్ప్రేరకం.' },
          { name: 'Folate & Magnesium', teluguName: 'ఫోలేట్ మరియు మెగ్నీషియం', confidence: 'Moderate', rationaleEn: 'Support peripheral neuromuscular nerve transmission and smooth nerve impulse conduction.', rationaleTe: 'నరాల ద్వారా సంకేతాల ప్రసారానికి మరియు ప్రశాంతతకు తోడ్పడతాయి.' }
        ],
        severity: 'Moderate',
        recommendedFoodIds: ['spinach', 'black_chickpeas', 'lentils', 'vegetable_pulao', 'roasted_chana', 'almonds', 'amla'],
        synergies: [
          { pair: 'Iron + Vitamin C at Dinner', descriptionEn: 'Take iron-rich lentils with lemon at night to promote restful nighttime dopamine stabilization.', descriptionTe: 'రాత్రి భోజనంలో నిమ్మరసంతో కూడిన పప్పుధాన్యాలు తీసుకోవడం మంచిది.' }
        ],
        redFlags: [
          'Symptoms spread to arms or cause persistent chronic sleep deprivation impacting cardiac health'
        ],
        redFlagsTe: [
          'తిమ్మిర్లు చేతులకు కూడా పాకడం లేదా నిద్రలేమి వల్ల గుండెపై ప్రభావం పడటం'
        ]
      },
      {
        id: 'bone_tenderness',
        nameEn: 'Deep Bone Ache & Tender Shins',
        nameTe: 'ఎముకల లోపల నొప్పి & బలహీనత',
        descriptionEn: 'Dull deep aching pain in long bones (shins, ribs, hips) and muscular weakness when climbing stairs',
        descriptionTe: 'నడుస్తున్నప్పుడు లేదా మెట్లు ఎక్కుతున్నప్పుడు ఎముకలు, కండరాలలో లోతైన నొప్పి',
        nutrients: [
          { name: 'Vitamin D (Cholecalciferol)', teluguName: 'విటమిన్ డి', confidence: 'Very High', rationaleEn: 'Essential for intestinal calcium absorption. Deficiency causes osteomalacia (impaired bone mineralization) with sensory bone ache.', rationaleTe: 'ఎముకల దృఢత్వానికి కాల్షియం శోషణను విటమిన్ డి నియంత్రిస్తుంది. లోపిస్తే ఎముకలు మెత్తబడి నొప్పులు వస్తాయి.' },
          { name: 'Calcium', teluguName: 'కాల్షియం', confidence: 'Very High', rationaleEn: 'Constitutes hydroxyapatite crystals that give human skeleton mechanical compression resistance.', rationaleTe: 'మానవ అస్థిపంజర నిర్మాణానికి ప్రధాన ఆధారమైన ఖనిజం కాల్షియం.' }
        ],
        severity: 'Moderate to High',
        recommendedFoodIds: ['ragi', 'ragi_sangati', 'curd', 'paneer', 'sesame_seeds', 'egg', 'salmon'],
        synergies: [
          { pair: 'Calcium + Vitamin D + Sunlight', descriptionEn: 'Combine calcium champions like ragi with morning 15-20 minutes sun exposure for maximum bone mineralization.', descriptionTe: 'రాగి ముద్ద వంటి కాల్షియం ఆహారాలతో పాటు ఉదయం 15 నిమిషాల ఎండ తగిలేలా చూసుకోవాలి.' }
        ],
        redFlags: [
          'Sudden severe bone pain following minimal impact (suspected pathological fracture)',
          'Difficulty rising from a chair without pushing with arms (proximal myopathy)'
        ],
        redFlagsTe: [
          'చిన్న దెబ్బకే ఎముక విరిగినట్లు విపరీతమైన నొప్పి రావడం',
          'చేతుల సహాయం లేకుండా కుర్చీ నుండి లేచి నిలబడలేకపోవడం'
        ]
      }
    ]
  }
];

/**
 * Evaluates physical change inputs rule-based when Vision AI is not active or as baseline
 */
export const evaluateBodyChange = ({ bodyAreaId, changeId, duration, associatedSymptoms = [], language = 'en' }) => {
  const isTelugu = language === 'te';
  const area = BODY_AREAS.find((a) => a.id === bodyAreaId);

  if (!area) {
    return null;
  }

  const change = area.changes.find((c) => c.id === changeId) || area.changes[0];

  // Adjust urgency based on duration
  let calculatedUrgency = change.severity;
  if (duration === 'more_than_3_months') {
    calculatedUrgency = 'High (Chronic - Seek Medical Guidance)';
  } else if (duration === '1_to_3_months' && change.severity === 'Moderate') {
    calculatedUrgency = 'Moderate to High';
  }

  return {
    bodyArea: {
      id: area.id,
      name: isTelugu ? area.nameTe : area.nameEn,
      icon: area.icon
    },
    physicalChange: {
      id: change.id,
      name: isTelugu ? change.nameTe : change.nameEn,
      description: isTelugu ? change.descriptionTe : change.descriptionEn
    },
    duration,
    urgencyLevel: calculatedUrgency,
    correlatedNutrients: change.nutrients.map((n) => ({
      nutrient: isTelugu ? n.teluguName : n.name,
      confidence: n.confidence,
      rationale: isTelugu ? n.rationaleTe : n.rationaleEn
    })),
    recommendedFoodIds: change.recommendedFoodIds,
    synergies: change.synergies.map((s) => ({
      pair: s.pair,
      description: isTelugu ? s.descriptionTe : s.descriptionEn
    })),
    redFlags: isTelugu ? change.redFlagsTe : change.redFlags,
    educationalDisclaimer: isTelugu
      ? 'శరీర మార్పుల విశ్లేషణ కేవలం విద్యా మరియు పోషకాహార అవగాహన కొరకు మాత్రమే. ఇది వైద్య నిర్ధారణ లేదా చికిత్స కాదు.'
      : 'The Body Change Analyzer provides preventive nutritional awareness and does not medically diagnose health conditions. Please consult a qualified doctor for medical symptoms.'
  };
};
