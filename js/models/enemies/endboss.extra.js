

/**
 * EndBoss extra methods split out to keep endboss.class.js under 400 LOC.
 * This file must be loaded AFTER js/models/enemies/endboss.class.js.
 */
Object.assign(EndBoss.prototype, {
  /** Registers an interval and tracks its id for later cleanup. */
  setSafeInterval(fn, ms) {
    const id = setInterval(fn, ms);
    this.timers.intervals.push(id);
    return id;
  },

  /** Registers a timeout and tracks its id for later cleanup. */
  setSafeTimeout(fn, ms) {
    const id = setTimeout(fn, ms);
    this.timers.timeouts.push(id);
    return id;
  },

  /** Clears all registered timers (intervals and timeouts) for this boss instance. */
  clearAllTimers() {
    this.timers.intervals.forEach(id => clearInterval(id));
    this.timers.timeouts.forEach(id => clearTimeout(id));
    this.timers = { intervals: [], timeouts: [] };
    this.bossThemeIntervalId = null;
  },

  /** Moves forward to startX - wanderDistance. */
  stepForward1() {
    if (!this.waypoint1 && this.x > this.startX - this.wanderDistance) {
      this.x -= this.speed * this.getRandomSpeedFactor(1.5, 3);
      if (this.x <= this.startX - this.wanderDistance) this.waypoint1 = true;
      return true;
    }
    return false;
  },

  /** Moves back to startX. */
  stepBack2() {
    if (this.waypoint1 && !this.waypoint2) {
      this.x += this.speed;
      if (this.x > this.startX) this.waypoint2 = true;
      return true;
    }
    return false;
  },

  /** Moves down to y = 150. */
  stepDown3() {
    if (this.waypoint2 && !this.waypoint3) {
      this.y += this.speed;
      if (this.y >= 150) this.waypoint3 = true;
      return true;
    }
    return false;
  },

  /** Moves forward again to startX - wanderDistance (faster). */
  stepForward4() {
    if (this.waypoint3 && !this.waypoint4) {
      this.x -= this.speed * this.getRandomSpeedFactor(2.5, 3.5);
      if (this.x <= this.startX - this.wanderDistance) this.waypoint4 = true;
      return true;
    }
    return false;
  },

  /** Moves back to startX with random speed. */
  stepBack5() {
    if (this.waypoint4 && !this.waypoint5) {
      this.x += this.speed * this.getRandomSpeedFactor(2, 3.5);
      if (this.x > this.startX) this.waypoint5 = true;
      return true;
    }
    return false;
  },

  /** Moves up to y < 0. */
  stepUp6() {
    if (this.waypoint5 && !this.waypoint6) {
      this.y -= this.speed;
      if (this.y < 0) this.waypoint6 = true;
      return true;
    }
    return false;
  },

  /** Moves forward again to startX - wanderDistance (fastest). */
  stepForward7() {
    if (this.waypoint6 && !this.waypoint7) {
      this.x -= this.speed * this.getRandomSpeedFactor(2.5, 4.5);
      if (this.x <= this.startX - this.wanderDistance) this.waypoint7 = true;
      return true;
    }
    return false;
  },

  /** Final step: moves back to startX and resets waypoints. */
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
  },

  /** Starts/maintains the boss theme playback loop without duplicating intervals. */
  startBossThemeLoop() {
    if (this.bossThemeIntervalId) return;
    this.bossThemeIntervalId = this.setSafeInterval(() => this._bossThemeTick(), 1000 / 60);
    if (!this._bossLoopBound) this._bindBossThemeEnd();
  },

  /** Performs one tick of the boss theme loop. */
  _bossThemeTick() {
    if (!this.world || this.world.stopped) {
      this._resetBossTheme();
      return;
    }
    if (soundOn && this.world.character && !this.world.character.isDead() && !this.isDead()) {
      try { this.BOSS_THEME_SOUND.play(); } catch(e){}
      if (this.world.MAIN_SOUND) this.world.MAIN_SOUND.pause();
    } else {
      this._resetBossTheme();
    }
  },

  /** Resets boss theme audio to start. */
  _resetBossTheme() {
    this.BOSS_THEME_SOUND.pause();
    this.BOSS_THEME_SOUND.currentTime = 0;
  },

  /** Binds looping behavior for when the boss theme ends. */
  _bindBossThemeEnd() {
    this._bossLoopBound = true;
    this.BOSS_THEME_SOUND.addEventListener('ended', function() {
      this.currentTime = 0;
      try { this.play(); } catch(e){}
    }, false);
  },

  /** Resets boss state flags and energy. */
  _resetBossFlags() {
    this.energy = 100;
    this.endBossTriggered = false;
    this.endBossIntroduced = false;
    this.endBossAlreadyTriggered = false;
    this.isCollidingWithCharacter = false;
    this.waypoint1 = this.waypoint2 = this.waypoint3 = false;
    this.waypoint4 = this.waypoint5 = this.waypoint6 = false;
    this.waypoint7 = false;
  },

  /** Resets boss position to start coordinates if defined. */
  _resetBossPosition() {
    if (typeof this.startX === 'number') this.x = this.startX;
    if (typeof this.startY === 'number') this.y = this.startY;
  },

  /** Resets boss audio playback. */
  _resetBossAudio() {
    try { this.BOSS_THEME_SOUND.pause(); this.BOSS_THEME_SOUND.currentTime = 0; } catch(e){}
    try { this.SPLASH_SOUND.pause(); this.SPLASH_SOUND.currentTime = 0; } catch(e){}
    try { this.BITE_SOUND.pause(); this.BITE_SOUND.currentTime = 0; } catch(e){}
  }
});