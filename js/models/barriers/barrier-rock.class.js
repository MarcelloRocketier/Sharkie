/**
 * Project: Sharkie 2D Game
 * File: js/models/barriers/barrier-rock.class.js
 * Responsibility: Defines the BarrierRock class – a rock obstacle that blocks player and enemy movement.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

/**
 * Rock barrier.
 * Inherits from Barrier and uses a specific rock sprite.
 * Blocks movement for both player and enemies.
 */
class BarrierRock extends Barrier {
    width = 720;
    height = 200;
    offset = {
        x: 50,
        y: 40,
        width: 8,
        height: 0
    }

    /**
     * Creates a rock barrier at the given coordinates.
     * @param {number} x - The horizontal position of the barrier.
     * @param {number} y - The vertical position of the barrier.
     */
    constructor(x, y) {
        super();
        this.loadImage('./assets/img/3._Background/Barrier/2.png');
        this.x = x;
        this.y = y;
    }
}