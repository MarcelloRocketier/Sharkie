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
 * Bootstraps the application: preloads assets, loads settings, registers mobile scroll behavior,
 * schedules win/death checks and renders the start screen.
 * @returns {void}
 */
function init() {
    const content = document.getElementById('content');
    preload();
    loadFromLocalStorage();
    updateUI();

 if (currentLevel == null || currentLevel < 0 || currentLevel >= levels.length) {
    currentLevel = 0;
}

if (currentLevel >= levels.length - 1) {
    maxLevelReached = true;
}

    if (mobileAndTabletCheck()) {
        const helpContainer = document.getElementById('help-container');
        if (helpContainer) helpContainer.classList.add('scroll-enabled');
    }

    checkForLevelWin();
    renderStartScreen();
}

/**
 * Displays a loading screen while the document transitions from `interactive` to `complete`.
 * Purely visual; has no gameplay side effects.
 * @returns {void}
 */

document.onreadystatechange = () => {
    let state = document.readyState;

    if (state == 'interactive') {
        loading = true;
        document.getElementById('loading-screen').classList.remove('d-none');
    } else if (state == 'complete') {
        setTimeout(function() {
            loading = false;
            document.getElementById('loading-screen').classList.add('d-none');
        }, 5000);
    }
}





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
 * Renders the game UI, initializes a fresh World instance, binds viewport listeners (once),
 * and (re)arms the periodic win/death check.
 * @returns {void}
 */

function startGame() {
    const content = document.getElementById('content');
    content.innerHTML = generateGameHTML();
    fitCanvasToViewport();
    resetGameFlagsAndTimers();

    if (typeof currentLevel !== 'number' || currentLevel < 0) currentLevel = 0;
    maxLevelReached = (currentLevel >= levels.length - 1);

    checkForLevelWin();

    if (!viewportListenersBound) {
        window.addEventListener('resize', fitCanvasToViewport);
        window.addEventListener('orientationchange', fitCanvasToViewport);
        viewportListenersBound = true;
    }

    if (typeof initSoundUI === 'function') initSoundUI();
    updateUI();

    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

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

    if (world && typeof world.draw === 'function') {
        try { requestAnimationFrame(() => world.draw()); } catch(e){}
    }

    if (window.mobileAndTabletCheck()) {
        document.getElementById('mobile-ctrl-left').classList.remove('d-none');
        document.getElementById('mobile-ctrl-right').classList.remove('d-none');
        setupMobileControls();
    }

    document.getElementById('toggle-fullscreen-btn').classList.remove('d-none');
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
 * Periodically checks for win/lose conditions and transitions to the appropriate screen.
 * Uses guards to avoid duplicate intervals and ensures each end-state is handled only once.
 * @returns {void}
 */

function checkForLevelWin() {
    if (winCheckIntervalId) return; 
    winCheckIntervalId = setInterval(() => {
        const isLastLevel = (typeof currentLevel === 'number') && (currentLevel >= levels.length - 1);
        const boss = world && world.level ? (world.level.endBoss || (typeof world.level.getEndBoss === 'function' ? world.level.getEndBoss() : null)) : null;
        const bossIntroduced = !!(boss && boss.endBossIntroduced);

        if (!levelEnded && endBossKilled && bossIntroduced && !isLastLevel) {
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

        } else if (!levelEnded && endBossKilled && bossIntroduced && isLastLevel) {
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

        } else if (!levelEnded && characterIsDead) {
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
    }, 250);
}


/**
 * Restarts the current level while preserving global options. Stops active world, resets timers and input.
 * @returns {void}
 */

function restartLevel() {
    resetGameFlagsAndTimers();
    try { WIN_SOUND.pause(); WIN_SOUND.currentTime = 0; } catch(e){}
    try { GAME_OVER_SOUND.pause(); GAME_OVER_SOUND.currentTime = 0; } catch(e){}
    if (world && typeof world.stop === 'function') world.stop();
    world = null; 
    keyboard = new Keyboard();
    startGame();
}

/**
 * Proceeds to the next level (if any). Ensures a clean transition by resetting timers, sounds, and input.
 * @returns {void}
 */

function nextLevel() {
    if (!maxLevelReached && currentLevel < levels.length - 1) {
        resetGameFlagsAndTimers();
        currentLevel++;
        if (currentLevel >= levels.length - 1) {
            maxLevelReached = true;
        }
        try { WIN_SOUND.pause(); WIN_SOUND.currentTime = 0; } catch(e){}
        try { GAME_OVER_SOUND.pause(); GAME_OVER_SOUND.currentTime = 0; } catch(e){}
        saveToLocalStorage();
        if (world && typeof world.stop === 'function') world.stop();
        world = null; 
        keyboard = new Keyboard();
        startGame();
    }
}

/**
 * Resets campaign progress to level 0 and restarts with a clean world.
 * @returns {void}
 */

function restartGame() {
    resetGameFlagsAndTimers();
    currentLevel = 0;
    maxLevelReached = false;
    try { WIN_SOUND.pause(); WIN_SOUND.currentTime = 0; } catch(e){}
    try { GAME_OVER_SOUND.pause(); GAME_OVER_SOUND.currentTime = 0; } catch(e){}
    saveToLocalStorage();
    if (world && typeof world.stop === 'function') world.stop();
    world = null; 
    keyboard = new Keyboard();
    startGame();
}
