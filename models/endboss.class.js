class Endboss extends MovableObject {
    
    introDone = false;
    introAnimationInterval = null;
    isFloatingStarted = false;

    IMAGES_INTRODUCE = [
        'assets/img/2.Enemy/3 Final Enemy/1.Introduce/1.png',
        'assets/img/2.Enemy/3 Final Enemy/1.Introduce/2.png',
        'assets/img/2.Enemy/3 Final Enemy/1.Introduce/3.png',
        'assets/img/2.Enemy/3 Final Enemy/1.Introduce/4.png',
        'assets/img/2.Enemy/3 Final Enemy/1.Introduce/5.png',
        'assets/img/2.Enemy/3 Final Enemy/1.Introduce/6.png',
        'assets/img/2.Enemy/3 Final Enemy/1.Introduce/7.png',
        'assets/img/2.Enemy/3 Final Enemy/1.Introduce/8.png',
        'assets/img/2.Enemy/3 Final Enemy/1.Introduce/9.png',
        'assets/img/2.Enemy/3 Final Enemy/1.Introduce/10.png',
    ];

    IMAGES_FLOATING = [
        'assets/img/2.Enemy/3 Final Enemy/2.floating/1.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/2.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/3.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/4.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/5.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/6.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/7.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/8.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/9.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/10.png',       
        'assets/img/2.Enemy/3 Final Enemy/2.floating/11.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/12.png',
        'assets/img/2.Enemy/3 Final Enemy/2.floating/13.png',
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 300;
        this.height = 300;
        this.speed = 1.5;
        this.currentImage = 0;
        this.frameCounter = 0;
        this.loadImage(this.IMAGES_INTRODUCE[0]);
        this.loadImages(this.IMAGES_INTRODUCE);
        this.loadImages(this.IMAGES_FLOATING);
    }

    update() {
        this.frameCounter++;

        if (!this.introDone) {
            this.x -= this.speed;

            if (this.frameCounter % 5 === 0) {
                this.playAnimation(this.IMAGES_INTRODUCE);
            }

            if (this.x <= 2200) {
                this.introDone = true;
                this.speed = 0;
                this.currentImage = 0;
            }
        } 

        if (this.introDone && !this.isFloatingStarted) {
            this.isFloatingStarted = true;
            this.frameCounter = 0;
        }

        if (this.introDone && this.isFloatingStarted && this.frameCounter % 6 === 0) {
            this.playAnimation(this.IMAGES_FLOATING);
        }
    }
    
    draw(ctx) {
        if (!this.img || !this.img.complete) return;

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}