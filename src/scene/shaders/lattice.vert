// Lattice Vertex Shader (Tilted Landscape Grid)
precision highp float;

attribute vec2 aGridCoord; // col, row
attribute float aActive;    // 0..1 activation
attribute float aHiddenId;  // 0 if regular, 1..5 if hidden
attribute float aPhase;     // random per-cell phase

uniform float uTime;
uniform float uScrollVelocity;
uniform vec3 uPointer; // cursor world position on XZ plane
uniform vec4 uRipple0; // x, z, startTime, strength
uniform vec4 uRipple1; // echo 1 (+0.18s)
uniform vec4 uRipple2; // echo 2 (+0.36s)
uniform vec4 uRipple3; // echo 3 (+0.54s)

varying vec2 vLocalPos;
varying vec3 vWorldPos;
varying float vActive;
varying float vHiddenId;
varying float vElevation;
varying float vWaveIntensity;
varying float vDistToCamera;

// Pseudo-random smooth 2D noise
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float evalRipple(vec4 rip, vec2 cellXZ, float t) {
  if (rip.w <= 0.001) return 0.0;
  float dt = t - rip.z;
  if (dt < 0.0 || dt > 1.4) return 0.0;

  float dist = length(cellXZ - rip.xy);
  float k = 1.2;
  float speed = 8.5;
  float decay = 0.22;

  // amp * sin(dist * k - dt * speed) * exp(-dist * decay)
  float wave = sin(dist * k - dt * speed) * exp(-dist * decay);
  // Decay over about 900ms per brief
  float timeFade = exp(-dt * 3.2);
  return wave * rip.w * timeFade;
}

void main() {
  vLocalPos = position.xy;
  vActive = aActive;
  vHiddenId = aHiddenId;

  // Extract cell center from instance matrix (XZ plane)
  vec3 cellCenter = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

  // 1. Vertical relief from low-frequency noise (landscape)
  float noiseRelief = (smoothNoise(cellCenter.xz * 0.07 + 0.12) - 0.5) * 0.85;
  float idleDrift = sin(uTime * 0.8 + aPhase * 6.28) * 0.08;

  // 2. Unmistakable cursor ripples with 3 delayed echo rings (180ms, 360ms, 540ms)
  float r0 = evalRipple(uRipple0, cellCenter.xz, uTime);
  float r1 = evalRipple(uRipple1, cellCenter.xz, uTime) * 0.72;
  float r2 = evalRipple(uRipple2, cellCenter.xz, uTime) * 0.50;
  float r3 = evalRipple(uRipple3, cellCenter.xz, uTime) * 0.32;
  float totalRipple = (r0 + r1 + r2 + r3);

  // Proximity to cursor lifts cells directly
  float pointerDist = length(cellCenter.xz - uPointer.xz);
  float hoverLift = smoothstep(3.5, 0.0, pointerDist) * 0.35;

  // Total Y displacement
  float yLift = noiseRelief + idleDrift + totalRipple * 0.95 + hoverLift;
  vElevation = yLift;
  vWaveIntensity = clamp(abs(totalRipple) * 2.8 + hoverLift * 1.5, 0.0, 1.0);

  // Apply instance transform to local vertex
  // In local space, hex is in XY plane. We rotate it to lie on XZ plane: (x, 0, -y)
  vec3 localInXZ = vec3(position.x, 0.0, -position.y);
  vec4 worldPos = instanceMatrix * vec4(localInXZ, 1.0);
  worldPos.y += yLift;

  vWorldPos = worldPos.xyz;

  vec4 mvPosition = modelViewMatrix * worldPos;
  vDistToCamera = -mvPosition.z;

  gl_Position = projectionMatrix * mvPosition;
}
