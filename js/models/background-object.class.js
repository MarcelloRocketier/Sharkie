/**
 * Class representing background elements for each level section of the game.
 * Handles loading the correct image and positioning for parallax backgrounds.
 * 
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Create a BackgroundObject.
     *
     * @param {number} scene - The scene index indicating which set of background images to use.
     * @param {number} section - The section index within the scene for the background image.
     * @param {number} index - The index for the specific background image in the section.
     * @param {number} levelSection - The horizontal section index of the level to position the background.
     */
    constructor(scene, section, index, levelSection) {
        // Load the appropriate background image based on parameters
        super().loadImage(BACKGROUND_IMAGES.IMAGES[scene][section][index]);

        /** 
         * Set the horizontal position of the background.
         * The first section starts at x=0, subsequent sections are offset by 719px per levelSection.
         */
        if (levelSection === 0) {
            this.x = 0;
        } else {
            this.x = 719 * levelSection;
        }

        /**
         * Align the background vertically to the bottom of the canvas.
         * The y position is calculated so the background sits at the bottom edge.
         */
        this.y = 480 - this.height;
    }
}