// Hero Particles Vertex Shader
precision highp float;

attribute vec3 aTargetPos;
attribute vec3 aOriginPos;
attribute float aDelay;
attribute float aSize;

uniform float uTime;
uniform float uProgress; // Reaches 1.0 within 1.5s
uniform vec2 uPointer;
uniform float uPointerRadius;

varying float vAlpha;

void main() {
  // Opening assembly: forms within 1.5s
  float localProg = clamp((uProgress - aDelay * 0.25) / (1.0 - aDelay * 0.25 + 0.001), 0.0, 1.0);
  float t = 1.0 - pow(1.0 - localProg, 3.0);

  vec3 pos = mix(aOriginPos, aTargetPos, t);

  // Soft cursor scatter and spring return within 1.2s
  vec2 diff = pos.xy - uPointer;
  float dist = length(diff);

  if (dist < uPointerRadius && dist > 0.001) {
    float factor = 1.0 - (dist / uPointerRadius);
    float disperse = factor * factor;
    vec2 dir = normalize(diff);
    pos.xy += dir * disperse * 1.35;
    pos.z += disperse * 0.45;
  }

  vAlpha = smoothstep(0.0, 0.2, localProg);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Crisp dense points on screen: 2.2 to 3.8px
  float camDist = max(-mvPosition.z, 1.0);
  gl_PointSize = clamp((aSize * 16.0) / camDist, 2.2, 3.8);
}
