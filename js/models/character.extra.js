/**
 * Character extra methods split out to keep character.class.js under 400 LOC.
 * This file must be loaded AFTER js/models/character.class.js.
 */
Object.assign(Character.prototype, {
  /** Checks if the character has been idle long enough to trigger long-idle animation. */
  isLongIdle() {
    let timePassed = new Date().getTime() - this.lastMove;
    timePassed = timePassed / 1000;
    return timePassed > this.secondsUntilLongIdle;
  },

  /** Initiates a fin slap attack and schedules key release. */
  finSlapAttack() {
    this.activateKey('SPACE', 600, () => this.isFinSlapping = false);
    this.lastMove = new Date().getTime();
    this.isFinSlapping = true;
    this.grantShortInvulnerability(350);
  },

  /** Grants a brief invulnerability window to the character. */
  grantShortInvulnerability(ms = 350) {
    const now = Date.now();
    this.invulnUntil = Math.max(this.invulnUntil || 0, now + ms);
  },

  /** Returns true while the character is currently invulnerable. */
  isInvulnerable() {
    return Date.now() < (this.invulnUntil || 0);
  },

  /** Activates a key flag for a limited duration, then clears it. */
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
  },

  /** Initiates a normal bubble trap attack. */
  bubbleTrapAttack() {
    this.activateKey('D', 600, () => this.isBubbleTrapping = false);
    this.lastMove = new Date().getTime();
    this.isBubbleTrapping = true;
    this.spawnBubble(false);
  },

  /** Initiates a poison bubble trap attack (consumes poison if available). */
  bubbleTrapAttackPoison() {
    this.activateKey('F', 600, () => this.isBubbleTrapping = false);
    this.lastMove = new Date().getTime();
    this.isBubbleTrapping = true;
    this.spawnBubble(true);
  },

  /** Spawns a bubble projectile after a short delay. */
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
  },

  /** Periodically checks the character position to trigger the EndBoss intro when in range. */
  triggerEndboss() {
    this.setSafeInterval(() => {
      const eb = this.world && this.world.level && typeof this.world.level.getEndBoss === 'function' ? this.world.level.getEndBoss() : null;
      if (!eb) return;
      if (this.x > (eb.x - eb.triggerDistance) && !eb.endBossAlreadyTriggered) {
        eb.endBossTriggered = true;
      }
    }, 100);
  },

  /** Drives all character-related sound effects in a lightweight loop. */
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
  },

  /** Plays/maintains the swim sound while movement keys are pressed. */
  handleSwimSound() {
    if (this.world.keyboard.LEFT || this.world.keyboard.RIGHT || this.world.keyboard.UP || this.world.keyboard.DOWN) {
      this.SWIM_SOUND.pause();
      this.SWIM_SOUND.play();
    }
  },

  /** Plays the death sound exactly once when the character dies. */
  handleDeathSound() {
    if (this.isDead() && !this.isAlreadyDead) {
      this.DYING_SOUND.play();
      this.isAlreadyDead = true;
    }
  },

  /** Triggers slap and bubble SFX for attacks and projectile-enemy collisions. */
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
  },

  /** Plays context-sensitive hurt/zap sounds on enemy collision. */
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
  },

  /** Plays pickup sounds for coins, poison, and life items on collision. */
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
  },

  /** Binds touch button listeners and maps them to character touch flags. */
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
  },

  /** Generic toggle for touch control flags. */
  handleTouchControl(startFlag, endFlag, isStart) {
    this[startFlag] = isStart;
    this[endFlag] = !isStart;
  }
});

if (typeof Character !== 'undefined') {
  Character.prototype.invulnUntil = 0;
}
