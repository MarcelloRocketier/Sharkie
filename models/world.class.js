class World { 

    character = new Character();
    level = currentLevel;
    ctx;
    canvas;
    keyboard;
    camara_x = 0; 
    reachedLevel3 = false; // Flag to prevent multiple level 3 loads

    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.setWorld();
        this.draw();
    }

    setWorld() {
        this.character.setWorld(this);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.character.x >= 1438 && currentLevel === level1) {
            currentLevel = createLevel2();
            this.level = currentLevel;
            this.setWorld();
            this.character.x = 1200;
            this.camara_x = -this.character.x + 100;
        }

        if (this.character.x >= 2800 && !this.reachedLevel3) {
            this.reachedLevel3 = true;
            currentLevel = createLevel3();
            this.level = currentLevel;
            this.setWorld();
            this.character.x = 2800;
            this.camara_x = -this.character.x + 100;
        }

        this.ctx.translate(this.camara_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        if (this.level.obstacles) this.addObjectsToMap(this.level.obstacles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.bubbles);
        if (this.level.poisons) this.addObjectsToMap(this.level.poisons);

        this.updateObjects(this.level.enemies.filter(e => e.isEndboss));
        this.addObjectsToMap(this.level.enemies);

        if (this.level.coins) this.addObjectsToMap(this.level.coins);

        this.ctx.translate(-this.camara_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    updateObjects(objects) {
        objects.forEach(obj => {
            if (typeof obj.update === 'function') {
                obj.update();
            }
        });
    }

    addToMap(mo) {
        if (!mo.img || !mo.img.complete) return;

        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);

        if (mo.otherDirection) {
            mo.x = mo.x * -1;
            this.ctx.restore();
        }
    }
}