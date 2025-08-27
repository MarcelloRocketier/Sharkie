function _canEnemyHurtCharacter(char, enemy) {
  if (!char || !enemy) return false;
  if (typeof enemy.isDead === 'function' && enemy.isDead()) return false;
  if (typeof char.isDead === 'function' && char.isDead()) return false;

  if (char.isFinSlapping && typeof PufferFish !== 'undefined' && enemy instanceof PufferFish) return false;

  if (enemy.neutralized) return false;
  return true;
}

class Character extends MovableObject {
    world;
    width = 300;
    height = 300;
    x = 0;
    y = 100;
    offset = {
        x: 55,
        y: 140,
        width: 55,
        height: 65,
        bubbleX: 220,
        bubbleY: 165
    }
    speed = 4;
    energy = 100;
    attack = 10;
    coins = 0;
    poison = 0;
    imgMirrored = false;
    lastMove = new Date().getTime();
    secondsUntilLongIdle = 10;
    hitBy;
    isAlreadyDead;
    isFinSlapping = false;
    isBubbleTrapping = false;
    isCollidingWithBarrier = false;
    isCollidingWithBarrierUp = false;
    isCollidingWithBarrierRight = false;
    isCollidingWithBarrierDown = false;
    isCollidingWithBarrierLeft = false;
    touchCtrlUpStart = false;
    touchCtrlUpEnd = false;
    touchCtrlRightStart = false;
    touchCtrlRightEnd = false;
    touchCtrlDownStart = false;
    touchCtrlDownEnd = false;
    touchCtrlLeftStart = false;
    touchCtrlLeftEnd = false;
    touchCtrlFinSlapStart = false;
    touchCtrlFinSlapEnd = false;
    touchCtrlBubbleTrapStart = false;
    touchCtrlBubbleTrapEnd = false;
    touchCtrlPoisonBubbleTrapStart = false;
    touchCtrlPoisonBubbleTrapEnd = false;
    SWIM_SOUND = new Audio('./assets/audio/swim.mp3');
    DYING_SOUND = new Audio('./assets/audio/hurt_dying.mp3');
    SLAP_SOUND = new Audio('./assets/audio/punch.mp3');
    BUBBLE_SOUND = new Audio('./assets/audio/bubble.mp3');
    HURT_SOUND = new Audio('./assets/audio/hurt.mp3');
    ELECTRIC_ZAP_SOUND = new Audio('./assets/audio/electric_zap.mp3');
    COIN_SOUND = new Audio('./assets/audio/coin.mp3');
    COLLECT_SOUND = new Audio('./assets/audio/collect.mp3');
    BUBBLING_SOUND = new Audio('./assets/audio/bubbling.mp3');
    LIFE_SOUND = new Audio('./assets/audio/health.mp3');
    /**
     * Safe timer management to prevent zombie intervals/timeouts across restarts.
     * @type {{type: ('i'|'t'), id: number}[]}
     */
    timers = [];
    /**
     * Registers an interval that auto-noops when the world is stopped and tracks its id for cleanup.
     * @param {Function} fn - Callback to execute.
     * @param {number} ms - Interval in milliseconds.
     * @returns {number} Interval id.
     */
    setSafeInterval(fn, ms) {
        const id = setInterval(() => {
            if (this.world && this.world.stopped) return;
            fn();
        }, ms);
        this.timers.push({ type: 'i', id });
        return id;
    }
    /**
     * Registers a timeout that auto-noops when the world is stopped and tracks its id for cleanup.
     * @param {Function} fn - Callback to execute.
     * @param {number} ms - Timeout in milliseconds.
     * @returns {number} Timeout id.
     */
    setSafeTimeout(fn, ms) {
        const id = setTimeout(() => {
            if (this.world && this.world.stopped) return;
            fn();
        }, ms);
        this.timers.push({ type: 't', id });
        return id;
    }
    /**
     * Clears all registered timers (intervals and timeouts).
     * @returns {void}
     */
    clearAllTimers() {
        this.timers.forEach(t => {
            if (t.type === 'i') clearInterval(t.id);
            else clearTimeout(t.id);
        });
        this.timers = [];
    }
    /**
     * Construct a new character and preload all required animation frames and sounds.
     */
    constructor() {
        super();
        this.loadImage('./assets/img/1._Sharkie/1._Idle/1.png');
        this.loadImages(SHARKIE_IMAGES.IDLE);
        this.loadImages(SHARKIE_IMAGES.LONG_IDLE);
        this.loadImages(SHARKIE_IMAGES.SWIM);
        this.loadImages(SHARKIE_IMAGES.HURT_POISONED);
        this.loadImages(SHARKIE_IMAGES.HURT_ELECTRIC_SHOCK);
        this.loadImages(SHARKIE_IMAGES.DIE_POISONED);
        this.loadImages(SHARKIE_IMAGES.DIE_ELECTRIC_SHOCK);
        this.loadImages(SHARKIE_IMAGES.FIN_SLAP);
        this.loadImages(SHARKIE_IMAGES.BUBBLE_TRAP);
        this.animate();
        this.characterEvents();
        this.characterSounds();
        this.triggerEndboss();
        this.touchEvents();
    }
    /**
     * Starts periodic animation-state updates and attack handling.
     * @returns {void}
     */
    animate() {
        this.setSafeInterval(() => {
            this.updateAnimationState();
        }, 200);

        this.setSafeInterval(() => {
            this.handleAttacks();
        }, 100);
    }
    /**
     * Updates the animation state based on health, hits, idling and movement input.
     * @returns {void}
     */
    updateAnimationState() {
        if (this._handleDeathAnimation()) return;
        if (this._handleHurtAnimation()) return;
        this._handleMoveOrIdleAnimation();
    }

