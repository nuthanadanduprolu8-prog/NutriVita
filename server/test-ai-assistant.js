// Integration Test for VitaMate AI Assistant API
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 Starting VitaMate AI Assistant Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  };

  // 1. Prompts endpoint (English)
  await test('AI API: Retrieve English suggested prompt chips', async () => {
    const res = await fetch(`${BASE_URL}/ai/prompts?lang=en`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Failed to return prompt chips');
    }
    if (!data.data.some(p => p.text.toLowerCase().includes('vitamin b12'))) {
      throw new Error('Missing B12 prompt in English prompts');
    }
  });

  // 2. Prompts endpoint (Telugu)
  await test('AI API: Retrieve Telugu suggested prompt chips', async () => {
    const res = await fetch(`${BASE_URL}/ai/prompts?lang=te`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Failed to return Telugu prompt chips');
    }
    if (data.language !== 'te') throw new Error('Language is not te');
  });

  // 3. Validation: Reject empty message
  await test('AI API: Reject empty query with 400 status', async () => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '   ' }),
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // 4. English Question: Vitamin B12 vegetarian sources
  await test('AI API: Query Vitamin B12 vegetarian sources in English', async () => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What are the best vegetarian sources of Vitamin B12?',
        language: 'en',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.message) throw new Error('Missing response message');
    if (!data.message.toLowerCase().includes('b12') && !data.message.toLowerCase().includes('cobalamin')) {
      throw new Error('Response does not discuss B12');
    }
    if (!data.disclaimer) throw new Error('Missing preventive disclaimer');
    if (!data.relatedFoods || data.relatedFoods.length === 0) throw new Error('Missing related foods metadata');
  });

  // 5. Telugu Question: Fatigue / Anemia / Iron
  await test('AI API: Query fatigue and anemia prevention in Telugu', async () => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'అలసట మరియు రక్తహీనత నివారణకు ఏ ఆహారాలు మేలు?',
        language: 'te',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.message) throw new Error('Missing response message');
    if (data.language !== 'te') throw new Error('Expected Telugu language flag');
    if (!data.message.includes('మునగాకు') && !data.message.includes('పాలకూర') && !data.message.includes('ఐరన్')) {
      throw new Error('Telugu response missing essential iron/moringa food advice');
    }
    if (!data.disclaimer) throw new Error('Missing Telugu disclaimer');
  });

  // 6. Symptom query: Bleeding gums (verifies non-diagnostic CSP disclaimer)
  await test('AI API: Query bleeding gums (verifies strict preventive disclaimer)', async () => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'My gums bleed when I brush. Do I have scurvy?',
        language: 'en',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.message.toLowerCase().includes('vitamin c') && !data.message.toLowerCase().includes('amla')) {
      throw new Error('Expected discussion of Vitamin C or Amla');
    }
    // Verify CSP medical disclaimer is strictly present
    if (!data.message.includes('Note:') && !data.disclaimer) {
      throw new Error('Missing mandatory medical disclaimer');
    }
  });

  // 7. Synergy query: Iron and Vitamin C
  await test('AI API: Query Iron and Vitamin C synergy', async () => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'How does Vitamin C help with iron absorption?',
        language: 'en',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.message.toLowerCase().includes('synergy') && !data.message.toLowerCase().includes('iron')) {
      throw new Error('Synergy not addressed properly');
    }
  });

  console.log(`\n========================================`);
  console.log(`🏁 VitaMate AI Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
};

runTests();
