'use strict';


/** ------------------------- Globale Variablen ------------------------- **/

let canvas;
let world;
let keyboard = new Keyboard();
let soundOn = true;
let fullscreen = false;
let debugMode = true;
let debugLevelDesignHelper = false;
let debugLogStatements = false;
let debugLevelNr = 0;
let endBossKilled = false;
let characterIsDead = false;
let levelEnded = false;
let levels = [level_1, level_2];
let currentLevel;
let maxLevelReached = false;
let WIN_SOUND = new Audio('./assets/audio/congrats.mp3');
let GAME_OVER_SOUND = new Audio('./assets/audio/game_over.mp3');
let loading = true;

loadFromLocalStorage();


/** ------------------------- Initialisierung ------------------------- **/

function init() {
    preload();
    loadFromLocalStorage();
    updateUI();

    currentLevel = currentLevel ?? 0;
    maxLevelReached = currentLevel >= levels.length - 1;

    if (mobileAndTabletCheck()) {
        document.getElementById('settings-menu-container').classList.add('scroll-enabled');
        document.getElementById('help-container').classList.add('scroll-enabled');
    }

    checkForLevelWin();
    renderStartScreen();
}


/** ------------------------- Loading Screen ------------------------- **/

document.onreadystatechange = () => {
    const state = document.readyState;

    if (state === 'interactive') {
        loading = true;
        document.getElementById('loading-screen').classList.remove('d-none');
    } else if (state === 'complete') {
        setTimeout(() => {
            loading = false;
            document.getElementById('loading-screen').classList.add('d-none');
        }, 5000);
    }
}


/** ------------------------- Ressourcen laden ------------------------- **/

function preload() {
    const allImages = [
        ...Object.values(SHARKIE_IMAGES).flat(),
        ...Object.values(ENDBOSS_IMAGES).flat(),
        ...Object.values(JELLYFISH_DANGEROUS_IMAGES).flatMap(group => Object.values(group).flat()),
        ...Object.values(JELLYFISH_REGULAR_IMAGES).flatMap(group => Object.values(group).flat()),
        ...Object.values(PUFFER_FISH_IMAGES).flatMap(group => Object.values(group).flat()),
        ...Object.values(STATUS_BAR_IMAGES.IMAGES.coins),
        ...Object.values(STATUS_BAR_IMAGES.IMAGES.life),
        ...Object.values(STATUS_BAR_IMAGES.IMAGES.poison),
        ...Object.values(BACKGROUND_IMAGES.IMAGES.light),
        ...Object.values(BACKGROUND_IMAGES.IMAGES.dark),
        ...Object.values(POISON_IMAGES.IMAGES).flat()
    ];

    allImages.forEach(preloadImage);
}

function preloadImage(url) {
    const img = new Image();
    img.src = url;
}


/** ------------------------- Tastatureingaben ------------------------- **/

window.addEventListener('keydown', (e) => {
    if (debugMode && debugLogStatements) console.log('Keydown:', e);

    switch (e.keyCode) {
        case 32: keyboard.SPACE = true; break;
        case 37: keyboard.LEFT = true; break;
        case 38: keyboard.UP = true; break;
        case 39: keyboard.RIGHT = true; break;
        case 40: keyboard.DOWN = true; break;
        case 68: keyboard.D = true; break;
        case 70: keyboard.F = true; break;
    }
});

window.addEventListener('keyup', (e) => {
    if (debugMode && debugLogStatements) console.log('Keyup:', e);

    switch (e.keyCode) {
        case 32: keyboard.SPACE = false; break;
        case 37: keyboard.LEFT = false; break;
        case 38: keyboard.UP = false; break;
        case 39: keyboard.RIGHT = false; break;
        case 40: keyboard.DOWN = false; break;
        case 68: keyboard.D = false; break;
        case 70: keyboard.F = false; break;
    }
});


/** ------------------------- Geräteerkennung ------------------------- **/

window.mobileAndTabletCheck = function () {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iphone|ipad|ipod|windows phone|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
};


/** ------------------------- Spielfunktionen ------------------------- **/

function startGame() {
    document.getElementById('content').innerHTML = generateGameHTML();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    document.getElementById('toggle-fullscreen-btn').classList.remove('d-none');
}

function renderStartScreen() {
    document.getElementById('content').innerHTML = generateStartScreenHTML();
}

function checkForLevelWin() {
    setInterval(() => {
        if (endBossKilled && !levelEnded) {
            const show = () => {
                content.innerHTML = maxLevelReached ? generateMaxEndScreenHTML() : generateEndScreenHTML();
                if (soundOn) WIN_SOUND.play();
                levelEnded = true;
            };
            setTimeout(show, 3000);
        } else if (characterIsDead && !levelEnded) {
            setTimeout(() => {
                content.innerHTML = generateGameOverScreenHTML();
                if (soundOn) GAME_OVER_SOUND.play();
                levelEnded = true;
            }, 3000);
        }
    }, 250);
}


