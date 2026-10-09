import { RECIPES } from "./CraftingRecipes.js";

export class CraftingSystem {
    constructor() {
        this.grid = Array(4).fill(null);
    }

    setSlot(index, item) {
        if (index < 0 || index >= 4) return;

        this.grid[index] = item;
    }

    getRecipe() {
        const ingredients = {};

        for (const item of this.grid) {
            if (!item) continue;

            ingredients[item] =
                (ingredients[item] || 0) + 1;
        }

        return RECIPES.find(recipe => {
            const required = recipe.ingredients;

            const keys = Object.keys(ingredients);
            const requiredKeys = Object.keys(required);

            return (
                keys.length === requiredKeys.length &&
                requiredKeys.every(key =>
                    ingredients[key] === required[key]
                )
            );
        }) || null;
    }

    getResult() {
        return this.getRecipe()?.result || null;
    }

    craft() {
        const result = this.getResult();

        if (!result) return null;

        this.grid.fill(null);

        return { ...result };
    }
}