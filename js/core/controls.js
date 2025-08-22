

/**
 * Project: Sharkie 2D Game
 * File: js/core/controls.js
 * Responsibility: Handles keyboard and mobile control bindings.
 * Notes: Extracted from game.js to reduce file size and centralize input handling.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

'use strict';

/**
 * Binds keyboard events to update the shared keyboard object.
 */
window.addEventListener('keydown', (e) => { 
    const k = KEY_MAP[e.keyCode]; 
    if (k) keyboard[k] = true; 
});
window.addEventListener('keyup',   (e) => { 
    const k = KEY_MAP[e.keyCode]; 
    if (k) keyboard[k] = false; 
});

/**
 * Binds touch handlers for mobile controls once and updates the shared `keyboard` flags.
 * @returns {void}
 */
function setupMobileControls() {
    if (mobileControlsBound) return;
    document.getElementById('ctrl-btn-up').addEventListener('touchstart', () => keyboard.UP = true);
    document.getElementById('ctrl-btn-up').addEventListener('touchend', () => keyboard.UP = false);

    document.getElementById('ctrl-btn-right').addEventListener('touchstart', () => keyboard.RIGHT = true);
    document.getElementById('ctrl-btn-right').addEventListener('touchend', () => keyboard.RIGHT = false);

    document.getElementById('ctrl-btn-down').addEventListener('touchstart', () => keyboard.DOWN = true);
    document.getElementById('ctrl-btn-down').addEventListener('touchend', () => keyboard.DOWN = false);

    document.getElementById('ctrl-btn-left').addEventListener('touchstart', () => keyboard.LEFT = true);
    document.getElementById('ctrl-btn-left').addEventListener('touchend', () => keyboard.LEFT = false);

    document.getElementById('ctrl-btn-fin-slap').addEventListener('touchstart', () => keyboard.SPACE = true);
    document.getElementById('ctrl-btn-fin-slap').addEventListener('touchend', () => keyboard.SPACE = false);

    document.getElementById('ctrl-btn-bubble-trap').addEventListener('touchstart', () => keyboard.D = true);
    document.getElementById('ctrl-btn-bubble-trap').addEventListener('touchend', () => keyboard.D = false);

    document.getElementById('ctrl-btn-poison-bubble-trap').addEventListener('touchstart', () => keyboard.F = true);
    document.getElementById('ctrl-btn-poison-bubble-trap').addEventListener('touchend', () => keyboard.F = false);
    mobileControlsBound = true;
}