//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();

// Set up camera
const camera = new THREE.PerspectiveCamera(16, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8.15);
scene.add(camera)

// Set the objects
let object1;
const loader1 = new GLTFLoader();
const loader1Object = [];

const loader2 = new GLTFLoader();
const loader2Objects = []; // Array to store references to the loaded objects of loader2

function loadAndAddObject(loader, filePath,  rotationAngle, scaleFactor, offsetX, offsetY, positionZ) {
  loader.load(
    filePath,
    function(gltf) {
      const object = gltf.scene;

      // Set the rotation
      object.rotateY(rotationAngle);

      // Set the scale
      object.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Set the position
      object.position.x += offsetX;
      object.position.y += offsetY;
      object.position.z = positionZ;

      // Add the object to the scene
      scene.add(object);

      // Store a reference to the loaded object for later use

      if (loader === loader1) {
        loader1Object.push(object);
      }

      if (loader === loader2) {
        loader2Objects.push(object);
      }
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    },
    function(error) {
      console.error(error);
    }
  );
}

// Load objects
loadAndAddObject(loader1, 'assets/S180.glb', 0, 1, 0, 0, 0);

// Load multiple instances of loader2
loadAndAddObject(loader2, 'assets/scene.gltf', Math.PI, 0.225, 0.55, -0.07, 0.85);
loadAndAddObject(loader2, 'assets/scene.gltf', 0, 0.225, -0.55, -0.07, 0.85);
loadAndAddObject(loader2, 'assets/scene.gltf', Math.PI, 0.225, 0.55, -0.07, -0.75);
loadAndAddObject(loader2, 'assets/scene.gltf', 0, 0.225, -0.55, -0.07, -0.75);

// Set up renderer
const renderer = new THREE.WebGLRenderer({ 
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
scene.background=new THREE.Color(0x333333)
document.body.appendChild(renderer.domElement);

// Set up lights
const ambientLight = new THREE.AmbientLight(0x505050);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 15);
scene.add(directionalLight);

// rendering loop

function rotateLight(){
  directionalLight.position.set(10 * Math.sin(Date.now() * 0.001), 6, 10 * Math.cos(Date.now() * 0.001));
}
let t=0;
function rotateCarLeft(){
  for (const object of loader1Object){
    if(object){
        camera.position.z = 8.15 * Math.cos(t * 0.0006);
        camera.position.x = 8.15 * Math.sin(t * 0.0006);
        camera.lookAt(object.position)
        t-=40;
    }
  }
}

function rotateCarRight(){
  for (const object of loader1Object){
    if(object){
        camera.position.z = 8.15 * Math.cos(t * 0.0006);
        camera.position.x = 8.15 * Math.sin(t * 0.0006);
        camera.lookAt(object.position)
        t+=40;
    }
  }
}

function resetCamera(){
  for (const object of loader1Object){
    if(object){
        camera.position.x = 0;
        camera.position.z = 7.5;
        camera.lookAt(object.position)
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate all loader2 objects around the X-axis
  for (const object of loader2Objects) {
    if (object) {
      object.rotation.x += 0.055;
    }
  }

  if(click){
    rotateLight();
  }
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener("resize", function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();

// add keyboard interaction
document.addEventListener('keydown', function(event) {
  switch(event.keyCode) {
      case 37: // left arrow
          rotateCarLeft();
        break;
      case 39: // right arrow
          rotateCarRight();
        break;
  }
});

var click = false;
// add mouse interaction
function onClick(event) {
  if(click)
    click = false;
  else click = true;
}
window.addEventListener('click', onClick);