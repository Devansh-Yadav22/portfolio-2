import * as THREE from 'three';
import vertShader from './shaders/particles.vert?raw';
import fragShader from './shaders/particles.frag?raw';

export interface HeroParticlesState {
  points: THREE.Points;
  update: (time: number, pointerWorld: THREE.Vector2, assembleProg: number) => void;
  dispose: () => void;
}

export function createHeroParticles(): HeroParticlesState {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const canvas = document.createElement('canvas');
  canvas.width = 2800;
  canvas.height = isMobile ? 800 : 500;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';

  if (isMobile) {
    // Two lines on mobile per Item A: Devansh / Yadav
    ctx.font = '700 240px "Fraunces", Garamond, Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Devansh', 60, 240);
    ctx.fillText('Yadav', 60, 540);
  } else {
    // Single large bold serif line on desktop
    ctx.font = '700 230px "Fraunces", Garamond, Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Devansh Yadav', 80, 250);
  }

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Find tight bounding box of rendered text
  let minX = canvas.width;
  let maxX = 0;
  let minY = canvas.height;
  let maxY = 0;

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx] > 60) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const rawWidth = Math.max(maxX - minX, 1);
  const rawHeight = Math.max(maxY - minY, 1);

  // Target requirement: Span ~72% to 78% of viewport width on desktop
  const targetWorldWidth = isMobile ? 5.2 : 8.4;
  const targetWorldHeight = (rawHeight / rawWidth) * targetWorldWidth;

  // Left margin matching tagline (starts at X = -4.2 on desktop, -2.6 on mobile)
  const startX = isMobile ? -2.6 : -4.3;
  // Positioned high enough so it never competes with the ground lattice
  const startY = isMobile ? 2.8 : 2.2;

  const targetCoords: [number, number, number][] = [];
  const step = isMobile ? 4 : 3; // Dense sampling -> 20,000 to 25,000 points

  for (let y = minY; y <= maxY; y += step) {
    for (let x = minX; x <= maxX; x += step) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx] > 60) {
        const normX = (x - minX) / rawWidth;
        const normY = (y - minY) / rawHeight;

        const wx = startX + normX * targetWorldWidth;
        const wy = startY - normY * targetWorldHeight;
        const wz = 0.0;
        targetCoords.push([wx, wy, wz]);
      }
    }
  }

  const pCount = targetCoords.length;
  const targetPos = new Float32Array(pCount * 3);
  const originPos = new Float32Array(pCount * 3);
  const delays = new Float32Array(pCount);
  const sizes = new Float32Array(pCount);

  for (let i = 0; i < pCount; i++) {
    const [tx, ty, tz] = targetCoords[i];
    targetPos[i * 3] = tx;
    targetPos[i * 3 + 1] = ty;
    targetPos[i * 3 + 2] = tz;

    // Scattered starting positions
    const angle = Math.random() * Math.PI * 2;
    const dist = 2.5 + Math.random() * 6.0;
    originPos[i * 3] = tx + Math.cos(angle) * dist;
    originPos[i * 3 + 1] = ty + Math.sin(angle) * dist - 1.5;
    originPos[i * 3 + 2] = (Math.random() - 0.5) * 2.0;

    delays[i] = Math.random() * 0.35;
    // Crisp points
    sizes[i] = 2.0 + Math.random() * 0.6;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(targetPos, 3));
  geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(targetPos, 3));
  geometry.setAttribute('aOriginPos', new THREE.BufferAttribute(originPos, 3));
  geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPointer: { value: new THREE.Vector2(-999, -999) },
    uPointerRadius: { value: 1.5 },
    uBone: { value: new THREE.Color('#E9E5DD') },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: vertShader,
    fragmentShader: fragShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.position.set(0, 0, 0);

  return {
    points,
    update: (time: number, pointerWorld: THREE.Vector2, assembleProg: number) => {
      uniforms.uTime.value = time;
      uniforms.uProgress.value = assembleProg;
      uniforms.uPointer.value.copy(pointerWorld);
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
