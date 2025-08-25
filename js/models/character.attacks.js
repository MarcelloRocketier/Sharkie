


/**
 * Character attack methods, attached to Character.prototype.
 */
Object.assign(Character.prototype, {
  /**
   * Handles keyboard and touch-based attacks.
   * @returns {void}
   */
  handleAttacks() {
    this._handleKeyboardAttacks();
    this._handleTouchAttacks();
  },

  /** Handles attack input from keyboard. */
  _handleKeyboardAttacks() {
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
  },

  /** Handles attack input from touch controls. */
  _handleTouchAttacks() {
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
  },

  /** Performs fin slap melee attack. */
  finSlapAttack() {
    // Logic to register a fin slap attack, e.g., collision checks with nearby enemies
  },

  /** Spawns a normal bubble. */
  bubbleTrapAttack() {
    this.spawnBubble(false);
  },

  /** Spawns a poison bubble. */
  bubbleTrapAttackPoison() {
    this.spawnBubble(true);
  },

  /**
   * Spawns a bubble after delay depending on type.
   * @param {boolean} isPoison
   */
  spawnBubble(isPoison = false) {
    if (this.checkAlreadyRunning) return;
    const otherDirection = this.imgMirrored === true;
    this.setSafeTimeout(() => this._spawnBubbleNow(isPoison, otherDirection), 600);
  },

  /**
   * Internal: spawns the bubble projectile now.
   * @param {boolean} isPoison
   * @param {boolean} otherDirection
   */
  _spawnBubbleNow(isPoison, otherDirection) {
    if (this.isDead() || (this.world && this.world.stopped)) return;
    const bx = this.x + this.offset.bubbleX;
    const by = this.y + this.offset.bubbleY;
    if (isPoison) {
      if (this.poison > 0) {
        this.world.bubble = new PoisonBubble(bx, by, otherDirection);
        this.poison--;
        this.world.statusBarPoison.setPercentage(
          (this.poison / this.world.level.totalPoison) * 100,
          this.world.statusBarPoison.type,
          this.world.statusBarPoison.color
        );
      }
    } else {
      this.world.bubble = new Bubble(bx, by, otherDirection);
    }
  }
});