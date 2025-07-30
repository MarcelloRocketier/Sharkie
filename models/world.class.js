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
    new BackgroundObject('assets/img/3. Background/Layers/5. Water/D.png', 0),
    new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D.png', 0),
    new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D.png', 0),
    new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D.png', 0),
];
    ctx;
    canvas;
    keyboard;

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

        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.bubbles);
        this.addObjectsToMap(this.enemies);
        
        




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
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.hight);
    }
}