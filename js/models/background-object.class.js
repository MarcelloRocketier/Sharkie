/**
 * Represents background elements for each level section
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    constructor(scene, section, index, levelSection) {
        // Load the appropriate background image based on parameters
        super().loadImage(BACKGROUND_IMAGES.IMAGES[scene][section][index]);

        // Position horizontally according to the section index
        if (levelSection === 0) {
            this.x = 0;
        } else {
            this.x = 719 * levelSection;
        }

        // Align vertically to the bottom of the canvas
        this.y = 480 - this.height;
    }
}