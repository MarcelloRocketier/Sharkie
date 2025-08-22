/**
 * Project: Sharkie 2D Game
 * File: js/models/enemies/puffer-fish.class.js
 * Responsibility: Defines the PufferFish enemy – handles movement, collision offsets, and animation loop.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

/**
 * PufferFish enemy.
 * Can move horizontally or vertically and switches between swim/dead animations based on state.
 * Extends MovableObject for rendering, movement, and collisions.
 */
class PufferFish extends MovableObject {
    /** @type {number} Default width of the puffer fish. */
    width = 100;
    /** @type {number} Default height of the puffer fish. */
    height = 100;
    /** @type {number} Default energy of the puffer fish. */
    energy = 5;
    /** @type {number} Default attack power of the puffer fish. */
    attack = 5;
    /** @type {number} Default movement speed of the puffer fish. */
    speed = 2;
    /** @type {{x:number,y:number,width:number,height:number}} Collision box offsets. */
    offset = {
        x: 0,
        y: 3,
        width: 5,
        height: 24
    }

    /**
     * Creates a PufferFish enemy instance.
     * @param {string} color - Color variant of the puffer fish.
     * @param {number} x - Initial horizontal position.
     * @param {number} y - Initial vertical position.
     * @param {string} direction - 'horizontal' or 'vertical'.
     * @param {number} startPoint - Start coordinate for patrol movement.
     * @param {number} endPoint - End coordinate for patrol movement.
     * @param {number} speed - Movement speed.
     * @param {number} imgInitiallyMirrored - 1 to mirror sprite initially, 0 otherwise.
     */
    constructor(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored) {
        super().loadImage('./assets/img/2._Enemy/1._Puffer_Fish_(3_Color_Options)/1._Swim/1._Swim_1.png');
        this.loadImages(PUFFER_FISH_IMAGES.SWIM[color]);
        this.loadImages(PUFFER_FISH_IMAGES.DEAD[color]);
        this.x = x;
        this.y = y;

        if (imgInitiallyMirrored == 1) {
            this.imgMirrored = true;
        } else {
            this.imgMirrored = false;
        }
        this.animate(color, direction, startPoint, endPoint, speed);
    }

    /**
     * Starts the animation loop for the PufferFish.
     * Handles switching between swim and dead animations depending on state.
     * @param {string} color - Color variant.
     * @param {string} direction - Movement direction.
     * @param {number} startPoint - Start coordinate for movement.
     * @param {number} endPoint - End coordinate for movement.
     * @param {number} speed - Movement speed.
     * @param {number} imgInitiallyMirrored - 1 to mirror sprite initially, 0 otherwise.
     * @returns {void}
     */
    animate(color, direction, startPoint, endPoint, speed, imgInitiallyMirrored) {
        this.move(direction, startPoint, endPoint, speed, imgInitiallyMirrored);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(PUFFER_FISH_IMAGES.DEAD[color], 0);
            } else {
                this.playAnimation(PUFFER_FISH_IMAGES.SWIM[color], 1);
            }
        }, 250)
    }
}