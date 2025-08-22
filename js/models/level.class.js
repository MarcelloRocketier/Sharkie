/**
 * Class representing a game level.
 * 
 * This class holds all per-level objects and gameplay-relevant data, such as background elements,
 * enemies, collectibles (coins, life, poison), barriers, and level boundaries.
 * It provides access to all items that can vary between levels, and methods to retrieve key objects.
 *
 * @property {BackgroundObject[]} backgroundObjects - Array of background elements for this level.
 * @property {Barrier[]} barriers - Array of barriers restricting movement in the level.
 * @property {Enemy[]} enemies - Array of all enemies present in this level, including EndBoss.
 * @property {Coin[]} coins - Array of coin collectibles placed in the level.
 * @property {Life[]} life - Array of life pickups in the level.
 * @property {Poison[]} poison - Array of poison pickups available in the level.
 * @property {number} totalPoison - Number of poison collectibles available in the level.
 * @property {number} collectedPoison - Number of poison collectibles collected so far.
 * @property {number} level_end_x - X coordinate marking the end of the level.
 */
class Level {
    backgroundObjects = [];
    barriers = [];
    enemies = [];
    coins = [];
    life = [];
    poison = [];
    totalPoison = 0;
    collectedPoison = 0;
    level_end_x = 0; // x position marking the end of the level
    endBoss = null; // cached EndBoss reference

    /**
     * Constructor takes parameters from specific level definition files
     * Assigns them to this level instance's properties.
     * @param {BackgroundObject[]} backgroundObjects - Background elements for this level.
     * @param {Coin[]} coins - Coins placed in the level.
     * @param {Life[]} life - Life pickups in the level.
     * @param {Poison[]} poison - Poison pickups available in the level.
     * @param {Enemy[]} enemies - Enemies present in this level.
     * @param {Barrier[]} barriers - Barriers restricting movement in the level.
     * @param {number} level_end_x - X coordinate where level ends.
     */
    constructor(backgroundObjects, coins, life, poison, enemies, barriers, level_end_x) {
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.life = life;
        this.poison = poison;
        this.enemies = enemies;
        this.barriers = barriers;
        this.level_end_x = level_end_x;
        this.endBoss = this.getEndBoss();
    }

    /**
     * Searches the enemies array and returns the EndBoss instance if found, otherwise returns undefined.
     * @returns {EndBoss|undefined} The EndBoss enemy if present in this level, otherwise undefined.
     */
    getEndBoss() {
        return this.enemies.find(e => e instanceof EndBoss);
    }
}