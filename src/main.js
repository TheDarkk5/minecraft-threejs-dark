import * as THREE from "three";
import "./style.css";

import { World } from "./world/World.js";
import { Player } from "./player/Player.js";
import {BlockInteraction} from "./systems/BlockInteraction.js";
import {Hotbar} from "./ui/Hotbar.js";
import {Inventory} from "./ui/Inventory.js";

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

const hotbar = new Hotbar();

const inventory = new Inventory(
        player,
        hotbar
);

const blockInteraction = new BlockInteraction(
        camera,
        world,
        scene,
        player,
        hotbar
);

const clock = new THREE.Timer();


// ==========================================
// MENU PRINCIPAL
// ==========================================

const mainMenu =
    document.getElementById(
        "main-menu"
    );

const playButton =
    document.getElementById(
        "play-button"
    );

const optionsButton =
    document.getElementById(
        "options-button"
    );

const quitButton =
    document.getElementById(
        "quit-button"
    );

const crosshair =
    document.getElementById(
        "crosshair"
    );

const instructions =
    document.getElementById(
        "instructions"
    );

const hud =
    document.getElementById(
        "hud"
    );

let gameStarted = false;


// ==========================================
// JOUER
// ==========================================

playButton.addEventListener(
    "click",
    () => {

        gameStarted = true;

        mainMenu.style.display =
            "none";

        hud.style.display =
            "block";

        crosshair.style.display =
            "block";

        instructions.style.display =
            "block";

    }
);

optionsButton.addEventListener(
    "click",
    () => {

        console.log(
            "Menu options"
        );

    }
);

quitButton.addEventListener(
    "click",
    () => {

        alert(
            "Vous pouvez fermer l'onglet."
        );

    }
);

// ==========================================
// HOTBAR
// ==========================================

let selectedSlot = 0;

const hotbarSlots =
    document.querySelectorAll(
        ".hotbar-slot"
    );


function selectSlot(index) {

    if (
        index < 0 ||
        index >= hotbarSlots.length
    ) {
        return;
    }


    hotbarSlots[
        selectedSlot
    ].classList.remove(
        "selected"
    );


    selectedSlot = index;


    hotbarSlots[
        selectedSlot
    ].classList.add(
        "selected"
    );

}

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code.startsWith(
                "Digit"
            )
        ) {

            const number =
                Number(
                    event.code.replace(
                        "Digit",
                        ""
                    )
                );


            if (
                number >= 1 &&
                number <= 9
            ) {

                selectSlot(
                    number - 1
                );

            }

        }

    }
);

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

if (gameStarted && !inventory.isOpen) {

    player.update(
        deltaTime
    );

    world.update(
        camera.position
    );  

    blockInteraction.update();

}

    renderer.render(
        scene,
        camera
    );

}
animate();