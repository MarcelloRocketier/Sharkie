/**
 * Base class for all objects that can be drawn on the canvas
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
     * Loads a single image and assigns it to the img property
     * @param {string} path - Path to the image file
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    };

    /**
     * Loads multiple images into the imageCache for animation purposes
     * @param {Array} array - Array of image paths
     */
    loadImages(array) {
        array.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Renders the current image on the canvas context at the object's position and size
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (error) {
            console.error('Error drawing image:', error);
            console.warn('Could not load image:', this.img);
        }
    }

    /**
     * Draws a red dashed rectangle around the object for debugging collision detection
     * Only draws for specific object types
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context
     */
    drawCollisionDetectionFrame(ctx) {
        const drawableTypes = [Character, LevelDesignHelper, PufferFish, JellyFishRegular, JellyFishDangerous, EndBoss, Coin, Life, Poison, Bubble, PoisonBubble, Barrier];
        if (drawableTypes.some(type => this instanceof type)) {
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'red';
            ctx.setLineDash([5, 5]);
            ctx.rect(
                this.x + this.offset.x, 
                this.y + this.offset.y, 
                this.width - this.offset.width - this.offset.x, 
                this.height - this.offset.height - this.offset.y
            );
            ctx.stroke();
        }
    }
}