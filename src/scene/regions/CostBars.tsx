import * as THREE from 'three';

export interface CostBarsState {
  group: THREE.Group;
  update: (time: number, scrollProg: number) => void;
  dispose: () => void;
}

export function createCostBarsRegion(): CostBarsState {
  const group = new THREE.Group();
  // Positioned on the right side at eye level along camera path: Project 5
  group.position.set(1.6, 0.2, -82);
  group.rotation.y = -0.15;

  const barCount = 14;
  const barWidth = 0.48;
  const barDepth = 0.48;
  const spacing = 0.68;
  const startX = -((barCount - 1) * spacing) / 2;

  const barBoxes: THREE.Mesh[] = [];
  const barEdges: THREE.LineSegments[] = [];
  const targetHeights: number[] = [];
  const baseOverprovisions: number[] = [];

  const barGeom = new THREE.BoxGeometry(barWidth, 1.0, barDepth);
  barGeom.translate(0, 0.5, 0); // Origin at bottom
  const edgesGeom = new THREE.EdgesGeometry(barGeom);

  // Bold materials per Item B
  const solidMat = new THREE.MeshBasicMaterial({
    color: 0x0D1117,
    transparent: true,
    opacity: 0.95,
  });

  const lineMat = new THREE.LineBasicMaterial({
    color: 0xE9E5DD,
    transparent: true,
    opacity: 0.75,
  });

  // Dashed baseline
  const baselinePoints = [
    new THREE.Vector3(startX - 0.6, 1.1, 0),
    new THREE.Vector3(startX + barCount * spacing, 1.1, 0),
  ];
  const baselineGeom = new THREE.BufferGeometry().setFromPoints(baselinePoints);
  const baselineMat = new THREE.LineDashedMaterial({
    color: 0xFFB23E,
    dashSize: 0.3,
    gapSize: 0.2,
  });
  const baselineLine = new THREE.Line(baselineGeom, baselineMat);
  baselineLine.computeLineDistances();
  group.add(baselineLine);

  for (let i = 0; i < barCount; i++) {
    const mesh = new THREE.Mesh(barGeom, solidMat.clone());
    const edge = new THREE.LineSegments(edgesGeom, lineMat.clone());
    mesh.add(edge);

    mesh.position.set(startX + i * spacing, 0, 0);
    group.add(mesh);
    barBoxes.push(mesh);
    barEdges.push(edge);

    // Initial wild fluctuating heights
    const overprovision = 1.6 + Math.sin(i * 1.3) * 1.1 + (i % 3) * 0.7;
    baseOverprovisions.push(overprovision);

    // Trimmed baseline
    const optimal = 1.05 + Math.sin(i * 0.4) * 0.2;
    targetHeights.push(optimal);
  }

  return {
    group,
    update: (time: number) => {
      const cycle = (time * 0.45) % 6.0;
      const trimProgress = THREE.MathUtils.smoothstep(cycle, 1.5, 3.8);

      barBoxes.forEach((bar, i) => {
        const unoptimized = baseOverprovisions[i] + Math.sin(time * 2.5 + i * 0.7) * 0.35;
        const optimized = targetHeights[i] + Math.sin(time * 0.8 + i * 0.3) * 0.05;

        const currentH = THREE.MathUtils.lerp(unoptimized, optimized, trimProgress);
        bar.scale.y = Math.max(0.1, currentH);

        const edgeLine = barEdges[i];
        const eMat = edgeLine.material as THREE.LineBasicMaterial;

        if (trimProgress > 0.8) {
          eMat.color.setHex(0xFFB23E); // Leveled honey highlight
          eMat.opacity = 1.0;
        } else {
          eMat.color.setHex(0xE9E5DD);
          eMat.opacity = 0.65;
        }
      });
    },
    dispose: () => {
      barGeom.dispose();
      edgesGeom.dispose();
      solidMat.dispose();
      lineMat.dispose();
      baselineGeom.dispose();
      baselineMat.dispose();
    },
  };
}
