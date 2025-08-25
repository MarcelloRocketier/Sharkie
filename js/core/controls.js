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
    _bindTouchToKey('ctrl-btn-up', 'UP');
    _bindTouchToKey('ctrl-btn-right', 'RIGHT');
    _bindTouchToKey('ctrl-btn-down', 'DOWN');
    _bindTouchToKey('ctrl-btn-left', 'LEFT');
    _bindTouchToKey('ctrl-btn-fin-slap', 'SPACE');
    _bindTouchToKey('ctrl-btn-bubble-trap', 'D');
    _bindTouchToKey('ctrl-btn-poison-bubble-trap', 'F');
    mobileControlsBound = true;
}

/**
 * Binds touchstart and touchend events on a control button to a keyboard flag.
 * @param {string} elementId - The DOM id of the control button element.
 * @param {string} keyFlag - The keyboard flag property to toggle.
 * @returns {void}
 */
function _bindTouchToKey(elementId, keyFlag) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.addEventListener('touchstart', () => keyboard[keyFlag] = true);
    el.addEventListener('touchend', () => keyboard[keyFlag] = false);
}