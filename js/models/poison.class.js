class Poison extends MovableObject {
    height = 60;
    width = 60;
    x = 300;
    y = 350;
    IMAGES_ANIMATED = [
        'assets/img/4. Marcadores/Posion/Animada/1.png',
        'assets/img/4. Marcadores/Posion/Animada/2.png',
        'assets/img/4. Marcadores/Posion/Animada/3.png',
        'assets/img/4. Marcadores/Posion/Animada/4.png',
        'assets/img/4. Marcadores/Posion/Animada/5.png',
        'assets/img/4. Marcadores/Posion/Animada/6.png',
        'assets/img/4. Marcadores/Posion/Animada/7.png',
        'assets/img/4. Marcadores/Posion/Animada/8.png',
    ];

    constructor(x, y) {
        super().loadImage(this.IMAGES_ANIMATED[0]);
        this.loadImages(this.IMAGES_ANIMATED);
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_ANIMATED);
        }, 180); // langsame flackernde Bewegung
    }
}