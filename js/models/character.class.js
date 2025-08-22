/**
 * Project: Sharkie 2D Game
 * File: js/models/character.class.js
 * Responsibility: Player character model – movement, animation state, attacks, sounds, timers, and boss trigger.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */
/**
 * Player character controller. Manages movement, animation FSM, attack actions, SFX, and safe-timer utilities.
 * Owns touch-controls flags and updates HUD via the world.
 */
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
        if (this.isDead() && (this.hitBy == 'PufferFish' || this.hitBy == 'EndBoss')) {
            this.playAnimation(SHARKIE_IMAGES.DIE_POISONED, 0);
            characterIsDead = true;
            this.clearAllTimers();
        } else if (this.isDead() && this.hitBy == 'JellyFish') {
            this.playAnimation(SHARKIE_IMAGES.DIE_ELECTRIC_SHOCK, 0);
            characterIsDead = true;
            this.clearAllTimers();
        } else if (this.isHurt() && (this.hitBy == 'PufferFish' || this.hitBy == 'EndBoss')) {
            this.playAnimation(SHARKIE_IMAGES.HURT_POISONED, 1);
        } else if (this.isHurt() && this.hitBy == 'JellyFish') {
            this.playAnimation(SHARKIE_IMAGES.HURT_ELECTRIC_SHOCK, 1);
        } else if (this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.RIGHT || this.world.keyboard.DOWN) {
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
     * Binds touch button listeners and maps them to character touch flags.
     * @returns {void}
     */
    touchEvents() {
        const ctrlUp = document.getElementById('ctrl-btn-up');
        const ctrlRight = document.getElementById('ctrl-btn-right');
        const ctrlDown = document.getElementById('ctrl-btn-down');
        const ctrlLeft = document.getElementById('ctrl-btn-left');
        const ctrlFinSlap = document.getElementById('ctrl-btn-fin-slap');
        const ctrlBubbleTrap = document.getElementById('ctrl-btn-bubble-trap');
        const ctrlPoisonBubbleTrap = document.getElementById('ctrl-btn-poison-bubble-trap');

        ctrlUp.addEventListener('touchstart', () => this.handleTouchControl('touchCtrlUpStart', 'touchCtrlUpEnd', true));
        ctrlUp.addEventListener('touchend', () => this.handleTouchControl('touchCtrlUpStart', 'touchCtrlUpEnd', false));
        ctrlRight.addEventListener('touchstart', () => this.handleTouchControl('touchCtrlRightStart', 'touchCtrlRightEnd', true));
        ctrlRight.addEventListener('touchend', () => this.handleTouchControl('touchCtrlRightStart', 'touchCtrlRightEnd', false));
        ctrlDown.addEventListener('touchstart', () => this.handleTouchControl('touchCtrlDownStart', 'touchCtrlDownEnd', true));
        ctrlDown.addEventListener('touchend', () => this.handleTouchControl('touchCtrlDownStart', 'touchCtrlDownEnd', false));
        ctrlLeft.addEventListener('touchstart', () => this.handleTouchControl('touchCtrlLeftStart', 'touchCtrlLeftEnd', true));
        ctrlLeft.addEventListener('touchend', () => this.handleTouchControl('touchCtrlLeftStart', 'touchCtrlLeftEnd', false));
        ctrlFinSlap.addEventListener('touchstart', () => this.handleTouchControl('touchCtrlFinSlapStart', 'touchCtrlFinSlapEnd', true));
        ctrlFinSlap.addEventListener('touchend', () => this.handleTouchControl('touchCtrlFinSlapStart', 'touchCtrlFinSlapEnd', false));
        ctrlBubbleTrap.addEventListener('touchstart', () => this.handleTouchControl('touchCtrlBubbleTrapStart', 'touchCtrlBubbleTrapEnd', true));
        ctrlBubbleTrap.addEventListener('touchend', () => this.handleTouchControl('touchCtrlBubbleTrapStart', 'touchCtrlBubbleTrapEnd', false));
        ctrlPoisonBubbleTrap.addEventListener('touchstart', () => this.handleTouchControl('touchCtrlPoisonBubbleTrapStart', 'touchCtrlPoisonBubbleTrapEnd', true));
        ctrlPoisonBubbleTrap.addEventListener('touchend', () => this.handleTouchControl('touchCtrlPoisonBubbleTrapStart', 'touchCtrlPoisonBubbleTrapEnd', false));
    }
    /**
     * Generic toggle for touch control flags.
     * @param {string} startFlag - Property name for touch start boolean.
     * @param {string} endFlag - Property name for touch end boolean.
     * @param {boolean} isStart - True when touch starts, false when it ends.
     * @returns {void}
     */
    handleTouchControl(startFlag, endFlag, isStart) {
        this[startFlag] = isStart;
        this[endFlag] = !isStart;
    }
    /**
     * Drives all character-related sound effects in a lightweight loop.
     * @returns {void}
     */
    characterSounds() {
        this.setSafeInterval(() => {
            if (soundOn) {
                this.handleSwimSound();
                this.handleDeathSound();
                this.handleSlapBubbleSounds();
                this.handleEnemyCollisionSounds();
                this.handleItemPickupSounds();
            }
        }, 1000 / 60);
    }
    /**
     * Plays/maintains the swim sound while movement keys are pressed.
     * @returns {void}
     */
    handleSwimSound() {
        if (this.world.keyboard.LEFT || this.world.keyboard.RIGHT || this.world.keyboard.UP || this.world.keyboard.DOWN) {
            this.SWIM_SOUND.pause();
            this.SWIM_SOUND.play();
        }
    }
    /**
     * Plays the death sound exactly once when the character dies.
     * @returns {void}
     */
    handleDeathSound() {
        if (this.isDead() && !this.isAlreadyDead) {
            this.DYING_SOUND.play();
            this.isAlreadyDead = true;
        }
    }
    /**
     * Triggers slap and bubble SFX for attacks and projectile-enemy collisions.
     * @returns {void}
     */
    handleSlapBubbleSounds() {
        if (this.isFinSlapping) {
            this.SLAP_SOUND.play();
        }
        if (this.isBubbleTrapping) {
            this.BUBBLE_SOUND.play();
        }
        this.world.level.enemies.forEach(enemy => {
            if (this.world.bubble) {
                if (this.world.bubble.isColliding(enemy) && (enemy instanceof JellyFishRegular || enemy instanceof JellyFishDangerous || enemy instanceof EndBoss)) {
                    this.BUBBLING_SOUND.currentTime = 0;
                    this.BUBBLING_SOUND.play();
                }
            }
        });
    }
    /**
     * Plays context-sensitive hurt/zap sounds on enemy collision.
     * @returns {void}
     */
    handleEnemyCollisionSounds() {
        this.world.level.enemies.forEach(enemy => {
            if (this.isColliding(enemy) && !this.isDead() && !enemy.isDead() && !this.isFinSlapping) {
                if (enemy instanceof PufferFish || enemy instanceof EndBoss) {
                    this.HURT_SOUND.play();
                } else if (enemy instanceof JellyFishRegular || enemy instanceof JellyFishDangerous) {
                    this.ELECTRIC_ZAP_SOUND.play();
                }
            }
        });
    }
    /**
     * Plays pickup sounds for coins, poison, and life items on collision.
     * @returns {void}
     */
    handleItemPickupSounds() {
        this.world.level.coins.forEach(coin => {
            if (this.isColliding(coin)) {
                this.COIN_SOUND.play();
            }
        });
        this.world.level.poison.forEach(poison => {
            if (this.isColliding(poison)) {
                this.COLLECT_SOUND.play();
            }
        });
        this.world.level.life.forEach(life => {
            if (this.isColliding(life)) {
                this.LIFE_SOUND.play();
            }
        });
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
        let collidingWithBarrier = this.world.level.barriers.find(barrier => this.isColliding(barrier));
        let collidingWithBarrierX = this.world.level.barriers.find(barrier => this.isCollidingX(barrier));
        let collidingWithBarrierY = this.world.level.barriers.find(barrier => this.isCollidingY(barrier));

        if (collidingWithBarrier) {
            this.isCollidingWithBarrier = true;
        } else {
            this.isCollidingWithBarrier = false;
            this.isCollidingWithBarrierUp = false;
            this.isCollidingWithBarrierRight = false;
            this.isCollidingWithBarrierDown = false;
            this.isCollidingWithBarrierLeft = false;
        }

        if (direction == 'right' && collidingWithBarrierX && !this.isCollidingWithBarrierLeft) {
            this.isCollidingWithBarrierRight = true;
        } else if (direction == 'left' && collidingWithBarrierX && !this.isCollidingWithBarrierRight) {
            this.isCollidingWithBarrierLeft = true;
        } else if (direction == 'up' && collidingWithBarrierY && !this.isCollidingWithBarrierDown) {
            this.isCollidingWithBarrierUp = true;
        } else if (direction == 'down' && collidingWithBarrierY && !this.isCollidingWithBarrierUp) {
            this.isCollidingWithBarrierDown = true;
        }
    }

    /**
     * Checks if the character has been idle long enough to trigger long-idle animation.
     * @returns {boolean}
     */
    isLongIdle() {
        let timePassed = new Date().getTime() - this.lastMove;
        timePassed = timePassed / 1000;
        return timePassed > this.secondsUntilLongIdle;
    }

    /**
     * Initiates a fin slap attack and schedules key release.
     * @returns {void}
     */
    finSlapAttack() {
        this.activateKey('SPACE', 600, () => this.isFinSlapping = false);
        this.lastMove = new Date().getTime();
        this.isFinSlapping = true;
    }
    /**
     * Activates a key flag for a limited duration, then clears it.
     * @param {string} key - Keyboard flag to toggle (e.g., 'SPACE').
     * @param {number} duration - Duration in milliseconds.
     * @param {Function} [onEnd] - Optional callback when the key is released.
     * @returns {void}
     */
    activateKey(key, duration, onEnd) {
        if (!this.checkAlreadyRunning) {
            this.currentImage = 0;
            let pressed = setInterval(() => {
                this.world.keyboard[key] = true;
                this.checkAlreadyRunning = true;
            }, 100);
            setTimeout(() => {
                this.world.keyboard[key] = false;
                this.checkAlreadyRunning = false;
                clearInterval(pressed);
                if (typeof onEnd === 'function') onEnd();
            }, duration);
        }
    }

    /**
     * Initiates a normal bubble trap attack.
     * @returns {void}
     */
    bubbleTrapAttack() {
        this.activateKey('D', 600, () => this.isBubbleTrapping = false);
        this.lastMove = new Date().getTime();
        this.isBubbleTrapping = true;
        this.spawnBubble(false);
    }
    /**
     * Initiates a poison bubble trap attack (consumes poison if available).
     * @returns {void}
     */
    bubbleTrapAttackPoison() {
        this.activateKey('F', 600, () => this.isBubbleTrapping = false);
        this.lastMove = new Date().getTime();
        this.isBubbleTrapping = true;
        this.spawnBubble(true);
    }
    /**
     * Spawns a bubble projectile after a short delay.
     * @param {boolean} [isPoison=false] - True to spawn poison bubble, false for normal.
     * @returns {void}
     */
    spawnBubble(isPoison = false) {
        if (!this.checkAlreadyRunning) {
            let otherDirection = this.imgMirrored === true;
            this.setSafeTimeout(() => {
                if (this.isDead() || (this.world && this.world.stopped)) return;
                if (isPoison) {
                    if (this.poison > 0) {
                        this.world.bubble = new PoisonBubble(this.x + this.offset.bubbleX, this.y + this.offset.bubbleY, otherDirection);
                        this.poison--;
                        this.world.statusBarPoison.setPercentage((this.poison / this.world.level.totalPoison) * 100, this.world.statusBarPoison.type, this.world.statusBarPoison.color);
                    }
                } else {
                    this.world.bubble = new Bubble(this.x + this.offset.bubbleX, this.y + this.offset.bubbleY, otherDirection);
                }
            }, 600);
        }
    }
    /**
     * Periodically checks the character position to trigger the EndBoss intro when in range.
     * @returns {void}
     */
    triggerEndboss() {
        this.setSafeInterval(() => {
            const eb = this.world && this.world.level && typeof this.world.level.getEndBoss === 'function' ? this.world.level.getEndBoss() : null;
            if (!eb) return;
            if (this.x > (eb.x - eb.triggerDistance) && !eb.endBossAlreadyTriggered) {
                eb.endBossTriggered = true;
            }
        }, 100);
    }
}