class Character extends MovableObject {

    x = 50;
    y = 100;
    speed = 6; 
    img;
    height = 250;
    width = 200;
    IMAGES_SWIM = [
        'assets/img/1.Sharkie/3.Swim/1.png',
        'assets/img/1.Sharkie/3.Swim/2.png',
        'assets/img/1.Sharkie/3.Swim/3.png',
        'assets/img/1.Sharkie/3.Swim/4.png',
        'assets/img/1.Sharkie/3.Swim/5.png',
        'assets/img/1.Sharkie/3.Swim/6.png',
    ];
    IMAGES_IDLE = [
        'assets/img/1.Sharkie/1.IDLE/1.png',
        'assets/img/1.Sharkie/1.IDLE/2.png',
        'assets/img/1.Sharkie/1.IDLE/3.png',
        'assets/img/1.Sharkie/1.IDLE/4.png',
        'assets/img/1.Sharkie/1.IDLE/5.png',
        'assets/img/1.Sharkie/1.IDLE/6.png',
        'assets/img/1.Sharkie/1.IDLE/7.png',
        'assets/img/1.Sharkie/1.IDLE/8.png',
        'assets/img/1.Sharkie/1.IDLE/9.png',
        'assets/img/1.Sharkie/1.IDLE/10.png',
        'assets/img/1.Sharkie/1.IDLE/11.png',
        'assets/img/1.Sharkie/1.IDLE/12.png',
        'assets/img/1.Sharkie/1.IDLE/13.png',
        'assets/img/1.Sharkie/1.IDLE/14.png',
        'assets/img/1.Sharkie/1.IDLE/15.png',
        'assets/img/1.Sharkie/1.IDLE/16.png',
        'assets/img/1.Sharkie/1.IDLE/17.png',
        'assets/img/1.Sharkie/1.IDLE/18.png',
    ];
    IMAGES_LONG_IDLE = [
        'assets/img/1.Sharkie/2.Long_IDLE/i1.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i2.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i3.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i4.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i5.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i6.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i7.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i8.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i9.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i10.png',     
        'assets/img/1.Sharkie/2.Long_IDLE/i11.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i12.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i13.png',
        'assets/img/1.Sharkie/2.Long_IDLE/i14.png',
    ];
world;
    

constructor() { 
    super().loadImage('assets/img/1.Sharkie/1.IDLE/1.png');
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.animate();
}

animate() {
    setInterval(() => {
        if (this.world.keyboard.RIGHT  && this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.otherDirection = false;
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
            this.x -= this.speed;
            this.otherDirection = true;
        }

        if (this.world.keyboard.UP && this.y > -30) {
            this.y -= this.speed;
        }

        if (this.world.keyboard.DOWN && this.y < 480 - this.height) {
            this.y += this.speed;
        }

        this.world.camara_x = -this.x + 100;
    }, 1000 / 60);

    let idleCounter = 0;
    let currentIdleInterval = 350;
    let currentIdleImages = this.IMAGES_IDLE;

    setInterval(() => {
        if (
            this.world.keyboard.RIGHT ||
            this.world.keyboard.LEFT ||
            this.world.keyboard.UP ||
            this.world.keyboard.DOWN
        ) {
            this.playAnimation(this.IMAGES_SWIM);
            idleCounter = 0;
            currentIdleImages = this.IMAGES_IDLE;
            currentIdleInterval = 350;
        } else {
            idleCounter++;

            if (idleCounter > 48) { // after ~8s
                currentIdleImages = this.IMAGES_LONG_IDLE;
                currentIdleInterval = 700; // slower long idle
            } else {
                currentIdleImages = this.IMAGES_IDLE;
                currentIdleInterval = 350;
            }

            this.playAnimation(currentIdleImages);
        }
    }, 350);
}

jump() {

       }   
}