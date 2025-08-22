

/**
 * Project: Sharkie 2D Game
 * File: js/core/ui.js
 * Responsibility: Handles UI toggles (settings, help, sound, fullscreen) and UI synchronization.
 * Notes: Extracted from game.js to reduce file size and centralize UI handling.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

'use strict';

/**
 * Toggles the settings overlay visibility.
 * @returns {void}
 */
function toggleSettingsMenu() {
    document.getElementById('settings-menu-container').classList.toggle('d-none');
}

/**
 * Toggles the help overlay visibility.
 * @returns {void}
 */
function toggleHelpSite() {
    document.getElementById('help-container').classList.toggle('d-none');
}

/**
 * Toggles sound state, updates relevant icons, and persists the new state.
 * @returns {void}
 */
function toggleSound() {
    soundOn = !soundOn;

    if (soundOn) {
        document.getElementById('sound-img').src = './assets/img/icons/speaker.svg';
    } else {
        document.getElementById('sound-img').src = './assets/img/icons/mute.svg';
    }

    saveToLocalStorage();
    updateUI();
    if (typeof updateSoundIcon === 'function') updateSoundIcon();
}

/**
 * Requests or exits fullscreen and mirrors the state in UI and localStorage.
 * @returns {void}
 */
function toggleFullscreen() {
    fullscreen = !fullscreen;

    if (document.getElementById('fullscreen-container')) {
        if (fullscreen) {
            document.getElementById('fullscreen-container').requestFullscreen();
            fullscreen = true;
        } else {
            fullscreen = false;
        }
    }

    saveToLocalStorage();
    updateUI();
}

/**
 * Mirrors `soundOn` and fullscreen state to icons/checkboxes.
 * Registers a single fullscreen watcher interval.
 * @returns {void}
 */
function updateUI() {
    if (soundOn) {
        document.getElementById('sound-img').src = './assets/img/icons/speaker.svg';
        document.getElementById('sound-checkbox').checked = true;
    } else {
        document.getElementById('sound-img').src = './assets/img/icons/mute.svg';
        document.getElementById('sound-checkbox').checked = false;
    }

    if (soundOn && document.getElementById('sound-img-mobile')) {
        document.getElementById('sound-img-mobile').src = './assets/img/icons/speaker.svg';
    } else if (!soundOn && document.getElementById('sound-img-mobile')) {
        document.getElementById('sound-img-mobile').src = './assets/img/icons/mute.svg';
    }

    if (!fullscreenIntervalId) {
        fullscreenIntervalId = setInterval(() => {
            function fs_status() {
                return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
            }

            if (fs_status()) {
                document.getElementById('fullscreen-checkbox').checked = true;
            } else {
                document.getElementById('fullscreen-checkbox').checked = false;
                fullscreen = false;
            }
        }, 250);
    }
}