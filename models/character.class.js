class Character extends MovableObject {

    x = 50;
    y = 100;
    speed = 6; 
    img;
    height = 250;
    width = 200;
    IMAGES_SWIM = [
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
world;
    

constructor() { 
    super().loadImage('assets/img/1.Sharkie/1.IDLE/1.png');
    this.loadImages(this.IMAGES_SWIM);

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
        this.world.camara_x = -this.x + 100; // Update camera position based on character's x position

    }, 1000 / 60);

    setInterval(() => {
    
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        
    this.playAnimation(this.IMAGES_SWIM);
    }
    }, 100); 
}

jump() {

       }   
}