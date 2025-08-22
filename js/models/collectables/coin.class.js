/****
 * Project: Sharkie 2D Game
 * File: js/models/collectables/coin.class.js
 * Responsibility: Defines the Coin class – collectible item increasing score when picked up.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

/**
 * Coin collectible.
 * Extends MovableObject for rendering and positioning.
 */
class Coin extends MovableObject {
    /**
     * Creates a coin object at the given coordinates.
     * @param {number} x - The horizontal position of the coin.
     * @param {number} y - The vertical position of the coin.
     */
    constructor(x, y) {
        super().loadImage('./assets/img/4._Marks/Coins/1.png');
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
    }
}