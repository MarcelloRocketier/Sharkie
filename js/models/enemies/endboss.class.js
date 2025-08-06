/**
 * Final enemy object
 */
class EndBoss extends MovableObject {
    world;
    width = 300;
    height = 300;
    energy = 100;
    attack = 20;
    speed = 8;
    endBossTriggered = false;
    endBossIntroduced = false;
    endBossAlreadyTriggered = false;
    isCollidingWithCharacter;
    triggerDistance = 500;
    wanderDistance = 300;
    waypoint1 = false;
    waypoint2 = false;
    waypoint3 = false;
    waypoint4 = false;
    waypoint5 = false;
    waypoint6 = false;
    waypoint7 = false;
    offset = {
        x: 15,
        y: 90,
        width: 20,
        height: 45
    }
    BOSS_THEME_SOUND = new Audio('./assets/audio/boss_theme.mp3');
    SPLASH_SOUND = new Audio('./assets/audio/splash.mp3');
    BITE_SOUND = new Audio('./assets/audio/bite.mp3');

    constructor(x, y, startX, startY) {
        super().loadImage(''); // Empty because EndBoss has introduce animation. Otherwise an image would be displayed permanently
        this.loadImages(ENDBOSS_IMAGES.FLOATING);
        this.loadImages(ENDBOSS_IMAGES.INTRODUCE);
        this.loadImages(ENDBOSS_IMAGES.HURT);
        this.loadImages(ENDBOSS_IMAGES.DEAD);
        this.loadImages(ENDBOSS_IMAGES.ATTACK);
        this.animate();
        this.x = x;
        this.y = y;
        this.startX = startX;
        this.startY = startY;
    }

    /**
     * Animate endboss
     */
    animate() {
        setInterval(() => {
            if (this.endBossIntroduced && !this.isHurt() && !this.isDead() && !this.isCollidingWithCharacter) {
                this.playAnimation(ENDBOSS_IMAGES.FLOATING, 1);

                if (!this.world.character.isDead()) {
                    this.aiMovement();
                } else {
                    this.BOSS_THEME_SOUND.pause();
                }
            } else if (this.isHurt() && !this.isDead()) {
                this.playAnimation(ENDBOSS_IMAGES.HURT, 1);
            } else if (this.isDead()) {
                this.playAnimation(ENDBOSS_IMAGES.DEAD, 0);
                endBossKilled = true;
                this.BOSS_THEME_SOUND.pause();
            } else if (this.endBossTriggered) {
                this.introduceEndBoss();
            } else if (this.isCollidingWithCharacter) {
                this.attackAnimation();
                this.playAnimation(ENDBOSS_IMAGES.ATTACK, 0);
            }
        }, 150)
    }

    /**
     * Autonomous motion sequence for EndBoss
     */
    aiMovement() {
        if (!this.waypoint1 && this.x > this.startX - this.wanderDistance) { // Move forward
            this.x -= this.speed * this.getRandomSpeedFactor(1.5, 3);

            if (this.x <= this.startX - this.wanderDistance) {
                this.waypoint1 = true;
                if (debugLogStatements) {
                    console.log('EndBoss reached waypoint1');
                }
            }
        } else if (this.waypoint1 && !this.waypoint2) { // Move back
            this.x += this.speed;

            if (this.x > this.startX) {
                this.waypoint2 = true;
                if (debugLogStatements) {
                    console.log('EndBoss reached waypoint2');
                }
            }
        } else if (this.waypoint2 && !this.waypoint3) { // Move down
            this.y += this.speed;

            if (this.y >= 150) {
                this.waypoint3 = true;
                if (debugLogStatements) {
                    console.log('EndBoss reached waypoint3');
                }
            }
        } else if (this.waypoint3 && !this.waypoint4) { // Move forward
            this.x -= this.speed * this.getRandomSpeedFactor(2.5, 3.5);

            if (this.x <= this.startX - this.wanderDistance) {
                this.waypoint4 = true;
                if (debugLogStatements) {
                    console.log('EndBoss reached waypoint4');
                }
            }
        } else if (this.waypoint4 && !this.waypoint5) { // Move back
            this.x += this.speed * this.getRandomSpeedFactor(2, 3.5);

            if (this.x > this.startX) {
                this.waypoint5 = true;
                if (debugLogStatements) {
                    console.log('EndBoss reached waypoint5');
                }
            }
        } else if (this.waypoint5 && !this.waypoint6) { // Move up
            this.y -= this.speed;

            if (this.y < 0) {
                this.waypoint6 = true;
                if (debugLogStatements) {
                    console.log('EndBoss reached waypoint6');
                }
            }
        } else if (this.waypoint6 && !this.waypoint7) { // Move forward
            this.x -= this.speed * this.getRandomSpeedFactor(2.5, 4.5);

            if (this.x <= this.startX - this.wanderDistance) {
                this.waypoint7 = true;
                if (debugLogStatements) {
                    console.log('EndBoss reached waypoint7');
                }
            }
        } else if (this.waypoint7) { // Move back
            this.x += this.speed;

            if (this.x > this.startX) {
                this.waypoint1 = false;
                this.waypoint2 = false;
                this.waypoint3 = false;
                this.waypoint4 = false;
                this.waypoint5 = false;
                this.waypoint6 = false;
                this.waypoint7 = false;

                if (debugLogStatements) {
                    console.log('EndBoss reached last waypoint');
                }
            }
        }
    }

    /**
     * Sets the boolean value isCollidingWithCharacter to true until the animation has finished playing once
     */
    attackAnimation() {
        if (!this.checkAlreadyRunning) {

            if (soundOn && !this.isDead() && !this.world.character.isDead()) {
                this.BITE_SOUND.currentTime = 0;
                this.BITE_SOUND.play();
            }

            this.currentImage = 0; // To start with the first img of the animation

            let spacePressed = setInterval(() => {
                this.isCollidingWithCharacter = true;
                this.checkAlreadyRunning = true;
            }, 100);

            setTimeout(() => {
                this.isCollidingWithCharacter = false;
                this.checkAlreadyRunning = false;
                clearInterval(spacePressed);
            }, 600);
        }
    }

    /**
     * EndBoss introduce animation
     */
    introduceEndBoss() {
        this.playAnimation(ENDBOSS_IMAGES.INTRODUCE, 0);
        this.endBossAlreadyTriggered = true;

        if (soundOn) {
            this.SPLASH_SOUND.play();
        }

        // Handle BOSS_THEME_SOUND
        // Check if soundOn is changed
        setInterval(() => {
            if (soundOn && !this.world.character.isDead() && !this.isDead()) {
                this.BOSS_THEME_SOUND.play();
                this.world.MAIN_SOUND.pause();

                this.BOSS_THEME_SOUND.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);
            } else {
                this.BOSS_THEME_SOUND.pause();
                this.BOSS_THEME_SOUND.currentTime = 0;
            }
        }, 1000 / 60)

        setTimeout(() => {
            this.endBossTriggered = false;
            this.endBossIntroduced = true;
        }, 1490); // Normally 1500ms => 10ms before the animation ends so that a smooth transition takes place
    }

    /**
     * Generates a random number between min and max
     * @param {int} min 
     * @param {int} max 
     * @returns int
     */
    getRandomSpeedFactor(min, max) {
        return Math.random() * (max - min) + min;
    }
}