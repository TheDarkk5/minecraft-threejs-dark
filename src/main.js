import * as THREE from "three";
import "./style.css";

import { World } from "./world/World.js";
import { Player } from "./player/Player.js";
import {BlockInteraction} from "./systems/BlockInteraction.js";


// ==========================================
// SCENE
// ==========================================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x87ceeb);


// ==========================================
// CAMERA
// ==========================================

const camera =
    new THREE.PerspectiveCamera(
        75,
        window.innerWidth /
        window.innerHeight,
        0.1,
        1000
    );

camera.position.set(
    20,
    15,
    20
);

camera.lookAt(
    8,
    3,
    8
);


// ==========================================
// RENDERER
// ==========================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

document
    .getElementById("game")
    .appendChild(renderer.domElement);


// ==========================================
// LUMIERE AMBIANTE
// ==========================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.7
    );

scene.add(ambientLight);


// ==========================================
// SOLEIL
// ==========================================

const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

sun.position.set(
    20,
    30,
    20
);

scene.add(sun);


// ==========================================
// MONDE
// ==========================================

const world =
    new World(scene);


// ==========================================
// RESIZE
// ==========================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);

// ==========================================
// PLAYYR
// ==========================================
const player = new Player(
    camera,
    renderer.domElement,
    world
);

const blockInteraction =
    new BlockInteraction(
        camera,
        world,
        scene,
        player
    );

const clock = new THREE.Clock();

// ==========================================
// GAME LOOP
// ==========================================

function animate() {

    requestAnimationFrame(
        animate
    );


    const deltaTime =
        Math.min(
            clock.getDelta(),
            0.1
        );


    player.update(
        deltaTime
    );

    world.update(
        camera.position
    );  

    blockInteraction.update();


    renderer.render(
        scene,
        camera
    );

}
animate();