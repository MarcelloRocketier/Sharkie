class Jellyfish extends MovableObject {
    height = 60;
    width = 60;
    speed = 0.2 + Math.random() * 0.3;
    img;
    IMAGES_JELLY;

    constructor() {
        super();
        this.IMAGES_JELLY = this.getRandomJellyImages();
        this.loadImage(this.IMAGES_JELLY[0]);
        this.loadImages(this.IMAGES_JELLY);
        this.x = 200 + Math.random() * 500;
        this.y = 480 + Math.random() * 200; // Start unterhalb des sichtbaren Bereichs
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.y -= this.speed;
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_JELLY);
        }, 350);
    }

    getRandomJellyImages() {
        const sets = [
            [ // Lila
                'assets/img/2.Enemy/2_Jellyfish/Regular_damage/lila_1.png',
                'assets/img/2.Enemy/2_Jellyfish/Regular_damage/lila_2.png',
                'assets/img/2.Enemy/2_Jellyfish/Regular_damage/lila_3.png',
                'assets/img/2.Enemy/2_Jellyfish/Regular_damage/lila_4.png',
            ],
            [ // Gelb
                'assets/img/2.Enemy/2_Jellyfish/Regular_damage/yellow_1.png',
                'assets/img/2.Enemy/2_Jellyfish/Regular_damage/yellow_2.png',
                'assets/img/2.Enemy/2_Jellyfish/Regular_damage/yellow_3.png',
                'assets/img/2.Enemy/2_Jellyfish/Regular_damage/yellow_4.png',
            ],
            [ // Pink 
                'assets/img/2.Enemy/2_Jellyfish/Super_dangerous/pink_1.png',
                'assets/img/2.Enemy/2_Jellyfish/Super_dangerous/pink_2.png',
                'assets/img/2.Enemy/2_Jellyfish/Super_dangerous/pink_3.png',
                'assets/img/2.Enemy/2_Jellyfish/Super_dangerous/pink_4.png',
            ],
            [ // Grün 
                'assets/img/2.Enemy/2_Jellyfish/Super_dangerous/green_1.png',
                'assets/img/2.Enemy/2_Jellyfish/Super_dangerous/green_2.png',
                'assets/img/2.Enemy/2_Jellyfish/Super_dangerous/green_3.png',
                'assets/img/2.Enemy/2_Jellyfish/Super_dangerous/green_4.png',
            ]
        ];
        return sets[Math.floor(Math.random() * sets.length)];
    }
}