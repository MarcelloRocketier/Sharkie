/**
 * Project: Sharkie 2D Game
 * File: js/levels/level_2.js
 * Responsibility: Defines and initializes the second level – backgrounds, collectibles, enemies, barriers, and endpoint.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

/**
 * Level 2 configuration instance.
 * Contains backgrounds, coins, life pickups, poison pickups, enemies, barriers and the level end coordinate.
 * @type {Level}
 */
const level_2 = new Level(

    /**
     * Background objects for Level 2.
     * Each BackgroundObject(scene, section, index, levelSection):
     *  - scene: Identifier for background style (e.g., 'dark')
     *  - section: 1 or 2 (alternating background sections)
     *  - index: 0–4 (tile index in section)
     *  - levelSection: 0+ (horizontal section, each ~719px)
     */
    [
        new BackgroundObject('dark', 1, 0, 0),
        new BackgroundObject('dark', 1, 1, 0),
        new BackgroundObject('dark', 1, 2, 0),
        new BackgroundObject('dark', 1, 3, 0),
        new BackgroundObject('dark', 1, 4, 0),

        new BackgroundObject('dark', 2, 0, 1),
        new BackgroundObject('dark', 2, 1, 1),
        new BackgroundObject('dark', 2, 2, 1),
        new BackgroundObject('dark', 2, 3, 1),
        new BackgroundObject('dark', 2, 4, 1),

        new BackgroundObject('dark', 1, 0, 2),
        new BackgroundObject('dark', 1, 1, 2),
        new BackgroundObject('dark', 1, 2, 2),
        new BackgroundObject('dark', 1, 3, 2),
        new BackgroundObject('dark', 1, 4, 2),

        new BackgroundObject('dark', 2, 0, 3),
        new BackgroundObject('dark', 2, 1, 3),
        new BackgroundObject('dark', 2, 2, 3),
        new BackgroundObject('dark', 2, 3, 3),
        new BackgroundObject('dark', 2, 4, 3),

        new BackgroundObject('dark', 1, 0, 4),
        new BackgroundObject('dark', 1, 1, 4),
        new BackgroundObject('dark', 1, 2, 4),
        new BackgroundObject('dark', 1, 3, 4),
        new BackgroundObject('dark', 1, 4, 4)
    ],

    /**
     * Coin collectibles.
     * Each Coin(x, y) defines its position.
     */
    [
        new Coin(548, 252),
        new Coin(612, 180),
        new Coin(696, 128),
        new Coin(1188, 244),
        new Coin(1656, 20),
        new Coin(2168, 112)
    ],

    /**
     * Life collectibles to restore character health.
     * Each Life(x, y) defines its position.
     */
    [
        new Life(976, 52),
        new Life(2564, 412)
    ],

    /**
     * Poison collectibles for special attacks.
     * Each Poison(type, x, y) defines sprite type and position.
     */
    [
        new Poison('dark_right', 96, 412),
        new Poison('animated', 1128, 412),
        new Poison('dark_right', 1588, 404)
    ],

    /**
     * Enemy entities in Level 2.
     * - PufferFish(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
     * - JellyFishRegular(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
     * - JellyFishDangerous(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
     * - EndBoss(x, y, startX, startY)
     */
    [
        new JellyFishDangerous('pink', 400, 100, 'vertical', 100, 240, 0.5, 0),
        new PufferFish('orange', 600, 128, 'horizontal', 600, 1000, 1.5, 1),
        new JellyFishDangerous('green', 1172, 64, 'vertical', 64, 300, 2, 0),
        new PufferFish('red', 1420, 352, 'horizontal', 1420, 1644, 1.5, 1),
        new PufferFish('green', 1924, 184, 'horizontal', 1924, 2396, 2.5, 1),
        new JellyFishDangerous('pink', 2572, 52, 'vertical', 52, 332, 1.5, 0),
        new EndBoss(3000, 50, 3000, 50)
    ],

    /**
     * Barriers restricting movement.
     * Each instance defines coordinates and type.
     */
    [
        new BarrierRock(300, 290),
        new BarrierWall(1380, -250),
        new BarrierTunnelAbove(1800, 0),
        new BarrierTunnelBelow(1800, 290)
    ],

    /**
     * Horizontal coordinate at which Level 2 ends.
     */
    3000

);