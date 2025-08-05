/**
 * Status bars for the game (e.g. life, coins, poison, boss)
 */
class StatusBar extends DrawableObject {
    percentage;

    constructor(type, color, percentage, x, y) {
        super();
        this.type = type;
        this.color = color;
        this.loadImages(STATUS_BAR_IMAGES.IMAGES[type][color]);
        this.setPercentage(percentage);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Updates the percentage and corresponding image
     * @param {number} percentage Value between 0–100
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let index = this.resolveImageIndex();
        let path = STATUS_BAR_IMAGES.IMAGES[this.type][this.color][index];
        this.img = this.imageCache[path];
    }

    /**
     * Returns image index depending on percentage value
     * @returns {number} Image index
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage > 80) return 5;
        if (this.percentage > 60) return 4;
        if (this.percentage > 40) return 3;
        if (this.percentage > 20) return 2;
        if (this.percentage > 0) return 1;
        return 0;
    }
}