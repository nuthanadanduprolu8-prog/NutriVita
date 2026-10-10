/**
 * NutriVita Default Body Areas and Observable Physical Changes
 * Client-side immediate fallback ensuring instant page rendering without network delays.
 */

export const DEFAULT_BODY_AREAS = [
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
        severity: 'Moderate to High'
      },
      {
        id: 'brittle_nails',
        nameEn: 'Brittle, Cracking, or Peeling Nails',
        nameTe: 'పెళుసైన, విరిగిపోయే గోర్లు',
        descriptionEn: 'Nails snap, split easily, peel in layers, or fail to grow without breaking',
        descriptionTe: 'గోర్లు సులువుగా పగిలిపోవడం లేదా పొరలుగా ఊడిపోవడం',
        severity: 'Mild to Moderate'
      },
      {
        id: 'white_spots',
        nameEn: 'White Spots / Leukonychia Dots',
        nameTe: 'గోర్లపై తెల్లటి మచ్చలు (చుక్కలు)',
        descriptionEn: 'Scattered small milky-white speckles or transverse bands across nail plates',
        descriptionTe: 'గోరు ఉపరితలంపై తెల్లని చిన్న మచ్చలు లేదా చారలు ఏర్పడటం',
        severity: 'Mild'
      },
      {
        id: 'pale_nail_beds',
        nameEn: 'Pale or Chalky Nail Beds',
        nameTe: 'పాలిపోయిన గోరు పడకలు (రక్తహీనత)',
        descriptionEn: 'Loss of natural pink vascular undertone beneath the nail plate upon gentle press',
        descriptionTe: 'గోరు కింద సహజమైన గులాబీ రంగు తగ్గి పాలిపోయి కనిపించడం',
        severity: 'Moderate'
      }
    ]
  },
  {
    id: 'hair',
    nameEn: 'Hair & Scalp',
    nameTe: 'జుట్టు & మాడు (Hair & Scalp)',
    icon: 'Sparkles',
    descriptionEn: 'Thinning, shedding, premature greying, dryness, or flaky scalp',
    descriptionTe: 'జుట్టు రాలడం, పలచబడటం, తెల్లబడటం లేదా చుండ్రు/పొడిబారడం',
    changes: [
      {
        id: 'diffuse_hair_shedding',
        nameEn: 'Excessive Diffuse Hair Shedding',
        nameTe: 'విపరీతంగా జుట్టు రాలడం (Hair Fall)',
        descriptionEn: 'Noticeable hair loss while washing or brushing without localized bald circular patches',
        descriptionTe: 'దువ్వినప్పుడు లేదా తలస్నానం చేసినప్పుడు పెద్ద మొత్తంలో జుట్టు రాలడం',
        severity: 'Mild to Moderate'
      },
      {
        id: 'dry_brittle_hair',
        nameEn: 'Dry, Dull, & Straw-like Hair',
        nameTe: 'పొడిబారిన, జీవం లేని జుట్టు',
        descriptionEn: 'Hair loses luster, snaps easily, develops split ends, or resists moisture',
        descriptionTe: 'జుట్టు మెరుపు కోల్పోయి, సులువుగా తెగిపోవడం',
        severity: 'Mild'
      },
      {
        id: 'premature_greying',
        nameEn: 'Premature Greying (Before Age 30)',
        nameTe: 'చిన్న వయసులోనే జుట్టు నెరవడం',
        descriptionEn: 'Loss of melanin pigment across hair follicles before age 25–30',
        descriptionTe: 'వయసు రాకముందే జుట్టు తెల్లబడటం (మెలనిన్ లోపం)',
        severity: 'Mild'
      }
    ]
  },
  {
    id: 'eyes',
    nameEn: 'Eyes & Vision Comfort',
    nameTe: 'కళ్ళు & దృష్టి (Eyes & Vision)',
    icon: 'Eye',
    descriptionEn: 'Night vision difficulty, dryness, gritty fatigue, or pale inner conjunctiva',
    descriptionTe: 'చీకటిలో సరిగ్గా కనిపించకపోవడం, కళ్ళు పొడిబారడం లేదా పాలిపోవడం',
    changes: [
      {
        id: 'night_blindness_strain',
        nameEn: 'Poor Twilight/Night Vision or Slow Dark Adaptation',
        nameTe: 'రాత్రిపూట లేదా మసక వెలుతురులో చూపు మందగించడం',
        descriptionEn: 'Difficulty adjusting when entering dim rooms or driving at dusk',
        descriptionTe: 'మసక వెలుతురులో లేదా చీకటి గదిలోకి వెళ్ళినప్పుడు సరిగ్గా కనిపించకపోవడం',
        severity: 'Moderate to High'
      },
      {
        id: 'dry_gritty_eyes',
        nameEn: 'Persistent Dry, Gritty, or Burning Eyes',
        nameTe: 'కళ్ళు పొడిబారడం, మంట లేదా ఇసుక పోసినట్లు అనిపించడం',
        descriptionEn: 'Lack of protective tear film moisture leading to chronic irritation and blinking strain',
        descriptionTe: 'కంటిలో తేమ తగ్గి ఎర్రబడటం మరియు నిరంతరం మంట కలగడం',
        severity: 'Mild to Moderate'
      },
      {
        id: 'pale_conjunctiva',
        nameEn: 'Pale Inner Lower Eyelids (Conjunctival Pallor)',
        nameTe: 'కనురెప్పల లోపలి భాగం పాలిపోవడం',
        descriptionEn: 'Gently pulling down lower eyelid reveals pale porcelain color rather than vibrant pink/red',
        descriptionTe: 'కనురెప్ప లోపలి భాగంలో సహజమైన ఎరుపు రంగు తగ్గి పాలిపోయి ఉండటం',
        severity: 'Moderate to High'
      }
    ]
  },
  {
    id: 'mouth_lips',
    nameEn: 'Mouth, Lips & Tongue',
    nameTe: 'నోరు, పెదవులు & నాలుక (Mouth & Lips)',
    icon: 'Smile',
    descriptionEn: 'Cracked lip corners, bleeding gums, burning tongue, or recurrent ulcers',
    descriptionTe: 'పెదవుల మూలల్లో పగుళ్లు, చిగుళ్ళ రక్తస్రావం లేదా నాలుక మంట',
    changes: [
      {
        id: 'cracked_corners_lips',
        nameEn: 'Cracked Lip Corners (Angular Cheilitis)',
        nameTe: 'పెదవుల మూలల్లో పగుళ్లు (Angular Cheilitis)',
        descriptionEn: 'Painful fissures, redness, crusting, or peeling at the corners of mouth',
        descriptionTe: 'నోటి మూలల్లో పగుళ్లు వచ్చి నొప్పెట్టడం, రక్తం కారడం',
        severity: 'Moderate'
      },
      {
        id: 'bleeding_spongy_gums',
        nameEn: 'Bleeding, Swollen, or Tender Gums',
        nameTe: 'చిగుళ్ల వాపు లేదా రక్తస్రావం',
        descriptionEn: 'Gums bleed readily upon gentle brushing or flossing with swelling and redness',
        descriptionTe: 'బ్రష్ చేసుకునేటప్పుడు చిగుళ్ల నుండి రక్తం రావడం మరియు వాపు',
        severity: 'Moderate'
      },
      {
        id: 'smooth_burning_tongue',
        nameEn: 'Smooth, Red, or Burning Tongue (Glossitis)',
        nameTe: 'నాలుక ఎర్రబడి మంట పుట్టడం (Glossitis)',
        descriptionEn: 'Loss of natural papillae texturing leaving tongue slick, tender, or sensitive to spice',
        descriptionTe: 'నాలుకపై మొగ్గలు నశించి ఎర్రగా, నునుపుగా మారి కారం తట్టుకోలేకపోవడం',
        severity: 'Moderate to High'
      }
    ]
  },
  {
    id: 'skin',
    nameEn: 'Skin & Complexion',
    nameTe: 'చర్మం (Skin & Texture)',
    icon: 'Shield',
    descriptionEn: 'Dry flaky rough texture, bumpy skin behind arms, slow wound healing',
    descriptionTe: 'చర్మం పొడిబారడం, చేతుల వెనుక చిన్న గుల్లలు లేదా గాయాలు నెమ్మదిగా మానడం',
    changes: [
      {
        id: 'rough_bumpy_skin',
        nameEn: 'Rough, Bumpy "Goosebump" Skin on Arms/Thighs',
        nameTe: 'చేతుల వెనుక గరుకైన చిన్న గుల్లలు (Keratosis Pilaris)',
        descriptionEn: 'Keratin plugs block hair follicles giving a sandpaper-like rash on upper arms or thighs',
        descriptionTe: 'భుజాలు మరియు తొడలపై ఇసుకలా గరుకుగా ఉండే చిన్న చిన్న గుల్లలు',
        severity: 'Mild'
      },
      {
        id: 'excessive_dry_flaky_skin',
        nameEn: 'Severe Dry, Scaling, or Flaking Skin',
        nameTe: 'చర్మం తీవ్రంగా పొడిబారడం లేదా పొట్టు రాలడం',
        descriptionEn: 'Compromised lipid moisture barrier leading to tightness, ashy lines, and scaling',
        descriptionTe: 'చర్మంపై సహజ తేమ తగ్గి తెల్లగా చారలు రావడం, పొట్టు రాలడం',
        severity: 'Mild to Moderate'
      },
      {
        id: 'slow_wound_healing',
        nameEn: 'Delayed Wound Healing & Easy Bruising',
        nameTe: 'చిన్న దెబ్బలు నెమ్మదిగా మానడం లేదా సులువుగా కమిలిపోవడం',
        descriptionEn: 'Minor scratches, scrapes, or insect bites take weeks to resolve with prolonged redness',
        descriptionTe: 'చిన్న గీతలు లేదా దెబ్బలు మానడానికి ఎక్కువ సమయం పట్టడం',
        severity: 'Moderate'
      }
    ]
  },
  {
    id: 'legs_joints',
    nameEn: 'Legs, Muscles & Joints',
    nameTe: 'శక్తి & కండరాలు (Muscles & Energy)',
    icon: 'Activity',
    descriptionEn: 'Muscle twitches, nighttime leg cramps, prolonged exhaustion, bone aching',
    descriptionTe: 'కండరాల నొప్పులు, రాత్రిపూట పిక్కలు పట్టేయడం లేదా తీవ్రమైన నీరసం',
    changes: [
      {
        id: 'nocturnal_calf_cramps',
        nameEn: 'Nighttime Calf or Foot Muscle Spasms',
        nameTe: 'రాత్రిపూట పిక్కలు లేదా పాదాల కండరాలు పట్టేయడం',
        descriptionEn: 'Sudden intense involuntary muscle contractions waking you from sleep',
        descriptionTe: 'నిద్రలో అకస్మాత్తుగా పిక్కలు పట్టేసి తీవ్రమైన నొప్పి రావడం',
        severity: 'Moderate'
      },
      {
        id: 'muscle_twitching_fasciculations',
        nameEn: 'Eyelid or Facial Muscle Twitches',
        nameTe: 'కనురెప్పలు లేదా ముఖ కండరాలు కొట్టుకోవడం (Twitching)',
        descriptionEn: 'Repetitive involuntary fluttering or micro-spasms in eyelid or facial muscles',
        descriptionTe: 'కనురెప్పలు లేదా ముఖంపై చిన్న కండరాలు పదేపదే కొట్టుకోవడం',
        severity: 'Mild'
      },
      {
        id: 'deep_bone_aching',
        nameEn: 'Deep Dull Bone or Lower Back Aching',
        nameTe: 'ఎముకల్లో లేదా నడుము కింది భాగంలో నిరంతర నొప్పి',
        descriptionEn: 'Aching sensation deep within pelvic bones, shins, or lumbar spine without injury',
        descriptionTe: 'ఎటువంటి దెబ్బ తగలకుండానే ఎముకలు, నడుము లోతుగా నొప్పిగా అనిపించడం',
        severity: 'Moderate to High'
      }
    ]
  }
];
