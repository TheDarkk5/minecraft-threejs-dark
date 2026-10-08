import { BLOCK } from "../blocks/BlockTypes.js";

export class Hotbar {

    constructor() {

        this.selectedSlot = 0;

        this.slots = [
            {
                name: "Herbe",
                blockId: BLOCK.GRASS.id
            },

            {
                name: "Terre",
                blockId: BLOCK.DIRT.id
            },

            {
                name: "Pierre",
                blockId: BLOCK.STONE.id
            },

            null,
            null,
            null,
            null,
            null,
            null
        ];


        this.elements =
            document.querySelectorAll(
                ".hotbar-slot"
            );


        this.blockName =
            document.getElementById(
                "selected-block-name"
            );


        this.setupEvents();

        this.updateUI();

    }


    setupEvents() {

        // TOUCHES 1 → 9

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
                            event.code.substring(5)
                        );


                    if (
                        number >= 1 &&
                        number <= 9
                    ) {

                        this.selectSlot(
                            number - 1
                        );

                    }

                }

            }
        );


        // MOLETTE

        window.addEventListener(
            "wheel",
            (event) => {

                if (event.deltaY > 0) {

                    this.selectedSlot++;

                } else {

                    this.selectedSlot--;

                }


                // Boucle 9 → 1

                if (
                    this.selectedSlot > 8
                ) {

                    this.selectedSlot = 0;

                }


                // Boucle 1 → 9

                if (
                    this.selectedSlot < 0
                ) {

                    this.selectedSlot = 8;

                }


                this.updateUI();

            }
        );

    }


    selectSlot(index) {

        if (
            index < 0 ||
            index > 8
        ) {

            return;

        }


        this.selectedSlot = index;

        this.updateUI();

    }


    updateUI() {

        this.elements.forEach(
            (element, index) => {

                element.classList.toggle(
                    "selected",
                    index === this.selectedSlot
                );

            }
        );


        const item =
            this.slots[
                this.selectedSlot
            ];


        if (item) {

            this.blockName.textContent =
                item.name;

        } else {

            this.blockName.textContent =
                "";

        }

    }


    getSelectedBlock() {

        const item =
            this.slots[
                this.selectedSlot
            ];


        if (!item) {

            return null;

        }


        return item.blockId;

    }

}