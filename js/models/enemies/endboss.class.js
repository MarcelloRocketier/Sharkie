/**
 * Represents the final boss enemy in the game.
 * Controls animation states, AI movement, attack behavior, and sound effects.
 * Extends MovableObject for rendering, positioning, and collision detection.
 */
class EndBoss extends MovableObject {
    world;
    width = 300;
    height = 300;
    energy = 100;
    attack = 20;
    speed = 8;
    endBossTriggered = false;
    endBossIntroduced = false;
    endBossAlreadyTriggered = false;
    isCollidingWithCharacter;
    triggerDistance = 500;
    wanderDistance = 300;
    waypoint1 = false;
    waypoint2 = false;
    waypoint3 = false;
    waypoint4 = false;
    waypoint5 = false;
    waypoint6 = false;
    waypoint7 = false;
    offset = {
        x: 15,
        y: 90,
        width: 20,
        height: 45
    }
    BOSS_THEME_SOUND = new Audio('./assets/audio/boss_theme.mp3');
    SPLASH_SOUND = new Audio('./assets/audio/splash.mp3');
    BITE_SOUND = new Audio('./assets/audio/bite.mp3');
    bossThemeIntervalId = null;
    static INTRO_TO_FLOAT_DELAY = 1490; // 10ms before animation end for smooth transition

    /**
     * Creates an EndBoss instance.
     * @param {number} x - The initial horizontal position.
     * @param {number} y - The initial vertical position.
     * @param {number} startX - The base X coordinate for AI movement patterns.
     * @param {number} startY - The base Y coordinate for AI movement patterns.
     */
    constructor(x, y, startX, startY) {
        super().loadImage(''); // Empty because EndBoss has introduce animation. Otherwise an image would be displayed permanently
        this.loadImages(ENDBOSS_IMAGES.FLOATING);
        this.loadImages(ENDBOSS_IMAGES.INTRODUCE);
        this.loadImages(ENDBOSS_IMAGES.HURT);
        this.loadImages(ENDBOSS_IMAGES.DEAD);
        this.loadImages(ENDBOSS_IMAGES.ATTACK);
        this.animate();
        this.x = x;
        this.y = y;
        this.startX = startX;
        this.startY = startY;
    }

    /**
     * Starts the EndBoss animation loop.
     * Delegates update and AI logic to updateAnimationAndAI().
     * @returns {void}
     */
    animate() {
        setInterval(() => this.updateAnimationAndAI(), 150);
    }

    /**
     * Updates the EndBoss animation and behavior based on its current state.
     * Handles introduce sequence, attack, floating, hurt, and dead states.
     * @returns {void}
     */
    updateAnimationAndAI() {
        if (this.endBossIntroduced && !this.isHurt() && !this.isDead() && !this.isCollidingWithCharacter) {
            this.playAnimation(ENDBOSS_IMAGES.FLOATING, 1);
            if (!this.world.character.isDead()) this.aiMovement();
            else this.BOSS_THEME_SOUND.pause();
            return;
        }
        if (this.isHurt() && !this.isDead()) {
            this.playAnimation(ENDBOSS_IMAGES.HURT, 1);
            return;
        }
        if (this.isDead()) {
            this.playAnimation(ENDBOSS_IMAGES.DEAD, 0);
            endBossKilled = true;
            this.BOSS_THEME_SOUND.pause();
            return;
        }
        if (this.endBossTriggered) return this.introduceEndBoss();
        if (this.isCollidingWithCharacter) {
            this.attackAnimation();
            this.playAnimation(ENDBOSS_IMAGES.ATTACK, 0);
        }
    }

    /**
     * Executes the predefined autonomous movement sequence of the EndBoss.
     * Movement is broken into discrete steps with waypoints.
     * @returns {void}
     */
    aiMovement() {
        if (this.stepForward1()) return;
        if (this.stepBack2()) return;
        if (this.stepDown3()) return;
        if (this.stepForward4()) return;
        if (this.stepBack5()) return;
        if (this.stepUp6()) return;
        if (this.stepForward7()) return;
        this.stepBack8();
    }

    /**
     * Moves forward to startX - wanderDistance.
     * @returns {boolean} True if movement occurred, otherwise false.
     */
    stepForward1() {
        if (!this.waypoint1 && this.x > this.startX - this.wanderDistance) {
            this.x -= this.speed * this.getRandomSpeedFactor(1.5, 3);
            if (this.x <= this.startX - this.wanderDistance) this.waypoint1 = true;
            return true;
        }
        return false;
    }

    /**
     * Moves back to startX.
     * @returns {boolean} True if movement occurred, otherwise false.
     */
    stepBack2() {
        if (this.waypoint1 && !this.waypoint2) {
            this.x += this.speed;
            if (this.x > this.startX) this.waypoint2 = true;
            return true;
        }
        return false;
    }

    /**
     * Moves down to y = 150.
     * @returns {boolean} True if movement occurred, otherwise false.
     */
    stepDown3() {
        if (this.waypoint2 && !this.waypoint3) {
            this.y += this.speed;
            if (this.y >= 150) this.waypoint3 = true;
            return true;
        }
        return false;
    }

