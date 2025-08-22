/**
 * Project: Sharkie 2D Game
 * File: js/models/collectables/life.class.js
 * Responsibility: Defines the Life class – collectible item restoring player health when picked up.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

/**
 * Life collectible.
 * Restores character energy/health when collected.
 * Extends MovableObject for rendering and positioning.
 */
class Life extends MovableObject {
    /** @type {{x:number,y:number,width:number,height:number}} Collision box offsets. */
    offset = {
        x: 7,
        y: 14,
        width: 8,
        height: 5
    }
    /**
     * Creates a life object at the specified position.
     * @param {number} x - The horizontal position of the life object.
     * @param {number} y - The vertical position of the life object.
     */
    constructor(x, y) {
        super().loadImage('./assets/img/4._Marks/Status_Bars/Life_100.png');
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
    }
}