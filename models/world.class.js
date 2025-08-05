/**
 * Spielwelt-Klasse
 * Hier werden alle Objekte des Spiels erstellt (Hintergründe, Charakter, Gegner, ...)
 * Zugriff auf Objekte über Konsole: world.<objekt>.<eigenschaft()/methode()>
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

        this.setWorld();
        this.draw();
        this.checkCollisions();

        if (mobileAndTabletCheck()) {
            this.setupMobileUI();
        }

        this.handleFullscreenCanvas();
        this.handleThemeSound();
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

    addToWorld(obj) {
        if (obj.imgMirrored) this.flipImage(obj);
        obj.draw(this.ctx);
        if (debugMode) obj.drawCollisionDetectionFrame(this.ctx);
        if (obj.imgMirrored) this.undoFlipImage(obj);
    }

    addObjectsToWorld(arr) {
        arr.forEach(obj => this.addToWorld(obj));
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    flipImage(obj) {
        this.ctx.save();
        this.ctx.translate(obj.width, 0);
        this.ctx.scale(-1, 1);
        obj.x = obj.x * -1;
    }

    undoFlipImage(obj) {
        obj.x = obj.x * -1;
        this.ctx.restore();
    }

    setupMobileUI() {
        const hide = id => document.getElementById(id)?.classList.add('d-none');
        const show = id => document.getElementById(id)?.classList.remove('d-none');

        ['game-title', 'canvas-frame-img', 'img-attribution'].forEach(hide);
        ['mobile-fullscreen-btn', 'mobile-mute-btn', 'mobile-close-btn', 'mobile-ctrl-left', 'mobile-ctrl-right'].forEach(show);

        document.getElementById('canvas-wrapper')?.classList.add('fullscreen');
        document.getElementById('fullscreen-container')?.classList.add('fullscreen');
        document.getElementById('canvas').style = 'width: 100%; height: 100%';

        toggleFullscreen();
    }

    handleFullscreenCanvas() {
        setInterval(() => {
            const canvas = document.getElementById('canvas');
            const fullMsg = document.getElementById('fullscreen-message');
            const landscapeMsg = document.getElementById('landscape-message');

            if (fullscreen && canvas) canvas.classList.add('fullscreen');
            else if (canvas) canvas.classList.remove('fullscreen');

            if (!mobileAndTabletCheck() && window.innerWidth <= 992) {
                fullMsg?.classList.remove('d-none');
                if (landscapeMsg) landscapeMsg.style = "opacity: 0";
            } else {
                fullMsg?.classList.add('d-none');
                if (landscapeMsg) landscapeMsg.style = "opacity: 1";
            }
        }, 1000 / 60);
    }

    handleThemeSound() {
        setInterval(() => {
            if (soundOn && !this.level.getEndBoss().endBossAlreadyTriggered && !levelEnded) {
                this.MAIN_SOUND.play();
                this.MAIN_SOUND.addEventListener('ended', function () {
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
            this.handleEnemyCollisions();
            this.handleBubbleCollisions();
            this.handleEndBossCollisions();
            this.handleCollectableCollisions();
        }, 200);
    }

    handleEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !enemy.isDead() && !this.character.isFinSlapping) {
                this.character.hit(enemy.attack);
                this.statusBarLife.setPercentage(this.character.energy, 'life', 'green');
                this.character.hitBy = enemy.constructor.name;
                if (enemy instanceof EndBoss) this.level.getEndBoss().isCollidingWithCharacter = true;
                if (debugLogStatements) console.log('Colliding with:', enemy);
            }

            if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof PufferFish) {
                enemy.hit(this.character.attack);
                enemy.stopMovement = true;
                enemy.floatAway(this.character.imgMirrored);
                if (debugLogStatements) console.log('Fin slap:', enemy);
            }
        });
    }

    handleBubbleCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.bubble instanceof Bubble && this.bubble.isColliding(enemy) && (enemy instanceof JellyFishRegular || enemy instanceof JellyFishDangerous)) {
                enemy.hit(this.bubble.attack);
                enemy.stopMovement = true;
                enemy.speed = 1;
                enemy.floatAwayUp();
                this.bubble = undefined;
            }
        });
    }

    handleEndBossCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof EndBoss) {
                enemy.hit(this.character.attack);
                this.statusBarEndBoss.setPercentage((enemy.energy / 200) * 100, 'life', 'orange');
            }

            if (this.bubble && this.bubble.isColliding(enemy) && enemy instanceof EndBoss) {
                enemy.hit(this.bubble.attack);
                this.statusBarEndBoss.setPercentage((enemy.energy / 200) * 100, 'life', 'orange');
                this.bubble = undefined;
            }
        });
    }

    handleCollectableCollisions() {
        this.level.coins.forEach(coin => {
            if (this.character.isColliding(coin)) {
                const index = this.level.coins.indexOf(coin);
                const total = this.level.coins.length + this.character.coins;
                this.character.coins++;
                this.statusBarCoins.setPercentage((this.character.coins / total) * 100, 'coins', 'green');
                this.level.coins.splice(index, 1);
            }
        });

        this.level.life.forEach(life => {
            if (this.character.isColliding(life)) {
                const index = this.level.life.indexOf(life);
                this.character.energy = Math.min(this.character.energy + (this.character.energy > 90 ? 5 : 10), 100);
                this.statusBarLife.setPercentage(this.character.energy, 'life', 'green');
                this.level.life.splice(index, 1);
            }
        });

        this.level.poison.forEach(poison => {
            if (this.character.isColliding(poison)) {
                const index = this.level.poison.indexOf(poison);
                this.level.totalPoison = this.level.poison.length + this.level.collectedPoison;
                this.character.poison++;
                this.statusBarPoison.setPercentage((this.character.poison / this.level.totalPoison) * 100, 'poison', 'green');
                this.level.poison.splice(index, 1);
                this.level.collectedPoison++;
            }
        });
    }
}