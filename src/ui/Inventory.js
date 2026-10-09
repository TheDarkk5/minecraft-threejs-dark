import { BLOCK } from "../blocks/BlockTypes.js";
import { CraftingSystem } from "../systems/CraftingSystem.js";

export class Inventory {

    constructor(player, hotbar) {

        this.player = player;
        this.hotbar = hotbar;

        this.crafting = new CraftingSystem();

        this.craftGrid = [null, null, null, null];

        this.items = {
            [BLOCK.OAK_LOG.id]: 0,
            [BLOCK.OAK_PLANKS.id]: 0
        };

        this.isOpen = false;

        this.element =
            document.getElementById(
                "inventory"
            );

        this.slots =
            document.querySelectorAll(
                ".inventory-slot"
            );


        this.setupKeyboard();

        this.setupSlots();
        this.setupCrafting();
        this.updateQuantities();
    }


    // ==========================================
    // CLAVIER
    // ==========================================

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.code !== "KeyE" ||
                    event.repeat
                ) {
                    return;
                }


                if (this.isOpen) {

                    this.close();

                } else {

                    this.open();

                }

            }
        );

    }


    // ==========================================
    // OUVRIR
    // ==========================================

    open() {

        this.isOpen = true;

        this.element.style.display =
            "flex";


        // Libère la souris

        if (
            this.player.controls.isLocked
        ) {

            this.player.controls.unlock();

        }

    }


    // ==========================================
    // FERMER
    // ==========================================

    close() {

        this.isOpen = false;

        this.element.style.display =
            "none";


        // Recapture la souris

        this.player.controls.lock();

    }


    // ==========================================
    // CASES
    // ==========================================

    setupSlots() {

        this.slots.forEach(
            (slot) => {

                slot.addEventListener(
                    "click",
                    () => {

                        const block =
                            slot.dataset.block;


                        if (!block) {
                            return;
                        }


                        let item = null;


                        if (block === "grass") {

                            item = {
                                name: "Herbe",
                                blockId:
                                    BLOCK.GRASS.id
                            };

                        }


                        if (block === "dirt") {

                            item = {
                                name: "Terre",
                                blockId:
                                    BLOCK.DIRT.id
                            };

                        }


                        if (block === "stone") {

                            item = {
                                name: "Pierre",
                                blockId:
                                    BLOCK.STONE.id
                            };

                        }


                        if (!item) {
                            return;
                        }


                        // Met le bloc dans
                        // la case sélectionnée

                        this.hotbar.slots[
                            this.hotbar.selectedSlot
                        ] = item;


                        this.hotbar.updateUI();

                    }
                );

            }
        );

    }
addItem(blockId, count = 1) {
    this.items[blockId] =
        (this.items[blockId] || 0) + count;

    this.updateCrafting();
    this.updateQuantities();
}

setupCrafting() {
    const slots = document.querySelectorAll(
        ".craft-slot[data-craft]"
    );

    slots.forEach(slot => {
        slot.addEventListener("click", () => {
            const index = Number(slot.dataset.craft);

            if (this.craftGrid[index] !== null) {
                const blockId = this.craftGrid[index];

                this.craftGrid[index] = null;
                this.addItem(blockId);
                return;
            }

            const blockId = this.hotbar.getSelectedBlock();

            if (blockId == null) return;
            if ((this.items[blockId] || 0) <= 0) return;

            this.items[blockId]--;
            this.craftGrid[index] = blockId;

            this.updateCrafting();
        });
    });

    document.getElementById("craft-result")
        .addEventListener("click", () => {
            const result = this.crafting.craft(this.craftGrid);

            if (!result) return;

            this.addItem(result.blockId, result.count);
        });

    this.updateCrafting();
}

updateCrafting() {
    const textures = {
        [BLOCK.OAK_LOG.id]: "/textures/oak_log.png",
        [BLOCK.OAK_PLANKS.id]: "/textures/oak_planks.png"
    };

    document.querySelectorAll(".craft-slot[data-craft]")
        .forEach((slot, index) => {
            slot.replaceChildren();

            const blockId = this.craftGrid[index];
            if (blockId == null) return;

            const image = document.createElement("img");
            image.src = textures[blockId] || "";
            image.style.width = "100%";
            image.style.height = "100%";
            image.style.imageRendering = "pixelated";

            slot.appendChild(image);
        });

    const resultSlot = document.getElementById("craft-result");
    if (!resultSlot) return;

    resultSlot.replaceChildren();

    const result = this.crafting.getResult(this.craftGrid);
    if (!result) return;

    const image = document.createElement("img");
    image.src = textures[result.blockId] || "";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.imageRendering = "pixelated";

    resultSlot.appendChild(image);

    const quantity = document.createElement("span");
    quantity.textContent = result.count;

    resultSlot.appendChild(quantity);
}

// Gestion du stock
getItemCount(blockId) {
    return this.items[blockId] || 0;
}

removeItem(blockId, count = 1) {
    if (this.getItemCount(blockId) < count) {
        return false;
    }

    this.items[blockId] -= count;
    this.updateCrafting();
    this.updateQuantities();

    return true;
}

updateQuantities() {
    const updateSlot = (element, blockId) => {
        element.querySelector(".item-count")?.remove();

        if (blockId == null) return;

        const count = this.getItemCount(blockId);

        const quantity = document.createElement("span");
        quantity.className = "item-count";
        quantity.textContent = count;
        quantity.style.display = count > 0 ? "block" : "none";

        element.appendChild(quantity);
    };

    // Hotbar
    this.hotbar.elements.forEach((element, index) => {
        const item = this.hotbar.slots[index];

        updateSlot(element, item?.blockId);
    });

    // Inventaire
    const blockIds = {
        grass: BLOCK.GRASS.id,
        dirt: BLOCK.DIRT.id,
        stone: BLOCK.STONE.id,
        oak_log: BLOCK.OAK_LOG.id,
        oak_planks: BLOCK.OAK_PLANKS.id
    };

    this.slots.forEach(element => {
        const blockId = blockIds[element.dataset.block];

        updateSlot(element, blockId);
    });
}

}