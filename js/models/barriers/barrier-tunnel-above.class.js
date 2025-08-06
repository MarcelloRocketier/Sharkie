/**
 * Barrier object
 */
class BarrierTunnelAbove extends Barrier {
    width = 720;
    height = 200;
    offset = {
        x: 0,
        y: 0,
        width: 0,
        height: 90
    }

    constructor(x, y) {
        super();
        this.loadImage('./assets/img/3._Background/Barrier/1.1.png');
        this.x = x;
        this.y = y;
    }
}