class fish extends MovableObject {

    x = 120;
    y = 240;
    img;
    hight = 60;
    width = 60;
    IMAGES_SWIM = [
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim1.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim2.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim3.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim4.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim5.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim1.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim2.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim3.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim4.png',
        'assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim5.png',
    ];

    constructor() { 
    super().loadImage('assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png');
        this.loadImages(this.IMAGES_SWIM);

    this.x = 200 + Math.random() * 500; // Random x position
    this.speed = 0.15 + Math.random() * 0.25; // Random speed between 0.15 and 0.25
    this.animate();
}

    animate() {
    this.moveLeft();

    setInterval(() => {
    let i = this.currentImage % this.IMAGES_SWIM.length;
    let path = this.IMAGES_SWIM[i];
    this.img = this.imageCache[path];
    this.currentImage++;
    }, 280); 
}

}