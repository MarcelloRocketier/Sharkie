/**
 * Represents a floating poison bubble used for attack
 */
class PoisonBubble extends MovableObject {
    width = 60;
    height = 60;
    speed = 1.02;
    attack = 30;

    constructor(startX, startY, flippedDirection) {
        super().loadImage('./assets/img/1._Sharkie/4._Attack/Bubble_Trap/Poisoned_Bubble_(For_Whale).png');
        this.x = startX;
        this.y = startY;
        this.otherDirection = flippedDirection;
        this.startFloating();
    }

    /**
     * Starts the floating animation of the poison bubble
     */
    startFloating() {
        if (this.otherDirection) {
            this.x -= 200; // Adjust position if character is facing left
        }

        setInterval(() => {
            if (this.otherDirection) {
                this.x -= this.speed;
                this.y -= this.speed;
            } else {
                this.x += this.speed;
                this.y -= this.speed;
            }
        }, 1000 / 60);
    }
}