    /** Handles death animations; returns true if handled. */
    _handleDeathAnimation() {
        if (this.isDead() && (this.hitBy == 'PufferFish' || this.hitBy == 'EndBoss')) {
            this.playAnimation(SHARKIE_IMAGES.DIE_POISONED, 0);
            characterIsDead = true; this.clearAllTimers(); return true;
        }
        if (this.isDead() && this.hitBy == 'JellyFish') {
            this.playAnimation(SHARKIE_IMAGES.DIE_ELECTRIC_SHOCK, 0);
            characterIsDead = true; this.clearAllTimers(); return true;
        }
        return false;
    }

    /** Handles hurt animations; returns true if handled. */
    _handleHurtAnimation() {
        if (this.isHurt() && (this.hitBy == 'PufferFish' || this.hitBy == 'EndBoss')) {
            this.playAnimation(SHARKIE_IMAGES.HURT_POISONED, 1); return true;
        }
        if (this.isHurt() && this.hitBy == 'JellyFish') {
            this.playAnimation(SHARKIE_IMAGES.HURT_ELECTRIC_SHOCK, 1); return true;
        }
        return false;
    }

    /** Handles move/idle/long-idle animations. */
    _handleMoveOrIdleAnimation() {
        const kb = this.world.keyboard;
        if (kb.LEFT || kb.UP || kb.RIGHT || kb.DOWN) {
            this.playAnimation(SHARKIE_IMAGES.SWIM, 1);
        } else if (this.isLongIdle()) {
            this.playAnimation(SHARKIE_IMAGES.LONG_IDLE, 1);
        } else {
            this.playAnimation(SHARKIE_IMAGES.IDLE, 1);
        }
    }
    /**
     * Handles character attack actions based on keyboard and touch controls.
     * @returns {void}
     */
    handleAttacks() {
        if (this.world.keyboard.SPACE && !this.isDead()) {
            this.finSlapAttack();
            this.playAnimation(SHARKIE_IMAGES.FIN_SLAP, 0);
        } else if (this.world.keyboard.D && !this.isDead()) {
            this.bubbleTrapAttack();
            this.playAnimation(SHARKIE_IMAGES.BUBBLE_TRAP, 0);
        } else if (this.world.keyboard.F && this.poison > 0 && !this.isDead()) {
            this.bubbleTrapAttackPoison();
            this.playAnimation(SHARKIE_IMAGES.BUBBLE_TRAP, 0);
        }
        if (this.touchCtrlFinSlapStart && !this.isDead()) {
            this.finSlapAttack();
            this.playAnimation(SHARKIE_IMAGES.FIN_SLAP, 0);
        } else if (this.touchCtrlBubbleTrapStart && !this.isDead()) {
            this.bubbleTrapAttack();
            this.playAnimation(SHARKIE_IMAGES.BUBBLE_TRAP, 0);
        } else if (this.touchCtrlPoisonBubbleTrapStart && this.poison > 0 && !this.isDead()) {
            this.bubbleTrapAttackPoison();
            this.playAnimation(SHARKIE_IMAGES.BUBBLE_TRAP, 0);
        }
    }
    /**
     * Polls input for movement, applies limits/barriers, and updates camera.
     * @returns {void}
     */
    characterEvents() {
        this.setSafeInterval(() => {
            this.handleMovementInput(
                'up',
                'UP',
                'touchCtrlUpStart',
                () => this.y > -135 && !this.isDead() && !this.world.level.getEndBoss().isDead()
            );
            this.handleMovementInput(
                'right',
                'RIGHT',
                'touchCtrlRightStart',
                () => this.x < this.world.level.level_end_x && !this.isDead() && !this.world.level.getEndBoss().isDead()
            );
            this.handleMovementInput(
                'down',
                'DOWN',
                'touchCtrlDownStart',
                () => this.y < 240 && !this.isDead() && !this.world.level.getEndBoss().isDead()
            );
            this.handleMovementInput(
                'left',
                'LEFT',
                'touchCtrlLeftStart',
                () => this.x > 0 && !this.isDead() && !this.world.level.getEndBoss().isDead()
            );
            this.world.camera_x = -this.x;
        }, 1000 / 60);
    }
    /**
     * Handles movement input for a given direction from keyboard and touch.
     * @param {string} direction - 'up' | 'down' | 'left' | 'right'.
     * @param {string} keyboardKey - Keyboard flag name on `this.world.keyboard` (e.g., 'UP').
     * @param {string} touchKey - Touch flag name on the character (e.g., 'touchCtrlUpStart').
     * @param {Function} limitCheck - Returns true if movement is allowed in this frame.
     * @returns {void}
     */
    handleMovementInput(direction, keyboardKey, touchKey, limitCheck) {
        if (this.world.keyboard[keyboardKey] && limitCheck()) {
            this.moveCharacter(direction);
        }
        if (this[touchKey] && limitCheck()) {
            this.moveCharacter(direction);
        }
    }
    /**
     * Applies one-tick movement in the given direction respecting barrier flags.
     * @param {string} direction - 'up' | 'down' | 'left' | 'right'.
     * @returns {void}
     */
    moveCharacter(direction) {
        this.lastMove = new Date().getTime();

        this.checkBarrierCollisions(direction);

        if (direction == 'up' && !this.isCollidingWithBarrierUp) {
            this.y -= this.speed;
        } else if (direction == 'right' && !this.isCollidingWithBarrierRight) {
            this.x += this.speed;
            this.imgMirrored = false;
        } else if (direction == 'down' && !this.isCollidingWithBarrierDown) {
            this.y += this.speed;
        } else if (direction == 'left' && !this.isCollidingWithBarrierLeft) {
            this.x -= this.speed;
            this.imgMirrored = true;
        }
    }

