import { Chunk } from "./Chunk.js";
import { BLOCK } from "../blocks/BlockTypes.js";
import {WorldGenerator} from "./WorldGenerator.js";


export class World {

    constructor(scene) {

        this.scene = scene;

        this.chunks = new Map();

this.renderDistance = 3;

this.lastPlayerChunkX = null;
this.lastPlayerChunkZ = null;

this.seed =
    "mon-premier-monde";


this.generator =
    new WorldGenerator(
        this.seed
    );
    
        this.generateWorld();

    }


    // ==========================================
    // CLE D'UN CHUNK
    // ==========================================

    getChunkKey(x, z) {

        return `${x},${z}`;

    }


    // ==========================================
    // GENERATION DU MONDE
    // ==========================================

  generateWorld() {

    // =========================
    // CREATION DES CHUNKS
    // =========================

    for (
        let chunkX = -1;
        chunkX <= 1;
        chunkX++
    ) {

        for (
            let chunkZ = -1;
            chunkZ <= 1;
            chunkZ++
        ) {

            this.createChunk(
                chunkX,
                chunkZ
            );

        }

    }


    // =========================
    // CREATION DES MESHES
    // =========================

    for (
        const chunk
        of this.chunks.values()
    ) {

        chunk.buildMesh();

    }

}


    // ==========================================
    // CREER CHUNK
    // ==========================================

    createChunk(chunkX, chunkZ) {

        const key =
            this.getChunkKey(
                chunkX,
                chunkZ
            );


        if (
            this.chunks.has(key)
        ) {

            return;

        }


        const chunk =
            new Chunk(
                this.scene,
                this,
                chunkX,
                chunkZ
            );


        this.chunks.set(
            key,
            chunk
        );

    }


    // ==========================================
    // TROUVER LE CHUNK D'UN BLOC
    // ==========================================

    getChunkFromWorldPosition(
        worldX,
        worldZ
    ) {

        const chunkX =
            Math.floor(
                worldX /
                Chunk.SIZE
            );


        const chunkZ =
            Math.floor(
                worldZ /
                Chunk.SIZE
            );


        const key =
            this.getChunkKey(
                chunkX,
                chunkZ
            );


        return this.chunks.get(key);

    }


    // ==========================================
    // WORLD → LOCAL
    // ==========================================

    worldToLocal(
        worldX,
        worldZ
    ) {

        let x =
            worldX %
            Chunk.SIZE;

        let z =
            worldZ %
            Chunk.SIZE;


        // JavaScript donne des modulo
        // négatifs pour les nombres négatifs.

        if (x < 0) {

            x += Chunk.SIZE;

        }


        if (z < 0) {

            z += Chunk.SIZE;

        }


        return {
            x,
            z
        };

    }


    // ==========================================
    // RECUPERER BLOC
    // ==========================================

    getBlock(
        worldX,
        y,
        worldZ
    ) {

        if (
            y < 0 ||
            y >= Chunk.HEIGHT
        ) {

            return BLOCK.AIR.id;

        }


        const chunk =
            this.getChunkFromWorldPosition(
                worldX,
                worldZ
            );


        if (!chunk) {

            return BLOCK.AIR.id;

        }


        const local =
            this.worldToLocal(
                worldX,
                worldZ
            );


        return chunk.getBlock(
            local.x,
            y,
            local.z
        );

    }


    // ==========================================
    // SOLIDE ?
    // ==========================================

    isSolidBlock(
        x,
        y,
        z
    ) {

        return (
            this.getBlock(
                x,
                y,
                z
            ) !== BLOCK.AIR.id
        );

    }

setBlock(
    worldX,
    y,
    worldZ,
    blockId
) {

    if (
        y < 0 ||
        y >= Chunk.HEIGHT
    ) {

        return false;

    }


    const chunk =
        this.getChunkFromWorldPosition(
            worldX,
            worldZ
        );


    if (!chunk) {

        return false;

    }


    const local =
        this.worldToLocal(
            worldX,
            worldZ
        );


    chunk.setBlock(
        local.x,
        y,
        local.z,
        blockId
    );


    // Reconstruit le chunk
    chunk.buildMesh();


    // Si le bloc est sur une frontière,
    // le chunk voisin doit aussi changer.

    if (local.x === 0) {

        this.rebuildChunk(
            chunk.chunkX - 1,
            chunk.chunkZ
        );

    }


    if (
        local.x ===
        Chunk.SIZE - 1
    ) {

        this.rebuildChunk(
            chunk.chunkX + 1,
            chunk.chunkZ
        );

    }


    if (local.z === 0) {

        this.rebuildChunk(
            chunk.chunkX,
            chunk.chunkZ - 1
        );

    }


    if (
        local.z ===
        Chunk.SIZE - 1
    ) {

        this.rebuildChunk(
            chunk.chunkX,
            chunk.chunkZ + 1
        );

    }


    return true;

}

rebuildChunk(
    chunkX,
    chunkZ
) {

    const key =
        this.getChunkKey(
            chunkX,
            chunkZ
        );


    const chunk =
        this.chunks.get(key);


    if (!chunk) {

        return;

    }


    chunk.buildMesh();

}

removeBlock(
    x,
    y,
    z
) {

    return this.setBlock(
        x,
        y,
        z,
        BLOCK.AIR.id
    );

}

addBlock(
    x,
    y,
    z,
    blockId
) {

    // Il y a déjà quelque chose

    if (
        this.getBlock(
            x,
            y,
            z
        ) !== BLOCK.AIR.id
    ) {

        return false;

    }


    return this.setBlock(
        x,
        y,
        z,
        blockId
    );

}

update(playerPosition) {

    // Chunk dans lequel se trouve le joueur
    const playerChunkX =
        Math.floor(
            playerPosition.x /
            Chunk.SIZE
        );

    const playerChunkZ =
        Math.floor(
            playerPosition.z /
            Chunk.SIZE
        );


    // Le joueur est toujours dans le même chunk
    // donc inutile de recalculer
    if (
        playerChunkX === this.lastPlayerChunkX &&
        playerChunkZ === this.lastPlayerChunkZ
    ) {
        return;
    }


    this.lastPlayerChunkX =
        playerChunkX;

    this.lastPlayerChunkZ =
        playerChunkZ;


    console.log(
        `Chunk joueur : ${playerChunkX}, ${playerChunkZ}`
    );


    this.loadChunksAroundPlayer(
        playerChunkX,
        playerChunkZ
    );

}

loadChunksAroundPlayer(
    centerChunkX,
    centerChunkZ
) {

    for (
        let x = -this.renderDistance;
        x <= this.renderDistance;
        x++
    ) {

        for (
            let z = -this.renderDistance;
            z <= this.renderDistance;
            z++
        ) {

            const chunkX =
                centerChunkX + x;

            const chunkZ =
                centerChunkZ + z;


            const key =
                this.getChunkKey(
                    chunkX,
                    chunkZ
                );


            // Chunk déjà présent
            if (
                this.chunks.has(key)
            ) {
                continue;
            }


            this.createChunk(
                chunkX,
                chunkZ
            );

        }

    }


    // Maintenant que tous les chunks existent,
    // on construit les meshes manquants.

    for (
        let x = -this.renderDistance;
        x <= this.renderDistance;
        x++
    ) {

        for (
            let z = -this.renderDistance;
            z <= this.renderDistance;
            z++
        ) {

            const chunk =
                this.chunks.get(
                    this.getChunkKey(
                        centerChunkX + x,
                        centerChunkZ + z
                    )
                );


            if (
                chunk &&
                !chunk.mesh
            ) {

                chunk.buildMesh();

            }

        }

    }

}

}