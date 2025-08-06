/**
 * Jellyfish enemy object
 */
class JellyFishDangerous extends MovableObject {
    width = 100;
    height = 100;
    energy = 5;
    attack = 15;
    offset = {
        x: 0,
        y: 5,
        width: 0,
        height: 8
    }

    constructor(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored) {
        super().loadImage('./assets/img/2._Enemy/2._Jellyfish/Regular_Damage/Lila_1.png');
        this.loadImages(JELLYFISH_DANGEROUS_IMAGES.SWIM[color]);
        this.loadImages(JELLYFISH_DANGEROUS_IMAGES.DEAD[color]);
        this.x = x;
        this.y = y;

        if (imgInitiallyMirrored == 1) {
            this.imgMirrored = true;
        } else {
            this.imgMirrored = false;
        }

        this.animate(color, direction, startPoint, endPoint, speed, imgInitiallyMirrored);
    }

    /**
     * Animate jellyfish
     * @param {string} color 'regular_damage' = 'lila' or 'yellow', 'super_dangerous' = 'green' or 'pink'
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
                this.playAnimation(JELLYFISH_DANGEROUS_IMAGES.DEAD[color], 1);
            } else {
                this.playAnimation(JELLYFISH_DANGEROUS_IMAGES.SWIM[color], 1);
            }
        }, 250)
    }
}