/**
 * Represents a collectible poison bottle that extends MovableObject and is animated in place.
 *
 * @property {number} height - The height of the poison bottle sprite.
 * @property {number} width - The width of the poison bottle sprite.
 * @property {number} x - The horizontal position of the poison bottle.
 * @property {number} y - The vertical position of the poison bottle.
 * @property {string[]} IMAGES_ANIMATED - Array of image paths used for animating the poison bottle.
 */
class Poison extends MovableObject {
    height = 60;
    width = 60;
    x = 300;
    y = 350;
    IMAGES_ANIMATED = [
        'assets/img/4. Marcadores/Posion/Animada/1.png',
        'assets/img/4. Marcadores/Posion/Animada/2.png',
        'assets/img/4. Marcadores/Posion/Animada/3.png',
        'assets/img/4. Marcadores/Posion/Animada/4.png',
        'assets/img/4. Marcadores/Posion/Animada/5.png',
        'assets/img/4. Marcadores/Posion/Animada/6.png',
        'assets/img/4. Marcadores/Posion/Animada/7.png',
        'assets/img/4. Marcadores/Posion/Animada/8.png',
    ];

    /**
     * Creates a new Poison bottle at the specified position.
     * @param {number} x - The horizontal position where the poison bottle will appear.
     * @param {number} y - The vertical position where the poison bottle will appear.
     */
    constructor(x, y) {
        super().loadImage(this.IMAGES_ANIMATED[0]);
        this.loadImages(this.IMAGES_ANIMATED);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Starts the animation loop for the poison bottle sprite by cycling through images every 180ms.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_ANIMATED);
        }, 180); // langsame flackernde Bewegung
    }
}