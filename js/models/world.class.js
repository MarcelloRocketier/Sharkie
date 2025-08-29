/**
 * Determines if an enemy is allowed to hurt the character.
 * Prevents double-hit during fin slap and ignores neutralized enemies.
 * @param {Character} char
 * @param {*} enemy
 * @returns {boolean}
 */
function _canEnemyHurtCharacter(char, enemy) {
  if (!char || !enemy) return false;
  if (typeof char.isDead === 'function' && char.isDead()) return false;
  if (typeof enemy.isDead === 'function' && enemy.isDead()) return false;
  if (char.isFinSlapping && typeof PufferFish !== 'undefined' && enemy instanceof PufferFish) return false;
  if (enemy.neutralized) return false;
  return true;
}
class World {
  /**
   * Game world controller. Owns the render loop, collision loops, audio loop, and HUD.
   * Provides lifecycle controls (start/stop/teardown) and bridges the level, character and UI.
   */
  canvas;
  ctx;
  camera_x = 0;
  keyboard;
  bubble;
  MAIN_SOUND = new Audio('./assets/audio/main_theme.mp3');
  intervals = [];
  animationFrameId = null;
  stopped = false;

  character = new Character();
  /** Always create a fresh level instance (no shared singletons) */
  level = (typeof getFreshLevel === 'function') ? getFreshLevel(currentLevel) : levels[currentLevel];

  statusBarLife   = new StatusBar('life',   'green', 100, 20,   -5);
  statusBarCoins  = new StatusBar('coins',  'green',   0, 240, -5);
  statusBarPoison = new StatusBar('poison', 'green',   0, 460, -5);
  statusBarEndBoss= new StatusBar('life',  'orange', 100, 460, 400);
  /**
   * Create a new World instance.
   * @param {HTMLCanvasElement} canvas - Rendering target.
   * @param {Keyboard} keyboard - Shared keyboard state.
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ctx = canvas.getContext('2d');

    this.stopped = false;

    this.setWorld();
    this.draw();
    this.checkCollisions();
    this.watchGameState();
    this.startAudioLoop();

    try {
      updateScreenMessages();
      window.addEventListener('resize', updateScreenMessages);
      window.addEventListener('orientationchange', updateScreenMessages);
    } catch (e) {}
  }
  /**
   * Injects the world reference into child objects (character, end boss).
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
    this.level.getEndBoss().world = this;
  }
  /**
   * Main render loop. Applies viewport scaling (Variant B), camera translation,
   * draws world layers and HUD, then schedules the next frame.
   * @returns {void}
   */
  draw() {
    if (this.stopped) return;
    this.clearCanvas();
    const { scaleX, scaleY } = this._computeScale(720, 480);
    this._beginScaledFrame(scaleX, scaleY);
    this._renderLevelObjects();
    this._renderHUD();
    this._endScaledFrame();
    this._scheduleNextFrame();
  }

