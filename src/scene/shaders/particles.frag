// Hero Particles Fragment Shader
precision highp float;

uniform vec3 uBone; // #E9E5DD
varying float vAlpha;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  // Crisp circular dot
  if (dot(coord, coord) > 0.25) {
    discard;
  }

  // Solid, dense bone color per Item A
  gl_FragColor = vec4(uBone, vAlpha);
}
