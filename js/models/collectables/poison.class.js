/****
 * Project: Sharkie 2D Game
 * File: js/models/collectables/poison.class.js
 * Responsibility: Defines the Poison class – collectible poison used for special bubble attacks.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

/**
 * Poison collectible.
 * Can appear in different visual styles and is consumed to enable poison bubble attacks.
 * Extends MovableObject for rendering and animation.
 */
class Poison extends MovableObject {

    /**
     * Creates a poison object of the given type at the specified coordinates.
     * @param {string} type - The type of poison image ('animated', 'light_left', 'light_right', 'dark_left', 'dark_right').
     * @param {number} x - The horizontal position of the poison.
     * @param {number} y - The vertical position of the poison.
     */
    constructor(type, x, y) {
        super().loadImage('./assets/img/4._Marks/Poison/Light_Left.png');
        this.loadImages(POISON_IMAGES.IMAGES[type]);
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
        this.animate(type);
    }

    /**
     * Starts the poison animation loop.
     * Cycles through the poison image set for the given type.
     * @param {string} type - The poison type key from POISON_IMAGES.
     * @returns {void}
     */
    animate(type) {
        setInterval(() => {
            this.playAnimation(POISON_IMAGES.IMAGES[type], 1);
        }, 250)
    }
}