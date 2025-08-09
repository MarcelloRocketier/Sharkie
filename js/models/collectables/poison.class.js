/**
 * Represents a collectible poison object in the game.
 * Extends MovableObject to allow rendering and animation.
 */
class Poison extends MovableObject {

    /**
     * Creates a poison object of the given type at the specified coordinates.
     * @param {string} type - The type of poison image ('animated', 'light_left', 'light_right', 'dark_left', 'dark_right').
     * @param {number} x - The horizontal position of the poison.
     * @param {number} y - The vertical position of the poison.
     */
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
     * Starts the poison animation by cycling through the provided image set.
     * @param {string} type - The type of poison image set to animate.
     * @returns {void}
     */
    animate(type) {
        setInterval(() => {
            this.playAnimation(POISON_IMAGES.IMAGES[type], 1);
        }, 250)
    }
}