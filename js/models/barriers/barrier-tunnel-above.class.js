/**
 * Tunnel-above barrier that blocks player and enemy movement from above.
 * Extends the base Barrier class.
 * @extends Barrier
 * @property {number} width - The width of the barrier in pixels.
 * @property {number} height - The height of the barrier in pixels.
 * @property {{x: number, y: number, width: number, height: number}} offset - The hitbox offset for collision detection.
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