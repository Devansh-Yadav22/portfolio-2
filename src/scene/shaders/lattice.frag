// Lattice Fragment Shader (Crisp High-Contrast Hex Edges)
precision highp float;

uniform vec3 uInk;       // #06080C
uniform vec3 uBone;      // #E9E5DD
uniform vec3 uHoney;     // #FFB23E
uniform vec3 uHoneyDeep; // #B86E10
uniform float uTime;
uniform float uFogNear;
uniform float uFogFar;

varying vec2 vLocalPos;
varying vec3 vWorldPos;
varying float vActive;
varying float vHiddenId;
varying float vElevation;
varying float vWaveIntensity;
varying float vDistToCamera;

// Exact regular hexagon signed distance field
float sdHexagon(vec2 p, float r) {
  const vec3 k = vec3(-0.866025404, 0.5, 0.577350269);
  p = abs(p);
  p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
  p -= vec2(clamp(p.x, -k.z * r, k.z * r), r);
  return length(p) * sign(p.y);
}

void main() {
  // Hexagon radius 0.96 in unit coordinates
  float d = sdHexagon(vLocalPos, 0.95);

  // If outside outer boundary, discard
  if (d > 0.06) {
    discard;
  }

  // Sharp 1px hairline edge
  float edge = smoothstep(0.042, 0.005, abs(d));

  // Hidden cell faint pulse
  float hiddenPulse = 0.0;
  if (vHiddenId > 0.5) {
    hiddenPulse = (sin(uTime * 2.8 + vHiddenId * 1.57) * 0.5 + 0.5) * 0.85;
  }

  // Activation & wave resonance
  float activation = clamp(vActive + vWaveIntensity + hiddenPulse, 0.0, 1.0);

  // Target requirement: Hex edges at roughly 25 to 35 percent of --bone opacity at rest
  vec3 restingEdgeColor = mix(uInk, uBone, 0.32);

  // Active / rippling edges light up in vibrant honey
  vec3 edgeColor = mix(restingEdgeColor, uHoney, activation);

  // Soft bloom glow on honey-lit edges
  float bloomGlow = smoothstep(0.12, 0.0, abs(d)) * smoothstep(0.4, 1.0, activation) * 0.75;

  // Very subtle interior plate fill when active
  float interior = smoothstep(0.0, -0.05, d);
  vec3 fillColor = mix(uInk, uHoneyDeep, activation * 0.16);

  // Composite edge and plate
  vec3 finalColor = mix(fillColor, edgeColor, edge) + uHoney * bloomGlow;
  float alpha = mix(activation * 0.15, 0.95, edge) + bloomGlow * 0.5;

  // Distance fog into --ink towards the horizon
  float fogFactor = clamp((vDistToCamera - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
  fogFactor = fogFactor * fogFactor; // smooth quad fade
  finalColor = mix(finalColor, uInk, fogFactor);
  alpha = mix(alpha, 0.0, fogFactor);

  if (alpha < 0.02) {
    discard;
  }

  gl_FragColor = vec4(finalColor, alpha);
}
