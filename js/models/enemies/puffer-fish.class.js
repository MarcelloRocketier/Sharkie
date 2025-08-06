/**
 * Puffer fish enemy object
 */
class PufferFish extends MovableObject {
    width = 100;
    height = 100;
    energy = 5;
    attack = 5;
    speed = 2;
    offset = {
        x: 0,
        y: 3,
        width: 5,
        height: 24
    }

    constructor(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored) {
        super().loadImage('./assets/img/2._Enemy/1._Puffer_Fish_(3_Color_Options)/1._Swim/1._Swim_1.png');
        this.loadImages(PUFFER_FISH_IMAGES.SWIM[color]);
        this.loadImages(PUFFER_FISH_IMAGES.DEAD[color]);
        this.x = x;
        this.y = y;

        if (imgInitiallyMirrored == 1) {
            this.imgMirrored = true;
        } else {
            this.imgMirrored = false;
        }
        this.animate(color, direction, startPoint, endPoint, speed);
    }

    /**
     * Animate puffer-fish
     * @param {string} color The color of the enemy
     * @param {string} direction 'horizontal' or 'vertical'
     * @param {integer} startPoint The start point of the movement
     * @param {integer} endPoint The end point of the movement
     * @param {float} speed The speed of the enemy
     * @param {integer} imgInitiallyMirrored 1 = mirrored, 0 = not mirrored (Necessary for horizontal movement)
     */
    animate(color, direction, startPoint, endPoint, speed, imgInitiallyMirrored) {
        this.move(direction, startPoint, endPoint, speed, imgInitiallyMirrored);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(PUFFER_FISH_IMAGES.DEAD[color], 0);
            } else {
                this.playAnimation(PUFFER_FISH_IMAGES.SWIM[color], 1);
            }
        }, 250)
    }
}