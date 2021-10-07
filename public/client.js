import * as THREE from '/build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'
import { GUI } from './jsm/libs/dat.gui.module.js';
import Stats from './jsm/libs/stats.module.js';

let scene;
let camera;
let renderer;
let house;
let model_container = document.querySelector('.webgl');
const canvasSize = document.querySelector('.canvas-element');

const stats = new Stats()
document.body.appendChild(stats.domElement);

const init = () => {
    // scene setup
    scene = new THREE.Scene();

    //camera setup
    const fov = 40;
    const aspect = canvasSize.offsetWidth / canvasSize.offsetHeight;
    const near = 0.1;
    const far = 1000;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 25);
    camera.lookAt(scene.position);
    scene.add(camera);

    //renderer setup
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: model_container
    });
    renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);

    // orbitcontrol setup
    const controls = new OrbitControls(camera, renderer.domElement);

    // ambient light setup
    const amibientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(amibientLight);

    // direction lights setup
    const spotLight1 = new THREE.SpotLight(0x1d27f0, 5);
    spotLight1.position.set(6, 11, 6);
    spotLight1.castShadow = true;
    const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1, 1, 0x00ff00);
    scene.add(spotLight1);

    // orenge light setup
    const spotLight2 = new THREE.SpotLight(0xf57d22, 2);
    spotLight2.position.set(-10, 0, 12);
    spotLight2.castShadow = true;
    const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2, 2, 0x00ff00);
    scene.add(spotLight2);

    // back light setup
    const spotLight3 = new THREE.SpotLight(0x1d27f0, 2);
    spotLight3.position.set(-10, 18, -17);
    spotLight3.castShadow = true;
    const spotLightHelper3 = new THREE.SpotLightHelper(spotLight3, 2, 0xff0000);
    scene.add(spotLight3);


    // helper code for setting light position
    const gui = new GUI();

    // blue light controls
    const blueLight = gui.addFolder('BlueLight');
    blueLight.add(spotLight1.position, "x", -30, 30, 1);
    blueLight.add(spotLight1.position, "y", -30, 30, 1);
    blueLight.add(spotLight1.position, "z", -30, 30, 1);

    // orenge light controls
    const orengeLight = gui.addFolder('OrengeLight');
    orengeLight.add(spotLight2.position, "x", -40, 40, 1);
    orengeLight.add(spotLight2.position, "y", -40, 40, 1);
    orengeLight.add(spotLight2.position, "z", -40, 40, 1);

    // back light controls
    const backLight = gui.addFolder('BackLight');
    backLight.add(spotLight3.position, "x", -40, 40, 1);
    backLight.add(spotLight3.position, "y", -40, 40, 1);
    backLight.add(spotLight3.position, "z", -40, 40, 1);

    // loding gltf 3d model
    const loader = new GLTFLoader();
    loader.load('./model/scene.glb', (gltf) => {
        house = gltf.scene.children[0];
        house.scale.set(0.4, 0.4, 0.4)
        house.position.set(0, -1.3, 0)
        house.rotation.x = Math.PI / -3
        scene.add(gltf.scene);
    });

    animate();
}

// redering scene and camera
const render = () => {
    renderer.render(scene, camera);
}

// animation recursive function
let step = 0
const animate = () => {
    requestAnimationFrame(animate);
    step += 0.02;
    house.position.y =  2*Math.abs(Math.sin(step));
    // console.log(2*Math.abs(Math.sin(step)))
    house.rotation.y = Math.sin(step)*(Math.abs(Math.cos(step / 3) / 4));

    render();
    stats.update();
}

console.log(Math.sin(10));

// making responsive
const windowResize = () => {
    camera.aspect = canvasSize.offsetWidth / canvasSize.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
    render();
}

window.addEventListener('resize', windowResize, false);
window.onload = init;