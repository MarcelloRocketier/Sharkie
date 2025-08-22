/**
 * Project: Sharkie 2D Game
 * File: js/models/keyboard.class.js
 * Responsibility: Defines the Keyboard class – tracks real-time keyboard input states for the game.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

/**
 * Keyboard state container.
 * Each property corresponds to a key binding used in the game.
 * Flags are set/unset by event listeners in game.js and used by the World/Character classes.
 */
class Keyboard {
    /** @type {boolean} True if the left arrow key is pressed. */
    LEFT;
    /** @type {boolean} True if the right arrow key is pressed. */
    RIGHT;
    /** @type {boolean} True if the up arrow key is pressed. */
    UP;
    /** @type {boolean} True if the down arrow key is pressed. */
    DOWN;
    /** @type {boolean} True if the spacebar is pressed. */
    SPACE;
    /** @type {boolean} True if the 'D' key is pressed. */
    D;
    /** @type {boolean} True if the 'F' key is pressed. */
    F;
}