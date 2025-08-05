/**
 * Basisklasse für alle beweglichen Objekte im Spiel
 * Auch Hintergrundelemente sind movable
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    energy;
    lastHit = 0;
    offset = { x: 0, y: 0, width: 0, height: 0 };
    checkAlreadyRunning = false;
    animationStarted = false;
    animationFinished = false;
    waypointReached = false;
    stopMovement = false;

    /**
     * Objekt in eine Richtung bewegen (horizontal / vertikal)
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
    }

    /**
     * Spielanimation abspielen
     * @param {string[]} images 
     * @param {number} loop 0 = einmal, 1 = unendlich
     */
    playAnimation(images, loop) {
        if (loop === 0 && !this.animationFinished) {
            if (!this.animationStarted) this.currentImage = 0;
            this.animationStarted = true;

            const i = this.currentImage % images.length;
            this.img = this.imageCache[images[i]];
            this.currentImage++;

            if (this.currentImage === images.length) {
                this.animationFinished = true;
                this.animationStarted = false;
            }
        } else if (loop === 1) {
            const i = this.currentImage % images.length;
            this.img = this.imageCache[images[i]];
            this.currentImage++;
            this.animationFinished = false;
        }
    }

    /**
     * Prüft, ob zwei Objekte sich überschneiden (Kollision)
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.width > mo.x + mo.offset.x &&
               this.y + this.height - this.offset.height > mo.y + mo.offset.y &&
               this.x + this.offset.x < mo.x + mo.width - mo.offset.width &&
               this.y + this.offset.y < mo.y + mo.height - mo.offset.height;
    }

    isCollidingX(mo) {
        if (this.y + this.height - this.offset.height - 3 > mo.y + mo.offset.y &&
            this.y + this.offset.y < mo.y + mo.height - mo.offset.height - 3) {
            return this.x + this.width - this.offset.width > mo.x + mo.offset.x &&
                   this.x + this.offset.x < mo.x + mo.width - mo.offset.width;
        }
    }

    isCollidingY(mo) {
        if (this.x + this.width - this.offset.width - 3 > mo.x + mo.offset.x &&
            this.x + this.offset.x < mo.x + mo.width - mo.offset.width - 3) {
            return this.y + this.height - this.offset.height > mo.y + mo.offset.y &&
                   this.y + this.offset.y < mo.y + mo.height - mo.offset.height;
        }
    }

    /**
     * Schaden erhalten durch gegnerischen Angriff
     */
    hit(damage) {
        this.energy -= damage;
        if (this.energy < 0) this.energy = 0;
        else this.lastHit = new Date().getTime();
    }

    /**
     * Gegner nach dem Tod wegschweben lassen (Pufferfisch)
     */
    floatAway(toRight) {
        setInterval(() => {
            this.x += toRight ? this.speed : -this.speed;
            this.y -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Gegner nach oben schweben lassen (Quallen)
     */
    floatAwayUp() {
        setInterval(() => {
            this.y -= this.speed;
        }, 1000 / 60);
    }

    /**
     * True, wenn Charakter kürzlich getroffen wurde
     */
    isHurt() {
        const timePassed = (new Date().getTime() - this.lastHit) / 1000;
        return timePassed < 1;
    }

    /**
     * True, wenn Energie leer ist
     */
    isDead() {
        return this.energy === 0;
    }
}