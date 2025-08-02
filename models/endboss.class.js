class Endboss extends MovableObject {
    
    introDone = false;
    introAnimationInterval = null;

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
    this.loadImage(this.IMAGES_INTRODUCE[0]);
    this.loadImages(this.IMAGES_INTRODUCE);
    this.initIntroAnimation();
}

initIntroAnimation() {
    this.frameCount = 0;
    this.updateBound = this.update.bind(this);
    requestAnimationFrame(this.updateBound);
}

update() {
    this.frameCount++;

    if (!this.introDone) {
        this.x -= this.speed;
        this.playAnimation(this.IMAGES_INTRODUCE);

        if (this.x <= 2200) {
            this.introDone = true;
            this.speed = 0;
            this.loadImages(this.IMAGES_FLOATING);
            this.currentImage = 0;
        }
    } else {
        this.playAnimation(this.IMAGES_FLOATING);
    }

    requestAnimationFrame(this.updateBound);
}

    
}