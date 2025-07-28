class Bubble extends MovableObject {
    y = -25;
    width = 150; // Set a width for the bubble
    hight = 175; // Set a height for the bubble




    constructor() { 
    super().loadImage('assets/img/4. Marcadores/bubbles.png');

    this.x = Math.random() * 500; // Random x position
}
}