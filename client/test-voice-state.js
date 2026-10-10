// Focused Unit & Logic Tester for Voice Support and State Management
import assert from 'node:assert';

console.log('🧪 Starting NutriVita Voice Support Logic & State Machine Tests...\n');

let passed = 0;
let failed = 0;

const test = (name, fn) => {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name} ->`, err.message);
    failed++;
  }
};

// Test 1: Markdown Cleaning for Text-to-Speech
const cleanMarkdownForSpeech = (markdown = '') => {
  return markdown
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^[*+-]\s+/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ', ')
    .trim();
};

test('TTS: Markdown cleaner removes headers, bold tags, and list bullets', () => {
  const input = `### Vitamin C & Collagen\n\n* **Indian Gooseberry (Amla):** Rich in *ascorbic acid*.\n* **Guava:** 228mg Vitamin C.`;
  const cleaned = cleanMarkdownForSpeech(input);

  assert(!cleaned.includes('###'), 'Headers should be stripped');
  assert(!cleaned.includes('**'), 'Bold asterisks should be stripped');
  assert(!cleaned.includes('* '), 'List bullets should be stripped');
  assert(cleaned.includes('Indian Gooseberry (Amla): Rich in ascorbic acid'), 'Content text should be preserved intact');
});

// Test 2: Speech Recognition Locale Selection
const getRecognitionLocale = (language) => {
  if (language === 'te') return 'te-IN';
  return 'en-IN'; // Indian English
};

test('Speech Recognition Locale: Correct mapping for English and Telugu', () => {
  assert.strictEqual(getRecognitionLocale('en'), 'en-IN', 'English should map to en-IN');
  assert.strictEqual(getRecognitionLocale('te'), 'te-IN', 'Telugu should map to te-IN');
});

// Test 3: Speech Synthesis Voice Matching Logic
const selectBestVoice = (availableVoices, language) => {
  if (language === 'te') {
    return availableVoices.find(v =>
      (v.lang && (v.lang.toLowerCase() === 'te-in' || v.lang.toLowerCase().startsWith('te'))) ||
      (v.name && v.name.toLowerCase().includes('telugu'))
    ) || null;
  }

  // English: prefer Indian English
  const indianEn = availableVoices.find(v =>
    v.lang && (v.lang.toLowerCase() === 'en-in' || v.name.toLowerCase().includes('india'))
  );
  if (indianEn) return indianEn;

  // Fallback to generic English
  return availableVoices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) || null;
};

test('TTS Voice Matcher: Selects en-IN when available for English', () => {
  const mockVoices = [
    { name: 'Google US English', lang: 'en-US' },
    { name: 'Google India English', lang: 'en-IN' },
    { name: 'Microsoft David', lang: 'en-US' }
  ];

  const matched = selectBestVoice(mockVoices, 'en');
  assert.strictEqual(matched?.name, 'Google India English', 'Should prefer en-IN voice');
});

test('TTS Voice Matcher: Gracefully returns null for Telugu if te-IN is missing', () => {
  const mockVoicesWithoutTelugu = [
    { name: 'Google US English', lang: 'en-US' },
    { name: 'Google India English', lang: 'en-IN' }
  ];

  const matched = selectBestVoice(mockVoicesWithoutTelugu, 'te');
  assert.strictEqual(matched, null, 'Must never speak English for Telugu text if te-IN missing');
});

test('TTS Voice Matcher: Successfully selects Telugu voice when present', () => {
  const mockVoicesWithTelugu = [
    { name: 'Google US English', lang: 'en-US' },
    { name: 'Google Telugu', lang: 'te-IN' }
  ];

  const matched = selectBestVoice(mockVoicesWithTelugu, 'te');
  assert.strictEqual(matched?.name, 'Google Telugu', 'Should select Telugu voice');
});

// Test 4: Error State Machine Transitions
const mapRecognitionError = (error, language = 'en') => {
  switch (error) {
    case 'not-allowed':
    case 'permission-denied':
      return {
        status: 'permission-denied',
        message: language === 'te' ? 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది.' : 'Microphone permission denied.'
      };
    case 'audio-capture':
      return {
        status: 'error',
        message: language === 'te' ? 'మైక్రోఫోన్ అందుబాటులో లేదు.' : 'Microphone is unavailable.'
      };
    case 'no-speech':
      return {
        status: 'idle',
        message: language === 'te' ? 'ఎలాంటి ధ్వని గుర్తించబడలేదు.' : 'No speech was detected.'
      };
    case 'network':
      return {
        status: 'error',
        message: language === 'te' ? 'నెట్‌వర్క్ సమస్య ఏర్పడింది.' : 'Network error during voice recognition.'
      };
    default:
      return {
        status: 'error',
        message: 'Voice recognition encountered an error.'
      };
  }
};

test('Speech Recognition Errors: Permission denied maps to permission-denied status', () => {
  const res = mapRecognitionError('not-allowed', 'en');
  assert.strictEqual(res.status, 'permission-denied');
  assert(res.message.includes('permission denied'));
});

test('Speech Recognition Errors: No-speech resets cleanly to idle status', () => {
  const res = mapRecognitionError('no-speech', 'en');
  assert.strictEqual(res.status, 'idle');
  assert(res.message.includes('No speech'));
});

test('Speech Recognition Errors: Bilingual error messages in Telugu', () => {
  const res = mapRecognitionError('not-allowed', 'te');
  assert.strictEqual(res.status, 'permission-denied');
  assert(res.message.includes('అనుమతి నిరాకరించబడింది'));
});

console.log(`\n========================================`);
console.log(`🏁 Voice Logic Test Summary: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
