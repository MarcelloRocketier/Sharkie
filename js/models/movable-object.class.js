/**
 * Base class for all objects that can move in the game world
 * Includes background elements which are also movable
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

    /**
     * Move object either horizontally or vertically between two points
     * @param {string} direction - 'horizontal' or 'vertical'
     * @param {number} startPoint - coordinate where movement starts
     * @param {number} endPoint - coordinate where movement ends
     * @param {number} speed - movement speed per frame
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
     * Plays animation frames for the object
     * @param {Array} images - array of image paths for animation
     * @param {number} loop - 0 = play once, 1 = loop continuously
     */
    playAnimation(images, loop) {
        if (loop === 0 && !this.animationFinished) {
            if (!this.animationStarted) {
                this.currentImage = 0; // Start animation from first frame
            }
            this.animationStarted = true;
            let i = this.currentImage % images.length;
            this.img = this.imageCache[images[i]];
            this.currentImage++;

            if (this.currentImage === images.length) {
                this.animationFinished = true;
                this.animationStarted = false;
            }
        } else if (loop === 1) {
            let i = this.currentImage % images.length;
            this.img = this.imageCache[images[i]];
            this.currentImage++;
            this.animationFinished = false;
        }
    }

    /**
     * Check for collision with another object, considering offsets
     * @param {MovableObject} movableObject
     * @returns {boolean}
     */
    isColliding(movableObject) {
        return this.x + this.width - this.offset.width > movableObject.x + movableObject.offset.x &&
               this.y + this.height - this.offset.height > movableObject.y + movableObject.offset.y &&
               this.x + this.offset.x < movableObject.x + movableObject.width - movableObject.offset.width &&
               this.y + this.offset.y < movableObject.y + movableObject.height - movableObject.offset.height;
    }

    /**
     * Check collision on the x-axis between two objects
     * @param {MovableObject} movableObject
     * @returns {boolean}
     */
    isCollidingX(movableObject) {
        if (this.y + this.height - this.offset.height - 3 > movableObject.y + movableObject.offset.y &&
            this.y + this.offset.y < movableObject.y + movableObject.height - movableObject.offset.height - 3) {
            return this.x + this.width - this.offset.width > movableObject.x + movableObject.offset.x &&
                   this.x + this.offset.x < movableObject.x + movableObject.width - movableObject.offset.width;
        }
    }

    /**
     * Check collision on the y-axis between two objects
     * @param {MovableObject} movableObject
     * @returns {boolean}
     */
    isCollidingY(movableObject) {
        if (this.x + this.width - this.offset.width - 3 > movableObject.x + movableObject.offset.x &&
            this.x + this.offset.x < movableObject.x + movableObject.width - movableObject.offset.width - 3) {
            return this.y + this.height - this.offset.height > movableObject.y + movableObject.offset.y &&
                   this.y + this.offset.y < movableObject.y + movableObject.height - movableObject.offset.height;
        }
    }

    /**
     * Decreases energy when hit by an attack
     * @param {number} attack - amount of damage
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
     * Moves dead enemy diagonally away (used for PufferFish)
     * @param {boolean} otherDirection - if true, move right/up; else left/up
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
     * Moves dead enemy straight up (used for Jellyfish)
     */
    floatAwayUp() {
        setInterval(() => {
            this.y -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Returns true if character was hit less than 1 second ago
     * @returns {boolean}
     */
    isHurt() {
        let timePassed = (Date.now() - this.lastHit) / 1000;
        return timePassed < 1;
    }

    /**
     * Returns true if energy has reached zero
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
}