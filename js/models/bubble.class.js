/**
 * Represents a bubble projectile that moves diagonally across the screen.
 * The Bubble can float either up-left or up-right depending on its direction.
 * Used primarily for attack mechanics in the game.
 * @extends MovableObject
 */
class Bubble extends MovableObject {
    width = 50;
    height = 50;
    speed = 1.02;
    attack = 10;

    /**
     * Creates a new Bubble instance.
     * @param {number} startX - The initial X coordinate of the bubble.
     * @param {number} startY - The initial Y coordinate of the bubble.
     * @param {boolean} otherDirection - Indicates if the bubble should float to the left instead of the right.
     */
    constructor(startX, startY, otherDirection) {
        super().loadImage('./assets/img/1._Sharkie/4._Attack/Bubble_Trap/Bubble.png');
        this.x = startX;
        this.y = startY;
        this.otherDirection = otherDirection;
        this.float();
    }

    /**
     * Causes the bubble to float in a diagonal direction.
     * If `otherDirection` is true, the bubble floats diagonally up-left;
     * otherwise, it floats diagonally up-right. The position is updated
     * every frame to create smooth movement.
     */
    float() {
        // Adjust start position if bubble is coming from the right side
        if (this.otherDirection) {
            this.x -= 200;
        }
        setInterval(() => {
            if (this.otherDirection) {
                // Bubble moves diagonally up-left
                this.x -= this.speed;
                this.y -= this.speed;
            } else {
                // Bubble moves diagonally up-right
                this.x += this.speed;
                this.y -= this.speed;
            }
        }, 1000 / 60);
    }
}