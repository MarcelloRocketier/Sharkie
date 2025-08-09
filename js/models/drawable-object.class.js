/**
 * Base class for all drawable objects in the game.
 * Handles image loading, rendering, and optional debug collision frames.
 * This class should be extended by all game entities that are rendered to the canvas.
 */
class DrawableObject {
    /**
     * Position, dimensions, current image, and image cache for the drawable object.
     * These properties define the object's placement, size, and visual representation.
     * @type {number} x - The X coordinate of the object.
     * @type {number} y - The Y coordinate of the object.
     * @type {number} width - The width of the object. Default is 100.
     * @type {number} height - The height of the object. Default is 100.
     * @type {HTMLImageElement} img - The current image to render for the object.
     * @type {Object.<string, HTMLImageElement>} imageCache - Cache of loaded images for animations.
     * @type {number} currentImage - Index of the current animation frame.
     */
    x;
    y;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads a single image and assigns it to the img property.
     * @param {string} path - Path to the image file.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    };

    /**
     * Loads multiple images into the imageCache for animation purposes.
     * @param {string[]} array - Array of image paths.
     * @returns {void}
     */
    loadImages(array) {
        array.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Renders the current image on the canvas context at the object's position and size.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     * @returns {void}
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
     * Draws a red dashed collision detection frame around the object for debugging purposes only.
     * Only applies to specific game object types defined in `drawableTypes`.
     * Useful for visualizing collision boundaries during development.
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
     * @returns {void}
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