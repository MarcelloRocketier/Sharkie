/**
 * All drawable objects
 */
class DrawableObject {
    x;
    y;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /**
     * Load a single image
     * @param {string} path - Path of the image to load
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Load multiple images into cache for animation
     * @param {string[]} array - Array of image paths
     */
    loadImages(array) {
        array.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draw the current image to the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (error) {
            console.error('Draw error:', error);
            console.warn('Failed to load image:', this.img);
        }
    }

    /**
     * Draw collision frame if object type matches
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawCollisionDetectionFrame(ctx) {
        const collisionTypes = [
            Character,
            LevelDesignHelper,
            PufferFish,
            JellyFishRegular,
            JellyFishDangerous,
            EndBoss,
            Coin,
            Life,
            Poison,
            Bubble,
            PoisonBubble,
            Barrier
        ];

        if (collisionTypes.some(type => this instanceof type)) {
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x + this.offset.x,
                this.y + this.offset.y,
                this.width - this.offset.width - this.offset.x,
                this.height - this.offset.height - this.offset.y
            );
            ctx.stroke();
            ctx.setLineDash([5, 5]);
        }
    }
}