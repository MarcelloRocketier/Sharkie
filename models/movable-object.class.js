class MovableObject {
    x = 120;
    y = 180;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.15; // Default speed for movement
    otherDirection = false;

    // loadImage('img/test.png');
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image">;
        this.img.src = path;
    }

    /**
     * Loads an image from the given source path.
     * @param {string} arr - The source path of the image to load.
     */
    loadImages(arr) {
        arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
    });
    }

    moveRight() {
        console.log('Moving right');        
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed; // Move left
        }, 1000 / 60); // Move left at 60 FPS
    }

    playAnimation(images) {
       let i = this.currentImage % this.IMAGES_SWIM.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
    }
}