    /**
     * Updates barrier-collision flags for the attempted movement direction.
     * @param {string} direction - Intended direction of movement.
     * @returns {void}
     */
    checkBarrierCollisions(direction) {
        const cAll = this.world.level.barriers.find(b => this.isColliding(b));
        const cX = this.world.level.barriers.find(b => this.isCollidingX(b));
        const cY = this.world.level.barriers.find(b => this.isCollidingY(b));
        this._resetBarrierFlags(cAll);
        this._updateHorizontalBarrierFlags(direction, cX);
        this._updateVerticalBarrierFlags(direction, cY);
    }
    /** Resets base barrier flags based on overall collision. */
    _resetBarrierFlags(collidingWithBarrier) {
        if (collidingWithBarrier) { this.isCollidingWithBarrier = true; return; }
        this.isCollidingWithBarrier = false;
        this.isCollidingWithBarrierUp = false;
        this.isCollidingWithBarrierRight = false;
        this.isCollidingWithBarrierDown = false;
        this.isCollidingWithBarrierLeft = false;
    }
    /** Updates left/right flags for attempted horizontal movement. */
    _updateHorizontalBarrierFlags(direction, cX) {
        if (direction == 'right' && cX && !this.isCollidingWithBarrierLeft) {
            this.isCollidingWithBarrierRight = true; return;
        }
        if (direction == 'left' && cX && !this.isCollidingWithBarrierRight) {
            this.isCollidingWithBarrierLeft = true;
        }
    }
    /** Updates up/down flags for attempted vertical movement. */
    _updateVerticalBarrierFlags(direction, cY) {
        if (direction == 'up' && cY && !this.isCollidingWithBarrierDown) {
            this.isCollidingWithBarrierUp = true; return;
        }
        if (direction == 'down' && cY && !this.isCollidingWithBarrierUp) {
            this.isCollidingWithBarrierDown = true;
        }
    }
}