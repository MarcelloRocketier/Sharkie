/**
 * @file game.js
 * @description
 * Manages global game state, initialization, user interface handling, keyboard and touch controls, and localStorage persistence for the Sharkie game.
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

// Load saved game settings from localStorage
loadFromLocalStorage();


/**
 * Initializes the game, preloads assets, loads settings, updates the UI, and sets up device-specific features.
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
        document.getElementById('settings-menu-container').classList.add('scroll-enabled');
        document.getElementById('help-container').classList.add('scroll-enabled');
    }

    checkForLevelWin();
    renderStartScreen();
}

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
 * Preloads all required images for the game.
 */
function preload() {
    const groups = [
        SHARKIE_IMAGES.IDLE,
        SHARKIE_IMAGES.LONG_IDLE,
        SHARKIE_IMAGES.SWIM,
        SHARKIE_IMAGES.HURT_POISONED,
        SHARKIE_IMAGES.HURT_ELECTRIC_SHOCK,
        SHARKIE_IMAGES.DIE_POISONED,
        SHARKIE_IMAGES.DIE_ELECTRIC_SHOCK,
        SHARKIE_IMAGES.FIN_SLAP,
        SHARKIE_IMAGES.BUBBLE_TRAP,
        ENDBOSS_IMAGES.INTRODUCE,
        ENDBOSS_IMAGES.FLOATING,
        ENDBOSS_IMAGES.HURT,
        ENDBOSS_IMAGES.DEAD,
        ENDBOSS_IMAGES.ATTACK,
        JELLYFISH_DANGEROUS_IMAGES.SWIM.green,
        JELLYFISH_DANGEROUS_IMAGES.SWIM.pink,
        JELLYFISH_DANGEROUS_IMAGES.DEAD.green,
        JELLYFISH_DANGEROUS_IMAGES.DEAD.pink,
        JELLYFISH_REGULAR_IMAGES.SWIM.lila,
        JELLYFISH_REGULAR_IMAGES.SWIM.yellow,
        JELLYFISH_REGULAR_IMAGES.DEAD.lila,
        JELLYFISH_REGULAR_IMAGES.DEAD.yellow,
        PUFFER_FISH_IMAGES.SWIM.green,
        PUFFER_FISH_IMAGES.SWIM.orange,
        PUFFER_FISH_IMAGES.SWIM.red,
        PUFFER_FISH_IMAGES.DEAD.green,
        PUFFER_FISH_IMAGES.DEAD.orange,
        PUFFER_FISH_IMAGES.DEAD.red,
        STATUS_BAR_IMAGES.IMAGES.coins.green,
        STATUS_BAR_IMAGES.IMAGES.coins.orange,
        STATUS_BAR_IMAGES.IMAGES.coins.purple,
        STATUS_BAR_IMAGES.IMAGES.life.green,
        STATUS_BAR_IMAGES.IMAGES.life.orange,
        STATUS_BAR_IMAGES.IMAGES.life.purple,
        STATUS_BAR_IMAGES.IMAGES.poison.green,
        STATUS_BAR_IMAGES.IMAGES.poison.orange,
        STATUS_BAR_IMAGES.IMAGES.poison.purple,
        BACKGROUND_IMAGES.IMAGES.dark[1],
        BACKGROUND_IMAGES.IMAGES.dark[2],
        POISON_IMAGES.IMAGES.animated,
        POISON_IMAGES.IMAGES.light_left,
        POISON_IMAGES.IMAGES.light_right,
        POISON_IMAGES.IMAGES.dark_left,
        POISON_IMAGES.IMAGES.dark_right
    ];
    groups.forEach(preloadImages);
}

/**
 * Preloads an array of image URLs.
 * @param {string[]} array - Array of image URLs to preload.
 */
function preloadImages(array) {
    for (let i = 0; i < array.length; i++) {
        preloadImage(array[i]);
    }
}

/**
 * Preloads a single image by URL.
 * @param {string} url - The image URL to preload.
 */
function preloadImage(url) {
    const img = new Image();
    img.src = url;
}

// Map für Tastencodes zu Key-Flags
const KEY_MAP = { 32:'SPACE', 37:'LEFT', 38:'UP', 39:'RIGHT', 40:'DOWN', 68:'D', 70:'F' };
// Keyboard-Events
window.addEventListener('keydown', (e) => { const k = KEY_MAP[e.keyCode]; if (k) keyboard[k] = true; });
window.addEventListener('keyup',   (e) => { const k = KEY_MAP[e.keyCode]; if (k) keyboard[k] = false; });


/**
 * Checks if the current device is a mobile or tablet using user agent sniffing.
 * @returns {boolean} True if the device is mobile or tablet, false otherwise.
 */
window.mobileAndTabletCheck = function() {
    let isMobile = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return isMobile;
};

/**
 * Adjusts the canvas-wrapper size to maintain 16:9 aspect ratio
 * and fit maximally into the current viewport.
 */
