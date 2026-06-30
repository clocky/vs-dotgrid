uniform float uTime;
attribute vec2 gridPos;

void main() {
  float ix = gridPos.x;
  float iy = gridPos.y;
  
  float newY = (sin((ix + uTime) * 0.1) * 512.0) + (cos((iy + uTime) * 0.1) * 128.0);
  float newScale = (sin((ix + uTime) * 0.25) + 1.0) * 8.0 + (cos((iy + uTime) * 0.25) + 1.0) * 8.0;

  vec3 newPosition = vec3(position.x, newY, position.z);
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  
  gl_PointSize = newScale * (256.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
