/**
 * Project: Sharkie 2D Game
 * File: js/game.js
 * Responsibility: Orchestrates game flow (init, start/restart, level transitions, end screens). Uses core/* modules for state, storage, viewport, controls, and UI.
 * Notes: Formal documentation only – no functional changes.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

'use strict';

loadFromLocalStorage();

/**
 * Ensures currentLevel is within bounds and updates maxLevelReached.
 * @returns {void}
 */
function _validateCurrentLevel() {
  if (currentLevel == null || currentLevel < 0 || currentLevel >= levels.length) {
    currentLevel = 0;
  }
  if (currentLevel >= levels.length - 1) {
    maxLevelReached = true;
  }
}

/**
 * Enables scroll in help overlay on mobile.
 * @returns {void}
 */
function _enableHelpScrollOnMobile() {
  if (mobileAndTabletCheck()) {
    const helpContainer = document.getElementById('help-container');
    if (helpContainer) helpContainer.classList.add('scroll-enabled');
  }
}

/**
 * Renders start screen after init.
 * @returns {void}
 */
function _showStartScreen() {
  renderStartScreen();
  updateUI();
}

/**
 * Bootstraps the application: preloads assets, loads settings, registers mobile scroll behavior,
 * schedules win/death checks and renders the start screen.
 * @returns {void}
 */
function init() {
  _validateCurrentLevel();
  _enableHelpScrollOnMobile();
  checkForLevelWin();
  _showStartScreen();
}

/** Returns the loading element (supports new and legacy ids). */
function _getLoadingEl() {
  return document.getElementById('loading-spinner') || document.getElementById('loading-screen');
}

/** Shows the loading overlay. */
function _showLoadingScreen() {
  loading = true;
  const el = _getLoadingEl();
  if (el) el.classList.remove('d-none');
}

/** Hides the loading overlay after short delay. */
function _hideLoadingScreenDelayed() {
  setTimeout(() => {
    loading = false;
    const el = _getLoadingEl();
    if (el) el.classList.add('d-none');
  }, 500);
}

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    try { _showLoadingScreen(); } catch(e) {}
  } else if (document.readyState === 'complete') {
    try { _hideLoadingScreenDelayed(); } catch(e) {}
  }
};

// Fallback in case readyState listeners fire too early/late
window.addEventListener('load', () => { try { _hideLoadingScreenDelayed(); } catch(e) {} });

/**
 * Resets transient run-state flags and clears any pending timers/intervals from a previous run.
 * @returns {void}
 */

function resetGameFlagsAndTimers() {
    endBossKilled = false;
    characterIsDead = false;
    levelEnded = false;
    if (screenTimeoutId) { clearTimeout(screenTimeoutId); screenTimeoutId = null; }
    if (winCheckIntervalId) { clearInterval(winCheckIntervalId); winCheckIntervalId = null; }
}

/**
 * Ensures currentLevel is valid and updates maxLevelReached flag.
 * @returns {void}
 */
function validateLevelIndex() {
  if (typeof currentLevel !== 'number' || currentLevel < 0) currentLevel = 0;
  maxLevelReached = (currentLevel >= levels.length - 1);
}

/**
 * Binds viewport resize/orientation listeners once.
 * @returns {void}
 */
function bindViewportListeners() {
  if (!viewportListenersBound) {
    window.addEventListener('resize', fitCanvasToViewport);
    window.addEventListener('orientationchange', fitCanvasToViewport);
    viewportListenersBound = true;
  }
}

/**
 * Resets end boss state if present.
 * @param {World} world - The current game world.
 * @returns {void}
 */
function resetEndBossState(world) {
  if (world && world.level) {
    const boss = world.level.endBoss || (typeof world.level.getEndBoss === 'function' ? world.level.getEndBoss() : null);
    if (boss) {
      boss.world = world;
      if (typeof boss.resetState === 'function') {
        boss.resetState();
      } else {
        boss.energy = 100;
        boss.endBossTriggered = false;
        boss.endBossIntroduced = false;
        boss.endBossAlreadyTriggered = false;
        boss.isCollidingWithCharacter = false;
        boss.waypoint1 = boss.waypoint2 = boss.waypoint3 = false;
        boss.waypoint4 = boss.waypoint5 = boss.waypoint6 = false;
        boss.waypoint7 = false;
        if (typeof boss.startX === 'number') boss.x = boss.startX;
        if (typeof boss.startY === 'number') boss.y = boss.startY;
        try { endBossKilled = false; } catch(e){}
      }
    }
  }
}

/** Prepares DOM, world, and rendering. */
function _prepareWorld() {
  const content = document.getElementById('content');
  content.innerHTML = generateGameHTML();
  fitCanvasToViewport();
  resetGameFlagsAndTimers();
  validateLevelIndex();
  checkForLevelWin();
  bindViewportListeners();
  if (typeof initSoundUI === 'function') initSoundUI();
  updateUI();
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
  resetEndBossState(world);
  if (world && typeof world.draw === 'function') {
    try { requestAnimationFrame(() => world.draw()); } catch(e){}
  }
}

/** Shows and sets up mobile controls if on mobile. */
function _setupMobileUI() {
  if (window.mobileAndTabletCheck()) {
    document.getElementById('mobile-ctrl-left').classList.remove('d-none');
    document.getElementById('mobile-ctrl-right').classList.remove('d-none');
    setupMobileControls();
  }
}

/** Reveals the fullscreen toggle button. */
function _showFullscreenBtn() {
  document.getElementById('toggle-fullscreen-btn').classList.remove('d-none');
}

