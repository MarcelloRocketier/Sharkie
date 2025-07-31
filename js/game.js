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
    if (e.keyCode == 39) keyboard.RIGHT = true;  // →
    if (e.keyCode == 37) keyboard.LEFT = true;   // ←
    if (e.keyCode == 38) keyboard.UP = true;     // ↑
    if (e.keyCode == 40) keyboard.DOWN = true;   // ↓
    if (e.keyCode == 32) keyboard.SPACE = true;  // Leertaste
    if (e.keyCode == 87) keyboard.UP = true;    // W
    if (e.keyCode == 65) keyboard.LEFT = true;  // A
    if (e.keyCode == 83) keyboard.DOWN = true;  // S
    if (e.keyCode == 68) keyboard.RIGHT = true; // D
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 87) keyboard.UP = false;
    if (e.keyCode == 65) keyboard.LEFT = false;
    if (e.keyCode == 83) keyboard.DOWN = false;
    if (e.keyCode == 68) keyboard.RIGHT = false;
});