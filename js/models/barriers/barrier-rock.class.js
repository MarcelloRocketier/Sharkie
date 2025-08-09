/**
 * Rock barrier used to block player and enemy movement.
 * Extends the base Barrier class.
 * @extends Barrier
 * @property {number} width - The width of the rock barrier in pixels.
 * @property {number} height - The height of the rock barrier in pixels.
 * @property {{x: number, y: number, width: number, height: number}} offset - The offset configuration for collision detection.
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