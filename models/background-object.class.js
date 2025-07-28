class BackgroundObject extends MovableObject {

    width = 720;
    hight = 480;
   
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x; 
        this.y = 480 - this.hight; 
    }
}