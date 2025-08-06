// Creating a new instance of the level
const level_1 = new Level(

    // ############################################### Background objects ###############################################
    // ### Instantiates BackgroundObject(scene, section, index, levelSection)
    // ##################################################################################################################
    // ### section: 1 or 2 (Alternates, starts with 1)
    // ### index: from 0 to 4 (increments upwards)
    // ### levelSection: 0 to x (each section is 719px long, ascending)
    // ##################################################################################################################

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

    // ############################################### Coins ###############################################
    // ### Instantiate new Coin(x, y)
    // #####################################################################################################
    // ### x and y specify position coordinates
    // #####################################################################################################

    [
        new Coin(312, 192),
        new Coin(508, 88),
        new Coin(724, 28),
        new Coin(1068, 244),
        new Coin(1184, 184),
        new Coin(1292, 120),
        new Coin(1748, 276),
    ],

    // ############################################### Life pickups ###############################################
    // ### Instantiate new Life(x, y)
    // ####################################################################################################
    // ### x and y are the coordinates
    // ####################################################################################################

    [
        new Life(544, 364),
        new Life(1552, 388),
        new Life(1988, 364)
    ],

    // ############################################### Poison pickups ###############################################
    // ### Instantiate new Poison(type, x, y)
    // ######################################################################################################
    // ### x and y specify coordinates
    // #######################################################################################################

    [
        new Poison('animated', 308, 388),
        new Poison('animated', 952, 392),
        new Poison('dark_right', 1916, 400)
    ],

    // ############################################### Enemies ###############################################
    // ### Instantiate enemies with parameters:
    // ### PufferFish(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
    // #######################################################################################################
    // ### color options: 'green', 'orange', 'red'
    // ### x, y are positions
    // ### direction: 'horizontal' or 'vertical'
    // ### startPoint and endPoint are coordinate waypoints (x or y depending on direction)
    // ### speed range: 0 to 5
    // ### imgInitiallyMirrored: 0 (no) or 1 (yes)
    // #######################################################################################################
    // ### JellyFishRegular(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
    // #######################################################################################################
    // ### color options: 'lila', 'yellow'
    // ### x, y: position
    // ### direction: 'horizontal' or 'vertical'
    // ### startPoint and endPoint waypoints
    // ### speed: 0 to 5
    // ### imgInitiallyMirrored: 0 or 1
    // #######################################################################################################
    // ### JellyFishDangerous(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
    // #######################################################################################################
    // ### color options: 'green', 'pink'
    // ### same parameters as above
    // #######################################################################################################
    // ### EndBoss(x, y, startX, startY)
    // #######################################################################################################
    // ### x, y position
    // ### startX and startY: initial AI movement position
    // #######################################################################################################

    [
        new PufferFish('red', 244, 24, 'horizontal', 244, 600, 1.3, 1),
        new PufferFish('green', 224, 380, 'horizontal', 224, 540, 1, 1),
        new JellyFishRegular('lila', 860, 16, 'vertical', 16, 280, 1.5, 0),
        new PufferFish('orange', 988, 20, 'horizontal', 988, 1296, 1.2, 1),
        new PufferFish('green', 1064, 312, 'horizontal', 1064, 1360, 1.8, 1),
        new JellyFishRegular('yellow', 1412, 52, 'vertical', 52, 250, 1.2, 0),
        new EndBoss(2000, 50, 2000, 50)
    ],

    // ############################################### Barriers ###############################################
    // ### Instantiate barriers:
    // ### BarrierTunnelAbove(x, y)
    // ### BarrierTunnelBelow(x, y)
    // ### BarrierRock(x, y)
    // ### BarrierWall(x, y)
    // ########################################################################################################
    // ### x and y coordinates (y=290 means on floor)
    // ########################################################################################################

    [
        new BarrierWall(640, 120)
    ],

    // ############################################### level_end_x ###############################################

    2000

);