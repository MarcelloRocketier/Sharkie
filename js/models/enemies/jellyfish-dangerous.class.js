/**
 * Represents a dangerous jellyfish enemy in the game.
 * Can inflict higher damage than regular jellyfish.
 * Moves horizontally or vertically and switches between swim and dead animations.
 * Extends MovableObject for rendering, movement, and collision handling.
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

    /**
     * Creates a dangerous jellyfish enemy.
     * @param {string} color - Color variant ('lila', 'yellow', 'green', or 'pink').
     * @param {number} x - Horizontal starting position.
     * @param {number} y - Vertical starting position.
     * @param {string} direction - Movement direction ('horizontal' or 'vertical').
     * @param {number} startPoint - Starting coordinate for movement.
     * @param {number} endPoint - Ending coordinate for movement.
     * @param {number} speed - Movement speed.
     * @param {number} imgInitiallyMirrored - 1 if initially mirrored, 0 otherwise (for horizontal movement).
     */
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
     * Starts the dangerous jellyfish animation loop.
     * Plays swim or dead animations depending on enemy's state.
     * @param {string} color - Color variant ('lila', 'yellow', 'green', or 'pink').
     * @param {string} direction - Movement direction ('horizontal' or 'vertical').
     * @param {number} startPoint - Starting coordinate for movement.
     * @param {number} endPoint - Ending coordinate for movement.
     * @param {number} speed - Movement speed.
     * @param {number} imgInitiallyMirrored - 1 if initially mirrored, 0 otherwise.
     * @returns {void}
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