import * as THREE from 'three';

export interface AssignMateState {
  group: THREE.Group;
  update: (time: number, scrollProg: number) => void;
  dispose: () => void;
}

export function createAssignMateRegion(): AssignMateState {
  const group = new THREE.Group();
  // Positioned on the left side at eye level along camera path: Project 2
  group.position.set(-1.8, 0.8, -34);
  group.rotation.y = 0.15;

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 300;
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const planeGeom = new THREE.PlaneGeometry(8.5, 2.1);
  const planeMat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.96,
  });
  const planeMesh = new THREE.Mesh(planeGeom, planeMat);
  group.add(planeMesh);

  // Border
  const borderGeom = new THREE.EdgesGeometry(planeGeom);
  const borderMat = new THREE.LineBasicMaterial({ color: 0x7B8794, transparent: true, opacity: 0.5 });
  const borderMesh = new THREE.LineSegments(borderGeom, borderMat);
  group.add(borderMesh);

  const rawText = "RAW AI: FORMAL PREDICTABLE SYNTHETIC CADENCE";
  const targetText = "Refined: Naturally balanced academic prose with organic flow.";
  const glyphs = "01$#%&§@8?/><*[]_";

  let lastTime = 0;

  const renderText = (time: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#1B2430';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    const cycle = (time * 0.5) % 4.0;
    let displayText = "";

    if (cycle < 1.0) {
      displayText = rawText;
      ctx.font = '500 26px "JetBrains Mono", monospace';
      ctx.fillStyle = '#7B8794';
    } else if (cycle < 2.5) {
      const progress = (cycle - 1.0) / 1.5;
      const resolveIdx = Math.floor(progress * targetText.length);
      const chars: string[] = [];
      for (let i = 0; i < targetText.length; i++) {
        if (i < resolveIdx) {
          chars.push(targetText[i]);
        } else if (i < resolveIdx + 4) {
          chars.push(glyphs[Math.floor(Math.random() * glyphs.length)]);
        } else if (i < rawText.length) {
          chars.push(rawText[i]);
        } else {
          chars.push(" ");
        }
      }
      displayText = chars.join('');
      ctx.font = '500 28px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FFB23E';
    } else {
      displayText = targetText;
      ctx.font = 'italic 500 30px "Fraunces", Georgia, serif';
      ctx.fillStyle = '#E9E5DD';
    }

    ctx.font = '400 15px "JetBrains Mono", monospace';
    ctx.fillStyle = '#7B8794';
    ctx.fillText("MODEL: GEMINI REFINEMENT PIPELINE // POSTMAN VALIDATED", 40, 50);
    ctx.fillText(displayText, 40, 160);

    // Blinking amber cursor
    if (Math.sin(time * 6) > 0) {
      const textWidth = ctx.measureText(displayText).width;
      ctx.fillStyle = '#FFB23E';
      ctx.fillRect(44 + textWidth, 134, 10, 32);
    }

    texture.needsUpdate = true;
  };

  return {
    group,
    update: (time: number) => {
      if (time - lastTime > 0.05) {
        renderText(time);
        lastTime = time;
      }
    },
    dispose: () => {
      planeGeom.dispose();
      planeMat.dispose();
      texture.dispose();
    },
  };
}
