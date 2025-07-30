class fish extends MovableObject {

    x = 120;
    y = 240;
    img;
    height = 60;
    width = 60;

    constructor() {
        super();

        const variants = [
            [
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim5.png',
            ],
            [
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim1.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim2.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim3.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim4.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim5.png',
            ],
            [
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim1.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim2.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim3.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim4.png',
                'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim5.png',
            ]
        ];

        this.IMAGES_SWIM = variants[Math.floor(Math.random() * variants.length)];
        this.loadImage(this.IMAGES_SWIM[0]);
        this.loadImages(this.IMAGES_SWIM);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
            this.playAnimation(this.IMAGES_SWIM);
        }, 280);
    }
}