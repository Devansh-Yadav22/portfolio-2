import * as THREE from 'three';

export interface HoneyChainState {
  group: THREE.Group;
  update: (time: number, scrollProg: number) => void;
  dispose: () => void;
}

export function createHoneyChainRegion(): HoneyChainState {
  const group = new THREE.Group();
  // Positioned at eye level along the camera's path: Project 1
  group.position.set(1.5, 0.8, -18);
  group.rotation.y = -0.15; // Subtle angle towards viewer

  const stages = [
    'Beekeeper',
    'Apiary',
    'Harvest',
    'Processing',
    'Packaging',
    'Distribution',
    'Consumer',
  ];

  const count = stages.length;
  const blockSpacing = 1.65;
  const startX = -((count - 1) * blockSpacing) / 2;

  // Hex shape (Radius 0.72)
  const hexShape = new THREE.Shape();
  const hexR = 0.72;
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = hexR * Math.cos(angle);
    const y = hexR * Math.sin(angle);
    if (i === 0) hexShape.moveTo(x, y);
    else hexShape.lineTo(x, y);
  }
  hexShape.closePath();

  const hexGeom = new THREE.ShapeGeometry(hexShape);
  const edgesGeom = new THREE.EdgesGeometry(hexGeom);

  const blockMeshes: THREE.Group[] = [];
  const linkLines: THREE.Line[] = [];

  stages.forEach((name, idx) => {
    const bGroup = new THREE.Group();
    const posX = startX + idx * blockSpacing;
    const posY = (idx % 2 === 0 ? 0.35 : -0.35);
    bGroup.position.set(posX, posY, 0);

    // Crisp high-contrast outline in --bone / --honey
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xE9E5DD,
      transparent: true,
      opacity: 0.6,
      linewidth: 2,
    });
    const lineMesh = new THREE.LineSegments(edgesGeom, lineMat);
    bGroup.add(lineMesh);

    // Semi-translucent dark plate
    const plateMat = new THREE.MeshBasicMaterial({
      color: 0x0D1117,
      transparent: true,
      opacity: 0.88,
    });
    const plateMesh = new THREE.Mesh(hexGeom, plateMat);
    plateMesh.position.z = -0.02;
    bGroup.add(plateMesh);

    // Text label for block
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#00000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '600 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#E9E5DD';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    const labelMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.5), labelMat);
    labelMesh.position.z = 0.04;
    bGroup.add(labelMesh);

    // QR Glyph matrix on final block (Consumer)
    if (idx === count - 1) {
      const qrGroup = new THREE.Group();
      qrGroup.position.z = 0.06;
      const sqGeom = new THREE.PlaneGeometry(0.12, 0.12);
      const sqMat = new THREE.MeshBasicMaterial({ color: 0xFFB23E, transparent: true, opacity: 0.8 });
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          if (Math.abs(r) === 1 && Math.abs(c) === 1) continue;
          const sq = new THREE.Mesh(sqGeom, sqMat);
          sq.position.set(c * 0.14, r * 0.14, 0);
          qrGroup.add(sq);
        }
      }
      bGroup.add(qrGroup);
      bGroup.userData.qrGroup = qrGroup;
    }

    bGroup.userData = {
      ...bGroup.userData,
      index: idx,
      baseY: posY,
      lineMat,
      plateMat,
    };

    blockMeshes.push(bGroup);
    group.add(bGroup);

    // Link line to previous block
    if (idx > 0) {
      const prevX = startX + (idx - 1) * blockSpacing;
      const prevY = ((idx - 1) % 2 === 0 ? 0.35 : -0.35);
      const points = [
        new THREE.Vector3(prevX, prevY, 0),
        new THREE.Vector3(posX, posY, 0),
      ];
      const linkGeom = new THREE.BufferGeometry().setFromPoints(points);
      const linkMat = new THREE.LineBasicMaterial({ color: 0x7B8794, transparent: true, opacity: 0.5 });
      const linkLine = new THREE.Line(linkGeom, linkMat);
      linkLines.push(linkLine);
      group.add(linkLine);
    }
  });

  // Glowing pulse sphere
  const pulseGeom = new THREE.SphereGeometry(0.12, 12, 12);
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0xFFB23E });
  const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
  pulseMesh.position.z = 0.1;
  group.add(pulseMesh);

  return {
    group,
    update: (time: number) => {
      // Pulse moves continuously through chain
      const cycleTime = (time * 1.5) % count;
      const activeIdx = Math.floor(cycleTime);
      const frac = cycleTime - activeIdx;

      const curr = blockMeshes[activeIdx];
      const next = blockMeshes[Math.min(activeIdx + 1, count - 1)];
      pulseMesh.position.x = THREE.MathUtils.lerp(curr.position.x, next.position.x, frac);
      pulseMesh.position.y = THREE.MathUtils.lerp(curr.position.y, next.position.y, frac);

      blockMeshes.forEach((mesh, idx) => {
        const isActive = activeIdx === idx;
        const lineMat = mesh.userData.lineMat as THREE.LineBasicMaterial;
        const plateMat = mesh.userData.plateMat as THREE.MeshBasicMaterial;

        if (isActive) {
          lineMat.color.setHex(0xFFB23E);
          lineMat.opacity = 1.0;
          plateMat.color.setHex(0x1B2430);
          mesh.position.y = mesh.userData.baseY + Math.sin(time * 4) * 0.08;
        } else {
          lineMat.color.setHex(0xE9E5DD);
          lineMat.opacity = 0.45;
          plateMat.color.setHex(0x0D1117);
          mesh.position.y = mesh.userData.baseY;
        }
      });

      linkLines.forEach((link, idx) => {
        const lMat = link.material as THREE.LineBasicMaterial;
        const lActive = activeIdx === idx;
        lMat.color.setHex(lActive ? 0xFFB23E : 0x7B8794);
        lMat.opacity = lActive ? 0.95 : 0.4;
      });
    },
    dispose: () => {
      hexGeom.dispose();
      edgesGeom.dispose();
      pulseGeom.dispose();
      pulseMat.dispose();
    },
  };
}
