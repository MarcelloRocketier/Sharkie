/**
 * Project: Sharkie 2D Game
 * File: js/models/barriers/barrier-wall.class.js
 * Responsibility: Defines the BarrierWall class – a vertical wall barrier that blocks player and enemy movement.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

/**
 * Vertical wall barrier.
 * Inherits from Barrier and represents a wall that restricts horizontal movement.
 */
class BarrierWall extends Barrier {
    width = 200;
    height = 480;
   offset = {
    x: 50,
    y: 0,
    width: 40,
    height: 480
}

    /**
     * Creates a vertical wall barrier at the given coordinates.
     * @param {number} x - The horizontal position of the barrier.
     * @param {number} y - The vertical position of the barrier.
     */
    constructor(x, y) {
        super();
        this.loadImage('./assets/img/3._Background/Barrier/3.png');
        this.x = x;
        this.y = y;
    }
}