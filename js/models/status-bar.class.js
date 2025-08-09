/**
 * Represents a visual status bar in the game.
 * Can display life, coins, or poison as a percentage.
 *
 * @extends DrawableObject
 *
 * @property {number} percentage - Current fill percentage (0-100) displayed by the bar.
 * @property {string} type - Type of the status bar ('life', 'coins', or 'poison').
 * @property {string} color - Color variant of the bar ('green', 'orange', or 'purple').
 * @property {number} width - Width of the status bar in pixels.
 * @property {number} height - Height of the status bar in pixels.
 */
class StatusBar extends DrawableObject {
    percentage;

    /**
     * Creates a StatusBar instance.
     * @param {string} type - Type of the status bar ('life', 'coins', 'poison').
     * @param {string} color - Color variant of the bar ('green', 'orange', 'purple').
     * @param {number} percentage - Initial fill percentage (0-100).
     * @param {number} x - X position on the canvas.
     * @param {number} y - Y position on the canvas.
     */
    constructor(type, color, percentage, x, y) {
        super();
        this.loadImages(STATUS_BAR_IMAGES.IMAGES[type][color]);
        this.setPercentage(percentage, type, color);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.type = type;
        this.color = color;
    }

    /**
     * Updates the status bar value and changes the displayed image to reflect the new percentage.
     * @param {number} percentage - Value from 0 to 100.
     * @param {string} type - Possible types: 'life', 'coins', or 'poison'.
     * @param {string} color - Bar color variant: 'green', 'orange', or 'purple'.
     * @returns {void}
     */
    setPercentage(percentage, type, color) {
        this.percentage = percentage;
        const path = STATUS_BAR_IMAGES.IMAGES[type][color][this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Returns the frame index corresponding to the percentage thresholds defined in this method.
     * @returns {number} Index of the image to use from the loaded images array.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        else if (this.percentage > 80) return 5;
        else if (this.percentage > 60) return 4;
        else if (this.percentage > 40) return 3;
        else if (this.percentage > 20) return 2;
        else if (this.percentage > 0) return 1;
        else return 0;
    }
}