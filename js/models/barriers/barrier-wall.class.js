/**
 * Vertical wall barrier that blocks player and enemy movement.
 * Extends the base Barrier class.
 * @extends Barrier
 * @property {number} width - The width of the barrier in pixels.
 * @property {number} height - The height of the barrier in pixels.
 * @property {{x: number, y: number, width: number, height: number}} offset - The hitbox offset for collision detection.
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