/**
 * Poison object
 */
class Poison extends MovableObject {

    constructor(type, x, y) {
        super().loadImage('./assets/img/4._Marks/Poison/Light_Left.png');
        this.loadImages(POISON_IMAGES.IMAGES[type]);
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
        this.animate(type);
    }

    /**
     * Animate poison
     * Each level has different background objects and enemies
     * @param {string} type 'animated', 'light_left', 'light_right', 'dark_left', 'dark_right'
     */
    animate(type) {
        setInterval(() => {
            this.playAnimation(POISON_IMAGES.IMAGES[type], 1);
        }, 250)
    }
}