/**
 * Renders the game UI, initializes a fresh World instance, binds viewport listeners (once),
 * and (re)arms the periodic win/death check.
 * @returns {void}
 */

function startGame() {
  _prepareWorld();
  _setupMobileUI();
  _showFullscreenBtn();
}

/**
 * Renders the start screen HTML and syncs the UI state.
 * @returns {void}
 */

function renderStartScreen() {
    const content = document.getElementById('content');
    content.innerHTML = generateStartScreenHTML();
    updateUI();
}

/**
 * Handles the transition when the player wins a non-final level.
 * @param {object} boss - The end boss instance.
 * @returns {void}
 */
function handleLevelWin(boss) {
  levelEnded = true;
  if (world && typeof world.stop === 'function') world.stop();
  clearInterval(winCheckIntervalId); winCheckIntervalId = null;

  screenTimeoutId = setTimeout(() => {
    const content = document.getElementById('content');
    if (typeof generateEndScreenHTML === 'function') {
      content.innerHTML = generateEndScreenHTML();
    }
    if (soundOn) { try { WIN_SOUND.currentTime = 0; WIN_SOUND.play(); } catch(e){} }
  }, 3000);
}

/**
 * Handles the transition when the player wins the final level.
 * @returns {void}
 */
function handleFinalWin() {
  levelEnded = true;
  if (world && typeof world.stop === 'function') world.stop();
  clearInterval(winCheckIntervalId); winCheckIntervalId = null;

  screenTimeoutId = setTimeout(() => {
    const content = document.getElementById('content');
    if (typeof generateMaxEndScreenHTML === 'function') {
      content.innerHTML = generateMaxEndScreenHTML();
    }
    if (soundOn) { try { WIN_SOUND.currentTime = 0; WIN_SOUND.play(); } catch(e){} }

    try {
      currentLevel = 0;
      maxLevelReached = false;
      saveToLocalStorage();
    } catch (e) {}
  }, 3000);
}

/**
 * Handles the transition when the character dies.
 * @returns {void}
 */
function handleGameOver() {
  levelEnded = true;
  if (world && typeof world.stop === 'function') world.stop();
  clearInterval(winCheckIntervalId); winCheckIntervalId = null;

  screenTimeoutId = setTimeout(() => {
    const content = document.getElementById('content');
    if (typeof generateGameOverScreenHTML === 'function') {
      content.innerHTML = generateGameOverScreenHTML();
    }
    if (soundOn) { try { GAME_OVER_SOUND.currentTime = 0; GAME_OVER_SOUND.play(); } catch(e){} }
  }, 3000);
}

/** Evaluates win/lose conditions and triggers appropriate handlers. */
function _evaluateWinConditions() {
  const isLastLevel = (typeof currentLevel === 'number') && (currentLevel >= levels.length - 1);
  const boss = world && world.level ? (world.level.endBoss || (typeof world.level.getEndBoss === 'function' ? world.level.getEndBoss() : null)) : null;
  const bossIntroduced = !!(boss && boss.endBossIntroduced);

  if (!levelEnded && endBossKilled && bossIntroduced && !isLastLevel) {
    handleLevelWin(boss);
  } else if (!levelEnded && endBossKilled && bossIntroduced && isLastLevel) {
    handleFinalWin();
  } else if (!levelEnded && characterIsDead) {
    handleGameOver();
  }
}

/**
 * Periodically checks for win/lose conditions and transitions to the appropriate screen.
 * Uses guards to avoid duplicate intervals and ensures each end-state is handled only once.
 * @returns {void}
 */

function checkForLevelWin() {
  if (winCheckIntervalId) return;
  winCheckIntervalId = setInterval(_evaluateWinConditions, 250);
}


/**
 * Restarts the current level while preserving global options. Stops active world, resets timers and input.
 * @returns {void}
 */

function restartLevel() {
  resetGameFlagsAndTimers();
  _resetWinAndGameOverSounds();
  _resetWorldAndKeyboard();
  startGame();
}

/**
 * Proceeds to the next level (if any). Ensures a clean transition by resetting timers, sounds, and input.
 * @returns {void}
 */

function nextLevel() {
  if (maxLevelReached || currentLevel >= levels.length - 1) return;
  resetGameFlagsAndTimers();
  currentLevel++;
  if (currentLevel >= levels.length - 1) maxLevelReached = true;
  _resetWinAndGameOverSounds();
  saveToLocalStorage();
  _resetWorldAndKeyboard();
  startGame();
}

/**
 * Resets campaign progress to level 0 and restarts with a clean world.
 * @returns {void}
 */

function restartGame() {
  resetGameFlagsAndTimers();
  currentLevel = 0;
  maxLevelReached = false;
  _resetWinAndGameOverSounds();
  saveToLocalStorage();
  _resetWorldAndKeyboard();
  startGame();
}

/**
 * Pauses and resets win and game over sounds.
 * @returns {void}
 */
function _resetWinAndGameOverSounds() {
  try { WIN_SOUND.pause(); WIN_SOUND.currentTime = 0; } catch(e){}
  try { GAME_OVER_SOUND.pause(); GAME_OVER_SOUND.currentTime = 0; } catch(e){}
}

/**
 * Stops the current world if running and resets keyboard input.
 * @returns {void}
 */
function _resetWorldAndKeyboard() {
  if (world && typeof world.stop === 'function') world.stop();
  world = null;
  keyboard = new Keyboard();
}
