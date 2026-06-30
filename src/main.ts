import { PerspectiveCamera, Scene, WebGLRenderer, Points, BufferGeometry, BufferAttribute, Color, ShaderMaterial } from 'three';
import './style.css';
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

const SEPARATION = 32;
const AMOUNTX = 64;
const AMOUNTY = 128;

let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
let particles: Points;
let count = 0;

init();
animate();

/**
 * Initializes the Three.js scene, camera, renderer, and particle system.
 * Sets up the dot grid geometry with position and gridPos attributes,
 * applies custom shaders, and attaches event listeners.
 */
function init() {
  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = AMOUNTY * 16;

  scene = new Scene();

  const numParticles = AMOUNTX * AMOUNTY;
  const positions = new Float32Array(numParticles * 3);
  const gridPos = new Float32Array(numParticles * 2);

  let i = 0, j = 0;

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
      positions[i + 1] = 0; // y
      positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z
      
      gridPos[j] = ix;
      gridPos[j + 1] = iy;
      
      i += 3;
      j += 2;
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('gridPos', new BufferAttribute(gridPos, 2));

  const computedStyle = getComputedStyle(document.documentElement);
  const dotColor = new Color(computedStyle.getPropertyValue('--dot-color').trim());

  const material = new ShaderMaterial({
    uniforms: {
      color: { value: dotColor },
      uTime: { value: 0 }
    },
    vertexShader,
    fragmentShader
  });

  particles = new Points(geometry, material);
  scene.add(particles);

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
 * Updates camera position and rotation, and passes the updated time uniform to the shader.
 */
function render() {
  camera.position.x += (camera.position.x) * .05;
  camera.position.y += (camera.position.y) * .05;
  camera.lookAt(scene.position);

  camera.rotation.z = (count * 0.02);

  const material = particles.material as ShaderMaterial;
  material.uniforms.uTime.value = count;

  renderer.render(scene, camera);
  count += 0.01;
}
