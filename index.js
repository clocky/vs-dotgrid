import {
  PerspectiveCamera,
  Scene,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Color,
  Points,
  WebGLRenderer,
} from "three";
const SEPARATION = 32,
  AMOUNTX = 64,
  AMOUNTY = 128;

let camera, scene, renderer;
let particles,
  count = 0;

init();
animate();

function init() {
  /**
   * fov, aspect-ratio, near, far
   * Set default camera Z-index to pull back for a fuller view of the grid.
   */
  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = AMOUNTY * 16;

  scene = new Scene();

  var numParticles = AMOUNTX * AMOUNTY;
  var positions = new Float32Array(numParticles * 3);
  var scales = new Float32Array(numParticles);
  var i = 0,
    j = 0;

  for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {
      positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
      positions[i + 1] = 0; // y
      positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
      scales[j] = 1;
      i += 3;
      j++;
    }
  }

  var geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("scale", new BufferAttribute(scales, 1));

  var material = new ShaderMaterial({
    uniforms: {
      color: { value: new Color(0x5c2d91) },
    },
    vertexShader: document.getElementById("vertexshader").textContent,
    fragmentShader: document.getElementById("fragmentshader").textContent,
  });

  particles = new Points(geometry, material);
  scene.add(particles);

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  camera.position.x += camera.position.x * 0.05;
  camera.position.y += camera.position.y * 0.05;
  camera.lookAt(scene.position);

  camera.rotation.z = count * 0.02;

  var positions = particles.geometry.attributes.position.array;
  var scales = particles.geometry.attributes.scale.array;

  var i = 0,
    j = 0;
  for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {
      positions[i + 1] =
        Math.sin((ix + count) * 0.1) * 512 + Math.cos((iy + count) * 0.1) * 128;
      scales[j] =
        (Math.sin((ix + count) * 0.25) + 1) * 8 +
        (Math.cos((iy + count) * 0.25) + 1) * 8;
      i += 3;
      j++;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;

  renderer.render(scene, camera);
  count += 0.05;
}
