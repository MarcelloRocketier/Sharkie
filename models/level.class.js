/**
 * Stores all level-specific objects
 * Each level has different backgrounds, enemies and items
 */
class Level {
    backgroundObjects;
    barriers;
    enemies;
    coins = 0;
    life = 0;
    poison = 0;
    totalPoison = 0;
    collectedPoison = 0;
    level_end_x;

    /**
     * Initializes all level objects
     * @param {Array} backgroundObjects 
     * @param {Array} coins 
     * @param {Array} life 
     * @param {Array} poison 
     * @param {Array} enemies 
     * @param {Array} barriers 
     * @param {number} level_end_x 
     */
    constructor(backgroundObjects, coins, life, poison, enemies, barriers, level_end_x) {
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.life = life;
        this.poison = poison;
        this.enemies = enemies;
        this.barriers = barriers;
        this.level_end_x = level_end_x;
        this.getEndBoss(); // Cache access to EndBoss if present
    }

    /**
     * Returns the EndBoss object if available
     */
    getEndBoss() {
        return this.enemies.find(e => e instanceof EndBoss);
    }
}