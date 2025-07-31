class Obstacle extends MovableObject {
    constructor(x, y, imagePath) {
        super();
        this.img = new Image();
        this.img.onload = () => {
            this.imageLoaded = true;
        };
        this.img.src = imagePath;

        this.width = 720;     // volle Canvas-Breite
        this.height = 500;    // volle Canvas-Höhe
        this.x = x;
        this.y = -20;           // exakt an den oberen Rand
        this.speed = 0;
    }
}