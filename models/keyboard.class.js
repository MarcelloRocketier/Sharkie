class Keyboard {
    static LEFT = 37;
    static RIGHT = 39;
    static UP = 38;
    static DOWN = 40;
    static SPACE = 32;

    static isDown(keyCode) {
        return this.pressed[keyCode];
    }

    static onKeydown(event) {
        this.pressed[event.keyCode] = true;
    }

    static onKeyup(event) {
        this.pressed[event.keyCode] = false;
    }
}