/**
 * NutriVita Nutrition Awareness Certificate Generator
 * Renders a high-resolution, downloadable canvas certificate of nutrition literacy.
 */

export const getCertificateMetadata = ({
  recipientName = 'NutriVita Learner',
  score = 15,
  total = 15,
  percentage = 100,
  date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  _isTelugu = false
} = {}) => ({
  title: 'Certificate of Nutrition Awareness',
  issuer: 'NutriVita Nutrition Education Initiative',
  recipientName: recipientName || 'NutriVita Learner',
  score,
  total,
  percentage,
  date,
  isCertified: true,
  disclaimer: 'Educational participation certificate for nutrition awareness. Not a medical qualification.'
});

export const generateCertificate = ({
  recipientName = 'NutriVita Learner',
  score = 15,
  total = 15,
  percentage = 100,
  date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  _isTelugu = false
}) => {
  if (typeof document === 'undefined') {
    return `data:image/png;base64,mock_certificate_${encodeURIComponent(recipientName)}_${score}_${total}_${percentage}`;
  }

  // Create high-DPI canvas (1600 x 1130 for sharp certificate export)
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1130;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // Background gradient: subtle soft cream/emerald parchment
  const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1130);
  bgGrad.addColorStop(0, '#fbfdfc');
  bgGrad.addColorStop(0.5, '#f4f9f6');
  bgGrad.addColorStop(1, '#edf6f1');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1600, 1130);

  // Outer decorative border
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#065f46'; // Emerald 800
  ctx.strokeRect(40, 40, 1520, 1050);

  // Inner thin gold/emerald accent border
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#059669'; // Emerald 600
  ctx.strokeRect(58, 58, 1484, 1014);

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#d97706'; // Amber accent
  ctx.strokeRect(66, 66, 1468, 998);

  // Corner decorative flourishes
  const drawCornerFlourish = (x, y, flipX, flipY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 40);
    ctx.stroke();
    ctx.restore();
  };

  drawCornerFlourish(80, 80, false, false);
  drawCornerFlourish(1520, 80, true, false);
  drawCornerFlourish(80, 1050, false, true);
  drawCornerFlourish(1520, 1050, true, true);

  // Brand Header
  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌿 NutriVita', 800, 160);

  ctx.fillStyle = '#059669';
  ctx.font = '600 16px "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('NUTRIVITA NUTRITION EDUCATION INITIATIVE', 800, 195);
  ctx.letterSpacing = '0px';

  // Decorative divider
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(600, 220);
  ctx.lineTo(1000, 220);
  ctx.stroke();

  // Certificate Title
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 50px "Georgia", serif';
  ctx.fillText('Certificate of Nutrition Awareness', 800, 300);

  // Presentation subtitle
  ctx.fillStyle = '#64748b';
  ctx.font = 'italic 22px "Georgia", serif';
  ctx.fillText('This certificate of accomplishment is proudly presented to', 800, 375);

  // Recipient Name
  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 54px "Segoe UI", "Georgia", sans-serif';
  ctx.fillText(recipientName || 'NutriVita Learner', 800, 465);

  // Underline for recipient
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(450, 490);
  ctx.lineTo(1150, 490);
  ctx.stroke();

  // Citation text
  ctx.fillStyle = '#334155';
  ctx.font = '22px "Segoe UI", Roboto, sans-serif';
  const line1 = 'for successfully completing the VitaQuiz Comprehensive Nutrition Assessment, demonstrating';
  const line2 = 'evidence-based knowledge of essential vitamins, dietary minerals, food synergies, and deficiency awareness.';
  ctx.fillText(line1, 800, 560);
  ctx.fillText(line2, 800, 595);

  // Score Badge Banner Box
  ctx.fillStyle = '#ecfdf5';
  ctx.fillRect(520, 650, 560, 90);
  ctx.strokeStyle = '#a7f3d0';
  ctx.lineWidth = 2;
  ctx.strokeRect(520, 650, 560, 90);

  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 30px "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Assessment Score: ${score} / ${total}  (${percentage}% Accuracy)`, 800, 706);

  // Bottom Columns: Date & Signatures
  // Left: Date
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = '16px "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Date of Completion', 250, 890);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px "Segoe UI", Roboto, sans-serif';
  ctx.fillText(date, 250, 925);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(250, 870);
  ctx.lineTo(480, 870);
  ctx.stroke();

  // Center: Seal Emblem
  ctx.save();
  ctx.beginPath();
  ctx.arc(800, 880, 55, 0, Math.PI * 2);
  ctx.fillStyle = '#059669';
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('NUTRIVITA', 800, 875);
  ctx.font = 'bold 12px "Segoe UI", sans-serif';
  ctx.fillText('VERIFIED NUTRIVITA', 800, 895);
  ctx.restore();

  // Right: Academic / Program Endorsement
  ctx.textAlign = 'right';
  ctx.fillStyle = '#64748b';
  ctx.font = '16px "Segoe UI", Roboto, sans-serif';
  ctx.fillText('NutriVita Educational Team', 1350, 890);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Nutrition Education Council', 1350, 925);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(1120, 870);
  ctx.lineTo(1350, 870);
  ctx.stroke();

  // Medical / Non-diagnostic Disclaimer Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 15px "Segoe UI", Roboto, sans-serif';
  ctx.fillText(
    'Educational participation certificate for nutrition awareness. Not a medical qualification or diagnostic certification.',
    800,
    1020
  );

  return canvas.toDataURL('image/png');
};

/**
 * Direct file download trigger for the certificate
 */
export const downloadCertificateImage = (params) => {
  const dataUrl = generateCertificate(params);
  if (!dataUrl) return false;

  const link = document.createElement('a');
  link.download = `NutriVita-Certificate-${params.recipientName ? params.recipientName.replace(/\s+/g, '_') : 'Learner'}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};
