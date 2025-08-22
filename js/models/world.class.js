/**
 * Project: Sharkie 2D Game
 * File: js/models/world.class.js
 * Responsibility: Orchestrates the game world – manages objects, rendering, collisions, audio, and lifecycle.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */
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

  statusBarLife   = new StatusBar('life',   'green', 100, 20,   0);
  statusBarCoins  = new StatusBar('coins',  'green',   0, 20,  40);
  statusBarPoison = new StatusBar('poison', 'green',   0, 20,  80);
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

    const DESIGN_WIDTH = 720;
    const DESIGN_HEIGHT = 480;
    const scaleX = this.canvas.width / DESIGN_WIDTH;
    const scaleY = this.canvas.height / DESIGN_HEIGHT;

    this.ctx.save();
    this.ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

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

    this.addToWorld(this.statusBarLife);
    this.addToWorld(this.statusBarCoins);
    this.addToWorld(this.statusBarPoison);
    const ebForHud = (this.level && typeof this.level.getEndBoss === 'function') ? this.level.getEndBoss() : null;
    if (ebForHud && ebForHud.endBossIntroduced) {
      this.addToWorld(this.statusBarEndBoss);
    }

    this.ctx.restore();

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
      if (this.stopped) {
        this.MAIN_SOUND.pause();
        this.MAIN_SOUND.currentTime = 0;
        return;
      }
      const eb = (this.level && typeof this.level.getEndBoss === 'function') ? this.level.getEndBoss() : null;
      const canPlay = soundOn && (!eb || !eb.endBossAlreadyTriggered) && !levelEnded && !characterIsDead;
      if (canPlay) {
        if (this.MAIN_SOUND.paused) {
          this.MAIN_SOUND.play().catch(() => {});
          this.MAIN_SOUND.addEventListener('ended', function onEnd() {
            this.currentTime = 0; this.play().catch(() => {});
          }, { once: true });
        }
      } else {
        this.MAIN_SOUND.pause();
        this.MAIN_SOUND.currentTime = 0;
      }
    }, 1000 / 30);
    this.intervals.push(id);
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
   * @returns {void}
   */
  checkCollisions() {
    const id = setInterval(() => {
      if (this.stopped || levelEnded || characterIsDead) return;
      this.handleEnemyDamageOnCharacter();
      this.handleFinSlapOnPuffer();
      if (this.level) this.handleBubbleVsJelly();
      this.handleFinSlapOnEndBoss();
      this.handleBubbleVsEndBoss();
      this.collectCoins();
      this.collectLife();
      this.collectPoison();
    }, 200);
    this.intervals.push(id);
  }

  /**
   * Handles enemy damage applied to the character when colliding (unless fin-slapping).
   * Updates life HUD and sets `hitBy` hints for feedback.
   * @returns {void}
   */
  handleEnemyDamageOnCharacter() {
    if (this.stopped || levelEnded || characterIsDead) return;
    if (!this.character || typeof this.character.isColliding !== 'function') return;
    const enemies = (this.level && Array.isArray(this.level.enemies)) ? this.level.enemies : [];

    enemies.forEach((enemy) => {
      if (!enemy || typeof enemy.isDead !== 'function') return;
      if (typeof this.character.isFinSlapping === 'undefined') this.character.isFinSlapping = false;

      if (this.character.isColliding(enemy) && !enemy.isDead() && !this.character.isFinSlapping) {
        if (typeof this.character.hit === 'function') this.character.hit(enemy.attack);
        if (this.statusBarLife && typeof this.statusBarLife.setPercentage === 'function') {
          this.statusBarLife.setPercentage(this.character.energy, this.statusBarLife.type, this.statusBarLife.color);
        }
        if (enemy instanceof PufferFish) this.character.hitBy = 'PufferFish';
        else if (enemy instanceof JellyFishRegular || enemy instanceof JellyFishDangerous) this.character.hitBy = 'JellyFish';
        else if (enemy instanceof EndBoss) {
          this.character.hitBy = 'EndBoss';
          if (this.level && typeof this.level.getEndBoss === 'function') {
            this.level.getEndBoss().isCollidingWithCharacter = true;
          }
        }
      }
    });
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
        if (typeof enemy.hit === 'function') enemy.hit(this.character.attack);
        enemy.stopMovement = true;
        if (typeof enemy.floatAway === 'function') enemy.floatAway(this.character.imgMirrored);
      }
    });
  }

  /**
   * Handles projectile (bubble) vs. jellyfish collisions. Null-safe and removes the bubble on hit.
   * @returns {void}
   */
  handleBubbleVsJelly() {
    const bubble = this.bubble;
    const enemies = (this.level && Array.isArray(this.level.enemies)) ? this.level.enemies : [];

    if (!bubble || bubble.markedForDeletion || typeof bubble.isColliding !== 'function') {
      return;
    }

    enemies.forEach((enemy) => {
      if (!enemy) return;
      const isJelly = (enemy instanceof JellyFishRegular) || (enemy instanceof JellyFishDangerous);
      if (!isJelly) return;
      if (typeof enemy.isColliding !== 'function') return;

      if (bubble.isColliding(enemy)) {
        if (typeof enemy.hit === 'function') enemy.hit(bubble.attack);
        enemy.stopMovement = true;
        enemy.speed = 1;
        if (typeof enemy.floatAwayUp === 'function') enemy.floatAwayUp();
        if (typeof bubble.pop === 'function') bubble.pop();
        this.bubble = undefined;
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
        enemy.hit(this.character.attack);
        this.statusBarEndBoss.setPercentage((this.level.getEndBoss().energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
      }
    });
  }

  /**
   * Handles projectile (bubble) vs. EndBoss collisions and updates the boss HUD on hit.
   * @returns {void}
   */
  handleBubbleVsEndBoss() {
    if (this.stopped || levelEnded || characterIsDead) return;
    const bubble = this.bubble;
    if (!bubble || typeof bubble.isColliding !== 'function') return;

    const enemies = (this.level && Array.isArray(this.level.enemies)) ? this.level.enemies : [];
    enemies.forEach((enemy) => {
      if (!(enemy instanceof EndBoss)) return;
      if (!bubble || typeof bubble.isColliding !== 'function') return;
      if (bubble.isColliding(enemy)) {
        if (typeof enemy.hit === 'function') enemy.hit(bubble.attack);
        if (this.statusBarEndBoss && typeof this.statusBarEndBoss.setPercentage === 'function' && this.level && typeof this.level.getEndBoss === 'function') {
          this.statusBarEndBoss.setPercentage((this.level.getEndBoss().energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
        }
        this.bubble = undefined;
      }
    });
  }

  /**
   * Collects coin items, updates character counters and the coin status bar.
   * @returns {void}
   */
  collectCoins() {
    this.level.coins.slice().forEach(coin => {
      if (this.character.isColliding(coin)) {
        const total = this.level.coins.length + this.character.coins;
        this.character.coins++;
        this.statusBarCoins.setPercentage((this.character.coins / total) * 100, this.statusBarCoins.type, this.statusBarCoins.color);
        this.level.coins.splice(this.level.coins.indexOf(coin), 1);
      }
    });
  }

  /**
   * Collects life items and updates the life status bar.
   * @returns {void}
   */
  collectLife() {
    this.level.life.slice().forEach(life => {
      if (this.character.isColliding(life)) {
        if (this.character.energy < 90) this.character.energy += 10;
        else if (this.character.energy < 100) this.character.energy += 5;
        this.statusBarLife.setPercentage(this.character.energy, this.statusBarLife.type, this.statusBarLife.color);
        this.level.life.splice(this.level.life.indexOf(life), 1);
      }
    });
  }

  /**
   * Collects poison items, updates counters and poison status bar.
   * @returns {void}
   */
  collectPoison() {
    this.level.poison.slice().forEach(poison => {
      if (this.character.isColliding(poison)) {
        this.level.totalPoison = this.level.poison.length + this.level.collectedPoison;
        this.character.poison++;
        this.statusBarPoison.setPercentage((this.character.poison / this.level.totalPoison) * 100, this.statusBarPoison.type, this.statusBarPoison.color);
        this.level.poison.splice(this.level.poison.indexOf(poison), 1);
        this.level.collectedPoison += 1;
      }
    });
  }

  /**
   * Idempotent stop of the world: cancels RAF, flips state and proceeds to teardown.
   * @returns {void}
   */
  stop() {
    if (this.stopped) return;
    console.log('[World] stop() called');
    if (this.animationFrameId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.stopped = true;
    this.teardown();
  }

  /**
   * Cleans up timers, audio, listeners and transient references so a fresh World can start.
   * @returns {void}
   */
  teardown() {
    console.log('[World] teardown() called');
    if (Array.isArray(this.intervals)) {
      this.intervals.forEach(id => clearInterval(id));
      this.intervals = [];
    }
    if (this.animationFrameId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.MAIN_SOUND && typeof this.MAIN_SOUND.pause === 'function') {
      this.MAIN_SOUND.pause();
      this.MAIN_SOUND.currentTime = 0;
    }
    try {
      window.removeEventListener('resize', updateScreenMessages);
      window.removeEventListener('orientationchange', updateScreenMessages);
    } catch (e) {}
    this.bubble = undefined;
    this.stopped = false;
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