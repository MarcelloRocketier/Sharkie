class PoisonBubble extends MovableObject {
    width = 60;
    height = 60;
    speed = 1.02;
    attack = 30;

    constructor(startX, startY, otherDirection) {
        super().loadImage('./assets/img/1._Sharkie/4._Attack/Bubble_Trap/Poisoned_Bubble_(For_Whale).png');
        this.x = startX;
        this.y = startY;
        this.otherDirection = otherDirection;
        this.float();
    }

    /**
     * Makes the bubble float in a diagonal direction based on orientation
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