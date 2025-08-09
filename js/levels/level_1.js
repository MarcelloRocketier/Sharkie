/**
 * Defines and initializes the first level of the Sharkie game, specifying backgrounds, collectibles, enemies, barriers, and the level endpoint.
 */
// Creating a new instance of the level
/**
 * Level 1 configuration instance.
 * @type {Level}
 */
const level_1 = new Level(

    /**
     * Background objects for the scene.
     * Each BackgroundObject(scene, section, index, levelSection)
     * - scene: string identifier for background style
     * - section: 1 or 2 (alternating background sections)
     * - index: 0-4 (tile index in section)
     * - levelSection: 0+ (horizontal section, each 719px)
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
        new BackgroundObject('dark', 2, 4, 3)
    ],

    /**
     * Coins to collect, specified as Coin(x, y) with coordinates for position.
     */
    [
        new Coin(312, 192),
        new Coin(508, 88),
        new Coin(724, 28),
        new Coin(1068, 244),
        new Coin(1184, 184),
        new Coin(1292, 120),
        new Coin(1748, 276),
    ],

    /**
     * Life pickups, each as Life(x, y) specifying coordinates for position.
     */
    [
        new Life(544, 364),
        new Life(1552, 388),
        new Life(1988, 364)
    ],

    /**
     * Poison pickups, each as Poison(type, x, y) with type and coordinates.
     */
    [
        new Poison('animated', 308, 388),
        new Poison('animated', 952, 392),
        new Poison('dark_right', 1916, 400)
    ],

    /**
     * Enemies for the level.
     * - PufferFish(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
     * - JellyFishRegular(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
     * - EndBoss(x, y, startX, startY)
     * Each type uses type-specific constructor parameters.
     */
    [
        new PufferFish('red', 244, 24, 'horizontal', 244, 600, 1.3, 1),
        new PufferFish('green', 224, 380, 'horizontal', 224, 540, 1, 1),
        new JellyFishRegular('lila', 860, 16, 'vertical', 16, 280, 1.5, 0),
        new PufferFish('orange', 988, 20, 'horizontal', 988, 1296, 1.2, 1),
        new PufferFish('green', 1064, 312, 'horizontal', 1064, 1360, 1.8, 1),
        new JellyFishRegular('yellow', 1412, 52, 'vertical', 52, 250, 1.2, 0),
        new EndBoss(2000, 50, 2000, 50)
    ],

    /**
     * Barriers in the level, each as a type-specific barrier with coordinates.
     */
    [
        new BarrierWall(640, 120)
    ],

    /**
     * The horizontal coordinate at which the level ends.
     */
    2000

);