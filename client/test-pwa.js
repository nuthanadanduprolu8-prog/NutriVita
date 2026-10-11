import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let passedTests = 0;
let totalTests = 0;

function assert(condition, name, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    console.error(`  ❌ [FAIL] ${name}: ${details}`);
    process.exitCode = 1;
  }
}

function readPngDimensions(buffer) {
  // Check PNG signature
  if (buffer.length < 24) return null;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  if (!isPng) return null;
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

console.log('\n======================================================');
console.log('📱 NUTRIVITA PROGRESSIVE WEB APP (PWA) TEST SUITE');
console.log('======================================================\n');

// Group 1: Manifest Integrity
console.log('📋 Test Group 1: Web App Manifest Specifications');
const manifestPath = path.join(__dirname, 'dist', 'manifest.webmanifest');
assert(fs.existsSync(manifestPath), '1a. manifest.webmanifest exists in build output');

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(manifest.name === 'NutriVita', '1b. App name is "NutriVita"', `Got ${manifest.name}`);
  assert(manifest.short_name === 'NutriVita', '1c. Short name is "NutriVita"', `Got ${manifest.short_name}`);
  assert(manifest.theme_color.toLowerCase() === '#059669', '1d. Theme color matches NutriVita emerald (#059669)', `Got ${manifest.theme_color}`);
  assert(manifest.background_color.toLowerCase() === '#f8fafc', '1e. Background color is suitable (#f8fafc)', `Got ${manifest.background_color}`);
  assert(manifest.display === 'standalone', '1f. Display mode is standalone', `Got ${manifest.display}`);
  assert(manifest.start_url === '/', '1g. Start URL is "/"', `Got ${manifest.start_url}`);
  assert(manifest.scope === '/', '1h. Scope is "/"', `Got ${manifest.scope}`);

  const icon192 = manifest.icons.find(i => i.sizes === '192x192');
  assert(Boolean(icon192), '1i. Manifest defines 192x192 icon');
  assert(icon192?.type === 'image/png', '1j. 192x192 icon has image/png type');

  const icon512 = manifest.icons.find(i => i.sizes === '512x512' && (i.purpose === 'any' || !i.purpose));
  assert(Boolean(icon512), '1k. Manifest defines 512x512 icon');
  assert(icon512?.type === 'image/png', '1l. 512x512 icon has image/png type');

  const maskable512 = manifest.icons.find(i => i.purpose === 'maskable');
  assert(Boolean(maskable512), '1m. Manifest defines maskable icon');
}

// Group 2: PNG Icon Files Binary Verification
console.log('\n📋 Test Group 2: PNG Icon Binaries & Geometry');
const publicDir = path.join(__dirname, 'public');

const icon192Buf = fs.readFileSync(path.join(publicDir, 'pwa-192x192.png'));
const dim192 = readPngDimensions(icon192Buf);
assert(Boolean(dim192), '2a. pwa-192x192.png has valid PNG binary signature');
assert(dim192?.width === 192 && dim192?.height === 192, '2b. pwa-192x192.png dimensions are exactly 192x192', `Got ${dim192?.width}x${dim192?.height}`);

const icon512Buf = fs.readFileSync(path.join(publicDir, 'pwa-512x512.png'));
const dim512 = readPngDimensions(icon512Buf);
assert(Boolean(dim512), '2c. pwa-512x512.png has valid PNG binary signature');
assert(dim512?.width === 512 && dim512?.height === 512, '2d. pwa-512x512.png dimensions are exactly 512x512', `Got ${dim512?.width}x${dim512?.height}`);

const maskableBuf = fs.readFileSync(path.join(publicDir, 'maskable-icon-512x512.png'));
const dimMask = readPngDimensions(maskableBuf);
assert(Boolean(dimMask), '2e. maskable-icon-512x512.png has valid PNG binary signature');
assert(dimMask?.width === 512 && dimMask?.height === 512, '2f. maskable-icon-512x512.png dimensions are 512x512', `Got ${dimMask?.width}x${dimMask?.height}`);

const appleBuf = fs.readFileSync(path.join(publicDir, 'apple-touch-icon.png'));
const dimApple = readPngDimensions(appleBuf);
assert(Boolean(dimApple), '2g. apple-touch-icon.png has valid PNG signature');
assert(dimApple?.width === 180 && dimApple?.height === 180, '2h. apple-touch-icon.png dimensions are 180x180', `Got ${dimApple?.width}x${dimApple?.height}`);

// Group 3: Service Worker & Safe Caching
console.log('\n📋 Test Group 3: Service Worker & Workbox Caching Rules');
const swPath = path.join(__dirname, 'dist', 'sw.js');
assert(fs.existsSync(swPath), '3a. Service worker sw.js generated in dist');

if (fs.existsSync(swPath)) {
  const swCode = fs.readFileSync(swPath, 'utf8');
  assert(swCode.includes('precacheAndRoute'), '3b. Service worker registers precache assets');
  assert(swCode.includes('/api'), '3c. Service worker contains /api routing logic');
  assert(swCode.includes('NetworkOnly'), '3d. Service worker enforces NetworkOnly strategy for API calls');
  assert(swCode.includes('denylist'), '3e. Navigation route denylists /api paths from index.html SPA fallback');
}

// Group 4: HTML Head PWA Integration
console.log('\n📋 Test Group 4: HTML PWA Integration & Metadata');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(indexHtml.includes('theme-color') && indexHtml.includes('#059669'), '4a. index.html includes theme-color #059669');
assert(indexHtml.includes('apple-mobile-web-app-capable'), '4b. index.html includes apple-mobile-web-app-capable');
assert(indexHtml.includes('apple-touch-icon'), '4c. index.html includes apple-touch-icon link');

const mainJsx = fs.readFileSync(path.join(__dirname, 'src', 'main.jsx'), 'utf8');
assert(mainJsx.includes('virtual:pwa-register') || mainJsx.includes('registerSW'), '4d. main.jsx registers PWA service worker');

console.log('\n======================================================');
console.log(`🏁 PWA TESTS FINISHED: ${passedTests} / ${totalTests} Passed`);
console.log('======================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 Progressive Web App (PWA) integration verified successfully!');
} else {
  process.exitCode = 1;
}
