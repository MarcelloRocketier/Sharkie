/**
 * Project: Sharkie 2D Game
 * File: js/models/movable-object.class.js
 * Responsibility: Base class for all movable objects – handles movement, collision detection, animation, and death behaviors.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

/**
 * Base class for all objects that can move in the game world.
 * Extends DrawableObject for rendering and provides:
 * - Movement control (horizontal/vertical).
 * - Collision detection.
 * - Animation handling.
 * - Enemy death float behaviors.
 */
class MovableObject extends DrawableObject {
    /** @type {number} Movement speed factor (pixels per frame). */
    speed = 0.15;
    /** @type {number} Current health/energy value. */
    energy;
    /** @type {number} Timestamp of last received hit (ms since epoch). */
    lastHit = 0;
    /** @type {{x:number,y:number,width:number,height:number}} Collision box offsets. */
    offset = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }
    /** @type {boolean} Guard to prevent overlapping attack checks. */
    checkAlreadyRunning = false;
    /** @type {boolean} True if an animation has started. */
    animationStarted = false;
    /** @type {boolean} True if an animation has finished. */
    animationFinished = false;
    /** @type {boolean} Indicates if a movement waypoint has been reached. */
    waypointReached = false;
    /** @type {boolean} If true, halts movement updates. */
    stopMovement = false;
    /** @type {number} Current animation frame index. */
    currentImage = 0;

    /**
     * Moves object horizontally or vertically between start and end coordinates.
     * 
     * @param {'horizontal'|'vertical'} direction - Direction of movement.
     * @param {number} startPoint - Coordinate where movement starts.
     * @param {number} endPoint - Coordinate where movement ends.
     * @param {number} speed - Movement speed per frame.
     * @returns {void}
     */
    move(direction, startPoint, endPoint, speed) {
        setInterval(() => {
            if (!this.stopMovement) {
                if (direction === 'horizontal') {
                    if (this.x > endPoint) {
                        this.waypointReached = true;
                        this.imgMirrored = false;
                    } else if (this.x < startPoint) {
                        this.waypointReached = false;
                        this.imgMirrored = true;
                    }
                    this.x += this.waypointReached ? -speed : speed;
                } else if (direction === 'vertical') {
                    if (this.y > endPoint) {
                        this.waypointReached = true;
                    } else if (this.y < startPoint) {
                        this.waypointReached = false;
                    }
                    this.y += this.waypointReached ? -speed : speed;
                }
            }
        }, 1000 / 60);
    };

    /**
     * Plays animation frames from given image list either once or in a loop.
     * 
     * @param {Array<string>} images - Array of image paths.
     * @param {number} loop - 0 to play once, 1 to loop continuously.
     * @returns {void}
     */
    playAnimation(images, loop) {
        if (loop === 0 && !this.animationFinished) {
            if (!this.animationStarted) {
                this.currentImage = 0;
            }
            this.animationStarted = true;
            this.updateFrame(images);

            if (this.currentImage === images.length) {
                this.animationFinished = true;
                this.animationStarted = false;
            }
        } else if (loop === 1) {
            this.updateFrame(images);
            this.animationFinished = false;
        }
    }

    /**
     * Advances current animation frame and updates displayed image.
     * 
     * @param {Array<string>} images - Array of image paths.
     * @returns {void}
     */
    updateFrame(images) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }

    /**
     * Detects collision with another movable object, using offsets.
     * 
     * @param {MovableObject} movableObject - Object to check collision against.
     * @returns {boolean} True if collision detected, false otherwise.
     */
    isColliding(movableObject) {
        return this.x + this.width - this.offset.width > movableObject.x + movableObject.offset.x &&
               this.y + this.height - this.offset.height > movableObject.y + movableObject.offset.y &&
               this.x + this.offset.x < movableObject.x + movableObject.width - movableObject.offset.width &&
               this.y + this.offset.y < movableObject.y + movableObject.height - movableObject.offset.height;
    }

    /**
     * Detects collision along the x-axis only.
     * 
     * @param {MovableObject} movableObject - Object to check collision against.
     * @returns {boolean} True if collision detected on x-axis, false otherwise.
     */
    isCollidingX(movableObject) {
        if (this.y + this.height - this.offset.height - 3 > movableObject.y + movableObject.offset.y &&
            this.y + this.offset.y < movableObject.y + movableObject.height - movableObject.offset.height - 3) {
            return this.x + this.width - this.offset.width > movableObject.x + movableObject.offset.x &&
                   this.x + this.offset.x < movableObject.x + movableObject.width - movableObject.offset.width;
        }
    }

    /**
     * Detects collision along the y-axis only.
     * 
     * @param {MovableObject} movableObject - Object to check collision against.
     * @returns {boolean} True if collision detected on y-axis, false otherwise.
     */
    isCollidingY(movableObject) {
        if (this.x + this.width - this.offset.width - 3 > movableObject.x + movableObject.offset.x &&
            this.x + this.offset.x < movableObject.x + movableObject.width - movableObject.offset.width - 3) {
            return this.y + this.height - this.offset.height > movableObject.y + movableObject.offset.y &&
                   this.y + this.offset.y < movableObject.y + movableObject.height - movableObject.offset.height;
        }
    }

    /**
     * Reduces energy by attack value; updates lastHit timestamp if still alive.
     * 
     * @param {number} attack - Damage amount.
     * @returns {void}
     */
    hit(attack) {
        this.energy -= attack;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = Date.now();
        }
    }

    /**
     * Post-death floating animation: drifts diagonally up (direction depends on flag).
     * 
     * @param {boolean} otherDirection - Flag for direction.
     * @returns {void}
     */
    floatAway(otherDirection) {
        setInterval(() => {
            if (otherDirection) {
                this.x += this.speed;
                this.y -= this.speed;
            } else {
                this.x -= this.speed;
                this.y -= this.speed;
            }
        }, 1000 / 60);
    }

    /**
     * Post-death floating animation: drifts straight up.
     * 
     * @returns {void}
     */
    floatAwayUp() {
        setInterval(() => {
            this.y -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Checks if object was hit within the last second.
     * 
     * @returns {boolean} True if hurt within last second, false otherwise.
     */
    isHurt() {
        let timePassed = (Date.now() - this.lastHit) / 1000;
        return timePassed < 1;
    }

    /**
     * Checks if energy is zero.
     * 
     * @returns {boolean} True if dead, false otherwise.
     */
    isDead() {
        return this.energy === 0;
    }
}