class fish extends MovableObject {

    x = 120;
    y = 240;
    img;
    hight = 60;
    width = 60;

    constructor() { 
    super().loadImage('assets/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png');

    this.x = 200 + Math.random() * 500; // Random x position
}

}