/****
 * Represents a collectible coin in the game.
 * Extends MovableObject to be rendered and positioned on the canvas.
 */
class Coin extends MovableObject {
    /**
     * Creates a coin object at the given coordinates.
     * @param {number} x - The horizontal position of the coin.
     * @param {number} y - The vertical position of the coin.
     */
    constructor(x, y) {
        super().loadImage('./assets/img/4._Marks/Coins/1.png');
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
    }
}