/**
 * Game world controller
 * Responsible for managing all game objects (background, player, enemies, etc.)
 */
class World {
    canvas;
    ctx;
    camera_x = 0;
    keyboard;
    bubble;
    MAIN_SOUND = new Audio('./assets/audio/main_theme.mp3');

    // ################################################### Object initialization ###################################################
    character = new Character();
    level = levels[currentLevel]; // Assign current level instance to this.level
    statusBarLife = new StatusBar('life', 'green', 100, 20, 0);
    statusBarCoins = new StatusBar('coins', 'green', 0, 20, 40);
    statusBarPoison = new StatusBar('poison', 'green', 0, 20, 80);
    statusBarEndBoss = new StatusBar('life', 'orange', 100, 460, 400);

    /**
     * Creates an instance of the game world.
     * Initializes canvas, keyboard, overlays, audio, and collision checks.
     * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
     * @param {Object} keyboard - The keyboard input handler instance.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas; // Save canvas reference
        this.keyboard = keyboard; // Save keyboard reference
        this.ctx = canvas.getContext('2d');
        this.draw();
        try {
            updateScreenMessages();
            window.addEventListener('resize', updateScreenMessages);
            window.addEventListener('orientationchange', updateScreenMessages);
        } catch (e) {} // fail-safe: do nothing if DOM not ready yet
        this.setWorld();
        this.checkCollisions();
        if (mobileAndTabletCheck()) {
            const gameTitle = document.getElementById('game-title');
            if (gameTitle) gameTitle.classList.add('d-none');
            const imgAttribution = document.getElementById('img-attribution');
            if (imgAttribution) imgAttribution.classList.add('d-none');
            const mobileFullscreenBtn = document.getElementById('mobile-fullscreen-btn');
            if (mobileFullscreenBtn) mobileFullscreenBtn.classList.remove('d-none');
            const mobileMuteBtn = document.getElementById('mobile-mute-btn');
            if (mobileMuteBtn) mobileMuteBtn.classList.remove('d-none');
            const mobileCloseBtn = document.getElementById('mobile-close-btn');
            if (mobileCloseBtn) mobileCloseBtn.classList.remove('d-none');
            const mobileCtrlLeft = document.getElementById('mobile-ctrl-left');
            if (mobileCtrlLeft) mobileCtrlLeft.classList.remove('d-none');
            const mobileCtrlRight = document.getElementById('mobile-ctrl-right');
            if (mobileCtrlRight) mobileCtrlRight.classList.remove('d-none');
            const canvasWrapper = document.getElementById('canvas-wrapper');
            if (canvasWrapper) canvasWrapper.classList.add('fullscreen');
            const fullscreenContainer = document.getElementById('fullscreen-container');
            if (fullscreenContainer) fullscreenContainer.classList.add('fullscreen');
            const canvas = document.getElementById('canvas');
            if (canvas) canvas.style = 'width: 100%; height: 100%';
            toggleFullscreen();
        }
        this.startAudioLoop();
    }

    /**
     * Pass reference of this world to important sub-objects
     * This allows them to access the world and its properties, e.g. keyboard input
     */
    setWorld() {
        this.character.world = this;
        this.level.getEndBoss().world = this;
    }

    // ################################################### Core rendering functions ###################################################

