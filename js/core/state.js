

/**
 * Project: Sharkie 2D Game
 * File: js/core/state.js
 * Responsibility: Holds global game state flags, constants, and shared objects.
 * Notes: Extracted from game.js to reduce file size and centralize state.
 * Author: <Your Name>
 * License: MIT (or project license)
 */

'use strict';

/** @type {HTMLCanvasElement} */
let canvas;
/** @type {World} */
let world;
/** @type {Keyboard} */
let keyboard = new Keyboard();
/** @type {boolean} */
let soundOn = true;
/** @type {boolean} */
let fullscreen = false;
/** @type {boolean} */
let endBossKilled = false;
/** @type {boolean} */
let characterIsDead = false;
/** @type {boolean} */
let levelEnded = false;
/** @type {Array} */
let levels = [
    level_1,
    level_2
];
/** @type {number} */
let currentLevel;
/** @type {boolean} */
let maxLevelReached = false;
/** @type {HTMLAudioElement} */
let WIN_SOUND = new Audio('./assets/audio/congrats.mp3');
/** @type {HTMLAudioElement} */
let GAME_OVER_SOUND = new Audio('./assets/audio/game_over.mp3');
/** @type {boolean} */
let loading = true;
/** @type {number|null} */
let fullscreenIntervalId = null;
let winCheckIntervalId = null;
let screenTimeoutId = null;
let viewportListenersBound = false;
let mobileControlsBound = false;

/** Key code to key name mapping */
const KEY_MAP = { 32:'SPACE', 37:'LEFT', 38:'UP', 39:'RIGHT', 40:'DOWN', 68:'D', 70:'F' };