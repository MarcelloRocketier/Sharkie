// Instantiate a new level object
const level_2 = new Level(

    // ############################################### Background objects ###############################################
    // ### Instantiates BackgroundObject(scene, section, index, levelSection)
    // ##################################################################################################################
    // ### section: 1 or 2 (Alternates between these)
    // ### index: from 0 to 4 (incremental)
    // ### levelSection: 0 to x (each section measures 719px, ascending order)
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
        new BackgroundObject('dark', 2, 4, 3),

        new BackgroundObject('dark', 1, 0, 4),
        new BackgroundObject('dark', 1, 1, 4),
        new BackgroundObject('dark', 1, 2, 4),
        new BackgroundObject('dark', 1, 3, 4),
        new BackgroundObject('dark', 1, 4, 4)
    ],

    // ############################################### Coins ###############################################
    // ### Instantiate new Coin(x, y)
    // #####################################################################################################
    // ### x and y define position coordinates
    // #####################################################################################################

    [
        new Coin(548, 252),
        new Coin(612, 180),
        new Coin(696, 128),
        new Coin(1188, 244),
        new Coin(1656, 20),
        new Coin(2168, 112)
    ],

    // ############################################### Life pickups ###############################################
    // ### Instantiate new Life(x, y)
    // ####################################################################################################
    // ### x and y coordinate values
    // ####################################################################################################

    [
        new Life(976, 52),
        new Life(2564, 412)
    ],

    // ############################################### Poison pickups ###############################################
    // ### Instantiate new Poison(type, x, y)
    // ######################################################################################################
    // ### x and y coordinates
    // #######################################################################################################

    [
        new Poison('dark_right', 96, 412),
        new Poison('animated', 1128, 412),
        new Poison('dark_right', 1588, 404)
    ],

    // ############################################### Enemies ###############################################
    // ### Instantiate enemies with parameters:
    // ### PufferFish(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
    // #######################################################################################################
    // ### color options: 'green', 'orange', 'red'
    // ### x and y are positions
    // ### direction: 'horizontal' or 'vertical'
    // ### startPoint and endPoint are waypoint coordinates (either x or y based on direction)
    // ### speed ranges between 0 and 5
    // ### imgInitiallyMirrored: 0 (no), 1 (yes)
    // #######################################################################################################
    // ### JellyFishRegular(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
    // #######################################################################################################
    // ### color options: 'lila', 'yellow'
    // ### x, y positions
    // ### direction: 'horizontal' or 'vertical'
    // ### start and end points for movement
    // ### speed between 0 and 5
    // ### imgInitiallyMirrored flag 0 or 1
    // #######################################################################################################
    // ### JellyFishDangerous(color, x, y, direction, startPoint, endPoint, speed, imgInitiallyMirrored)
    // #######################################################################################################
    // ### color options: 'green', 'pink'
    // ### same parameter structure as above
    // #######################################################################################################
    // ### EndBoss(x, y, startX, startY)
    // #######################################################################################################
    // ### x and y coordinates
    // ### startX and startY are AI movement start positions
    // #######################################################################################################

    [
        new JellyFishDangerous('pink', 400, 100, 'vertical', 100, 240, 0.5, 0),
        new PufferFish('orange', 600, 128, 'horizontal', 600, 1000, 1.5, 1),
        new JellyFishDangerous('green', 1172, 64, 'vertical', 64, 300, 2, 0),
        new PufferFish('red', 1420, 352, 'horizontal', 1420, 1644, 1.5, 1),
        new PufferFish('green', 1924, 184, 'horizontal', 1924, 2396, 2.5, 1),
        new JellyFishDangerous('pink', 2572, 52, 'vertical', 52, 332, 1.5, 0),
        new EndBoss(3000, 50, 3000, 50)
    ],

    // ############################################### Barriers ###############################################
    // ### Instantiate barriers:
    // ### BarrierTunnelAbove(x, y)
    // ### BarrierTunnelBelow(x, y)
    // ### BarrierRock(x, y)
    // ### BarrierWall(x, y)
    // ########################################################################################################
    // ### x and y coordinate values (y = 290 indicates floor level)
    // ########################################################################################################

    [
        new BarrierRock(300, 290),
        new BarrierWall(1380, -250),
        new BarrierTunnelAbove(1800, 0),
        new BarrierTunnelBelow(1800, 290)
    ],

    // ############################################### level_end_x ###############################################

    3000

);