/**
 * Base class for all objects that can move in the game world.
 * Includes background elements which are also movable.
 * Manages collision detection, animation control, and basic enemy death behaviors.
 *
 * @class
 * @extends DrawableObject
 *
 * @property {number} speed - The movement speed of the object.
 * @property {number} energy - The current energy or health of the object.
 * @property {number} lastHit - Timestamp (in ms) when the object was last hit.
 * @property {Object} offset - Collision offset for the object.
 * @property {number} offset.x - X offset for collision detection.
 * @property {number} offset.y - Y offset for collision detection.
 * @property {number} offset.width - Width offset for collision detection.
 * @property {number} offset.height - Height offset for collision detection.
 * @property {boolean} checkAlreadyRunning - Flag for ongoing checks.
 * @property {boolean} animationStarted - Whether animation has started.
 * @property {boolean} animationFinished - Whether animation has finished.
 * @property {boolean} waypointReached - Whether a movement waypoint has been reached.
 * @property {boolean} stopMovement - Whether movement is currently stopped.
 * @property {number} currentImage - Current animation frame index.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    energy;
    lastHit = 0;
    offset = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }
    checkAlreadyRunning = false;
    animationStarted = false;
    animationFinished = false;
    waypointReached = false;
    stopMovement = false;
    currentImage = 0;

    /**
     * Move the object either horizontally or vertically between two points.
     * 
     * @param {'horizontal'|'vertical'} direction - Direction of movement: 'horizontal' or 'vertical'.
     * @param {number} startPoint - Coordinate where movement starts.
     * @param {number} endPoint - Coordinate where movement ends.
     * @param {number} speed - Movement speed per frame in pixels.
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
     * Plays animation frames for the object.
     * 
     * @param {Array<string>} images - Array of image paths for animation frames.
     * @param {number} loop - 0 to play once and stop, 1 to loop continuously.
     * @returns {void}
     */
    playAnimation(images, loop) {
        if (loop === 0 && !this.animationFinished) {
            if (!this.animationStarted) {
                this.currentImage = 0; // Reset animation to the first frame
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
     * Updates the current animation frame by advancing the frame index and updating the displayed image.
     * 
     * @param {Array<string>} images - Array of image paths for animation frames.
     * @returns {void}
     */
    updateFrame(images) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }

    /**
     * Checks for collision with another object, considering offsets.
     * 
     * @param {MovableObject} movableObject - The other object to check collision against.
     * @returns {boolean} True if collision detected, false otherwise.
     */
    isColliding(movableObject) {
        return this.x + this.width - this.offset.width > movableObject.x + movableObject.offset.x &&
               this.y + this.height - this.offset.height > movableObject.y + movableObject.offset.y &&
               this.x + this.offset.x < movableObject.x + movableObject.width - movableObject.offset.width &&
               this.y + this.offset.y < movableObject.y + movableObject.height - movableObject.offset.height;
    }

    /**
     * Checks collision on the x-axis between this object and another.
     * This method detects collisions restricted to the horizontal axis for more granular collision handling.
     * 
     * @param {MovableObject} movableObject - The other object to check collision against.
     * @returns {boolean} True if collision detected on the x-axis, false otherwise.
     */
    isCollidingX(movableObject) {
        if (this.y + this.height - this.offset.height - 3 > movableObject.y + movableObject.offset.y &&
            this.y + this.offset.y < movableObject.y + movableObject.height - movableObject.offset.height - 3) {
            return this.x + this.width - this.offset.width > movableObject.x + movableObject.offset.x &&
                   this.x + this.offset.x < movableObject.x + movableObject.width - movableObject.offset.width;
        }
    }

    /**
     * Checks collision on the y-axis between this object and another.
     * This method detects collisions restricted to the vertical axis for more granular collision handling.
     * 
     * @param {MovableObject} movableObject - The other object to check collision against.
     * @returns {boolean} True if collision detected on the y-axis, false otherwise.
     */
    isCollidingY(movableObject) {
        if (this.x + this.width - this.offset.width - 3 > movableObject.x + movableObject.offset.x &&
            this.x + this.offset.x < movableObject.x + movableObject.width - movableObject.offset.width - 3) {
            return this.y + this.height - this.offset.height > movableObject.y + movableObject.offset.y &&
                   this.y + this.offset.y < movableObject.y + movableObject.height - movableObject.offset.height;
        }
    }

    /**
     * Decreases energy when hit by an attack.
     * 
     * @param {number} attack - Amount of damage to subtract from energy.
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
     * Moves a dead enemy diagonally away as a post-death floating animation (used for PufferFish).
     * If otherDirection is true, moves right and up; otherwise moves left and up.
     * 
     * @param {boolean} otherDirection - Direction flag for floating movement.
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
     * Moves a dead enemy straight up as a post-death floating animation (used for Jellyfish).
     * 
     * @returns {void}
     */
    floatAwayUp() {
        setInterval(() => {
            this.y -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Returns true if the character was hit less than 1 second ago.
     * 
     * @returns {boolean} True if hurt within the last second, false otherwise.
     */
    isHurt() {
        let timePassed = (Date.now() - this.lastHit) / 1000;
        return timePassed < 1;
    }

    /**
     * Returns true if energy has reached zero.
     * 
     * @returns {boolean} True if energy is zero, false otherwise.
     */
    isDead() {
        return this.energy === 0;
    }
}