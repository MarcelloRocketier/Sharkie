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
 * Öffnet ein Overlay mit Spielanleitung.
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
 * Öffnet ein Overlay mit Impressum.
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
 * Schließt das aktuell offene Overlay.
 */
function closeOverlay() {
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();
}
/**
 * Overlay: End Screen after defeating Endboss.
 */
function generateEndScreenHTML() {
    return `
        <div id="end-screen" class="overlay">
            <div class="overlay-content">
                <h2>Level Completed!</h2>
                <p>Congratulations! You defeated the Endboss.</p>
                <button onclick="restartLevel()">Restart Level</button>
                <button onclick="nextLevel()">Next Level</button>
                <button onclick="closeOverlay()">Close</button>
            </div>
        </div>
    `;
}

/**
 * Overlay: End Screen if the last level (max level) is finished.
 */
function generateMaxEndScreenHTML() {
    return `
        <div id="max-end-screen" class="overlay">
            <div class="overlay-content">
                <h2>Game Completed!</h2>
                <p>You have beaten all levels of Sharkie. Well done!</p>
                <button onclick="restartGame()">Play Again</button>
                <button onclick="closeOverlay()">Close</button>
            </div>
        </div>
    `;
}

/**
 * Overlay: Game Over Screen when Sharkie dies.
 */
function generateGameOverScreenHTML() {
    return `
        <div id="game-over-screen" class="overlay">
            <div class="overlay-content">
                <h2>Game Over</h2>
                <p>Sharkie has been defeated. Try again!</p>
                <button onclick="restartLevel()">Restart Level</button>
                <button onclick="closeOverlay()">Close</button>
            </div>
        </div>
    `;
}