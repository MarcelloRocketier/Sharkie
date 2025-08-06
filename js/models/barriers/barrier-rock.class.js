/**
 * Barrier object
 */
class BarrierRock extends Barrier {
    width = 720;
    height = 200;
    offset = {
        x: 50,
        y: 40,
        width: 8,
        height: 0
    }

    constructor(x, y) {
        super();
        this.loadImage('./assets/img/3._Background/Barrier/2.png');
        this.x = x;
        this.y = y;
    }
}