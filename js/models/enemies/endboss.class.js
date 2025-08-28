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
        if (this._shouldFloat()) return;
        if (this._shouldPlayHurt()) return;
        if (this._shouldDie()) return;
        if (this.endBossTriggered) return this.introduceEndBoss();
        if (this.isCollidingWithCharacter) this._playAttackCycle();
    }

    /** Handles floating state logic. */
    _shouldFloat() {
        if (this.endBossIntroduced && !this.isHurt() && !this.isDead() && !this.isCollidingWithCharacter) {
            this.playAnimation(ENDBOSS_IMAGES.FLOATING, 1);
            if (!this.world.character.isDead()) this.aiMovement();
            else this.BOSS_THEME_SOUND.pause();
            return true;
        }
        return false;
    }

    /** Handles hurt state logic. */
    _shouldPlayHurt() {
        if (this.isHurt() && !this.isDead()) {
            this.playAnimation(ENDBOSS_IMAGES.HURT, 1);
            return true;
        }
        return false;
    }

    /** Handles death state logic. */
    _shouldDie() {
        if (this.isDead()) {
            this.playAnimation(ENDBOSS_IMAGES.DEAD, 0);
            endBossKilled = this.endBossIntroduced;
            this.BOSS_THEME_SOUND.pause();
            return true;
        }
        return false;
    }

    /** Handles attack animation when colliding with character. */
    _playAttackCycle() {
        this.attackAnimation();
        this.playAnimation(ENDBOSS_IMAGES.ATTACK, 0);
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
        this._resetBossFlags();
        this._resetBossPosition();
        this._resetBossAudio();
        try { endBossKilled = false; } catch(e){}
        this.animate();
    }

    /**
     * Applies damage to the end boss and triggers death if energy <= 0.
     * Ignores hits while neutralized.
     * @param {number} dmg - The amount of damage to apply.
     * @returns {void}
     */
    hit(dmg) {
        if (this.neutralized && (!this.neutralizedUntil || this.neutralizedUntil > Date.now())) {
            return;
        }
        this.energy -= dmg;
        if (this.energy <= 0) {
            this.energy = 0;
        }
    }

    /**
     * Returns true if the end boss is dead (energy <= 0).
     * @returns {boolean}
     */
    isDead() {
        return this.energy <= 0;
    }
}