import * as THREE from "three";

import { BLOCK } from "../blocks/BlockTypes.js";


export class BlockInteraction {

    constructor(
        camera,
        world,
        scene,
        player,
        hotbar
    ) {

        this.camera = camera;
        this.world = world;
        this.scene = scene;
        this.player = player;

        this.hotbar = hotbar;

        this.maxDistance = 5;


        // =========================
        // RAYCASTER
        // =========================

        this.raycaster =
            new THREE.Raycaster();

        this.raycaster.far =
            this.maxDistance;


        this.center =
            new THREE.Vector2(
                0,
                0
            );


        this.target = null;


        // =========================
        // CONTOUR
        // =========================

        const geometry =
            new THREE.BoxGeometry(
                1.01,
                1.01,
                1.01
            );


        const edges =
            new THREE.EdgesGeometry(
                geometry
            );


        const material =
            new THREE.LineBasicMaterial({
                color: 0x000000
            });


        this.outline =
            new THREE.LineSegments(
                edges,
                material
            );


        this.outline.visible =
            false;


        this.scene.add(
            this.outline
        );


        this.initEvents();

    }


    // ==========================================
    // EVENEMENTS
    // ==========================================

    initEvents() {

        window.addEventListener(
            "mousedown",
            (event) => {

                if (
                    document.pointerLockElement
                    === null
                ) {

                    return;

                }


                // Gauche
                if (event.button === 0) {

                    this.breakBlock();

                }


                // Droit
                if (event.button === 2) {

                    this.placeBlock();

                }

            }
        );


        window.addEventListener(
            "contextmenu",
            (event) => {

                event.preventDefault();

            }
        );

    }


    // ==========================================
    // RECUPERER LES MESHES
    // ==========================================

    getChunkMeshes() {

        const meshes = [];


        for (
            const chunk
            of this.world.chunks.values()
        ) {

            if (chunk.mesh) {

                meshes.push(
                    chunk.mesh
                );

            }

        }


        return meshes;

    }


    // ==========================================
    // UPDATE
    // ==========================================

    update() {

        this.raycaster.setFromCamera(
            this.center,
            this.camera
        );


        const intersections =
            this.raycaster.intersectObjects(
                this.getChunkMeshes(),
                false
            );


        if (
            intersections.length === 0
        ) {

            this.clearTarget();

            return;

        }


        const hit =
            intersections[0];


        if (
            !hit.face ||
            hit.distance >
            this.maxDistance
        ) {

            this.clearTarget();

            return;

        }


        // =========================
        // NORMALE
        // =========================

        const normal =
            hit.face.normal.clone();


        // =========================
        // BLOC TOUCHE
        // =========================

        // On se déplace légèrement
        // à l'intérieur du bloc.

        const insidePoint =
            hit.point.clone().addScaledVector(
                normal,
                -0.01
            );


        const blockX =
            Math.floor(
                insidePoint.x
            );

        const blockY =
            Math.floor(
                insidePoint.y
            );

        const blockZ =
            Math.floor(
                insidePoint.z
            );


        this.target = {

            x: blockX,
            y: blockY,
            z: blockZ,

            normal: normal

        };


        // =========================
        // CONTOUR
        // =========================

        this.outline.position.set(

            blockX + 0.5,
            blockY + 0.5,
            blockZ + 0.5

        );


        this.outline.visible =
            true;

    }


    // ==========================================
    // EFFACER CIBLE
    // ==========================================

    clearTarget() {

        this.target = null;

        this.outline.visible =
            false;

    }


    // ==========================================
    // CASSER
    // ==========================================

    breakBlock() {

        if (!this.target) {

            return;

        }

        if (
    !this.player.controls.isLocked
) {
    return;
}

        this.world.removeBlock(

            this.target.x,
            this.target.y,
            this.target.z

        );


        this.clearTarget();

    }


    // ==========================================
    // PLACER
    // ==========================================

    placeBlock() {

        if (!this.target) {

            return;

        }

if (
    !this.player.controls.isLocked
) {
    return;
}
        const x =
            this.target.x +
            Math.round(
                this.target.normal.x
            );


        const y =
            this.target.y +
            Math.round(
                this.target.normal.y
            );


        const z =
            this.target.z +
            Math.round(
                this.target.normal.z
            );


const blockId =
    this.hotbar.getSelectedBlock();


if (blockId === null) {
    return;
}


this.world.addBlock(
    x,
    y,
    z,
    blockId
);


        this.clearTarget();

    }

}