    /**
     * Moves forward again to startX - wanderDistance (faster).
     * @returns {boolean} True if movement occurred, otherwise false.
     */
    stepForward4() {
        if (this.waypoint3 && !this.waypoint4) {
            this.x -= this.speed * this.getRandomSpeedFactor(2.5, 3.5);
            if (this.x <= this.startX - this.wanderDistance) this.waypoint4 = true;
            return true;
        }
        return false;
    }

    /**
     * Moves back to startX with random speed.
     * @returns {boolean} True if movement occurred, otherwise false.
     */
    stepBack5() {
        if (this.waypoint4 && !this.waypoint5) {
            this.x += this.speed * this.getRandomSpeedFactor(2, 3.5);
            if (this.x > this.startX) this.waypoint5 = true;
            return true;
        }
        return false;
    }

    /**
     * Moves up to y < 0.
     * @returns {boolean} True if movement occurred, otherwise false.
     */
    stepUp6() {
        if (this.waypoint5 && !this.waypoint6) {
            this.y -= this.speed;
            if (this.y < 0) this.waypoint6 = true;
            return true;
        }
        return false;
    }

    /**
     * Moves forward again to startX - wanderDistance (fastest).
     * @returns {boolean} True if movement occurred, otherwise false.
     */
    stepForward7() {
        if (this.waypoint6 && !this.waypoint7) {
            this.x -= this.speed * this.getRandomSpeedFactor(2.5, 4.5);
            if (this.x <= this.startX - this.wanderDistance) this.waypoint7 = true;
            return true;
        }
        return false;
    }

    /**
     * Final step: moves back to startX and resets waypoints.
     * @returns {boolean} True if movement occurred, otherwise false.
     */
    stepBack8() {
        if (this.waypoint7) {
            this.x += this.speed;
            if (this.x > this.startX) {
                this.waypoint1 = this.waypoint2 = this.waypoint3 = false;
                this.waypoint4 = this.waypoint5 = this.waypoint6 = false;
                this.waypoint7 = false;
            }
            return true;
        }
        return false;
    }

    /**
     * Sets isCollidingWithCharacter to true until the attack animation finishes once.
     * @returns {void}
     */
    attackAnimation() {
        if (this.checkAlreadyRunning) return;
        this.playBiteIfAllowed();
        this.currentImage = 0; // start with first img of animation
        this.beginAttackWindow();
    }

    /**
     * Plays bite sound effect if allowed.
     * @returns {void}
     */
    playBiteIfAllowed() {
        if (soundOn && !this.isDead() && !this.world.character.isDead()) {
            this.BITE_SOUND.currentTime = 0;
            this.BITE_SOUND.play();
        }
    }

    /**
     * Begins the short window where the boss is colliding with the character.
     * @returns {void}
     */
    beginAttackWindow() {
        const tick = () => {
            this.isCollidingWithCharacter = true;
            this.checkAlreadyRunning = true;
        };
        const intervalId = setInterval(tick, 100);
        setTimeout(() => this.endAttackWindow(intervalId), 600);
    }

    /**
     * Ends the attack window and clears flags.
     * @param {number} intervalId - The interval ID to clear.
     * @returns {void}
     */
    endAttackWindow(intervalId) {
        this.isCollidingWithCharacter = false;
        this.checkAlreadyRunning = false;
        clearInterval(intervalId);
    }

    /**
     * Plays the EndBoss introduce animation and triggers splash sound and boss theme.
     * @returns {void}
     */
    introduceEndBoss() {
        this.playAnimation(ENDBOSS_IMAGES.INTRODUCE, 0);
        this.endBossAlreadyTriggered = true;
        if (soundOn) this.SPLASH_SOUND.play();
        this.startBossThemeLoop();
        setTimeout(() => {
            this.endBossTriggered = false;
            this.endBossIntroduced = true;
        }, EndBoss.INTRO_TO_FLOAT_DELAY);
    }

    /**
     * Starts or maintains the boss theme loop without creating duplicate intervals.
     * @returns {void}
     */
    startBossThemeLoop() {
        if (this.bossThemeIntervalId) return; // already running
        this.bossThemeIntervalId = setInterval(() => {
            if (soundOn && !this.world.character.isDead() && !this.isDead()) {
                this.BOSS_THEME_SOUND.play();
                this.world.MAIN_SOUND.pause();
                this.BOSS_THEME_SOUND.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);
            } else {
                this.BOSS_THEME_SOUND.pause();
                this.BOSS_THEME_SOUND.currentTime = 0;
            }
        }, 1000 / 60);
    }

    /**
     * Generates a random number between min and max.
     * @param {number} min - Minimum value.
     * @param {number} max - Maximum value.
     * @returns {number} A random number between min and max.
     */
    getRandomSpeedFactor(min, max) {
        return Math.random() * (max - min) + min;
    }
}