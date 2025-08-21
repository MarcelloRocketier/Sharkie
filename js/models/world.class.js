/**
 * Game world controller
 * Manages all game objects, rendering and collision loops.
 */
class World {
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
   * @param {HTMLCanvasElement} canvas
   * @param {Keyboard} keyboard
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ctx = canvas.getContext('2d');

    this.setWorld();
    this.draw();
    this.checkCollisions();
    this.watchGameState();
    this.startAudioLoop();

    // Responsive overlays (no fullscreen toggling here)
    try {
      updateScreenMessages();
      window.addEventListener('resize', updateScreenMessages);
      window.addEventListener('orientationchange', updateScreenMessages);
    } catch (e) {}
  }

  /** Pass world to sub-objects */
  setWorld() {
    this.character.world = this;
    this.level.getEndBoss().world = this;
  }

  /** Render loop */
  draw() {
    if (this.stopped) return;
    this.clearCanvas();

    // Responsive scaling (Variant B)
    const DESIGN_WIDTH = 720;
    const DESIGN_HEIGHT = 480;
    const scaleX = this.canvas.width / DESIGN_WIDTH;
    const scaleY = this.canvas.height / DESIGN_HEIGHT;

    this.ctx.save();
    this.ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

    // World draw with camera
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

    // HUD
    this.addToWorld(this.statusBarLife);
    this.addToWorld(this.statusBarCoins);
    this.addToWorld(this.statusBarPoison);
    if (this.level.getEndBoss().endBossIntroduced) {
      this.addToWorld(this.statusBarEndBoss);
    }

    this.ctx.restore();

    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  /** Draw one object, handle mirror */
  addToWorld(mo) {
    if (mo.imgMirrored) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.imgMirrored) this.undoFlipImage(mo);
  }

  /** Draw list of objects */
  addObjectsToWorld(list) {
    list.forEach(o => this.addToWorld(o));
  }

  /** Clear frame */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Mirror helpers */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = -mo.x;
  }
  undoFlipImage(mo) {
    mo.x = -mo.x;
    this.ctx.restore();
  }

  /** Keep music state in sync with game flags */
  startAudioLoop() {
    const id = setInterval(() => {
      if (this.stopped) {
        this.MAIN_SOUND.pause();
        this.MAIN_SOUND.currentTime = 0;
        return;
      }
      const eb = this.level.getEndBoss();
      const canPlay = soundOn && !eb.endBossAlreadyTriggered && !levelEnded && !characterIsDead;
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

  /** Periodically stop world when end/game-over flags are set */
  watchGameState() {
    const id = setInterval(() => {
      if (this.stopped) return;
      if (levelEnded || characterIsDead) this.stop();
    }, 100);
    this.intervals.push(id);
  }

  /** Collisions main loop (thin orchestrator) */
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

  handleEnemyDamageOnCharacter() {
    if (this.stopped || levelEnded || characterIsDead) return;
    this.level.enemies.forEach(enemy => {
      if (this.character.isColliding(enemy) && !enemy.isDead() && !this.character.isFinSlapping) {
        this.character.hit(enemy.attack);
        this.statusBarLife.setPercentage(this.character.energy, this.statusBarLife.type, this.statusBarLife.color);
        if (enemy instanceof PufferFish) this.character.hitBy = 'PufferFish';
        else if (enemy instanceof JellyFishRegular || enemy instanceof JellyFishDangerous) this.character.hitBy = 'JellyFish';
        else if (enemy instanceof EndBoss) {
          this.character.hitBy = 'EndBoss';
          this.level.getEndBoss().isCollidingWithCharacter = true;
        }
      }
    });
  }

  handleFinSlapOnPuffer() {
    this.level.enemies.forEach(enemy => {
      if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof PufferFish) {
        enemy.hit(this.character.attack);
        enemy.stopMovement = true;
        enemy.floatAway(this.character.imgMirrored);
      }
    });
  }

  handleBubbleVsJelly() {
    // Null-safe bubble vs jellyfish collision handling
    const bubble = this.bubble;
    const enemies = (this.level && Array.isArray(this.level.enemies)) ? this.level.enemies : [];

    // if no bubble or bubble cannot collide, stop early
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

  handleFinSlapOnEndBoss() {
    if (this.stopped || levelEnded || characterIsDead) return;
    this.level.enemies.forEach(enemy => {
      if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof EndBoss) {
        enemy.hit(this.character.attack);
        this.statusBarEndBoss.setPercentage((this.level.getEndBoss().energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
      }
    });
  }

  handleBubbleVsEndBoss() {
    if (this.stopped || levelEnded || characterIsDead) return;
    if (!this.bubble) return;
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof EndBoss && this.bubble.isColliding(enemy)) {
        enemy.hit(this.bubble.attack);
        this.statusBarEndBoss.setPercentage((this.level.getEndBoss().energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
        this.bubble = undefined;
      }
    });
  }

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

  /** Idempotent stop */
  stop() {
    if (this.stopped) return;
    this.stopped = true;
    this.teardown();
  }

  /** Cleanup loops, audio and listeners */
  teardown() {
    this.intervals.forEach(id => clearInterval(id));
    this.intervals = [];
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.MAIN_SOUND.pause();
    this.MAIN_SOUND.currentTime = 0;
    try {
      window.removeEventListener('resize', updateScreenMessages);
      window.removeEventListener('orientationchange', updateScreenMessages);
    } catch (e) {}
  }
}

/**
 * Overlay state updater (fullscreen/orientation hints)
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