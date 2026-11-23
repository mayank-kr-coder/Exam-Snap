/**
 * Generates realistic sample images directly in browser canvas
 * so users and reviewers can instantly test without finding files.
 */

export function createSamplePassportPhotoBlob(): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext('2d')!;

    // Background (light off-white studio wall)
    ctx.fillStyle = '#E8ECEF';
    ctx.fillRect(0, 0, 600, 750);

    // Subtle background gradient
    const grad = ctx.createRadialGradient(300, 300, 50, 300, 300, 400);
    grad.addColorStop(0, '#F4F7F9');
    grad.addColorStop(1, '#D8DEE4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 750);

    // Shoulders & Navy Formal Suit / Shirt
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(100, 750);
    ctx.quadraticCurveTo(150, 520, 240, 500);
    ctx.lineTo(360, 500);
    ctx.quadraticCurveTo(450, 520, 500, 750);
    ctx.closePath();
    ctx.fill();

    // Shirt collar (White formal shirt)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(250, 500);
    ctx.lineTo(300, 560);
    ctx.lineTo(350, 500);
    ctx.lineTo(300, 470);
    ctx.closePath();
    ctx.fill();

    // Neck
    ctx.fillStyle = '#E0A97E';
    ctx.fillRect(265, 410, 70, 90);

    // Head / Face
    ctx.fillStyle = '#EBB68C';
    ctx.beginPath();
    ctx.ellipse(300, 320, 110, 140, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#E0A97E';
    ctx.beginPath();
    ctx.ellipse(185, 325, 14, 28, 0, 0, Math.PI * 2);
    ctx.ellipse(415, 325, 14, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#1A1817';
    ctx.beginPath();
    ctx.ellipse(300, 240, 115, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(185, 270);
    ctx.quadraticCurveTo(300, 210, 415, 270);
    ctx.quadraticCurveTo(300, 260, 185, 270);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(255, 315, 10, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(345, 315, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#27221F';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(235, 298);
    ctx.quadraticCurveTo(255, 290, 275, 296);
    ctx.moveTo(325, 296);
    ctx.quadraticCurveTo(345, 290, 365, 298);
    ctx.stroke();

    // Nose
    ctx.strokeStyle = '#D49568';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(300, 315);
    ctx.lineTo(295, 355);
    ctx.lineTo(308, 355);
    ctx.stroke();

    // Mouth / Neutral smile
    ctx.strokeStyle = '#B36B46';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(275, 390);
    ctx.quadraticCurveTo(300, 396, 325, 390);
    ctx.stroke();

    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'sample_passport_candidate.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  });
}

export function createSampleSignatureBlob(): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;

    // Slightly off-white paper texture with slight realistic shading
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, 600, 300);

    // Realistic Blue Fountain Pen Signature Stroke
    ctx.strokeStyle = '#1E3A8A'; // Deep royal blue ink
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    // Capital M
    ctx.moveTo(80, 200);
    ctx.lineTo(110, 90);
    ctx.lineTo(140, 180);
    ctx.lineTo(170, 95);
    ctx.lineTo(190, 190);

    // cursive "ayank"
    ctx.quadraticCurveTo(210, 170, 225, 185);
    ctx.quadraticCurveTo(240, 160, 255, 185);
    ctx.quadraticCurveTo(270, 150, 285, 195);
    ctx.quadraticCurveTo(300, 140, 310, 185);
    ctx.quadraticCurveTo(330, 165, 345, 185);

    // Loop flourish
    ctx.quadraticCurveTo(400, 100, 460, 120);
    ctx.quadraticCurveTo(490, 140, 430, 190);
    ctx.quadraticCurveTo(320, 220, 100, 225);
    ctx.stroke();

    // Two dots under signature flourish
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.arc(280, 245, 4, 0, Math.PI * 2);
    ctx.arc(320, 245, 4, 0, Math.PI * 2);
    ctx.fill();

    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'sample_signature_candidate.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  });
}

export function createSampleThumbprintBlob(): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;

    // Paper background
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, 400, 400);

    // Ink impression rings
    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = 2.5;

    for (let r = 15; r < 140; r += 7) {
      ctx.beginPath();
      ctx.ellipse(200, 200, r * 0.75, r, 0.15, 0, Math.PI * 1.85);
      ctx.stroke();
    }

    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'sample_left_thumbprint.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  });
}
