/**
 * Project: Sharkie 2D Game
 * File: js/models/enemies/jellyfish-dangerous.class.js
 * Responsibility: Defines the dangerous jellyfish enemy – higher attack damage, movement logic, swim/dead animations.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

/**
 * Dangerous Jellyfish enemy.
 * Inflicts more damage than regular jellyfish.
 * Moves horizontally or vertically and switches animations depending on state.
 */
class JellyFishDangerous extends MovableObject {
    /** @type {number} Width of the jellyfish. */
    width = 100;
    /** @type {number} Height of the jellyfish. */
    height = 100;
    /** @type {number} Health points of the jellyfish. */
    energy = 5;
    /** @type {number} Attack damage inflicted by the jellyfish. */
    attack = 15;
    /** @type {{x:number,y:number,width:number,height:number}} Collision box offsets. */
    offset = {
        x: 0,
        y: 5,
        width: 0,
        height: 8
    }

    /**
     * Creates a Dangerous Jellyfish enemy instance.
     * @param {string} color - Color variant ('lila', 'yellow', 'green', 'pink').
     * @param {number} x - Initial x coordinate.
     * @param {number} y - Initial y coordinate.
     * @param {string} direction - Movement direction ('horizontal' or 'vertical').
     * @param {number} startPoint - Start coordinate for patrol.
     * @param {number} endPoint - End coordinate for patrol.
     * @param {number} speed - Movement speed.
     * @param {number} imgInitiallyMirrored - 1 if sprite should be mirrored initially, 0 otherwise.
     */
    constructor(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored) {
        super().loadImage('./assets/img/2._Enemy/2._Jellyfish/Regular_Damage/Lila_1.png');
        this._initImages(color);
        this._initPosition(x, y, imgInitiallyMirrored);
        this.animate(color, direction, startPoint, endPoint, speed, imgInitiallyMirrored);
    }

    /**
     * Loads swim and dead image sets for this jellyfish color.
     * @param {string} color
     * @returns {void}
     */
    _initImages(color) {
        this.loadImages(JELLYFISH_DANGEROUS_IMAGES.SWIM[color]);
        this.loadImages(JELLYFISH_DANGEROUS_IMAGES.DEAD[color]);
    }

    /**
     * Initializes position and mirroring of the sprite.
     * @param {number} x
     * @param {number} y
     * @param {number} imgInitiallyMirrored
     * @returns {void}
     */
    _initPosition(x, y, imgInitiallyMirrored) {
        this.x = x;
        this.y = y;
        this.imgMirrored = (imgInitiallyMirrored == 1);
    }

    /**
     * Starts the animation loop.
     * Plays swim or dead animation depending on current state.
     * @param {string} color - Color variant.
     * @param {string} direction - Movement direction.
     * @param {number} startPoint - Start coordinate.
     * @param {number} endPoint - End coordinate.
     * @param {number} speed - Movement speed.
     * @param {number} imgInitiallyMirrored - 1 if mirrored initially, 0 otherwise.
     * @returns {void}
     */
    animate(color, direction, startPoint, endPoint, speed, imgInitiallyMirrored) {
        this.move(direction, startPoint, endPoint, speed, imgInitiallyMirrored);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(JELLYFISH_DANGEROUS_IMAGES.DEAD[color], 1);
            } else {
                this.playAnimation(JELLYFISH_DANGEROUS_IMAGES.SWIM[color], 1);
            }
        }, 250)
    }

    /**
     * Applies damage to this dangerous jellyfish and triggers death if energy <= 0.
     * @param {number} dmg - The amount of damage to apply.
     * @returns {void}
     */
    hit(dmg) {
        if (this.neutralized && (!this.neutralizedUntil || this.neutralizedUntil > Date.now())) {
            return;
        }
        this.energy -= dmg;
        if (this.energy <= 0) {
            this.energy = 0;
        }
    }

    /**
     * Returns true if the dangerous jellyfish is dead (energy <= 0).
     * @returns {boolean}
     */
    isDead() {
        return this.energy <= 0;
    }
}