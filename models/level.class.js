class Level {
    enemies;
    character;
    bubbles;
    backgroundObjects;
    level_end_x = 2200; 

    constructor(enemies, bubbles, backgroundObjects) {
        this.enemies = enemies;
        this.bubbles = bubbles;
        this.backgroundObjects = backgroundObjects;
    }
}