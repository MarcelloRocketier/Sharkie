


/**
 * Character animation methods, attached to Character.prototype.
 */
Object.assign(Character.prototype, {
  /**
   * Main animation loop.
   * @returns {void}
   */
  animate() {
    setInterval(() => {
      this.updateAnimationState();
    }, 1000 / 12);
  },

  /**
   * Updates animation state depending on conditions.
   * @returns {void}
   */
  updateAnimationState() {
    if (this._handleDeathAnimation()) return;
    if (this._handleHurtAnimation()) return;
    this._handleMoveOrIdleAnimation();
  },

  /**
   * Handles death animations and stops timers.
   * @returns {boolean} True if death animation applied.
   */
  _handleDeathAnimation() {
    if (this.isDead() && (this.hitBy == 'PufferFish' || this.hitBy == 'EndBoss')) {
      this.playAnimation(SHARKIE_IMAGES.DIE_POISONED, 0);
      characterIsDead = true;
      this.clearAllTimers();
      return true;
    }
    if (this.isDead() && this.hitBy == 'JellyFish') {
      this.playAnimation(SHARKIE_IMAGES.DIE_ELECTRIC_SHOCK, 0);
      characterIsDead = true;
      this.clearAllTimers();
      return true;
    }
    return false;
  },

  /**
   * Handles hurt animations.
   * @returns {boolean} True if hurt animation applied.
   */
  _handleHurtAnimation() {
    if (this.isHurt() && (this.hitBy == 'PufferFish' || this.hitBy == 'EndBoss')) {
      this.playAnimation(SHARKIE_IMAGES.HURT_POISONED, 1);
      return true;
    }
    if (this.isHurt() && this.hitBy == 'JellyFish') {
      this.playAnimation(SHARKIE_IMAGES.HURT_ELECTRIC_SHOCK, 1);
      return true;
    }
    return false;
  },

  /**
   * Handles move or idle animations.
   * @returns {void}
   */
  _handleMoveOrIdleAnimation() {
    if (this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.RIGHT || this.world.keyboard.DOWN) {
      this.playAnimation(SHARKIE_IMAGES.SWIM, 1);
    } else if (this.isLongIdle()) {
      this.playAnimation(SHARKIE_IMAGES.LONG_IDLE, 1);
    } else {
      this.playAnimation(SHARKIE_IMAGES.IDLE, 1);
    }
  }
});