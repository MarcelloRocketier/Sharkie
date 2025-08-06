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

    constructor(canvas, keyboard) {
        this.canvas = canvas; // Save canvas reference
        this.keyboard = keyboard; // Save keyboard reference

        // Get 2D rendering context of the canvas
        this.ctx = canvas.getContext('2d');
        this.draw();
        this.setWorld();
        this.checkCollisions();

        // Automatically switch to fullscreen on mobile/tablet devices
        if (mobileAndTabletCheck()) {
            // Hide desktop-only elements
            document.getElementById('game-title').classList.add('d-none');
            document.getElementById('canvas-frame-img').classList.add('d-none');
            document.getElementById('img-attribution').classList.add('d-none');

            // Show mobile controls and buttons
            document.getElementById('mobile-fullscreen-btn').classList.remove('d-none');
            document.getElementById('mobile-mute-btn').classList.remove('d-none');
            document.getElementById('mobile-close-btn').classList.remove('d-none');
            document.getElementById('mobile-ctrl-left').classList.remove('d-none');
            document.getElementById('mobile-ctrl-right').classList.remove('d-none');

            // Apply fullscreen styles to canvas container
            document.getElementById('canvas-wrapper').classList.add('fullscreen');
            document.getElementById('fullscreen-container').classList.add('fullscreen');
            document.getElementById('canvas').style = 'width: 100%; height: 100%';

            toggleFullscreen();
        }

        // Keep checking fullscreen mode and device orientation regularly
        setInterval(() => {
            if (fullscreen && document.getElementById('canvas')) {
                document.getElementById('canvas').classList.add('fullscreen');
            } else if (!fullscreen && document.getElementById('canvas')) {
                document.getElementById('canvas').classList.remove('fullscreen');
            }

            if (!mobileAndTabletCheck() && window.innerWidth <= 992) {
                if (document.getElementById('fullscreen-message')) {
                    document.getElementById('fullscreen-message').classList.remove('d-none');
                }
                document.getElementById('landscape-message').style = "opacity: 0";
            } else {
                if (document.getElementById('fullscreen-message')) {
                    document.getElementById('fullscreen-message').classList.add('d-none');
                }

                if (document.getElementById('landscape-message')) {
                    document.getElementById('landscape-message').style = "opacity: 1";
                }
            }
        }, 1000 / 60);

        // Control main theme playback based on game state and sound setting
        setInterval(() => {
            if (soundOn && !this.level.getEndBoss().endBossAlreadyTriggered && !levelEnded) {
                this.MAIN_SOUND.play();

                // Loop the main theme smoothly
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
     * Pass reference of this world to important sub-objects
     * This allows them to access the world and its properties, e.g. keyboard input
     */
    setWorld() {
        this.character.world = this;
        this.level.getEndBoss().world = this;
    }


    // ################################################### Core rendering functions ###################################################

    /**
     * Draw all game objects and UI elements on the canvas
     */
    draw() {
        this.clearCanvas(); // Clear previous frame

        // Apply camera offset (simulate movement)
        this.ctx.translate(this.camera_x, 0);

        // Render all game objects from current level
        this.addObjectsToWorld(this.level.backgroundObjects);
        this.addObjectsToWorld(this.level.coins);
        this.addObjectsToWorld(this.level.life);
        this.addObjectsToWorld(this.level.poison);
        this.addObjectsToWorld(this.level.enemies);
        this.addObjectsToWorld(this.level.barriers);

        // Always render the character
        this.addToWorld(this.character);

        // Render bubble if active
        if (this.bubble) {
            this.addToWorld(this.bubble);
        }

        // Fixed UI elements drawn on top and not affected by camera
        this.ctx.translate(-this.camera_x, 0);

        this.addToWorld(this.statusBarLife);
        this.addToWorld(this.statusBarCoins);
        this.addToWorld(this.statusBarPoison);
        if (this.level.getEndBoss().endBossIntroduced) {
            this.addToWorld(this.statusBarEndBoss);
        }

        this.ctx.translate(this.camera_x, 0);

        // Reset camera translation for next frame
        this.ctx.translate(-this.camera_x, 0);

        // Recursively call draw() 60 times per second via requestAnimationFrame
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    /**
     * Add one object to the canvas
     * @param {*} movableObject Instance of any class extending MovableObject
     */
    addToWorld(movableObject) {
        // Flip the image horizontally if needed
        if (movableObject.imgMirrored) {
            this.flipImage(movableObject);
        }

        movableObject.draw(this.ctx); // Render the object

        // No debug collision boxes rendered

        // Undo horizontal flip for following drawings
        if (movableObject.imgMirrored) {
            this.undoFlipImage(movableObject);
        }
    }

    /**
     * Add multiple objects from an array to the canvas
     * @param {*} objects Array of objects extending MovableObject
     */
    addObjectsToWorld(objects) {
        objects.forEach(object => {
            this.addToWorld(object);
        });
    }

    /**
     * Clear the entire canvas area
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Flip image horizontally for mirroring
     */
    flipImage(movableObject) {
        this.ctx.save(); // Save current drawing context
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    /**
     * Undo image flip transformation
     */
    undoFlipImage(movableObject) {
        movableObject.x = movableObject.x * -1;
        this.ctx.restore(); // Restore drawing context
    }

    /**
     * Continuously checks for collisions between the character and other objects
     */
    checkCollisions() {
        setInterval(() => {
            // Check collisions with enemies
            this.level.enemies.forEach(enemy => {
                if (this.character.isColliding(enemy) && !enemy.isDead() && !this.character.isFinSlapping) {
                    this.character.hit(enemy.attack);
                    this.statusBarLife.setPercentage(this.character.energy, this.statusBarLife.type, this.statusBarLife.color);

                    // Track which enemy hit the character for animation reasons
                    if (enemy instanceof PufferFish) {
                        this.character.hitBy = 'PufferFish';
                    } else if (enemy instanceof JellyFishRegular || enemy instanceof JellyFishDangerous) {
                        this.character.hitBy = 'JellyFish';
                    } else if (enemy instanceof EndBoss) {
                        this.character.hitBy = 'EndBoss';
                        this.level.getEndBoss().isCollidingWithCharacter = true;
                    }
                }
            });

            // Handle Fin Slap attack on PufferFish
            this.level.enemies.forEach(enemy => {
                if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof PufferFish) {
                    enemy.hit(this.character.attack);
                    enemy.stopMovement = true;
                    enemy.floatAway(this.character.imgMirrored);
                }
            });

            // Bubble collision with JellyFish
            this.level.enemies.forEach(enemy => {
                if (this.bubble) {
                    if ((this.bubble.isColliding(enemy) && enemy instanceof JellyFishRegular) || (this.bubble.isColliding(enemy) && enemy instanceof JellyFishDangerous)) {
                        enemy.hit(this.bubble.attack);
                        enemy.stopMovement = true;
                        enemy.speed = 1;
                        enemy.floatAwayUp();
                        this.bubble = undefined; // Bubble disappears after collision
                    }
                }
            });

            // Fin Slap attack on EndBoss
            this.level.enemies.forEach(enemy => {
                if (this.character.isColliding(enemy) && this.character.isFinSlapping && enemy instanceof EndBoss) {
                    enemy.hit(this.character.attack);
                    this.statusBarEndBoss.setPercentage((this.level.getEndBoss().energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
                }
            });

            // Bubble collision with EndBoss
            this.level.enemies.forEach(enemy => {
                if (this.bubble instanceof Bubble) {
                    if (this.bubble.isColliding(enemy) && enemy instanceof EndBoss) {
                        enemy.hit(this.bubble.attack);
                        this.statusBarEndBoss.setPercentage((this.level.getEndBoss().energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
                        this.bubble = undefined;
                    }
                } else if (this.bubble instanceof PoisonBubble) {
                    if (this.bubble.isColliding(enemy) && enemy instanceof EndBoss) {
                        enemy.hit(this.bubble.attack);
                        this.statusBarEndBoss.setPercentage((this.level.getEndBoss().energy / 200) * 100, this.statusBarEndBoss.type, this.statusBarEndBoss.color);
                        this.bubble = undefined;
                    }
                }
            });

            // Check collision with coins and update count & status bar
            this.level.coins.forEach(coin => {
                if (this.character.isColliding(coin)) {
                    let coinIndex = this.level.coins.indexOf(coin);
                    let totalCoins = this.level.coins.length + this.character.coins;
                    this.character.coins++;
                    this.statusBarCoins.setPercentage((this.character.coins / totalCoins) * 100, this.statusBarCoins.type, this.statusBarCoins.color);
                    this.level.coins.splice(coinIndex, 1);
                }
            });

            // Life pickups: increase character energy but never over max
            this.level.life.forEach(life => {
                if (this.character.isColliding(life)) {
                    let lifeIndex = this.level.life.indexOf(life);

                    if (this.character.energy < 100 && this.character.energy < 90) {
                        this.character.energy += 10;
                    } else if (this.character.energy < 100 && this.character.energy > 90) {
                        this.character.energy += 5;
                    }

                    this.statusBarLife.setPercentage(this.character.energy, this.statusBarLife.type, this.statusBarLife.color);
                    this.level.life.splice(lifeIndex, 1);
                }
            });

            // Poison pickups: increase poison count and update bar
            this.level.poison.forEach(poison => {
                if (this.character.isColliding(poison)) {
                    let poisonIndex = this.level.poison.indexOf(poison);
                    this.level.totalPoison = this.level.poison.length + this.level.collectedPoison;
                    this.character.poison++;
                    this.statusBarPoison.setPercentage((this.character.poison / this.level.totalPoison) * 100, this.statusBarPoison.type, this.statusBarPoison.color);
                    this.level.poison.splice(poisonIndex, 1);
                    this.level.collectedPoison += 1;
                }
            });
        }, 200);
    }
}