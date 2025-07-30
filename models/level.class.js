class Level {
    enemies;
    character;
    bubbles;
    backgroundObjects;
    coins;
    poisons;
    level_end_x = 2200; 

    constructor(enemies, bubbles, backgroundObjects, coins, poisons) {
    this.enemies = enemies;
    this.bubbles = bubbles;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.poisons = poisons; 
}
}