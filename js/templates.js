'use strict';

/**
 * Generates the HTML for the game's start screen
 * @returns {string} HTML markup for the start screen
 */
function generateStartScreenHTML() {
    return `
        <div class="start-screen-container">
            <div class="start-screen-header">
                <h1 class="start-screen-title">Sharkie</h1>
                <h1 class="start-screen-title">Level ${currentLevel + 1}</h1>
            </div>
            <div class="start-screen-body">
                <button class="start-game-btn btn" onclick="startGame()">START GAME</button>
                <button class="help-btn btn" onclick="openHelp()">HOW TO PLAY</button>
            </div>
            <div id="help-backdrop" class="dialog-backdrop d-none" onclick="backdropClick(event)">
                <div class="dialog">
                    <button class="dialog-close" onclick="closeHelp()" aria-label="Close">×</button>
                    <h2>How to play</h2>
                    <ul class="dialog-list">
                        <li>Move: Arrow keys or on-screen controls</li>
                        <li>Fin Slap: SPACE / Fin Slap button</li>
                        <li>Bubble: D / Bubble button</li>
                        <li>Poison Bubble: F (requires poison)</li>
                        <li>Mute/Unmute: Speaker button (saved)</li>
                        <li>Rotate device to landscape on mobile</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="start-screen-footer">
            <a href="impressum.html" class="impressum-link">Impressum</a>
        </div>
    `;
}

/**
 * Generates the main game HTML container with canvas and controls
 * @returns {string} HTML markup for the game view
 */
function generateGameHTML() {
    return `
        <h1 id="game-title" class="game-title">Sharkie</h1>
        <div id="canvas-wrapper" class="canvas-wrapper">
            <div id="fullscreen-message" class="screen-message d-none">
                Please switch to fullscreen mode
            </div>
            <div id="rotate-overlay" class="screen-message d-none">
                Please rotate your device to landscape mode to play
            </div>
            <div id="fullscreen-container" class="fullscreen-container">
                <div id="landscape-message" class="screen-message d-none">
                    Please turn your device to landscape mode
                </div>
                <canvas id="canvas" width="720" height="480"></canvas>
                <div id="mobile-ctrl-left" class="mobile-controller-container-left d-none">
                    <button id="ctrl-btn-up" class="mobile-ctrl-btn"><img src="./assets/img/icons/arrow_up.svg" class="ctrl-arrow-img" oncontextmenu="return false;"></button>
                    <div class="mobile-controller-x-control">
                        <button id="ctrl-btn-left" class="mobile-ctrl-btn"><img src="./assets/img/icons/arrow_left.svg" class="ctrl-arrow-img" oncontextmenu="return false;"></button>
                        <button id="ctrl-btn-right" class="mobile-ctrl-btn"><img src="./assets/img/icons/arrow_right.svg" class="ctrl-arrow-img" oncontextmenu="return false;"></button>
                    </div>
                    <button id="ctrl-btn-down" class="mobile-ctrl-btn"><img src="./assets/img/icons/arrow_down.svg" class="ctrl-arrow-img" oncontextmenu="return false;"></button>
                </div>  
                <div id="mobile-ctrl-right" class="mobile-controller-container-right d-none">
                    <button id="ctrl-btn-fin-slap" class="mobile-ctrl-btn">Fin Slap</button>
                    <button id="ctrl-btn-bubble-trap" class="mobile-ctrl-btn">Bubble</button>
                    <button id="ctrl-btn-poison-bubble-trap" class="mobile-ctrl-btn">Poison Bubble</button>
                </div>
                <button id="mobile-fullscreen-btn" class="nav-btn d-none" onclick="toggleFullscreen()" title="Fullscreen On/Off"><img src="./assets/img/icons/fullscreen.svg" alt="Fullscreen On/Off" class="nav-icon"></button>
                <button id="mobile-mute-btn" class="nav-btn d-none" onclick="toggleSound()" title="Mute/Unmute"><img src="./assets/img/icons/speaker.svg" alt="Mute/Unmute" class="nav-icon" id="sound-img-mobile"></button>
                <button id="mobile-close-btn" class="nav-btn d-none" onclick="restartLevel()" title="Exit Game"><img src="./assets/img/icons/close.svg" alt="Close" class="nav-icon"></button>
            </div>
        </div>
    `;
}
/**
 * Generates the HTML for the end-of-level screen when player wins
 * @returns {string} HTML markup for the end screen
 */
function generateEndScreenHTML() {
    return `
        <div class="end-screen-container">
            <div class="end-screen-header">
                <img src="./assets/img/6._Buttons/Titles/You_Win/Work_Table.png" class="end-screen-img" alt="Victory Screen">
            </div>
            <div class="end-screen-body">
                <button class="restart-lvl-btn btn" onclick="restartLevel()">RESTART LEVEL</button>
                <button class="next-lvl-btn btn" onclick="nextLevel()">NEXT LEVEL</button>
            </div>
        </div>
    `;
}

/**
 * Generates the HTML for the final level completion screen
 * @returns {string} HTML markup for max level completion
 */
function generateMaxEndScreenHTML() {
    return `
        <div class="end-screen-container">
            <div class="end-screen-header">
                <img src="./assets/img/6._Buttons/Titles/You_Win/Work_Table.png" class="end-screen-img" alt="Victory Screen">
            </div>
            <h2 class="max-level-heading">Congratulations!</h2>
            <h2 class="max-level-heading">You finished the last level!</h2>
            <div class="end-screen-body">
                <button class="restart-lvl-btn btn" onclick="restartLevel()">RESTART LEVEL</button>
                <button class="restart-lvl-btn btn" onclick="restartGame()">RESTART GAME</button>
            </div>
        </div>
    `;
}

/**
 * Generates the HTML shown when the player loses the game
 * @returns {string} HTML markup for game over screen
 */
function generateGameOverScreenHTML() {
    return `
        <div class="end-screen-container">
            <div>
                <h2 class="game-over-screen-title">GAME OVER</h2>
            </div>
            <div class="end-screen-body">
                <button class="restart-lvl-btn btn" onclick="restartLevel()">TRY AGAIN</button>
            </div>
        </div>
    `;
}

/** Opens the How-To dialog */
function openHelp() {
    const el = document.getElementById('help-backdrop');
    if (el) el.classList.remove('d-none');
}

/** Closes the How-To dialog */
function closeHelp() {
    const el = document.getElementById('help-backdrop');
    if (el) el.classList.add('d-none');
}

/** Closes the dialog when clicking the semi-transparent backdrop */
function backdropClick(ev) {
    if (ev && ev.target && ev.target.id === 'help-backdrop') closeHelp();
}

/** Initializes sound UI state from localStorage and updates icons */
function initSoundUI() {
    try {
        const saved = localStorage.getItem('soundOn');
        if (saved !== null && typeof soundOn !== 'undefined') {
            soundOn = saved === 'true';
        }
    } catch (e) {}
    updateSoundIcon();
}

/** Updates the mute/unmute icon to reflect current soundOn */
function updateSoundIcon() {
    const img = document.getElementById('sound-img-mobile');
    if (!img || typeof soundOn === 'undefined') return;
    img.src = soundOn ? './assets/img/icons/speaker.svg' : './assets/img/icons/speaker_muted.svg';
}