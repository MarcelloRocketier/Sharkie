/**
 * Game character object
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
     * Handles animation state updates for the character.
     */
    animate() {
        setInterval(() => {
            this.updateAnimationState();
        }, 200);

        setInterval(() => {
            this.handleAttacks();
        }, 100)
    }
    /**
     * Updates the animation state based on character status and input.
     */
    updateAnimationState() {
        if (this.isDead() && (this.hitBy == 'PufferFish' || this.hitBy == 'EndBoss')) {
            this.playAnimation(SHARKIE_IMAGES.DIE_POISONED, 0);
            characterIsDead = true;
        } else if (this.isDead() && this.hitBy == 'JellyFish') {
            this.playAnimation(SHARKIE_IMAGES.DIE_ELECTRIC_SHOCK, 0);
            characterIsDead = true;
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
     */
    handleAttacks() {
        // Keyboard controls
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
        // Touch controls
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
     * Handles character movement input events from keyboard and touch controls.
     */
    characterEvents() {
        setInterval(() => {
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
        }, 1000 / 60)
    }
    /**
     * Handles movement input for a given direction from keyboard and touch.
     * @param {string} direction - The movement direction ('up', 'down', 'left', 'right')
     * @param {string} keyboardKey - The keyboard key name (e.g., 'UP', 'RIGHT')
     * @param {string} touchKey - The touch control boolean name (e.g., 'touchCtrlUpStart')
     * @param {function} limitCheck - Function to check if movement is allowed
     */
    handleMovementInput(direction, keyboardKey, touchKey, limitCheck) {
        if (this.world.keyboard[keyboardKey] && limitCheck()) {
            this.moveCharacter(direction);
        }
        if (this[touchKey] && limitCheck()) {
            this.moveCharacter(direction);
        }
    }

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
     * Generic handler for touch controls
     * @param {string} startFlag - property name for touch start boolean
     * @param {string} endFlag - property name for touch end boolean
     * @param {boolean} isStart - whether this is a start or end event
     */
    handleTouchControl(startFlag, endFlag, isStart) {
        this[startFlag] = isStart;
        this[endFlag] = !isStart;
    }
    /**
     * Handles playing character sounds based on various game events.
     */
    characterSounds() {
        setInterval(() => {
            if (soundOn) {
                this.handleSwimSound();
                this.handleDeathSound();
                this.handleSlapBubbleSounds();
                this.handleEnemyCollisionSounds();
                this.handleItemPickupSounds();
            }
        }, 1000 / 60)
    }
    /**
     * Plays swim sound when movement keys are pressed.
     */
    handleSwimSound() {
        if (this.world.keyboard.LEFT || this.world.keyboard.RIGHT || this.world.keyboard.UP || this.world.keyboard.DOWN) {
            this.SWIM_SOUND.pause();
            this.SWIM_SOUND.play();
        }
    }
    /**
     * Plays death sound when character dies, only once.
     */
    handleDeathSound() {
        if (this.isDead() && !this.isAlreadyDead) {
            this.DYING_SOUND.play();
            this.isAlreadyDead = true;
        }
    }
    /**
     * Plays slap and bubble trap sounds for attacks and enemy bubble collisions.
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
     * Plays hurt or electric zap sound when colliding with enemies.
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
     * Plays item pickup sounds for coins, poison, and life.
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

    isLongIdle() {
        let timePassed = new Date().getTime() - this.lastMove;
        timePassed = timePassed / 1000;
        return timePassed > this.secondsUntilLongIdle;
    }

    finSlapAttack() {
        this.activateKey('SPACE', 600, () => this.isFinSlapping = false);
        this.lastMove = new Date().getTime();
        this.isFinSlapping = true;
    }
    /**
     * Activates a key for a set duration
     * @param {string} key - key property to activate (e.g., 'SPACE')
     * @param {number} duration - duration in ms
     * @param {function} onEnd - optional callback after end
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

    bubbleTrapAttack() {
        this.activateKey('D', 600, () => this.isBubbleTrapping = false);
        this.lastMove = new Date().getTime();
        this.isBubbleTrapping = true;
        this.spawnBubble(false);
    }
    bubbleTrapAttackPoison() {
        this.activateKey('F', 600, () => this.isBubbleTrapping = false);
        this.lastMove = new Date().getTime();
        this.isBubbleTrapping = true;
        this.spawnBubble(true);
    }
    /**
     * Spawns a bubble or poison bubble after a delay
     * @param {boolean} isPoison - true for poison bubble, false for normal
     */
    spawnBubble(isPoison = false) {
        if (!this.checkAlreadyRunning) {
            let otherDirection = this.imgMirrored === true;
            setTimeout(() => {
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
     * Triggers the EndBoss when exceeding the x coordinate minus the triggerDistance
     */
    triggerEndboss() {
        setInterval(() => {
            if (this.x > (this.world.level.getEndBoss().x - this.world.level.getEndBoss().triggerDistance) && !this.world.level.getEndBoss().endBossAlreadyTriggered) {
                this.world.level.getEndBoss().endBossTriggered = true;
            }
        }, 100);
    }
}