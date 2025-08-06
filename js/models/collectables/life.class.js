/**
 * Life object
 */
class Life extends MovableObject {
    offset = {
        x: 7,
        y: 14,
        width: 8,
        height: 5
    }
    constructor(x, y) {
        super().loadImage('./assets/img/4._Marks/Status_Bars/Life_100.png');
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
    }
}