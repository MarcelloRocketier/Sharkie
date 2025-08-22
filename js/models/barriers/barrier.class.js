/**
 * Project: Sharkie 2D Game
 * File: js/models/barriers/barrier.class.js
 * Responsibility: Base class for barriers – inherited by specific barrier types (wall, tunnel, rock).
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

/**
 * Abstract Barrier class.
 * Serves as the base for specific barrier types.
 * Provides positioning and rendering through MovableObject.
 */
class Barrier extends MovableObject {
    /**
     * Initializes a Barrier instance.
     * Typically called by child barrier classes.
     */
    constructor() {
        super();
    }
}