/** ------------------------- Local Storage ------------------------- **/

function saveToLocalStorage() {
    localStorage.setItem('currentLevel', JSON.stringify(currentLevel));
    localStorage.setItem('soundOn', JSON.stringify(soundOn));
    localStorage.setItem('debugMode', JSON.stringify(debugMode));
    localStorage.setItem('debugLogStatements', JSON.stringify(debugLogStatements));
    localStorage.setItem('debugLevelDesignHelper', JSON.stringify(debugLevelDesignHelper));
    localStorage.setItem('debugLevelNr', JSON.stringify(debugLevelNr));
}

function loadFromLocalStorage() {
    currentLevel = JSON.parse(localStorage.getItem('currentLevel'));
    soundOn = JSON.parse(localStorage.getItem('soundOn'));
    debugMode = JSON.parse(localStorage.getItem('debugMode'));
    debugLogStatements = JSON.parse(localStorage.getItem('debugLogStatements'));
    debugLevelDesignHelper = JSON.parse(localStorage.getItem('debugLevelDesignHelper'));
    debugLevelNr = JSON.parse(localStorage.getItem('debugLevelNr'));
}


/** ------------------------- Level-Navigation ------------------------- **/

function restartLevel() {
    window.location.reload();
}

function nextLevel() {
    if (currentLevel < levels.length && !maxLevelReached) {
        currentLevel++;
        saveToLocalStorage();
        window.location.reload();
    }
}

function restartGame() {
    currentLevel = 0;
    saveToLocalStorage();
    window.location.reload();
}


/** ------------------------- Menü-Interaktionen ------------------------- **/

function toggleSettingsMenu() {
    document.getElementById('settings-menu-container').classList.toggle('d-none');
    document.getElementById('img-attribution').classList.toggle('d-none');
}

function toggleHelpSite() {
    document.getElementById('help-container').classList.toggle('d-none');
    document.getElementById('img-attribution').classList.toggle('d-none');
}

function toggleSound() {
    soundOn = !soundOn;
    document.getElementById('sound-img').src = soundOn
        ? './assets/img/icons/speaker.svg'
        : './assets/img/icons/mute.svg';
    saveToLocalStorage();
    updateUI();
}

function toggleFullscreen() {
    fullscreen = !fullscreen;
    const elem = document.getElementById('fullscreen-container');
    if (elem) {
        fullscreen && elem.requestFullscreen();
    }
    saveToLocalStorage();
    updateUI();
}

function toggleDebugMode() {
    debugMode = !debugMode;
    document.getElementById('debugMode-checkbox').checked = debugMode;
    saveToLocalStorage();
    updateUI();
    window.location.reload();
}

function toggleDebugLogStatements() {
    debugLogStatements = !debugLogStatements;
    document.getElementById('debugLogStatements-checkbox').checked = debugLogStatements;
    saveToLocalStorage();
    updateUI();
}

function toggleDebugLevelDesignHelper() {
    debugLevelDesignHelper = !debugLevelDesignHelper;
    document.getElementById('debugLevelDesignHelper-checkbox').checked = debugLevelDesignHelper;
    saveToLocalStorage();
    updateUI();
    window.location.reload();
}

function selectDebugLevelNr() {
    debugLevelNr = parseInt(document.getElementById('debugLevelNr-select').value);
    currentLevel = debugLevelNr;
    saveToLocalStorage();
    updateUI();
    window.location.reload();
}


/** ------------------------- UI Updates ------------------------- **/

function updateUI() {
    const setChecked = (id, state) => document.getElementById(id).checked = state;

    document.getElementById('sound-img').src = soundOn
        ? './assets/img/icons/speaker.svg'
        : './assets/img/icons/mute.svg';

    setChecked('sound-checkbox', soundOn);
    if (document.getElementById('sound-img-mobile')) {
        document.getElementById('sound-img-mobile').src = soundOn
            ? './assets/img/icons/speaker.svg'
            : './assets/img/icons/mute.svg';
    }

    setChecked('debugMode-checkbox', debugMode);
    setChecked('debugLogStatements-checkbox', debugLogStatements);
    setChecked('debugLevelDesignHelper-checkbox', debugLevelDesignHelper);
    document.getElementById('debugLevelNr-select').value = debugLevelNr;

    setInterval(() => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
        setChecked('fullscreen-checkbox', isFullscreen);
        fullscreen = isFullscreen;
    }, 250);
}