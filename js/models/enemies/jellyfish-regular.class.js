/**
 * Project: Sharkie 2D Game
 * File: js/models/enemies/jellyfish-regular.class.js
 * Responsibility: Defines the regular jellyfish enemy – movement logic and swim/dead animations.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

/**
 * Regular Jellyfish enemy.
 * Moves horizontally or vertically and switches animations based on life state.
 * Extends MovableObject for rendering and movement.
 */
class JellyFishRegular extends MovableObject {
    /** @type {number} Width of the jellyfish. */
    width = 100;
    /** @type {number} Height of the jellyfish. */
    height = 100;
    /** @type {number} Health points of the jellyfish. */
    energy = 5;
    /** @type {number} Attack strength of the jellyfish. */
    attack = 10;
    /** @type {{x:number,y:number,width:number,height:number}} Collision box offsets. */
    offset = {
        x: 0,
        y: 5,
        width: 0,
        height: 8
    }

    /**
     * Creates a regular jellyfish enemy instance.
     * @param {string} color - Color variant ('lila', 'yellow', etc.).
     * @param {number} x - Initial x coordinate.
     * @param {number} y - Initial y coordinate.
     * @param {string} direction - Movement direction ('horizontal' or 'vertical').
     * @param {number} startPoint - Start coordinate for patrol movement.
     * @param {number} endPoint - End coordinate for patrol movement.
     * @param {number} speed - Movement speed.
     * @param {number} imgInitiallyMirrored - 1 if sprite should be mirrored initially, otherwise 0.
     */
    constructor(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored) {
        super().loadImage('./assets/img/2._Enemy/2._Jellyfish/Regular_Damage/Lila_1.png');
        this.loadImages(JELLYFISH_REGULAR_IMAGES.SWIM[color]);
        this.loadImages(JELLYFISH_REGULAR_IMAGES.DEAD[color]);
        this.x = x;
        this.y = y;

        if (imgInitiallyMirrored == 1) {
            this.imgMirrored = true;
        } else {
            this.imgMirrored = false;
        }

        this.animate(color, direction, startPoint, endPoint, speed, imgInitiallyMirrored);
    }

    /**
     * Starts the animation loop.
     * Plays swim or dead animation depending on state.
     * @param {string} color - Color variant.
     * @param {string} direction - Movement direction.
     * @param {number} startPoint - Start coordinate.
     * @param {number} endPoint - End coordinate.
     * @param {number} speed - Movement speed.
     * @param {number} imgInitiallyMirrored - 1 if initially mirrored, 0 otherwise.
     * @returns {void}
     */
    animate(color, direction, startPoint, endPoint, speed, imgInitiallyMirrored) {
        this.move(direction, startPoint, endPoint, speed, imgInitiallyMirrored);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(JELLYFISH_REGULAR_IMAGES.DEAD[color], 1);
            } else {
                this.playAnimation(JELLYFISH_REGULAR_IMAGES.SWIM[color], 1);
            }
        }, 250)
    }
}