import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('========================================================');
  console.log('🔍 NUTRIVITA ISSUE 1 & ISSUE 2 VERIFICATION SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}: ${details}`);
    }
  }

  // -----------------------------------------------------------------
  // ISSUE 1: BODY SIGNS ASSESSMENT MODE & ACCURACY
  // -----------------------------------------------------------------
  console.log('📋 Test Group 1: Body Signs Assessment Mode & Medical Notice');

  let analyzerStatus = null;
  try {
    const statusRes = await fetch(`${BASE_URL}/body-analyzer/status`);
    analyzerStatus = await statusRes.json();
    assert(statusRes.ok && analyzerStatus.success, '1a. GET /api/body-analyzer/status is reachable');
    assert(typeof analyzerStatus.visionAiConfigured === 'boolean', '1b. Body analyzer status returns boolean visionAiConfigured');
    assert(typeof analyzerStatus.visionAiReachable === 'boolean', '1c. Body analyzer status returns boolean visionAiReachable');
    assert(analyzerStatus.modes && analyzerStatus.modes.length >= 4, '1d. Body analyzer status returns all evaluation modes');
  } catch (err) {
    assert(false, '1a. Body analyzer status check failed', err.message);
  }

  try {
    const assessRes = await fetch(`${BASE_URL}/body-analyzer/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bodyArea: 'nails',
        physicalChange: 'spoon_nails',
        duration: '1_to_4_weeks',
        associatedSymptoms: ['fatigue', 'cold_intolerance'],
        language: 'en'
      })
    });
    const assessJson = await assessRes.json();
    assert(assessRes.ok && assessJson.success, '1e. POST /api/body-analyzer/assess succeeds');
    
    // Check transparent mode notice
    const hasRequiredNotice = assessJson.data.apiKeyNotice.includes('Educational Rules-Based Mode Active') &&
      (!analyzerStatus?.visionAiConfigured ? assessJson.data.apiKeyNotice.includes('AI-powered photo analysis is currently unavailable') : true);
    assert(hasRequiredNotice, '1f. Exact Educational Rules-Based message displayed');

    // Never claim AI was used when unconfigured
    assert(assessJson.data.visionAiUsed === false, '1g. Never claims vision AI was used when unconfigured');
    assert(assessJson.data.photoAnalyzed === false, '1h. Explicitly reports photoAnalyzed: false');

    // Check non-diagnostic medical notice
    assert(
      assessJson.data.nonDiagnosticNotice && assessJson.data.nonDiagnosticNotice.includes('non-diagnostic'),
      '1i. Non-diagnostic medical notice present in English'
    );
  } catch (err) {
    assert(false, '1e. Body signs assessment failed', err.message);
  }

  // Telugu language assessment
  try {
    const teRes = await fetch(`${BASE_URL}/body-analyzer/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bodyArea: 'nails',
        physicalChange: 'spoon_nails',
        duration: '1_to_4_weeks',
        language: 'te'
      })
    });
    const teJson = await teRes.json();
    assert(
      teJson.data.apiKeyNotice.includes('ఎడ్యుకేషనల్ రూల్స్-బేస్డ్ మోడ్ యాక్టివ్‌గా ఉంది'),
      '1j. Telugu assessment returns localized educational mode notice'
    );
    assert(
      teJson.data.nonDiagnosticNotice.includes('వైద్య గమనిక'),
      '1k. Telugu assessment returns localized non-diagnostic medical notice'
    );
  } catch (err) {
    assert(false, '1j. Telugu body signs assessment failed', err.message);
  }

  // -----------------------------------------------------------------
  // ISSUE 2: LABEL LENS & FOOD RECOGNITION PIPELINE
  // -----------------------------------------------------------------
  console.log('\n🔍 Test Group 2: Label Lens & Accurate Food Recognition');

  try {
    const scannerStatusRes = await fetch(`${BASE_URL}/scanner/status`);
    const scannerStatusJson = await scannerStatusRes.json();
    assert(scannerStatusRes.ok && scannerStatusJson.success, '2a. GET /api/scanner/status is reachable');
    assert(typeof scannerStatusJson.visionAiConfigured === 'boolean', '2b. Scanner status returns boolean visionAiConfigured');
    assert(typeof scannerStatusJson.visionAiReachable === 'boolean', '2c. Scanner status returns boolean visionAiReachable');
  } catch (err) {
    assert(false, '2a. Scanner status failed', err.message);
  }

  // Test real image upload handling with multipart form data
  const applePath = path.resolve('client/public/images/foods/apple.jpg');
  if (fs.existsSync(applePath)) {
    try {
      const appleBuffer = fs.readFileSync(applePath);
      const blob = new Blob([appleBuffer], { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('image', blob, 'apple.jpg');

      const appleRes = await fetch(`${BASE_URL}/scanner/identify`, {
        method: 'POST',
        body: formData
      });
      const appleData = await appleRes.json();
      
      // When GEMINI_API_KEY is unconfigured, it must NOT guess beetroot or orange!
      if (!appleData.visionAiAvailable) {
        assert(
          appleData.matched === null,
          '2d. When Vision AI is unconfigured, image upload returns matched: null (no fake heuristic guessing)'
        );
        assert(
          appleData.source === 'unconfigured',
          '2e. Reports source: "unconfigured" honestly'
        );
      } else {
        assert(
          appleData.matched?.id === 'apple',
          '2d. Apple image correctly matched to apple (not beetroot)'
        );
      }
    } catch (err) {
      assert(false, '2d. Apple image upload test failed', err.message);
    }
  }

  // Test Mango image upload
  const mangoPath = path.resolve('client/public/images/foods/mango.jpg');
  if (fs.existsSync(mangoPath)) {
    try {
      const mangoBuffer = fs.readFileSync(mangoPath);
      const blob = new Blob([mangoBuffer], { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('image', blob, 'mango.jpg');

      const mangoRes = await fetch(`${BASE_URL}/scanner/identify`, {
        method: 'POST',
        body: formData
      });
      const mangoData = await mangoRes.json();
      
      if (!mangoData.visionAiAvailable) {
        assert(
          mangoData.matched === null,
          '2f. When Vision AI is unconfigured, mango photo returns matched: null (never misidentified as orange)'
        );
      } else {
        assert(
          mangoData.matched?.id === 'mango',
          '2f. Mango image correctly matched to mango (not orange)'
        );
      }
    } catch (err) {
      assert(false, '2f. Mango image upload test failed', err.message);
    }
  }

  // Test deterministic Food Synonym Mapping (verifying no cross-confusion)
  const { matchAiNameToDatabase } = await import('./server/controllers/scannerController.js');
  const { memoryStore } = await import('./server/config/db.js');
  const allFoods = memoryStore.foods;

  const mangoMatch = matchAiNameToDatabase('mango', allFoods);
  assert(mangoMatch?.id === 'mango', '2g. "mango" maps to Mango (never Orange)');

  const orangeMatch = matchAiNameToDatabase('orange', allFoods);
  assert(orangeMatch?.id === 'orange', '2h. "orange" maps to Sweet Orange');

  const appleMatch = matchAiNameToDatabase('apple', allFoods);
  assert(appleMatch?.id === 'apple', '2i. "apple" maps to Fresh Apple (never Beetroot)');

  const beetrootMatch = matchAiNameToDatabase('beetroot', allFoods);
  assert(beetrootMatch?.id === 'beetroot_poriyal', '2j. "beetroot" maps to Beetroot Poriyal');

  const sambarMatch = matchAiNameToDatabase('south indian sambar', allFoods);
  assert(sambarMatch?.id === 'sambar', '2k. "south indian sambar" maps to Sambar');

  const tomatoDalMatch = matchAiNameToDatabase('tomato dal', allFoods);
  assert(tomatoDalMatch?.id === 'tomato_dal', '2l. "tomato dal" maps to Tomato Dal');

  const spinachMatch = matchAiNameToDatabase('palak spinach', allFoods);
  assert(spinachMatch?.id === 'spinach', '2m. "palak spinach" maps to Spinach');

  const chickenMatch = matchAiNameToDatabase('indian chicken curry', allFoods);
  assert(chickenMatch?.id === 'chicken_curry', '2n. "indian chicken curry" maps to Indian Chicken Curry');

  // Verify UI safety check in frontend files
  const labelLensCode = fs.readFileSync('client/src/pages/LabelLens.jsx', 'utf8');
  assert(
    labelLensCode.includes('activeScanIdRef') && labelLensCode.includes('abortControllerRef'),
    '2o. LabelLens implements scanId and abortController to prevent race conditions'
  );
  assert(
    labelLensCode.includes('processImage(file, dataUrl)'),
    '2p. LabelLens camera modal passes actual captured File and DataUrl directly'
  );
  assert(
    labelLensCode.includes('Not this food?'),
    '2q. LabelLens provides manual correction option ("Not this food?")'
  );

  const bodyChangeCode = fs.readFileSync('client/src/pages/BodyChangeAnalyzer.jsx', 'utf8');
  assert(
    bodyChangeCode.includes('Visible Observations') && bodyChangeCode.includes('User-Reported Symptoms'),
    '2r. BodyChangeAnalyzer clearly separates visible observations from user symptoms'
  );
  assert(
    bodyChangeCode.includes('Confirmed Medical Notice: Educational & Non-Diagnostic'),
    '2s. BodyChangeAnalyzer renders prominent educational non-diagnostic medical notice'
  );

  console.log('\n--------------------------------------------------------');
  console.log(`Results: ${passed} / ${total} Verification Tests Passed`);
  console.log('--------------------------------------------------------\n');

  if (passed === total) {
    console.log('🎉 ALL ISSUE 1 & ISSUE 2 VERIFICATIONS PASSED 100%!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME VERIFICATIONS FAILED!\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
