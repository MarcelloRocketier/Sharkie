/**
 * Class representing a game level
 * Holds all objects that vary per level, such as backgrounds, enemies, and collectibles
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
    level_end_x; // x position marking the end of the level

    /**
     * Constructor takes parameters from specific level definition files
     * Assigns them to this level instance's properties
     * @param {Array} backgroundObjects - Background elements for this level
     * @param {Array} coins - Coins placed in the level
     * @param {Array} life - Life pickups in the level
     * @param {Array} poison - Poison pickups available
     * @param {Array} enemies - Enemies present in this level
     * @param {Array} barriers - Barriers restricting movement
     * @param {number} level_end_x - X coordinate where level ends
     */
    constructor(backgroundObjects, coins, life, poison, enemies, barriers, level_end_x) {
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.life = life;
        this.poison = poison;
        this.enemies = enemies;
        this.barriers = barriers;
        this.level_end_x = level_end_x;
        this.getEndBoss();
    }

    /**
     * Finds and returns the EndBoss instance among enemies
     * @returns {EndBoss|undefined}
     */
    getEndBoss() {
        return this.enemies.find(e => e instanceof EndBoss);
    }
}