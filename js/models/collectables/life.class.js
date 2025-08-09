/**
 * Represents a collectible life object in the game.
 * Increases the player's health when collected.
 * Extends MovableObject for rendering and positioning.
 */
class Life extends MovableObject {
    offset = {
        x: 7,
        y: 14,
        width: 8,
        height: 5
    }
    /**
     * Creates a life object at the specified position.
     * @param {number} x - The horizontal position of the life object.
     * @param {number} y - The vertical position of the life object.
     */
    constructor(x, y) {
        super().loadImage('./assets/img/4._Marks/Status_Bars/Life_100.png');
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
    }
}