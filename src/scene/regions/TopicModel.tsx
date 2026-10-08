import * as THREE from 'three';

export interface TopicModelState {
  group: THREE.Group;
  update: (time: number, scrollProg: number) => void;
  dispose: () => void;
}

export function createTopicModelRegion(): TopicModelState {
  const group = new THREE.Group();
  // Positioned on the left side at eye level along camera path: Project 4
  group.position.set(-1.8, 0.8, -66);
  group.rotation.y = 0.12;

  const particleCount = 800;
  const clusterCount = 4;

  const clusterCenters = [
    new THREE.Vector3(-3.2, 1.0, 0),
    new THREE.Vector3(3.2, 1.2, 0),
    new THREE.Vector3(-2.4, -1.2, 0),
    new THREE.Vector3(2.6, -1.0, 0),
  ];

  const originPositions = new Float32Array(particleCount * 3);
  const targetPositions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount);

  const clusterColors = [
    new THREE.Color('#FFB23E'),
    new THREE.Color('#E9E5DD'),
    new THREE.Color('#7B8794'),
    new THREE.Color('#B86E10'),
  ];

  for (let i = 0; i < particleCount; i++) {
    const cluster = i % clusterCount;
    const center = clusterCenters[cluster];

    originPositions[i * 3] = (Math.random() - 0.5) * 12.0;
    originPositions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
    originPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.0;

    const angle = Math.random() * Math.PI * 2;
    const radius = Math.pow(Math.random(), 1.8) * 1.35;
    targetPositions[i * 3] = center.x + Math.cos(angle) * radius;
    targetPositions[i * 3 + 1] = center.y + Math.sin(angle) * radius;
    targetPositions[i * 3 + 2] = center.z + (Math.random() - 0.5) * 0.3;

    const col = clusterColors[cluster];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;

    phases[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(targetPositions, 3));
  geometry.setAttribute('aOrigin', new THREE.BufferAttribute(originPositions, 3));
  geometry.setAttribute('aTarget', new THREE.BufferAttribute(targetPositions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

  const uniforms = {
    uTime: { value: 0 },
    uConverge: { value: 0 },
  };

  const vertexShader = `
    attribute vec3 aOrigin;
    attribute vec3 aTarget;
    attribute vec3 aColor;
    attribute float aPhase;
    uniform float uTime;
    uniform float uConverge;
    varying vec3 vColor;

    void main() {
      vColor = aColor;
      float t = smoothstep(0.0, 1.0, uConverge);
      vec3 pos = mix(aOrigin, aTarget, t);
      pos.xy += vec2(sin(uTime * 2.0 + aPhase * 6.28), cos(uTime * 2.5 + aPhase * 6.28)) * 0.04 * t;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = clamp(3.0 * (100.0 / -mvPosition.z), 2.0, 5.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    precision highp float;
    varying vec3 vColor;
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      if (length(coord) > 0.5) discard;
      gl_FragColor = vec4(vColor, 0.95);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  });

  const pointsMesh = new THREE.Points(geometry, material);
  group.add(pointsMesh);

  // Centroid rings
  const ringGeom = new THREE.RingGeometry(1.35, 1.38, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x7B8794,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
  });

  clusterCenters.forEach((c) => {
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.copy(c);
    group.add(ring);
  });

  return {
    group,
    update: (time: number) => {
      const cycle = (time * 0.45) % 6.0;
      uniforms.uConverge.value = THREE.MathUtils.smoothstep(cycle, 1.0, 3.2);
      uniforms.uTime.value = time;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
      ringGeom.dispose();
      ringMat.dispose();
    },
  };
}
