import * as THREE from 'three';

export interface HeadlynState {
  group: THREE.Group;
  update: (time: number, scrollProg: number) => void;
  dispose: () => void;
}

interface HeadlineItem {
  title: string;
  category: number;
  mesh: THREE.Mesh;
  originPos: THREE.Vector3;
  targetPos: THREE.Vector3;
}

export function createHeadlynRegion(): HeadlynState {
  const group = new THREE.Group();
  // Positioned on the right side at eye level along camera path: Project 3
  group.position.set(1.6, 0.8, -50);
  group.rotation.y = -0.12;

  const categories = ['Technology', 'Engineering', 'Systems'];
  const headlines = [
    { text: 'Linux 6.12 Realtime Kernel Preemption Merged', cat: 2 },
    { text: 'Distributed Consensus Latency Benchmarks', cat: 0 },
    { text: 'Local 4-bit Quantization on Edge Hardware', cat: 1 },
    { text: 'Subsea Cable Routing Redundancy Analyzed', cat: 2 },
    { text: 'Rust Tooling Integrated into Upstream Drivers', cat: 0 },
    { text: 'Decentralized Identity Standards Draft', cat: 1 },
  ];

  const items: HeadlineItem[] = [];
  const cardWidth = 3.8;
  const cardHeight = 1.0;
  const laneX = [-3.8, 0.0, 3.8];

  headlines.forEach((hl, idx) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#2A3645';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

    ctx.font = '600 18px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFB23E';
    ctx.fillText(`[ ${categories[hl.cat].toUpperCase()} ]`, 24, 40);

    ctx.font = '500 21px "Fraunces", Georgia, serif';
    ctx.fillStyle = '#E9E5DD';
    ctx.fillText(hl.text, 24, 88);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const geom = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
    });
    const mesh = new THREE.Mesh(geom, mat);

    const origX = (Math.random() - 0.5) * 10.0;
    const origY = (Math.random() - 0.5) * 3.5;
    const origZ = (Math.random() - 0.5) * 3.0;

    const rowInLane = Math.floor(idx / 3);
    const targX = laneX[hl.cat];
    const targY = 0.8 - (rowInLane * 1.3);
    const targZ = 0.1;

    mesh.position.set(origX, origY, origZ);
    group.add(mesh);

    items.push({
      title: hl.text,
      category: hl.cat,
      mesh,
      originPos: new THREE.Vector3(origX, origY, origZ),
      targetPos: new THREE.Vector3(targX, targY, targZ),
    });
  });

  return {
    group,
    update: (time: number) => {
      const cycle = (time * 0.45) % 6.0;
      const sortProgress = THREE.MathUtils.smoothstep(cycle, 1.2, 3.2);

      items.forEach((item, i) => {
        const driftX = Math.sin(time * 0.7 + i) * 0.25;
        const driftY = Math.cos(time * 0.6 + i * 1.5) * 0.25;

        item.mesh.position.x = THREE.MathUtils.lerp(item.originPos.x + driftX, item.targetPos.x, sortProgress);
        item.mesh.position.y = THREE.MathUtils.lerp(item.originPos.y + driftY, item.targetPos.y, sortProgress);
        item.mesh.position.z = THREE.MathUtils.lerp(item.originPos.z, item.targetPos.z, sortProgress);
      });
    },
    dispose: () => {
      items.forEach((item) => {
        item.mesh.geometry.dispose();
      });
    },
  };
}
