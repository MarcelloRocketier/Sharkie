class World { 

    character = new Character();
    level = level1; 
    ctx;
    canvas;
    keyboard;
    camara_x = 0; 

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
       
    }

    setWorld() {
    this.character.setWorld(this);
}

    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas

        this.ctx.translate(this.camara_x, 0); // Move the camera

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.bubbles);
        if (this.level.poisonObjects) this.addObjectsToMap(this.level.poisonObjects);
        this.addObjectsToMap(this.level.enemies);
        if (this.level.coins) this.addObjectsToMap(this.level.coins);
        
        this.ctx.translate(-this.camara_x, 0); 
        
        // Draw() wird immer wieder aufgerufen, um die Animation zu aktualisieren
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }


    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }


    addToMap(mo) {
        if(mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1); // Flip horizontally
            mo.x = mo.x* -1; // Adjust x position for flipped image
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if(mo.otherDirection) {
            mo.x = mo.x* -1; // Reset x position after flipping
            this.ctx.restore();
        }
    }
}