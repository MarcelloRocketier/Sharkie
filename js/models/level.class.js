/****
 * Project: Sharkie 2D Game
 * File: js/models/level.class.js
 * Responsibility: Defines the Level class – container for per-level objects and data.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

/**
 * Class representing a game level.
 * Holds per-level objects and gameplay-relevant data, such as backgrounds, enemies,
 * collectibles (coins, life, poison), barriers, and the end boundary.
 */
class Level {
    /** @type {BackgroundObject[]} Background elements for this level. */
    backgroundObjects = [];
    /** @type {Barrier[]} Barriers restricting movement in the level. */
    barriers = [];
    /** @type {Enemy[]} All enemies present in this level, including EndBoss. */
    enemies = [];
    /** @type {Coin[]} Coin collectibles in the level. */
    coins = [];
    /** @type {Life[]} Life pickups in the level. */
    life = [];
    /** @type {Poison[]} Poison pickups in the level. */
    poison = [];
    /** @type {number} Total number of poison collectibles in the level. */
    totalPoison = 0;
    /** @type {number} Number of poison collectibles collected so far. */
    collectedPoison = 0;
    /** @type {number} X coordinate marking the end of the level. */
    level_end_x = 0; 
    /** @type {EndBoss|null} Cached EndBoss reference for this level. */
    endBoss = null;

    /**
     * Constructs a Level instance with the specified assets and parameters.
     * @param {BackgroundObject[]} backgroundObjects - Background elements.
     * @param {Coin[]} coins - Coin collectibles.
     * @param {Life[]} life - Life pickups.
     * @param {Poison[]} poison - Poison collectibles.
     * @param {Enemy[]} enemies - Enemies including the EndBoss.
     * @param {Barrier[]} barriers - Environmental barriers.
     * @param {number} level_end_x - X coordinate where the level ends.
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
     * Returns the EndBoss instance for this level, if present.
     * @returns {EndBoss|undefined} The EndBoss enemy if found, otherwise undefined.
     */
    getEndBoss() {
        return this.enemies.find(e => e instanceof EndBoss);
    }
}