/**
 * Coin object
 */
class Coin extends MovableObject {
    constructor(x, y) {
        super().loadImage('./assets/img/4._Marks/Coins/1.png');
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
    }
}