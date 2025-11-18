import * as THREE from 'three';
import './style.css';
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

const SEPARATION = 32, AMOUNTX = 64, AMOUNTY = 128;

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let particles: THREE.Points;
let count = 0;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = AMOUNTY * 16;

  scene = new THREE.Scene();

  const numParticles = AMOUNTX * AMOUNTY;
  const positions = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);

  let i = 0, j = 0;

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
      positions[i + 1] = 0; // y
      positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z
      scales[j] = 1;
      i += 3;
      j++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  const computedStyle = getComputedStyle(document.documentElement);
  const dotColor = new THREE.Color(computedStyle.getPropertyValue('--dot-color').trim());

  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: dotColor },
    },
    vertexShader,
    fragmentShader
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  camera.position.x += (camera.position.x) * .05;
  camera.position.y += (camera.position.y) * .05;
  camera.lookAt(scene.position);

  camera.rotation.z = (count * 0.02);

  const positions = particles.geometry.attributes.position.array as Float32Array;
  const scales = particles.geometry.attributes.scale.array as Float32Array;

  let i = 0, j = 0;
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions[i + 1] =
        (Math.sin((ix + count) * 0.1) * 512) +
        (Math.cos((iy + count) * 0.1) * 128);
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
