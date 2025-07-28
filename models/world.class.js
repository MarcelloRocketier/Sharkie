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
        new BackgrundObject('assets/img/3. Background/Layers/3.Fondo 1/D.png', 0),
    ];

    ctx;
    canvas;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas

        this.addToMap(this.character);
        this.addObjectsToMap(this.bubbles);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.backgroundObjects);
        




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