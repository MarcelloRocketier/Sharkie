class Coin extends MovableObject {
    height = 40;
    width = 40;
    IMAGES_COIN = [
        'assets/img/4. Marcadores/1. Coins/1.png',
        'assets/img/4. Marcadores/1. Coins/2.png',
        'assets/img/4. Marcadores/1. Coins/3.png',
        'assets/img/4. Marcadores/1. Coins/4.png',
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImages(this.IMAGES_COIN);
        this.loadImage(this.IMAGES_COIN[0]);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 150);
    }
}