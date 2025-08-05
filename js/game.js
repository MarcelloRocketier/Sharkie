let canvas;
let world;
let keyboard = new Keyboard();
const level1 = createLevel1();
const level2 = createLevel2();
let currentLevel = level1;

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, currentLevel);    
}

window.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
        case 39: case 68: keyboard.RIGHT = true; break; // → / D
        case 37: case 65: keyboard.LEFT = true; break;  // ← / A
        case 38: case 87: keyboard.UP = true; break;    // ↑ / W
        case 40: case 83: keyboard.DOWN = true; break;  // ↓ / S
        case 32: keyboard.SPACE = true; break;          // Space
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.keyCode) {
        case 39: case 68: keyboard.RIGHT = false; break;
        case 37: case 65: keyboard.LEFT = false; break;
        case 38: case 87: keyboard.UP = false; break;
        case 40: case 83: keyboard.DOWN = false; break;
        case 32: keyboard.SPACE = false; break;
    }
});