class Bubble extends MovableObject {
    width = 50;
    height = 50;
    speed = 1.02;
    attack = 10;

    constructor(startX, startY, otherDirection) {
        super().loadImage('./assets/img/1._Sharkie/4._Attack/Bubble_Trap/Bubble.png');
        this.x = startX;
        this.y = startY;
        this.otherDirection = otherDirection;
        this.float();
    }

    /**
     * Causes the bubble to float in a diagonal direction
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