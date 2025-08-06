/**
 * Barrier object
 */
class BarrierWall extends Barrier {
    width = 200;
    height = 480;
    offset = {
        x: 50,
        y: 0,
        width: 40,
        height: 0
    }

    constructor(x, y) {
        super();
        this.loadImage('./assets/img/3._Background/Barrier/3.png');
        this.x = x;
        this.y = y;
    }
}