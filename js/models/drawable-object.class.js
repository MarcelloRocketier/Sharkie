/**
 * Project: Sharkie 2D Game
 * File: js/models/drawable-object.class.js
 * Responsibility: Base class for drawable objects – handles image loading, rendering, and optional debug collision frames.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

/**
 * Base class for all objects that can be drawn on the canvas.
 * Provides:
 * - Image loading (single and multiple).
 * - Rendering on canvas.
 * - Optional debug collision frames for development.
 */
class DrawableObject {
    /**
     * Position, dimensions, current image, and image cache for the drawable object.
     * @property {number} x - X coordinate of the object.
     * @property {number} y - Y coordinate of the object.
     * @property {number} width - Width of the object (default 100).
     * @property {number} height - Height of the object (default 100).
     * @property {HTMLImageElement} img - Current image to render.
     * @property {Object.<string, HTMLImageElement>} imageCache - Cache of loaded images for animations.
     * @property {number} currentImage - Index of the current animation frame.
     */
    x;
    y;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads a single image and assigns it to `img`.
     * @param {string} path - Path to the image file.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    };

    /**
     * Preloads multiple images into cache for animations.
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
     * Draws the current image at object’s position and size.
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
     * Draws a red dashed collision box (for debugging collisions).
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