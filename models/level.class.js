class Level {
    enemies;
    character;
    bubbles;
    backgroundObjects;
    coins;
    poisons;
    obstacles;
    poisonObjects;
    level_end_x = 2200; 

    constructor(enemies, bubbles, backgroundObjects, coins, poisons, obstacles = []) {
        this.enemies = enemies;
        this.bubbles = bubbles;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.poisons = poisons;
        this.obstacles = obstacles;
    }
}