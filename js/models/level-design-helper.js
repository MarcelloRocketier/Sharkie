/**
 * Debug helper class for level design
 * Allows precise placement of objects in the game world during development
 */
class LevelDesignHelper extends MovableObject {
    world;
    width = 50;
    height = 50;
    x = 0;
    y = 0;
    offset = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }
    speed = 4;

    constructor() {
        super();
        if (debugLevelDesignHelper) { // Only initialize if debug helper is enabled, avoids camera issues otherwise
            this.loadImage('./assets/img/1._Sharkie/1._Idle/1.png');
            this.characterEvents();
        }
    }

    /**
     * Registers movement events for this helper object
     * Handles movement inputs and camera adjustment
     */
    characterEvents() {
        setInterval(() => {

            // Move helper up
            if (this.world.keyboard.UP && this.y > 0) {
                this.moveCharacter('up');
            }

            // Move helper right
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveCharacter('right');
            }

            // Move helper down
            if (this.world.keyboard.DOWN && this.y < 426) {
                this.moveCharacter('down');
            }

            // Move helper left
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveCharacter('left');
            }

            // Center the camera on this helper box horizontally
            this.world.camera_x = -this.x + ((720 - this.width) / 2);
        }, 1000 / 60)
    }

    /**
     * Moves the helper object in the given direction
     * @param {string} direction One of 'up', 'right', 'down', or 'left'
     */
    moveCharacter(direction) {
        if (debugLogStatements) {
            console.log('Helper position:', this.x, ',', this.y);
        }

        if (direction === 'up') {
            this.y -= this.speed;
        } else if (direction === 'right') {
            this.x += this.speed;
            this.imgMirrored = false;
        } else if (direction === 'down') {
            this.y += this.speed;
        } else if (direction === 'left') {
            this.x -= this.speed;
            this.imgMirrored = true;
        }
    }
}