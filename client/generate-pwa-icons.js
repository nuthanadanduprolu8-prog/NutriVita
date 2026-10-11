import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, pixelShader) {
  // RGBA buffer: 4 bytes per pixel
  // For PNG, each scanline has 1 filter byte (0x00) + width * 4 bytes
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelShader(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = Math.max(0, Math.min(255, Math.round(r)));
      rawData[pixelOffset + 1] = Math.max(0, Math.min(255, Math.round(g)));
      rawData[pixelOffset + 2] = Math.max(0, Math.min(255, Math.round(b)));
      rawData[pixelOffset + 3] = Math.max(0, Math.min(255, Math.round(a)));
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const toCrc = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(toCrc), 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // color type 6 (RGBA)
  ihdr.writeUInt8(0, 10); // compression 0
  ihdr.writeUInt8(0, 11); // filter 0
  ihdr.writeUInt8(0, 12); // interlace 0
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Shader for NutriVita Leaf Icon
function nutriVitaIconShader(isMaskable) {
  return function (x, y, width, height) {
    // Normalized coordinates [-1, 1]
    const nx = (x / (width - 1)) * 2 - 1;
    const ny = (y / (height - 1)) * 2 - 1;

    // Corner radius for standard app icon (squircle)
    let bgAlpha = 255;
    if (!isMaskable) {
      // Rounded rectangle: radius 0.22 of size
      const r = 0.22;
      const qx = Math.max(0, Math.abs(nx) - (1 - r));
      const qy = Math.max(0, Math.abs(ny) - (1 - r));
      const dist = Math.sqrt(qx * qx + qy * qy);
      if (dist > r) {
        // Outside rounded corners: anti-aliasing
        const edge = (dist - r) / (2 / width);
        if (edge >= 1) return [0, 0, 0, 0];
        bgAlpha = Math.round(255 * (1 - edge));
      }
    }

    // Emerald gradient background: #059669 (5, 150, 105) to #0d9488 (13, 148, 136)
    // Diagonal top-left to bottom-right
    const gradT = (nx + ny + 2) / 4;
    const bgR = 5 + (13 - 5) * gradT;
    const bgG = 150 + (148 - 150) * gradT;
    const bgB = 105 + (136 - 105) * gradT;

    // Scale factor for foreground icon inside safe-zone
    const iconScale = isMaskable ? 0.72 : 0.82;
    const ix = nx / iconScale;
    const iy = ny / iconScale;

    // Leaf center slightly offset for visual balance
    const cx = -0.05;
    const cy = 0.05;
    const dx = ix - cx;
    const dy = iy - cy;

    // Rotate 45 degrees
    const angle = Math.PI / 4;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const u = dx * cosA - dy * sinA; // along leaf length (bottom-left to top-right)
    const v = dx * sinA + dy * cosA; // perpendicular to leaf

    // Leaf body definition:
    // u ranges from -0.55 (base) to 0.55 (tip)
    let inLeaf = false;
    let leafAlpha = 0;

    const leafL = 0.58;
    const leafW = 0.38;

    if (u >= -leafL && u <= leafL) {
      const uNorm = u / leafL;
      // Leaf half-width profile
      const halfW = leafW * Math.sqrt(Math.max(0, 1 - uNorm * uNorm)) * (1 - 0.25 * uNorm);
      const distFromBoundary = halfW - Math.abs(v);
      const pixelSize = (2 / width) / iconScale;

      if (distFromBoundary > 0) {
        inLeaf = true;
        const aa = Math.min(1, distFromBoundary / pixelSize);
        leafAlpha = aa;
      }
    }

    // Central leaf vein slit (creates the classic leaf icon silhouette)
    if (inLeaf) {
      // Main vein runs along v ≈ 0, u from -0.45 to 0.4
      const veinW = 0.028;
      if (Math.abs(v) < veinW && u >= -0.42 && u <= 0.35) {
        const veinBoundary = veinW - Math.abs(v);
        const pixelSize = (2 / width) / iconScale;
        const cutFactor = Math.min(1, veinBoundary / pixelSize);
        leafAlpha *= (1 - cutFactor);
      }
    }

    // Stem curving down
    const stemU = u;
    const stemV = v + 0.15 * Math.pow(Math.max(0, -stemU - 0.3), 1.5);
    if (stemU < -0.4 && stemU > -0.75) {
      const stemDist = Math.abs(stemV);
      const stemThick = 0.024;
      if (stemDist < stemThick) {
        const pixelSize = (2 / width) / iconScale;
        const aa = Math.min(1, (stemThick - stemDist) / pixelSize);
        leafAlpha = Math.max(leafAlpha, aa);
      }
    }

    // Secondary sprout / vitality dot (representing nutrition / vitamin droplet)
    const dotX = ix - 0.32;
    const dotY = iy - (-0.28);
    const dotR = Math.sqrt(dotX * dotX + dotY * dotY);
    const targetDotR = 0.09;
    if (dotR < targetDotR + 0.02) {
      const pixelSize = (2 / width) / iconScale;
      const aa = Math.min(1, Math.max(0, (targetDotR - dotR) / pixelSize));
      leafAlpha = Math.max(leafAlpha, aa);
    }

    // Blend leaf (pure white: 255, 255, 255) over emerald background
    if (leafAlpha > 0) {
      const r = bgR * (1 - leafAlpha) + 255 * leafAlpha;
      const g = bgG * (1 - leafAlpha) + 255 * leafAlpha;
      const b = bgB * (1 - leafAlpha) + 255 * leafAlpha;
      return [r, g, b, bgAlpha];
    }

    return [bgR, bgG, bgB, bgAlpha];
  };
}

const publicDir = 'c:/Users/Anusha/Downloads/NutriVita/client/public';

console.log('Generating PWA icons...');

// 1. 192x192
const pwa192 = createPNG(192, 192, nutriVitaIconShader(false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);
console.log('Generated pwa-192x192.png (' + pwa192.length + ' bytes)');

// 2. 512x512
const pwa512 = createPNG(512, 512, nutriVitaIconShader(false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);
console.log('Generated pwa-512x512.png (' + pwa512.length + ' bytes)');

// 3. Maskable 512x512 (full bleed)
const maskable512 = createPNG(512, 512, nutriVitaIconShader(true));
fs.writeFileSync(path.join(publicDir, 'maskable-icon-512x512.png'), maskable512);
console.log('Generated maskable-icon-512x512.png (' + maskable512.length + ' bytes)');

// 4. Apple Touch Icon 180x180
const apple180 = createPNG(180, 180, nutriVitaIconShader(false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), apple180);
console.log('Generated apple-touch-icon.png (' + apple180.length + ' bytes)');

// 5. Favicon 64x64
const fav64 = createPNG(64, 64, nutriVitaIconShader(false));
fs.writeFileSync(path.join(publicDir, 'favicon-64x64.png'), fav64);
console.log('Generated favicon-64x64.png (' + fav64.length + ' bytes)');

console.log('All PWA icons generated successfully!');
