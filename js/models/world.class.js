/**
 * The entire game world – manages all rendered objects.
 */
class World {
    canvas;
    ctx;
    camera_x = 0;
    keyboard;
    bubble;
    MAIN_SOUND = new Audio('./assets/audio/main_theme.mp3');

    character = new Character();
    levelDesignHelper = new LevelDesignHelper();
    level = levels[currentLevel];
    statusBarLife = new StatusBar('life', 'green', 100, 20, 0);
    statusBarCoins = new StatusBar('coins', 'green', 0, 20, 40);
    statusBarPoison = new StatusBar('poison', 'green', 0, 20, 80);
    statusBarEndBoss = new StatusBar('life', 'orange', 100, 460, 400);

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.ctx = canvas.getContext('2d');

        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.setupMobileView();
        this.observeFullscreen();
        this.handleBackgroundSound();
    }

    setWorld() {
        this.character.world = this;
        this.levelDesignHelper.world = this;
        this.level.getEndBoss().world = this;
    }

    draw() {
        this.clearCanvas();
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToWorld(this.level.backgroundObjects);
        this.addObjectsToWorld(this.level.coins);
        this.addObjectsToWorld(this.level.life);
        this.addObjectsToWorld(this.level.poison);
        this.addObjectsToWorld(this.level.enemies);
        this.addObjectsToWorld(this.level.barriers);

        if (debugLevelDesignHelper) {
            this.addToWorld(this.levelDesignHelper);
        } else {
            this.addToWorld(this.character);
        }

        if (this.bubble) {
            this.addToWorld(this.bubble);
        }

        this.ctx.translate(-this.camera_x, 0);

        this.addToWorld(this.statusBarLife);
        this.addToWorld(this.statusBarCoins);
        this.addToWorld(this.statusBarPoison);
        if (this.level.getEndBoss().endBossIntroduced) {
            this.addToWorld(this.statusBarEndBoss);
        }

        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame(() => this.draw());
    }

    addToWorld(movableObject) {
        if (movableObject.imgMirrored) {
            this.flipImage(movableObject);
        }

        movableObject.draw(this.ctx);

        if (debugMode) {
            movableObject.drawCollisionDetectionFrame(this.ctx);
        }

        if (movableObject.imgMirrored) {
            this.undoFlipImage(movableObject);
        }
    }

    addObjectsToWorld(objects) {
        objects.forEach(obj => this.addToWorld(obj));
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x *= -1;
    }

    undoFlipImage(movableObject) {
        movableObject.x *= -1;
        this.ctx.restore();
    }

    setupMobileView() {
        if (!mobileAndTabletCheck()) return;

        const hide = id => document.getElementById(id)?.classList.add('d-none');
        const show = id => document.getElementById(id)?.classList.remove('d-none');

        hide('game-title');
        hide('canvas-frame-img');
        hide('img-attribution');

        show('mobile-fullscreen-btn');
        show('mobile-mute-btn');
        show('mobile-close-btn');
        show('mobile-ctrl-left');
        show('mobile-ctrl-right');

        document.getElementById('canvas-wrapper')?.classList.add('fullscreen');
        document.getElementById('fullscreen-container')?.classList.add('fullscreen');
        const canvas = document.getElementById('canvas');
        if (canvas) canvas.style = 'width: 100%; height: 100%';

        toggleFullscreen();
    }

    observeFullscreen() {
        setInterval(() => {
            const canvas = document.getElementById('canvas');
            const fullscreenMessage = document.getElementById('fullscreen-message');
            const landscapeMessage = document.getElementById('landscape-message');

            if (fullscreen && canvas) {
                canvas.classList.add('fullscreen');
            } else if (!fullscreen && canvas) {
                canvas.classList.remove('fullscreen');
            }

            if (!mobileAndTabletCheck() && window.innerWidth <= 992) {
                fullscreenMessage?.classList.remove('d-none');
                if (landscapeMessage) landscapeMessage.style = 'opacity: 0';
            } else {
                fullscreenMessage?.classList.add('d-none');
                if (landscapeMessage) landscapeMessage.style = 'opacity: 1';
            }
        }, 1000 / 60);
    }

    handleBackgroundSound() {
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

    checkCollisions() {
        setInterval(() => {
            this.checkEnemyCollisions();
            this.checkCoinCollisions();
            this.checkLifeCollisions();
            this.checkPoisonCollisions();
        }, 200);
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !enemy.isDead() && !this.character.isFinSlapping) {
                this.character.hit(enemy.attack);
                this.statusBarLife.setPercentage(this.character.energy, this.statusBarLife.type, this.statusBarLife.color);
                if (enemy instanceof PufferFish) this.character.hitBy = 'PufferFish';
                if (enemy instanceof JellyFishRegular || enemy instanceof JellyFishDangerous) this.character.hitBy = 'JellyFish';
                if (enemy instanceof EndBoss) {
                    this.character.hitBy = 'EndBoss';
                    this.level.getEndBoss().isCollidingWithCharacter = true;
                }
            }

            if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof PufferFish) {
                enemy.hit(this.character.attack);
                enemy.stopMovement = true;
                enemy.floatAway(this.character.imgMirrored);
            }

            if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof EndBoss) {
                enemy.hit(this.character.attack);
                this.statusBarEndBoss.setPercentage((enemy.energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
            }

            if (this.bubble && this.bubble.isColliding(enemy)) {
                if (enemy instanceof JellyFishRegular || enemy instanceof JellyFishDangerous) {
                    enemy.hit(this.bubble.attack);
                    enemy.stopMovement = true;
                    enemy.speed = 1;
                    enemy.floatAwayUp();
                    this.bubble = undefined;
                }
                if (enemy instanceof EndBoss) {
                    enemy.hit(this.bubble.attack);
                    this.statusBarEndBoss.setPercentage((enemy.energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
                    this.bubble = undefined;
                }
            }
        });
    }

    checkCoinCollisions() {
        this.level.coins.forEach(coin => {
            if (this.character.isColliding(coin)) {
                let index = this.level.coins.indexOf(coin);
                let total = this.level.coins.length + this.character.coins;
                this.character.coins++;
                this.statusBarCoins.setPercentage((this.character.coins / total) * 100, this.statusBarCoins.type, this.statusBarCoins.color);
                this.level.coins.splice(index, 1);
            }
        });
    }

    checkLifeCollisions() {
        this.level.life.forEach(life => {
            if (this.character.isColliding(life)) {
                let index = this.level.life.indexOf(life);
                this.character.energy = Math.min(100, this.character.energy + (this.character.energy < 90 ? 10 : 5));
                this.statusBarLife.setPercentage(this.character.energy, this.statusBarLife.type, this.statusBarLife.color);
                this.level.life.splice(index, 1);
            }
        });
    }

    checkPoisonCollisions() {
        this.level.poison.forEach(poison => {
            if (this.character.isColliding(poison)) {
                let index = this.level.poison.indexOf(poison);
                this.level.totalPoison = this.level.poison.length + this.level.collectedPoison;
                this.character.poison++;
                this.level.collectedPoison++;
                this.statusBarPoison.setPercentage((this.character.poison / this.level.totalPoison) * 100, this.statusBarPoison.type, this.statusBarPoison.color);
                this.level.poison.splice(index, 1);
            }
        });
    }
}