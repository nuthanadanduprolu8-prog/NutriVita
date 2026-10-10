// Foundation Automated Integration Tester
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 Starting NutriVita Foundation Integration Tests...\n');
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

  // 1. Health check
  await test('Server Health Check', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error('Status not healthy');
  });

  // 2. Reject registration with missing fields
  await test('Registration Validation: Reject missing fields', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Incomplete' }),
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // 3. Successful registration
  let authToken = '';
  const testEmail = `wellness_${Date.now()}@nutrivita.org`;

  await test('User Registration Flow', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Ramesh Kumar',
        email: testEmail,
        password: 'SecurePassword123',
        age: 28,
        gender: 'male',
        dietaryPreference: 'vegetarian',
        activityLevel: 'moderate',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.token) throw new Error('No JWT token returned');
    if (data.user.email !== testEmail) throw new Error('User email mismatch');
    authToken = data.token;
  });

  // 4. Duplicate email prevention
  await test('Registration: Duplicate Email Rejection', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Person',
        email: testEmail,
        password: 'AnotherPassword',
      }),
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // 5. Login with invalid password
  await test('Login: Reject Invalid Password', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword!',
      }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 6. Login with valid password
  await test('Login: Successful Authentication & Token Issuance', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'SecurePassword123',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.token) throw new Error('No JWT token returned');
    authToken = data.token;
  });

  // 7. Protected route without token
  await test('Protected Route Guard: Reject unauthenticated request', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 8. Protected route with token
  await test('Protected Route Guard: Allow authenticated user (/auth/me)', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.user.email !== testEmail) throw new Error('Fetched wrong user');
  });

  // 9. Profile update
  await test('User Profile Update: Save dietary preference and age', async () => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        age: 29,
        dietaryPreference: 'vegan',
        languagePreference: 'te',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.user.dietaryPreference !== 'vegan') throw new Error('Dietary preference not updated');
    if (data.user.age !== 29) throw new Error('Age not updated');
  });

  console.log(`\n========================================`);
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
};

runTests();
