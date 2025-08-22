/**
 * Project: Sharkie 2D Game
 * File: js/models/barriers/barrier-tunnel-below.class.js
 * Responsibility: Defines the BarrierTunnelBelow class – blocks player and enemy movement from below.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

/**
 * Tunnel-below barrier.
 * Inherits from Barrier and represents a tunnel floor that restricts downward movement.
 */
class BarrierTunnelBelow extends Barrier {
    width = 720;
    height = 200;
    offset = {
        x: 0,
        y: 40,
        width: 8,
        height: 0
    }

    /**
     * Creates a tunnel-below barrier at the given coordinates.
     * @param {number} x - The horizontal position of the barrier.
     * @param {number} y - The vertical position of the barrier.
     */
    constructor(x, y) {
        super();
        this.loadImage('./assets/img/3._Background/Barrier/1.2.png');
        this.x = x;
        this.y = y;
    }
}