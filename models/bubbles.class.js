class Bubble extends MovableObject {
    width = 50;
    height = 50;
    speed = 1.02;
    attack = 10;

    constructor(startX, startY, otherDirection) {
        super().loadImage('assets/img/1._Sharkie/4._Attack/Bubble_Trap/Bubble.png');
        this.x = startX;
        this.y = startY;
        this.otherDirection = otherDirection;
        this.float();
    }

    /**
     * Moves the bubble diagonally upward depending on the direction
     */
    float() {
        if (this.otherDirection) {
            this.x -= 200; // Shift bubble to start from character's correct side
        }

        setInterval(() => {
            this.x += this.otherDirection ? -this.speed : this.speed;
            this.y -= this.speed;
        }, 1000 / 60);
    }
} 
