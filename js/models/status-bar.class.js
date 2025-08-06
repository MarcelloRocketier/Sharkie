/**
 * Handles the visual status bars shown in-game
 */
class StatusBar extends DrawableObject {
    percentage;

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
     * Update the bar based on given percentage
     * @param {number} percentage Value from 0 to 100
     * @param {string} type Possible types: 'life', 'coins', or 'poison'
     * @param {string} color Bar color variant: 'green', 'orange', or 'purple'
     */
    setPercentage(percentage, type, color) {
        this.percentage = percentage;
        const path = STATUS_BAR_IMAGES.IMAGES[type][color][this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines which image to use depending on current percentage
     * @returns {number} index of image in the array
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