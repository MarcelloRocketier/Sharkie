

/**
 * Project: Sharkie 2D Game
 * File: js/core/storage.js
 * Responsibility: Persists and restores minimal game state (currentLevel, soundOn) to and from localStorage.
 * Notes: Extracted from game.js to reduce file size and centralize storage.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

'use strict';

/**
 * Saves the current game state to localStorage.
 * @returns {void}
 */
function saveToLocalStorage() {
    let currentLevelAsString = JSON.stringify(currentLevel);
    localStorage.setItem('currentLevel', currentLevelAsString);

    let soundOnAsString = JSON.stringify(soundOn);
    localStorage.setItem('soundOn', soundOnAsString);
}

/**
 * Loads the game state from localStorage, including current level and sound settings.
 * @returns {void}
 */
function loadFromLocalStorage() {
    let currentLevelAsString = localStorage.getItem('currentLevel');
    currentLevel = JSON.parse(currentLevelAsString);

    if (typeof currentLevel !== 'number' || currentLevel < 0 || currentLevel >= levels.length) {
        currentLevel = 0;
        saveToLocalStorage();  
    }

    let soundOnAsString = localStorage.getItem('soundOn');
    soundOn = JSON.parse(soundOnAsString);
    if (soundOn === null || typeof soundOn !== 'boolean') soundOn = true;
}