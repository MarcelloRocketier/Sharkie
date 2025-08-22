/**
 * Project: Sharkie 2D Game
 * File: js/models/enemies/endboss.class.js
 * Responsibility: Final boss entity – animations, AI movement, attack behavior, sounds, and safe timer handling.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

/**
 * Final boss controller. Manages state machine (introduce, float, attack, hurt, dead),
 * autonomous movement, attack windows, and audio loops. Uses safe timer utilities
 * to avoid lingering intervals/timeouts across restarts.
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
    static INTRO_TO_FLOAT_DELAY = 1490; 
    timers = { intervals: [], timeouts: [] };
    _bossLoopBound = false;

    /**
     * Registers an interval and tracks its id for later cleanup.
     * @param {Function} fn - Callback to execute.
     * @param {number} ms - Interval in milliseconds.
     * @returns {number} Interval id.
     */
    setSafeInterval(fn, ms) {
        const id = setInterval(fn, ms);
        this.timers.intervals.push(id);
        return id;
    }

    /**
     * Registers a timeout and tracks its id for later cleanup.
     * @param {Function} fn - Callback to execute.
     * @param {number} ms - Timeout in milliseconds.
     * @returns {number} Timeout id.
     */
    setSafeTimeout(fn, ms) {
        const id = setTimeout(fn, ms);
        this.timers.timeouts.push(id);
        return id;
    }

    /**
     * Clears all registered timers (intervals and timeouts) for this boss instance.
     * @returns {void}
     */
    clearAllTimers() {
        this.timers.intervals.forEach(id => clearInterval(id));
        this.timers.timeouts.forEach(id => clearTimeout(id));
        this.timers = { intervals: [], timeouts: [] };
        this.bossThemeIntervalId = null;
    }

    /**
     * Creates an EndBoss instance and preloads animation frames.
     * @param {number} x - Initial horizontal position.
     * @param {number} y - Initial vertical position.
     * @param {number} startX - Base X coordinate for AI movement patterns.
     * @param {number} startY - Base Y coordinate for AI movement patterns.
     * @returns {void}
     */
    constructor(x, y, startX, startY) {
        super().loadImage(''); 
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
     * Starts the EndBoss animation loop; delegates updates to `updateAnimationAndAI()`.
     * @returns {void}
     */
    animate() {
        this.setSafeInterval(() => {
            if (this.world && this.world.stopped) return;
            this.updateAnimationAndAI();
        }, 150);
    }

    /**
     * Updates animation/behavior according to current state (introduce, float, attack, hurt, dead).
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
            if (this.endBossIntroduced) {
                endBossKilled = true;
            } else {
                endBossKilled = false; 
            }
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
     * Executes the autonomous multi-step movement pattern using waypoints.
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
     * Opens a brief collision window and triggers attack animation once.
     * @returns {void}
     */
    attackAnimation() {
        if (this.checkAlreadyRunning) return;
        this.playBiteIfAllowed();
        this.currentImage = 0; 
        this.beginAttackWindow();
    }

    /**
     * Plays the bite SFX if sound is enabled and both entities are alive.
     * @returns {void}
     */
    playBiteIfAllowed() {
        if (soundOn && !this.isDead() && !this.world.character.isDead()) {
            this.BITE_SOUND.currentTime = 0;
            this.BITE_SOUND.play();
        }
    }

    /**
     * Starts a short interval marking the boss as colliding; auto-clears after a timeout.
     * @returns {void}
     */
    beginAttackWindow() {
        const tick = () => {
            this.isCollidingWithCharacter = true;
            this.checkAlreadyRunning = true;
        };
        const intervalId = this.setSafeInterval(tick, 100);
        this.setSafeTimeout(() => this.endAttackWindow(intervalId), 600);
    }

    /**
     * Ends the collision window and clears its interval.
     * @param {number} intervalId - Interval ID created in `beginAttackWindow`.
     * @returns {void}
     */
    endAttackWindow(intervalId) {
        this.isCollidingWithCharacter = false;
        this.checkAlreadyRunning = false;
        clearInterval(intervalId);
    }

    /**
     * Plays the introduce animation, triggers splash SFX, and transitions to floating state.
     * @returns {void}
     */
    introduceEndBoss() {
        this.playAnimation(ENDBOSS_IMAGES.INTRODUCE, 0);
        this.endBossAlreadyTriggered = true;
        if (soundOn) this.SPLASH_SOUND.play();
        this.startBossThemeLoop();
        this.setSafeTimeout(() => {
            this.endBossTriggered = false;
            this.endBossIntroduced = true;
        }, EndBoss.INTRO_TO_FLOAT_DELAY);
    }

    /**
     * Starts/maintains the boss theme playback loop without duplicating intervals.
     * @returns {void}
     */
    startBossThemeLoop() {
        if (this.bossThemeIntervalId) return; 
        this.bossThemeIntervalId = this.setSafeInterval(() => {
            if (!this.world || this.world.stopped) {
                this.BOSS_THEME_SOUND.pause();
                this.BOSS_THEME_SOUND.currentTime = 0;
                return;
            }
            if (soundOn && this.world && this.world.character && !this.world.character.isDead() && !this.isDead()) {
                try { this.BOSS_THEME_SOUND.play(); } catch(e){}
                if (this.world.MAIN_SOUND) this.world.MAIN_SOUND.pause();
            } else {
                this.BOSS_THEME_SOUND.pause();
                this.BOSS_THEME_SOUND.currentTime = 0;
            }
        }, 1000 / 60);
        if (!this._bossLoopBound) {
            this._bossLoopBound = true;
            this.BOSS_THEME_SOUND.addEventListener('ended', function() {
                this.currentTime = 0;
                try { this.play(); } catch(e){}
            }, false);
        }
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

    /**
     * Resets boss flags, waypoints, sounds and timers to a fresh state for a new run.
     * @returns {void}
     */
    resetState() {
        this.clearAllTimers();
        this.energy = 100;
        this.endBossTriggered = false;
        this.endBossIntroduced = false;
        this.endBossAlreadyTriggered = false;
        this.isCollidingWithCharacter = false;
        this.waypoint1 = this.waypoint2 = this.waypoint3 = false;
        this.waypoint4 = this.waypoint5 = this.waypoint6 = false;
        this.waypoint7 = false;
        if (typeof this.startX === 'number') this.x = this.startX;
        if (typeof this.startY === 'number') this.y = this.startY;
        try { this.BOSS_THEME_SOUND.pause(); this.BOSS_THEME_SOUND.currentTime = 0; } catch(e){}
        try { this.SPLASH_SOUND.pause(); this.SPLASH_SOUND.currentTime = 0; } catch(e){}
        try { this.BITE_SOUND.pause(); this.BITE_SOUND.currentTime = 0; } catch(e){}
        try { endBossKilled = false; } catch(e){}
        this.animate();
    }
}