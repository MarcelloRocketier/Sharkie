/**
 * Represents a poison bubble that floats diagonally and can attack.
 * Extends the MovableObject class.
 */
class PoisonBubble extends MovableObject {
    width = 60;
    height = 60;
    speed = 1.02;
    attack = 50;

    /**
     * Creates a PoisonBubble instance.
     * @param {number} startX - The initial X coordinate of the bubble.
     * @param {number} startY - The initial Y coordinate of the bubble.
     * @param {boolean} otherDirection - If true, the bubble floats to the left; otherwise, it floats to the right.
     * @property {number} attack - The damage value this poison bubble inflicts (default 50).
     */
    constructor(startX, startY, otherDirection) {
        super().loadImage('./assets/img/1._Sharkie/4._Attack/Bubble_Trap/Poisoned_Bubble_(For_Whale).png');
        this.x = startX;
        this.y = startY;
        this.otherDirection = otherDirection;
        this.float();
    }

    /**
     * Makes the bubble float diagonally upward and horizontally away from its starting position depending on otherDirection.
     * @returns {void}
     */
    float() {
        if (this.otherDirection) {
            this.x -= 200; // Adjust bubble start position when character faces right
        }
        setInterval(() => {
            if (this.otherDirection) { // Moves bubble diagonally up-left
                this.x -= this.speed;
                this.y -= this.speed;
            } else { // Moves bubble diagonally up-right
                this.x += this.speed;
                this.y -= this.speed;
            }
        }, 1000 / 60);
    }
}