function fitCanvasToViewport() {
    const wrapper = document.getElementById('canvas-wrapper');
if (!wrapper) return;

// Fullscreen fill (Variant B): no letterboxing, allow stretch
wrapper.style.top = '0';
wrapper.style.left = '0';
wrapper.style.right = '0';
wrapper.style.bottom = '0';
wrapper.style.transform = 'none';

wrapper.style.width = `${window.innerWidth}px`;
wrapper.style.height = `${window.innerHeight}px`;
}

/**
 * Starts the game by rendering the game UI, initializing the world, and setting up controls.
 */
function startGame() {
    const content = document.getElementById('content');
    content.innerHTML = generateGameHTML();
    fitCanvasToViewport();
    window.addEventListener('resize', fitCanvasToViewport);
    window.addEventListener('orientationchange', fitCanvasToViewport);

    if (typeof initSoundUI === 'function') initSoundUI();
    updateUI();

    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    if (window.mobileAndTabletCheck()) {
        document.getElementById('mobile-ctrl-left').classList.remove('d-none');
        document.getElementById('mobile-ctrl-right').classList.remove('d-none');
        setupMobileControls();
    }

    document.getElementById('toggle-fullscreen-btn').classList.remove('d-none');
}

/**
 * Renders the start screen UI.
 */
function renderStartScreen() {
    const content = document.getElementById('content');
    content.innerHTML = generateStartScreenHTML();
    updateUI();
}

/**
 * Periodically checks for level win, game over, or max level, and updates the screen accordingly.
 */
function checkForLevelWin() {
    setInterval(() => {
        if (endBossKilled && !levelEnded && !maxLevelReached) {
            setTimeout(() => {
                const content = document.getElementById('content');
                content.innerHTML = generateEndScreenHTML();

                if (soundOn && !levelEnded) {
                    WIN_SOUND.play();
                }

                levelEnded = true;
            }, 3000);
        } else if (endBossKilled && !levelEnded && maxLevelReached) {
            setTimeout(() => {
                const content = document.getElementById('content');
                content.innerHTML = generateMaxEndScreenHTML();

                if (soundOn && !levelEnded) {
                    WIN_SOUND.play();
                }

                levelEnded = true;
            }, 3000);
        } else if (characterIsDead && !levelEnded) {
            setTimeout(() => {
                const content = document.getElementById('content');
                content.innerHTML = generateGameOverScreenHTML();

                if (soundOn && !levelEnded) {
                    GAME_OVER_SOUND.play();
                }

                levelEnded = true;
            }, 3000);
        }
    }, 250)
}

/**
 * Saves the current game state to localStorage.
 */
function saveToLocalStorage() {
    let currentLevelAsString = JSON.stringify(currentLevel);
    localStorage.setItem('currentLevel', currentLevelAsString);

    let soundOnAsString = JSON.stringify(soundOn);
    localStorage.setItem('soundOn', soundOnAsString);
}

/**
 * Loads the game state from localStorage, including current level and sound settings.
 */
function loadFromLocalStorage() {
    let currentLevelAsString = localStorage.getItem('currentLevel');
    currentLevel = JSON.parse(currentLevelAsString);

    // Prüfe, ob currentLevel gültig ist (0 <= currentLevel < levels.length)
    if (typeof currentLevel !== 'number' || currentLevel < 0 || currentLevel >= levels.length) {
        currentLevel = 0;
        saveToLocalStorage();  // Setze den Wert im LocalStorage zurück
    }

    let soundOnAsString = localStorage.getItem('soundOn');
    soundOn = JSON.parse(soundOnAsString);
}

/**
 * Restarts the current level, resetting relevant game state.
 */
function restartLevel() {
    levelEnded = false;
    characterIsDead = false;
    endBossKilled = false;
    startGame();
}

/**
 * Advances to the next level if available, saves state, and starts the game.
 */
function nextLevel() {
    if (!maxLevelReached && currentLevel < levels.length - 1) {
        currentLevel++;
        if (currentLevel >= levels.length - 1) {
            maxLevelReached = true;
        }
        saveToLocalStorage();
        startGame();
    }
}

/**
 * Restarts the game from the first level, resetting all progress.
 */
function restartGame() {
    currentLevel = 0;
    maxLevelReached = false;
    levelEnded = false;
    characterIsDead = false;
    endBossKilled = false;
    saveToLocalStorage();
    startGame();
}

/**
 * Toggles the visibility of the settings menu.
 */
function toggleSettingsMenu() {
    document.getElementById('settings-menu-container').classList.toggle('d-none');
}

/**
 * Toggles the visibility of the help site.
 */
function toggleHelpSite() {
    document.getElementById('help-container').classList.toggle('d-none');
}

/**
 * Toggles sound on or off, updates icons, and saves state.
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
 * Toggles fullscreen mode and updates the UI and saved state.
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
 * Updates the UI elements for sound and fullscreen status.
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

    // Update fullscreen checkbox every 250ms (register once)
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

/**
 * Sets up touch event handlers for mobile controls to update the keyboard object.
 */
function setupMobileControls() {
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
}