    /**
     * Draws all game objects and UI elements to the canvas.
     * Uses requestAnimationFrame to continuously render the scene.
     * @returns {void}
     */
    draw() {
        this.clearCanvas(); // Clear frame
        this.ctx.translate(this.camera_x, 0); // Apply camera offset (simulate movement)
        this.addObjectsToWorld(this.level.backgroundObjects);
        this.addObjectsToWorld(this.level.coins);
        this.addObjectsToWorld(this.level.life);
        this.addObjectsToWorld(this.level.poison);
        this.addObjectsToWorld(this.level.enemies);
        this.addObjectsToWorld(this.level.barriers);
        this.addToWorld(this.character); // Always render the character
        if (this.bubble) this.addToWorld(this.bubble); // Render bubble if active
        this.ctx.translate(-this.camera_x, 0); // Fixed UI elements drawn on top and not affected by camera
        this.addToWorld(this.statusBarLife);
        this.addToWorld(this.statusBarCoins);
        this.addToWorld(this.statusBarPoison);
        if (this.level.getEndBoss().endBossIntroduced) this.addToWorld(this.statusBarEndBoss);
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0); // Reset camera translation for next frame
        let self = this;
        requestAnimationFrame(function() { self.draw(); });
    }

    /**
     * Adds a single MovableObject to the rendering context.
     * Handles image mirroring if needed.
     * @param {MovableObject} movableObject - An object extending MovableObject to be drawn.
     * @returns {void}
     */
    addToWorld(movableObject) {
        if (movableObject.imgMirrored) this.flipImage(movableObject); // Flip the image horizontally if needed
        movableObject.draw(this.ctx); // Render the object
        if (movableObject.imgMirrored) this.undoFlipImage(movableObject); // Undo horizontal flip for following drawings
    }

    /**
     * Renders an array of MovableObject instances.
     * @param {MovableObject[]} objects - Array of movable objects to draw.
     * @returns {void}
     */
    addObjectsToWorld(objects) {
        objects.forEach(object => this.addToWorld(object));
    }

    /**
     * Clears the entire canvas.
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Flips the given object's image horizontally for mirrored rendering.
     * @param {MovableObject} movableObject - Object whose image will be flipped.
     * @returns {void}
     */
    flipImage(movableObject) {
        this.ctx.save(); // Save current drawing context
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    /**
     * Restores the rendering context after horizontal flipping.
     * @param {MovableObject} movableObject - Object whose flip will be undone.
     * @returns {void}
     */
    undoFlipImage(movableObject) {
        movableObject.x = movableObject.x * -1;
        this.ctx.restore(); // Restore drawing context
    }

    /**
     * Starts a lightweight loop that controls the main theme based on game state and sound setting.
     * Keeps constructor short and respects clean-code line limits.
     */
    startAudioLoop() {
        setInterval(() => {
            if (soundOn && !this.level.getEndBoss().endBossAlreadyTriggered && !levelEnded) {
                this.MAIN_SOUND.play();
                this.MAIN_SOUND.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);
            } else {
                this.MAIN_SOUND.pause();
                this.MAIN_SOUND.currentTime = 0;
            }
        }, 1000 / 60);
    }

    /**
     * Continuously checks for collisions between the character and other objects.
     * Split into small helpers to comply with the 14-lines-per-function rule.
     */
    checkCollisions() {
        setInterval(() => {
            this.handleEnemyDamageOnCharacter();
            this.handleFinSlapOnPuffer();
            this.handleBubbleVsJelly();
            this.handleFinSlapOnEndBoss();
            this.handleBubbleVsEndBoss();
            this.collectCoins();
            this.collectLife();
            this.collectPoison();
        }, 200);
    }

    /**
     * Applies enemy damage to the character on collision.
     * @returns {void}
     */
    handleEnemyDamageOnCharacter() {
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

    /**
     * Handles Fin Slap attack on PufferFish.
     * @returns {void}
     */
    handleFinSlapOnPuffer() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof PufferFish) {
                enemy.hit(this.character.attack);
                enemy.stopMovement = true;
                enemy.floatAway(this.character.imgMirrored);
            }
        });
    }

    /**
     * Handles bubble collision with JellyFish (regular & dangerous).
     * @returns {void}
     */
    handleBubbleVsJelly() {
        if (!this.bubble) return;
        this.level.enemies.forEach(enemy => {
            const isJelly = enemy instanceof JellyFishRegular || enemy instanceof JellyFishDangerous;
            if (isJelly && this.bubble.isColliding(enemy)) {
                enemy.hit(this.bubble.attack);
                enemy.stopMovement = true;
                enemy.speed = 1;
                enemy.floatAwayUp();
                this.bubble = undefined;
            }
        });
    }

    /**
     * Handles Fin Slap attack on EndBoss.
     * @returns {void}
     */
    handleFinSlapOnEndBoss() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof EndBoss) {
                enemy.hit(this.character.attack);
                this.statusBarEndBoss.setPercentage((this.level.getEndBoss().energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
            }
        });
    }

    /**
     * Handles bubble collision with EndBoss (both Bubble & PoisonBubble).
     * @returns {void}
     */
    handleBubbleVsEndBoss() {
        if (!this.bubble) return;
        this.level.enemies.forEach(enemy => {
            const isEndBoss = enemy instanceof EndBoss;
            if (isEndBoss && this.bubble.isColliding(enemy)) {
                enemy.hit(this.bubble.attack);
                this.statusBarEndBoss.setPercentage((this.level.getEndBoss().energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
                this.bubble = undefined;
            }
        });
    }

    /**
     * Collects coins and updates the status bar.
     * @returns {void}
     */
    collectCoins() {
        this.level.coins.forEach(coin => {
            if (this.character.isColliding(coin)) {
                const idx = this.level.coins.indexOf(coin);
                const total = this.level.coins.length + this.character.coins;
                this.character.coins++;
                this.statusBarCoins.setPercentage((this.character.coins / total) * 100, this.statusBarCoins.type, this.statusBarCoins.color);
                this.level.coins.splice(idx, 1);
            }
        });
    }

    /**
     * Collects life pick-ups and updates the status bar.
     * @returns {void}
     */
    collectLife() {
        this.level.life.forEach(life => {
            if (this.character.isColliding(life)) {
                const idx = this.level.life.indexOf(life);
                if (this.character.energy < 100 && this.character.energy < 90) this.character.energy += 10;
                else if (this.character.energy < 100 && this.character.energy > 90) this.character.energy += 5;
                this.statusBarLife.setPercentage(this.character.energy, this.statusBarLife.type, this.statusBarLife.color);
                this.level.life.splice(idx, 1);
            }
        });
    }

    /**
     * Collects poison pick-ups and updates the status bar.
     * @returns {void}
     */
    collectPoison() {
        this.level.poison.forEach(poison => {
            if (this.character.isColliding(poison)) {
                const idx = this.level.poison.indexOf(poison);
                this.level.totalPoison = this.level.poison.length + this.level.collectedPoison;
                this.character.poison++;
                this.statusBarPoison.setPercentage((this.character.poison / this.level.totalPoison) * 100, this.statusBarPoison.type, this.statusBarPoison.color);
                this.level.poison.splice(idx, 1);
                this.level.collectedPoison += 1;
            }
        });
    }
}

/**
 * Updates fullscreen and orientation overlay messages based on device state.
 * - Shows fullscreen message on desktop if viewport is narrow.
 * - Shows rotate (landscape) hint on mobile when in portrait.
 */
function updateScreenMessages() {
  const fullscreenMessage = document.getElementById('fullscreen-message');
  const landscapeMessage = document.getElementById('landscape-message');
  const isMobile = (typeof mobileAndTabletCheck === 'function') ? mobileAndTabletCheck() : false;
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  const isNarrow = window.innerWidth <= 992;
  if (fullscreenMessage) fullscreenMessage.classList.toggle('d-none', !( !isMobile && isNarrow ));
  if (landscapeMessage) landscapeMessage.classList.toggle('d-none', !( isMobile && isPortrait ));
  const rotateOverlay = document.getElementById('rotate-overlay');
  if (rotateOverlay) rotateOverlay.classList.toggle('d-none', !(isMobile && isPortrait));
}