


/**
 * Character sound methods, attached to Character.prototype.
 */
Object.assign(Character.prototype, {
  /**
   * Starts all continuous character sound loops.
   * @returns {void}
   */
  characterSounds() {
    this.setSafeInterval(() => this._swimSoundLoop(), 1000 / 10);
  },

  /**
   * Plays swim sound when character is moving.
   * @returns {void}
   */
  _swimSoundLoop() {
    if (this.isDead()) return;
    const moving = this.world.keyboard.LEFT || this.world.keyboard.RIGHT || this.world.keyboard.UP || this.world.keyboard.DOWN;
    if (moving) {
      try { this.SWIM_SOUND.play(); } catch(e){}
    } else {
      try { this.SWIM_SOUND.pause(); this.SWIM_SOUND.currentTime = 0; } catch(e){}
    }
  },

  /**
   * Plays sound when character picks up items.
   * @returns {void}
   */
  handleItemPickupSounds() {
    this._checkCoinPickup();
    this._checkPoisonPickup();
    this._checkLifePickup();
  },

  /** Plays death sound. */
  playDeathSound() {
    try { this.DEAD_SOUND.play(); } catch(e){}
  }
});