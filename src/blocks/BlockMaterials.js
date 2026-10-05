import * as THREE from "three";

const loader = new THREE.TextureLoader();

function loadTexture(path) {

    const texture = loader.load(path);

    // Aspect pixelisé façon Minecraft
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    // Nos PNG contiennent des couleurs
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
}


// ================================
// TEXTURES
// ================================

const grassTop = loadTexture(
    "/textures/grass_top.png"
);

const grassSide = loadTexture(
    "/textures/grass_side.png"
);

const dirt = loadTexture(
    "/textures/dirt.png"
);

const stone = loadTexture(
    "/textures/stone.png"
);


// ================================
// MATERIALS
// ================================

const grassTopMaterial =
    new THREE.MeshLambertMaterial({
        map: grassTop
    });

const grassSideMaterial =
    new THREE.MeshLambertMaterial({
        map: grassSide
    });

const dirtMaterial =
    new THREE.MeshLambertMaterial({
        map: dirt
    });

const stoneMaterial =
    new THREE.MeshLambertMaterial({
        map: stone
    });


// ================================
// BLOCS
// ================================

export const BLOCK_MATERIALS = {

    GRASS: [

        // droite
        grassSideMaterial,

        // gauche
        grassSideMaterial,

        // dessus
        grassTopMaterial,

        // dessous
        dirtMaterial,

        // devant
        grassSideMaterial,

        // derrière
        grassSideMaterial

    ],

    DIRT: dirtMaterial,

    STONE: stoneMaterial

};