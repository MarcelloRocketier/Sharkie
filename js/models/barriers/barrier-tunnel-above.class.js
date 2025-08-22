/**
 * Project: Sharkie 2D Game
 * File: js/models/barriers/barrier-tunnel-above.class.js
 * Responsibility: Defines the BarrierTunnelAbove class – blocks player and enemy movement from above.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

/**
 * Tunnel-above barrier.
 * Inherits from Barrier and represents a tunnel ceiling that restricts upward movement.
 */
class BarrierTunnelAbove extends Barrier {
    width = 720;
    height = 200;
    offset = {
        x: 0,
        y: 0,
        width: 0,
        height: 90
    }

    /**
     * Creates a tunnel-above barrier at the given coordinates.
     * @param {number} x - The horizontal position of the barrier.
     * @param {number} y - The vertical position of the barrier.
     */
    constructor(x, y) {
        super();
        this.loadImage('./assets/img/3._Background/Barrier/1.1.png');
        this.x = x;
        this.y = y;
    }
}