  /**
   * Computes canvas scale factors relative to a design resolution.
   * @param {number} designWidth
   * @param {number} designHeight
   * @returns {{scaleX:number, scaleY:number}}
   */
  _computeScale(designWidth, designHeight) {
    const scaleX = this.canvas.width / designWidth;
    const scaleY = this.canvas.height / designHeight;
    return { scaleX, scaleY };
  }
  /**
   * Begins a scaled frame by saving context and applying transform.
   * @param {number} scaleX
   * @param {number} scaleY
   * @returns {void}
   */
  _beginScaledFrame(scaleX, scaleY) {
    this.ctx.save();
    this.ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  }
  /**
   * Renders world layers, character, and bubble respecting the camera.
   * @returns {void}
   */
  _renderLevelObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToWorld(this.level.backgroundObjects);
    this.addObjectsToWorld(this.level.coins);
    this.addObjectsToWorld(this.level.life);
    this.addObjectsToWorld(this.level.poison);
    this.addObjectsToWorld(this.level.enemies);
    this.addObjectsToWorld(this.level.barriers);
    this.addToWorld(this.character);
    if (this.bubble) this.addToWorld(this.bubble);
    this.ctx.translate(-this.camera_x, 0);
  }
  /**
   * Renders HUD/status bars and conditionally the end boss bar.
   * @returns {void}
   */
  _renderHUD() {
    this.addToWorld(this.statusBarLife);
    this.addToWorld(this.statusBarCoins);
    this.addToWorld(this.statusBarPoison);
    const ebForHud = (this.level && typeof this.level.getEndBoss === 'function') ? this.level.getEndBoss() : null;
    if (ebForHud && ebForHud.endBossIntroduced) this.addToWorld(this.statusBarEndBoss);
  }
  /**
   * Restores context after a scaled frame.
   * @returns {void}
   */
  _endScaledFrame() {
    this.ctx.restore();
  }
  /**
   * Schedules the next animation frame if not stopped.
   * @returns {void}
   */
  _scheduleNextFrame() {
    if (!this.stopped) {
      this.animationFrameId = requestAnimationFrame(() => this.draw());
    }
  }
  /**
   * Draws a single movable/renderable object, handling optional horizontal mirroring.
   * @param {*} mo - Object with a `draw(ctx)` method and optional `imgMirrored` flag.
   * @returns {void}
   */
  addToWorld(mo) {
    if (!mo || typeof mo.draw !== 'function') return;
    if (mo.imgMirrored) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.imgMirrored) this.undoFlipImage(mo);
  }
  /**
   * Draws a list of objects (null-safe).
   * @param {Array<*>} list - Objects to render.
   * @returns {void}
   */
  addObjectsToWorld(list) {
    if (!Array.isArray(list)) return;
    list.forEach((o) => {
      if (!o) return;
      this.addToWorld(o);
    });
  }
  /**
   * Clears the current frame on the canvas context.
   * @returns {void}
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  /**
   * Applies a horizontal flip transform before drawing a mirrored sprite.
   * @param {*} mo - Object providing `x` and `width`.
   * @returns {void}
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = -mo.x;
  }
  /**
   * Restores coordinates and canvas state after a mirrored draw.
   * @param {*} mo - Object previously flipped.
   * @returns {void}
   */
  undoFlipImage(mo) {
    mo.x = -mo.x;
    this.ctx.restore();
  }
  /**
   * Keeps background music in sync with world/boss state. Starts an interval and stores its id.
   * @returns {void}
   */
  startAudioLoop() {
    const id = setInterval(() => {
      if (this._shouldStopAudio()) return this._resetMainSound();
      const eb = this.level?.getEndBoss?.();
      if (this._shouldPlayMainSound(eb)) {
        this._playOrLoopMainSound();
      } else {
        this._resetMainSound();
      }
    }, 1000 / 30);
    this.intervals.push(id);
  }
  /** Checks if audio should stop due to world state. */
  _shouldStopAudio() {
    return this.stopped;
  }
  /** Pauses and resets the main soundtrack. */
  _resetMainSound() {
    if (!this.MAIN_SOUND) return;
    this.MAIN_SOUND.pause();
    this.MAIN_SOUND.currentTime = 0;
  }
  /**
   * Determines if main sound should play given end boss state and globals.
   * @param {EndBoss|undefined} eb
   * @returns {boolean}
   */
  _shouldPlayMainSound(eb) {
    return soundOn && (!eb || !eb.endBossAlreadyTriggered) && !levelEnded && !characterIsDead;
  }
  /** Plays main sound if paused and rebinds loop-on-end. */
  _playOrLoopMainSound() {
    if (this.MAIN_SOUND.paused) {
      this.MAIN_SOUND.play().catch(() => {});
      this.MAIN_SOUND.addEventListener('ended', function onEnd() {
        this.currentTime = 0; this.play().catch(() => {});
      }, { once: true });
    }
  }
  /**
   * Monitors global end/game-over flags and stops the world when necessary.
   * @returns {void}
   */
  watchGameState() {
    const id = setInterval(() => {
      if (this.stopped) return;
      if (levelEnded || characterIsDead) this.stop();
    }, 100);
    this.intervals.push(id);
  }
  /**
   * Collision orchestrator. Periodically runs all collision handlers and collectors.
   * Delegates to external collision handler functions for modularity.
   * @returns {void}
   */
  checkCollisions() {
    const id = setInterval(() => {
      if (this.stopped || levelEnded || characterIsDead) return;
      handleCharacterVsEnemies(this);
      this.handleFinSlapOnPuffer();
      handleBubbleVsJelly(this);
      this.handleFinSlapOnEndBoss();
      this.handleBubbleVsEndBoss();
      handlePickups(this);
      handleEndBossIntro(this);
    }, 200);
    this.intervals.push(id);
  }
  /**
   * Applies character fin-slap to PufferFish on collision and triggers their float-away behavior.
   * @returns {void}
   */
  handleFinSlapOnPuffer() {
    const enemies = (this.level && Array.isArray(this.level.enemies)) ? this.level.enemies : [];
    if (!this.character || typeof this.character.isColliding !== 'function') return;
    enemies.forEach((enemy) => {
      if (!enemy) return;
      if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof PufferFish) {
        // prevent mutual damage while slapping
        if (!_canEnemyHurtCharacter(this.character, enemy)) {
          if (typeof enemy.hit === 'function') enemy.hit(this.character.attack);
          enemy.stopMovement = true;
          if (typeof enemy.floatAway === 'function') enemy.floatAway(this.character.imgMirrored);
        }
      }
    });
  }
  /**
   * Applies character fin-slap to the EndBoss on collision and updates the boss HUD.
   * @returns {void}
   */
  handleFinSlapOnEndBoss() {
    if (this.stopped || levelEnded || characterIsDead) return;
    this.level.enemies.forEach(enemy => {
      if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof EndBoss) {
        if (!_canEnemyHurtCharacter(this.character, enemy)) {
          enemy.hit(this.character.attack);
          this.statusBarEndBoss.setPercentage((this.level.getEndBoss().energy / 200) * 100,
            this.statusBarEndBoss.type, this.statusBarEndBoss.color);
        }
      }
    });
  }
  /**
   * Handles projectile (bubble) vs. EndBoss collisions and updates the boss HUD on hit.
   * @returns {void}
   */
  handleBubbleVsEndBoss() {
    if (this.stopped || levelEnded || characterIsDead) return;
    if (!this._validBubble()) return;
    this._checkEndBossBubbleHits();
  }
  /** Validates bubble existence and collision function. */
  _validBubble() {
    return this.bubble && typeof this.bubble.isColliding === 'function';
  }
  /** Iterates enemies and applies bubble hits to EndBoss, updates HUD. */
  _checkEndBossBubbleHits() {
    const enemies = Array.isArray(this.level?.enemies) ? this.level.enemies : [];
    enemies.forEach(enemy => {
      if (!(enemy instanceof EndBoss)) return;
      if (this.bubble?.isColliding(enemy)) {
        if (typeof enemy.hit === 'function') enemy.hit(this.bubble.attack);
        if (this.statusBarEndBoss && typeof this.statusBarEndBoss.setPercentage === 'function') {
          const eb = this.level?.getEndBoss?.();
          if (eb) {
            this.statusBarEndBoss.setPercentage((eb.energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
          }
        }
        this.bubble = undefined;
      }
    });
  }
  /**
   * Idempotent stop of the world: cancels RAF, flips state and proceeds to teardown.
   * @returns {void}
   */
  stop() {
    if (this.stopped) return;
    this._cancelAnimationFrame();
    this.stopped = true;
    this.teardown();
  }
  /**
   * Cancels a scheduled animation frame if present.
   * @returns {void}
   */
  _cancelAnimationFrame() {
    if (this.animationFrameId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  /**
   * Cleans up timers, audio, listeners and transient references so a fresh World can start.
   * @returns {void}
   */
  teardown() {
    this._clearIntervals();
    this._cancelAnimationFrame();
    this._resetAudio();
    this._removeEventListeners();
    this.bubble = undefined;
    this.stopped = false;
  }
  /**
   * Clears all active intervals.
   * @returns {void}
   */
  _clearIntervals() {
    if (Array.isArray(this.intervals)) {
      this.intervals.forEach(id => clearInterval(id));
      this.intervals = [];
    }
  }
  /**
   * Resets audio playback to initial state.
   * @returns {void}
   */
  _resetAudio() {
    if (this.MAIN_SOUND && typeof this.MAIN_SOUND.pause === 'function') {
      this.MAIN_SOUND.pause();
      this.MAIN_SOUND.currentTime = 0;
    }
  }
  /**
   * Removes resize/orientation listeners for screen messages.
   * @returns {void}
   */
  _removeEventListeners() {
    try {
      window.removeEventListener('resize', updateScreenMessages);
      window.removeEventListener('orientationchange', updateScreenMessages);
    } catch (e) {}
  }
}
/**
 * Updates responsive overlay visibility (fullscreen/rotate hints) based on device/orientation.
 * @returns {void}
 */
function updateScreenMessages() {
  const fullscreenMessage = document.getElementById('fullscreen-message');
  const landscapeMessage  = document.getElementById('landscape-message');
  const isMobile   = (typeof mobileAndTabletCheck === 'function') ? mobileAndTabletCheck() : false;
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  const isNarrow   = window.innerWidth <= 992;
  if (fullscreenMessage) fullscreenMessage.classList.toggle('d-none', !(!isMobile && isNarrow));
  if (landscapeMessage)  landscapeMessage.classList.toggle('d-none', !(isMobile && isPortrait));
  const rotateOverlay = document.getElementById('rotate-overlay');
  if (rotateOverlay) rotateOverlay.classList.toggle('d-none', !(isMobile && isPortrait));
}