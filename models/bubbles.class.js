class Bubble extends MovableObject {
    constructor() {
        super().loadImage('assets/img/4. Marcadores/bubbles.png');

        // zufällige Größe
        this.width = 60 + Math.random() * 50;
        this.height = this.width * 1.1;

        // Startposition rechts außerhalb
        this.x = 720 + Math.random() * 300;
        this.y = 50 + Math.random() * 300;

        // zufällige Geschwindigkeit
        this.speedX = 0.2 + Math.random() * 0.2;
        this.speedY = 0.1 + Math.random() * 0.3;

        // individuelle Wackelphase
        this.phase = Math.random() * 100;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= this.speedX;
            this.y -= this.speedY;

            // sanftes Wackeln nach oben/unten
            this.y += Math.sin(Date.now() / 300 + this.phase) * 0.4;
        }, 1000 / 60);
    }
}