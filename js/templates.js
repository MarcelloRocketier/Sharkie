/**
 * Project: Sharkie 2D Game
 * File: js/templates.js
 * Responsibility: Provides HTML template generators for screens (start, game, end, game over) and UI overlays.
 * Notes: Documentation-only changes. No logic is modified.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

/**
 * Generates the HTML string for the start screen.
 * @returns {string} HTML markup for the start screen.
 */
function generateStartScreenHTML() {
    return `
        <div id="start-screen" class="start-screen-container">
            <div class="start-screen-header">
                <h1 class="start-screen-title">Sharkie</h1>
                <h2 class="start-screen-subtitle">Level ${currentLevel + 1}</h2>
            </div>
            <div class="start-screen-body">
                <button class="start-game-btn btn" onclick="startGame()">START GAME</button>
                <button class="how-to-play-btn btn" onclick="showHowToPlay()">HOW TO PLAY</button>
                <button class="impressum-btn btn" onclick="openImpressum()">IMPRESSUM</button>
            </div>
        </div>
    `;
}

/**
 * Generates the HTML string for the main game screen, including canvas and mobile controls.
 * @returns {string} HTML markup for the game screen.
 */
function generateGameHTML() {
    return `
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

                <!-- Canvas direkt in Logikauflösung, CSS skaliert responsiv -->
                <canvas id="canvas" width="960" height="540"></canvas>

                <!-- Mobile Controls: LEFT (D-Pad) -->
                <div id="mobile-ctrl-left" class="mobile-controller-container-left d-none">
                    <button id="ctrl-btn-up"
                            class="mobile-ctrl-btn"
                            aria-label="Move Up"
                            title="Up"
                            oncontextmenu="return false;">
                        <img src="./assets/img/icons/arrow_up.svg"
                             class="ctrl-arrow-img"
                             draggable="false"
                             oncontextmenu="return false;">
                    </button>

                    <div class="mobile-controller-x-control">
                        <button id="ctrl-btn-left"
                                class="mobile-ctrl-btn"
                                aria-label="Move Left"
                                title="Left"
                                oncontextmenu="return false;">
                            <img src="./assets/img/icons/arrow_left.svg"
                                 class="ctrl-arrow-img"
                                 draggable="false"
                                 oncontextmenu="return false;">
                        </button>

                        <button id="ctrl-btn-right"
                                class="mobile-ctrl-btn"
                                aria-label="Move Right"
                                title="Right"
                                oncontextmenu="return false;">
                            <img src="./assets/img/icons/arrow_right.svg"
                                 class="ctrl-arrow-img"
                                 draggable="false"
                                 oncontextmenu="return false;">
                        </button>
                    </div>

                    <button id="ctrl-btn-down"
                            class="mobile-ctrl-btn"
                            aria-label="Move Down"
                            title="Down"
                            oncontextmenu="return false;">
                        <img src="./assets/img/icons/arrow_down.svg"
                             class="ctrl-arrow-img"
                             draggable="false"
                             oncontextmenu="return false;">
                    </button>
                </div>

                <!-- Mobile Controls: RIGHT (Actions) -->
                <div id="mobile-ctrl-right" class="mobile-controller-container-right d-none">
                    <button id="ctrl-btn-fin-slap"
                            class="mobile-ctrl-btn"
                            data-label="FIN"
                            aria-label="Fin Slap"
                            title="Fin Slap"
                            oncontextmenu="return false;"></button>

                    <button id="ctrl-btn-bubble-trap"
                            class="mobile-ctrl-btn"
                            data-label="BUB"
                            aria-label="Bubble"
                            title="Bubble"
                            oncontextmenu="return false;"></button>

                    <button id="ctrl-btn-poison-bubble-trap"
                            class="mobile-ctrl-btn"
                            data-label="PSN"
                            aria-label="Poison Bubble"
                            title="Poison Bubble"
                            oncontextmenu="return false;"></button>
                </div>

                <!-- Mobile Top-Right: Mute & Close (Fullscreen-Button entfernt) -->
                <button id="mobile-mute-btn"
                        class="nav-btn d-none"
                        onclick="toggleSound()"
                        title="Mute/Unmute">
                    <img src="./assets/img/icons/speaker.svg"
                         alt="Mute/Unmute"
                         class="nav-icon"
                         id="sound-img-mobile">
                </button>

                <button id="mobile-close-btn"
                        class="nav-btn d-none"
                        onclick="restartLevel()"
                        title="Exit Game">
                    <img src="./assets/img/icons/close.svg"
                         alt="Close"
                         class="nav-icon">
                </button>
            </div>
        </div>
    `;
}

/**
 * Creates and displays an overlay with gameplay instructions.
 * @returns {void}
 */
function showHowToPlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay-content">
            <h2>How to Play</h2>
            <p>Use the arrow keys (or mobile buttons) to move Sharkie.<br>
               SPACE = Fin Slap<br>
               D = Bubble<br>
               F = Poison Bubble (if collected)</p>
            <button onclick="closeOverlay()">Close</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * Creates and displays an overlay with impressum/legal information.
 * @returns {void}
 */
function openImpressum() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay-content">
            <h2>Impressum</h2>
            <p>Dies ist ein Portfolio-Projekt (Sharkie) im Rahmen der Developer Akademie.</p>
            <button onclick="closeOverlay()">Close</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * Removes the currently open overlay if one exists.
 * @returns {void}
 */
function closeOverlay() {
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();
}
/**
 * Generates HTML for the "level completed" end screen (non-final level).
 * @returns {string} HTML markup for the end screen.
 */
function generateEndScreenHTML() {
  return `
    <div class="end-screen-container">
      <div class="end-screen-header">
        <img class="end-screen-img" src="assets/img/6._Buttons/Titles/You_Win/2.png" alt="Level Completed" />
      </div>
      <div class="end-screen-body">
        <button class="btn" onclick="restartLevel()">Restart Level</button>
        <button class="btn" onclick="nextLevel()">Next Level</button>
      </div>
    </div>
  `;
}

/**
 * Generates HTML for the final end screen shown after completing the last level.
 * @returns {string} HTML markup for the max end screen.
 */
function generateMaxEndScreenHTML() {
  return `
    <div class="end-screen-container">
      <div class="end-screen-header">
        <img class="end-screen-img" src="assets/img/6._Buttons/Titles/You_Win/2.png" alt="Game Completed" />
      </div>
      <div class="end-screen-body">
        <h2 class="max-level-heading">You beat all levels!</h2>
        <button class="btn" onclick="restartGame()">Play Again</button>
        <button class="btn" onclick="(function(){ try { currentLevel = 0; maxLevelReached = false; saveToLocalStorage(); } catch(e){} renderStartScreen(); })()">Back to Menu</button>
      </div>
    </div>
  `;
}

/**
 * Generates HTML for the game over screen when the player dies.
 * @returns {string} HTML markup for the game over screen.
 */
function generateGameOverScreenHTML() {
  return `
    <div class="end-screen-container">
      <div class="end-screen-header">
        <img class="end-screen-img" src="assets/img/6._Buttons/Titles/Game_Over/5.png" alt="Game Over" />
      </div>
      <div class="end-screen-body">
        <button class="btn" onclick="restartLevel()">Retry Level</button>
        <button class="btn" onclick="restartGame()">Restart Game</button>
      </div>
    </div>
  `;
}