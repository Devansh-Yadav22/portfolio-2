import * as THREE from 'three';

export interface CameraWaypoint {
  id: string;
  progress: number;
  camPos: THREE.Vector3;
  targetPos: THREE.Vector3;
}

export const CAMERA_WAYPOINTS: CameraWaypoint[] = [
  {
    id: 'hero',
    progress: 0.0,
    camPos: new THREE.Vector3(0, 2.4, 7.5),
    targetPos: new THREE.Vector3(0, 0.4, -28.0),
  },
  {
    id: 'about',
    progress: 0.10,
    camPos: new THREE.Vector3(0, 2.2, 0.0),
    targetPos: new THREE.Vector3(0, 0.4, -28.0),
  },
  {
    id: 'honey-chain',
    progress: 0.24,
    camPos: new THREE.Vector3(0, 2.0, -10.0),
    targetPos: new THREE.Vector3(1.5, 0.8, -18.0),
  },
  {
    id: 'assignmate',
    progress: 0.40,
    camPos: new THREE.Vector3(0, 2.0, -26.0),
    targetPos: new THREE.Vector3(-1.8, 0.8, -34.0),
  },
  {
    id: 'headlyn',
    progress: 0.56,
    camPos: new THREE.Vector3(0, 2.0, -42.0),
    targetPos: new THREE.Vector3(1.6, 0.8, -50.0),
  },
  {
    id: 'topic-model',
    progress: 0.70,
    camPos: new THREE.Vector3(0, 2.0, -58.0),
    targetPos: new THREE.Vector3(-1.8, 0.8, -66.0),
  },
  {
    id: 'cost-bars',
    progress: 0.84,
    camPos: new THREE.Vector3(0, 1.8, -74.0),
    targetPos: new THREE.Vector3(1.6, 0.6, -82.0),
  },
  {
    id: 'skills',
    progress: 0.94,
    camPos: new THREE.Vector3(0, 2.2, -90.0),
    targetPos: new THREE.Vector3(0, 0.5, -98.0),
  },
  {
    id: 'closing',
    progress: 1.0,
    camPos: new THREE.Vector3(0, 2.0, -104.0),
    targetPos: new THREE.Vector3(0, 0.2, -112.0),
  },
];

const camPoints = CAMERA_WAYPOINTS.map((w) => w.camPos);
const targetPoints = CAMERA_WAYPOINTS.map((w) => w.targetPos);

export const cameraSpline = new THREE.CatmullRomCurve3(camPoints, false, 'centripetal');
export const targetSpline = new THREE.CatmullRomCurve3(targetPoints, false, 'centripetal');

export function getCameraTransformAt(progress: number): { position: THREE.Vector3; target: THREE.Vector3 } {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  const position = cameraSpline.getPoint(p);
  const target = targetSpline.getPoint(p);
  return { position, target };
}
