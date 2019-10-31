const THREE = require('three');
const SEPARATION = 50, AMOUNTX = 100, AMOUNTY = 100;


var camera, scene, renderer;
var particles, count = 0;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init () {
  /**
   * fov, aspect-ratio, near, far
   */
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1500;
  camera.position.x = 100;
  scene = new THREE.Scene();

  var numParticles = AMOUNTX * AMOUNTY;
  var positions = new Float32Array( numParticles * 3 );
  var scales = new Float32Array( numParticles );
  var i = 0, j = 0;

  for ( var ix = 0; ix < AMOUNTX; ix++ ) {
    for ( var iy = 0; iy < AMOUNTY; iy++ ) {
      positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
      positions[ i + 1 ] = 0; // y
      positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z
      scales[ j ] = 1;
      i += 3;
      j ++;
    } 
  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );


  var material = new THREE.ShaderMaterial( {
    uniforms: {
      color: { value: new THREE.Color( 0xffffff ) },
    },
    vertexShader: document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent
  } );
  
  particles = new THREE.Points( geometry, material );
  scene.add( particles );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY - camera.position.y ) * .05;
  // camera.position.x = 0.5;
  // camera.position.y = 0.5;
  camera.lookAt( scene.position );

  var positions = particles.geometry.attributes.position.array;
  var scales = particles.geometry.attributes.scale.array;
  var i = 0, j = 0;
  for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
    for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
      positions[ i + 1 ] = ( Math.cos( ( ix + count ) * 0.3 ) * 50 ) +
              ( Math.sin( ( iy + count ) * 0.3 ) * 50 );
      scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 8 +
              ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 8;
      i += 3;
      j ++;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;
  
  renderer.render( scene, camera );
  count += 0.1;

}