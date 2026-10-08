import { BLOCK } from "../blocks/BlockTypes.js";

export class Inventory {

    constructor(player, hotbar) {

        this.player = player;
        this.hotbar = hotbar;

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

}