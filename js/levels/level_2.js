/**
 * Configuration and initialization of Level 2 in the Sharkie game.
 * Defines background layers, collectible items, enemies, barriers, and the level end position.
 * @type {Level}
 */
// Instantiate a new level object
const level_2 = new Level(

    /**
     * Background layers for Level 2.
     * Each BackgroundObject is defined by: scene, section (1|2), index (0–4), and levelSection (0+).
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
     * Coin collectibles with (x, y) positions.
     * @type {Coin[]}
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
     * Life pickups that restore character energy.
     * @type {Life[]}
     */
    [
        new Life(976, 52),
        new Life(2564, 412)
    ],

    /**
     * Poison collectibles used for special attacks.
     * @type {Poison[]}
     */
    [
        new Poison('dark_right', 96, 412),
        new Poison('animated', 1128, 412),
        new Poison('dark_right', 1588, 404)
    ],

    /**
     * Enemy entities for Level 2 with their movement parameters.
     * @type {(PufferFish|JellyFishRegular|JellyFishDangerous|EndBoss)[]}
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
     * Environmental barriers that restrict player/enemy movement.
     * @type {(BarrierTunnelAbove|BarrierTunnelBelow|BarrierRock|BarrierWall)[]}
     */
    [
        new BarrierRock(300, 290),
        new BarrierWall(1380, -250),
        new BarrierTunnelAbove(1800, 0),
        new BarrierTunnelBelow(1800, 290)
    ],

    /**
     * Level end position in pixels (x coordinate).
     * @type {number}
     */
    3000

);