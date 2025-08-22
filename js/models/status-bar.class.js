/**
 * Project: Sharkie 2D Game
 * File: js/models/status-bar.class.js
 * Responsibility: Defines the StatusBar class – visual indicator for life, coins, or poison percentages.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

/**
 * StatusBar renders a percentage-based bar (life, coins, poison).
 * Extends DrawableObject to handle rendering and image management.
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
     * Sets the percentage and updates the bar image accordingly.
     * @param {number} percentage - Value between 0 and 100.
     * @param {string} type - 'life', 'coins', or 'poison'.
     * @param {string} color - 'green', 'orange', or 'purple'.
     * @returns {void}
     */
    setPercentage(percentage, type, color) {
        this.percentage = percentage;
        const path = STATUS_BAR_IMAGES.IMAGES[type][color][this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves which image index corresponds to the current percentage thresholds.
     * @returns {number} Index of the image to use.
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