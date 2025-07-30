class World { 

    character = new Character();
    enemies = [
        new fish(),
        new fish(),
        new fish(),
    ];
    bubbles = [
        new Bubble(),
    ];

    backgroundObjects = [
    new BackgroundObject('assets/img/3. Background/Layers/5. Water/D1.png', 0),
    new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D1.png', 0),
    new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D1.png', 0),
    new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D1.png', 0),
    new BackgroundObject('assets/img/3. Background/Layers/5. Water/D2.png', 720),
    new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D2.png', 720),
    new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D2.png', 720),
    new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D2.png', 720),
];
    ctx;
    canvas;
    keyboard;
    camara_x = 0; 

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas

        this.ctx.translate(this.camara_x, 0); // Move the camera

        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.bubbles);
        this.addObjectsToMap(this.enemies);
        
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
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.hight);
        if(mo.otherDirection) {
            mo.x = mo.x* -1; // Reset x position after flipping
            this.ctx.restore();
        }
    }
}