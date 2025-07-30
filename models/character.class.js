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

        if (this.world.keyboard.UP && this.y > -30) {
        this.y -= this.speed;
        }

        if (this.world.keyboard.DOWN && this.y < 480 - this.height) {
    this.y += this.speed;
        }

        this.world.camara_x = -this.x + 100; // Update camera position based on character's x position

    }, 1000 / 60);

    setInterval(() => {
    
    if (
    this.world.keyboard.RIGHT ||
    this.world.keyboard.LEFT ||
    this.world.keyboard.UP ||
    this.world.keyboard.DOWN
    ) 
    {
        
    this.playAnimation(this.IMAGES_SWIM);
    }
    }, 120); 
}

jump() {

       }   
}