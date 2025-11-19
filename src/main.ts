import * as THREE from 'three';
import './style.css';
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

const SEPARATION = 32;
const AMOUNTX = 64;
const AMOUNTY = 128;

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let particles: THREE.Points;
let count = 0;

init();
animate();

/**
 * Initializes the Three.js scene, camera, renderer, and particle system.
 * Sets up the dot grid geometry with position and scale attributes,
 * applies custom shaders, and attaches event listeners.
 */
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

/**
 * Handles window resize events by updating the camera aspect ratio
 * and renderer size to match the new window dimensions.
 */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Main animation loop that requests the next frame and calls render.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */
function animate() {
  requestAnimationFrame(animate);
  render();
}

/**
 * Renders a single frame of the animation.
 * Updates camera position and rotation, calculates wave motion for particles,
 * and updates particle positions and scales based on sine/cosine functions.
 */
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
