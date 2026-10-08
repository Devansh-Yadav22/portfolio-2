import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import vertShader from './shaders/lattice.vert?raw';
import fragShader from './shaders/lattice.frag?raw';
import { createHeroParticles, HeroParticlesState } from './HeroParticles';
import { createHoneyChainRegion, HoneyChainState } from './regions/HoneyChain';
import { createAssignMateRegion, AssignMateState } from './regions/AssignMate';
import { createHeadlynRegion, HeadlynState } from './regions/Headlyn';
import { createTopicModelRegion, TopicModelState } from './regions/TopicModel';
import { createCostBarsRegion, CostBarsState } from './regions/CostBars';
import { getCameraTransformAt } from './cameraPath';
import { HIDDEN_CELLS, HiddenCellFact } from '../content/hiddenCells';
import { audioManager } from './audio';
import { scrollState } from '../lib/scrollStore';

interface LatticeProps {
  onSelectHiddenCell: (fact: HiddenCellFact) => void;
  onWebGLFailure?: () => void;
}

export function Lattice({
  onSelectHiddenCell,
  onWebGLFailure,
}: LatticeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) {
      setHasWebGLError(true);
      onWebGLFailure?.();
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#06080C');
    scene.fog = new THREE.Fog('#06080C', 18.0, 68.0);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      140
    );
    camera.position.set(0, 2.4, 7.5);
    camera.lookAt(0, 0.4, -28.0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setHasWebGLError(true);
      onWebGLFailure?.();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.className = 'webgl-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    // 1. Build Instanced Hexagonal Lattice Mesh (on XZ ground plane)
    const hexR = 1.15;
    const spacingX = Math.sqrt(3) * hexR; // ~1.99
    const spacingZ = 1.5 * hexR;          // ~1.725

    const isMobile = window.innerWidth < 768;
    const cols = isMobile ? 32 : 48;
    const rows = isMobile ? 54 : 76;
    const instanceCount = cols * rows;

    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = hexR * Math.cos(angle);
      const y = hexR * Math.sin(angle);
      if (i === 0) hexShape.moveTo(x, y);
      else hexShape.lineTo(x, y);
    }
    hexShape.closePath();

    const hexGeom = new THREE.ShapeGeometry(hexShape);
    const instancedMesh = new THREE.InstancedMesh(hexGeom, undefined as unknown as THREE.Material, instanceCount);

    const dummy = new THREE.Object3D();
    const aGridCoord = new Float32Array(instanceCount * 2);
    const aActive = new Float32Array(instanceCount);
    const aHiddenId = new Float32Array(instanceCount);
    const aPhase = new Float32Array(instanceCount);

    const cellPositions: { x: number; z: number; index: number; hiddenFact?: HiddenCellFact }[] = [];

    let idx = 0;
    const startX = -((cols - 1) * spacingX) / 2;
    const startZ = 4.0;

    for (let r = 0; r < rows; r++) {
      const rowOffset = (r % 2) * (spacingX / 2);
      const posZ = startZ - r * spacingZ;

      for (let c = 0; c < cols; c++) {
        const posX = startX + c * spacingX + rowOffset;

        dummy.position.set(posX, 0, posZ);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(idx, dummy.matrix);

        aGridCoord[idx * 2] = c;
        aGridCoord[idx * 2 + 1] = r;
        aActive[idx] = 0.0;
        aPhase[idx] = Math.random();

        // 5 hidden cells positioned across the path
        let hiddenId = 0;
        let matchedFact: HiddenCellFact | undefined;

        if (r === 6 && c === Math.floor(cols * 0.35)) { hiddenId = 1; matchedFact = HIDDEN_CELLS[0]; }
        else if (r === 18 && c === Math.floor(cols * 0.65)) { hiddenId = 2; matchedFact = HIDDEN_CELLS[1]; }
        else if (r === 32 && c === Math.floor(cols * 0.28)) { hiddenId = 3; matchedFact = HIDDEN_CELLS[2]; }
        else if (r === 48 && c === Math.floor(cols * 0.72)) { hiddenId = 4; matchedFact = HIDDEN_CELLS[3]; }
        else if (r === 62 && c === Math.floor(cols * 0.50)) { hiddenId = 5; matchedFact = HIDDEN_CELLS[4]; }

        aHiddenId[idx] = hiddenId;

        cellPositions.push({
          x: posX,
          z: posZ,
          index: idx,
          hiddenFact: matchedFact,
        });

        idx++;
      }
    }

    instancedMesh.instanceMatrix.needsUpdate = true;

    const instancedBufferGeom = instancedMesh.geometry;
    instancedBufferGeom.setAttribute('aGridCoord', new THREE.InstancedBufferAttribute(aGridCoord, 2));
    instancedBufferGeom.setAttribute('aActive', new THREE.InstancedBufferAttribute(aActive, 1));
    instancedBufferGeom.setAttribute('aHiddenId', new THREE.InstancedBufferAttribute(aHiddenId, 1));
    instancedBufferGeom.setAttribute('aPhase', new THREE.InstancedBufferAttribute(aPhase, 1));

    const latticeUniforms = {
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector3(-999, 0, -999) },
      uRipple0: { value: new THREE.Vector4(0, 0, -999, 0) },
      uRipple1: { value: new THREE.Vector4(0, 0, -999, 0) },
      uRipple2: { value: new THREE.Vector4(0, 0, -999, 0) },
      uRipple3: { value: new THREE.Vector4(0, 0, -999, 0) },
      uInk: { value: new THREE.Color('#06080C') },
      uBone: { value: new THREE.Color('#E9E5DD') },
      uHoney: { value: new THREE.Color('#FFB23E') },
      uHoneyDeep: { value: new THREE.Color('#B86E10') },
      uFogNear: { value: 18.0 },
      uFogFar: { value: 68.0 },
    };

    const latticeMaterial = new THREE.ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms: latticeUniforms,
      transparent: true,
      depthWrite: false,
    });

    instancedMesh.material = latticeMaterial;
    scene.add(instancedMesh);

    // 2. Hero Particles
    const heroParticles: HeroParticlesState = createHeroParticles();
    scene.add(heroParticles.points);

    // 3. Project Regions (Positioned along travel path at eye level)
    const honeyRegion: HoneyChainState = createHoneyChainRegion();
    scene.add(honeyRegion.group);

    const assignMateRegion: AssignMateState = createAssignMateRegion();
    scene.add(assignMateRegion.group);

    const headlynRegion: HeadlynState = createHeadlynRegion();
    scene.add(headlynRegion.group);

    const topicRegion: TopicModelState = createTopicModelRegion();
    scene.add(topicRegion.group);

    const costRegion: CostBarsState = createCostBarsRegion();
    scene.add(costRegion.group);

    // Pointer Raycasting on Ground Plane (Y = 0)
    const pointerScreen = new THREE.Vector2(0, 0);
    const pointerWorldXZ = new THREE.Vector3(-999, 0, -999);
    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    let lastMoveTime = 0;
    let echoTimeouts: number[] = [];

    const triggerEchoRipples = (px: number, pz: number, t: number, strength: number) => {
      latticeUniforms.uRipple0.value.set(px, pz, t, strength);

      echoTimeouts.forEach((tid) => window.clearTimeout(tid));
      echoTimeouts = [];

      echoTimeouts.push(
        window.setTimeout(() => {
          latticeUniforms.uRipple1.value.set(px, pz, performance.now() * 0.001, strength * 0.72);
        }, 180)
      );

      echoTimeouts.push(
        window.setTimeout(() => {
          latticeUniforms.uRipple2.value.set(px, pz, performance.now() * 0.001, strength * 0.50);
        }, 360)
      );

      echoTimeouts.push(
        window.setTimeout(() => {
          latticeUniforms.uRipple3.value.set(px, pz, performance.now() * 0.001, strength * 0.30);
        }, 540)
      );
    };

    const handlePointerMove = (e: MouseEvent) => {
      pointerScreen.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerScreen.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointerScreen, camera);
      const hit = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, hit);

      if (hit) {
        pointerWorldXZ.copy(hit);
        latticeUniforms.uPointer.value.copy(hit);

        const nowSec = performance.now() * 0.001;
        if (nowSec - lastMoveTime > 0.09) {
          triggerEchoRipples(hit.x, hit.z, nowSec, 1.4);
          lastMoveTime = nowSec;
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      pointerScreen.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerScreen.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointerScreen, camera);
      const hit = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, hit);

      if (hit) {
        const nowSec = performance.now() * 0.001;
        triggerEchoRipples(hit.x, hit.z, nowSec, 2.2);

        let minDist = 2.4;
        let foundCell: (typeof cellPositions)[0] | null = null;

        for (const cell of cellPositions) {
          const dx = cell.x - hit.x;
          const dz = cell.z - hit.z;
          const d = Math.sqrt(dx * dx + dz * dz);
          if (d < minDist) {
            minDist = d;
            foundCell = cell;
          }
        }

        if (foundCell) {
          audioManager.playHexTone(foundCell.index);
          if (foundCell.hiddenFact) {
            onSelectHiddenCell(foundCell.hiddenFact);
          }
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };
    window.addEventListener('resize', handleResize);

    // 60-120fps Animation Loop with Spline Interpolation
    let animId: number;
    const startTime = performance.now();

    const animate = (timestamp: number) => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = (timestamp - startTime) * 0.001;
      const assembleProg = Math.min(elapsedTime / 1.5, 1.0);

      const curProg = scrollState.progress;
      const curVel = scrollState.velocity;

      // Smooth camera spline scrubbing per brief
      const { position: targetCamPos, target: targetCamLook } = getCameraTransformAt(curProg);
      camera.position.lerp(targetCamPos, 0.16);
      camera.lookAt(targetCamLook);

      latticeUniforms.uTime.value = elapsedTime;
      latticeUniforms.uScrollVelocity.value = curVel;

      heroParticles.update(elapsedTime, new THREE.Vector2(pointerWorldXZ.x, pointerWorldXZ.z), assembleProg);
      honeyRegion.update(elapsedTime, curProg);
      assignMateRegion.update(elapsedTime, curProg);
      headlynRegion.update(elapsedTime, curProg);
      topicRegion.update(elapsedTime, curProg);
      costRegion.update(elapsedTime, curProg);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      echoTimeouts.forEach((tid) => window.clearTimeout(tid));
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      hexGeom.dispose();
      latticeMaterial.dispose();
      heroParticles.dispose();
      honeyRegion.dispose();
      assignMateRegion.dispose();
      headlynRegion.dispose();
      topicRegion.dispose();
      costRegion.dispose();
    };
  }, [onSelectHiddenCell, onWebGLFailure]);

  if (hasWebGLError) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-ink">
        <svg
          className="w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="hex-pattern"
              width="48"
              height="84"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M24 0 L48 14 L48 42 L24 56 L0 42 L0 14 Z M24 84 L48 70 L48 42 L24 28 L0 42 L0 70 Z"
                fill="none"
                stroke="#1B2430"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-pattern)" />
        </svg>
      </div>
    );
  }

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-auto" />;
}
