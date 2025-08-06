'use strict';

// ################################################### Global variables ###################################################

let canvas;
let world;
let keyboard = new Keyboard();
let soundOn = true;
let fullscreen = false;
let endBossKilled = false;
let characterIsDead = false;
let levelEnded = false;
let levels = [
    level_1,
    level_2
];
let currentLevel;
let maxLevelReached = false;
let WIN_SOUND = new Audio('./assets/audio/congrats.mp3');
let GAME_OVER_SOUND = new Audio('./assets/audio/game_over.mp3');
let loading = true;

// Load saved game settings from localStorage
loadFromLocalStorage();

// ################################################### Game initialization ###################################################

function init() {
    preload();
    loadFromLocalStorage();
    updateUI();

    if (currentLevel == null) {
        currentLevel = 0;
    } else if (currentLevel >= levels.length - 1) {
        maxLevelReached = true;
    }

    if (mobileAndTabletCheck()) {
        document.getElementById('settings-menu-container').classList.add('scroll-enabled');
        document.getElementById('help-container').classList.add('scroll-enabled');
    }

    checkForLevelWin();
    renderStartScreen();
}

// ################################################### Loading screen handling ###################################################

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

// ################################################### Preload all necessary images ###################################################

function preload() {
    preloadImages(SHARKIE_IMAGES['IDLE']);
    preloadImages(SHARKIE_IMAGES['LONG_IDLE']);
    preloadImages(SHARKIE_IMAGES['SWIM']);
    preloadImages(SHARKIE_IMAGES['HURT_POISONED']);
    preloadImages(SHARKIE_IMAGES['HURT_ELECTRIC_SHOCK']);
    preloadImages(SHARKIE_IMAGES['DIE_POISONED']);
    preloadImages(SHARKIE_IMAGES['DIE_ELECTRIC_SHOCK']);
    preloadImages(SHARKIE_IMAGES['FIN_SLAP']);
    preloadImages(SHARKIE_IMAGES['BUBBLE_TRAP']);
    preloadImages(ENDBOSS_IMAGES['INTRODUCE']);
    preloadImages(ENDBOSS_IMAGES['FLOATING']);
    preloadImages(ENDBOSS_IMAGES['HURT']);
    preloadImages(ENDBOSS_IMAGES['DEAD']);
    preloadImages(ENDBOSS_IMAGES['ATTACK']);
    preloadImages(JELLYFISH_DANGEROUS_IMAGES['SWIM']['green']);
    preloadImages(JELLYFISH_DANGEROUS_IMAGES['SWIM']['pink']);
    preloadImages(JELLYFISH_DANGEROUS_IMAGES['DEAD']['green']);
    preloadImages(JELLYFISH_DANGEROUS_IMAGES['DEAD']['pink']);
    preloadImages(JELLYFISH_REGULAR_IMAGES['SWIM']['lila']);
    preloadImages(JELLYFISH_REGULAR_IMAGES['SWIM']['yellow']);
    preloadImages(JELLYFISH_REGULAR_IMAGES['DEAD']['lila']);
    preloadImages(JELLYFISH_REGULAR_IMAGES['DEAD']['yellow']);
    preloadImages(PUFFER_FISH_IMAGES['SWIM']['green']);
    preloadImages(PUFFER_FISH_IMAGES['SWIM']['orange']);
    preloadImages(PUFFER_FISH_IMAGES['SWIM']['red']);
    preloadImages(PUFFER_FISH_IMAGES['DEAD']['green']);
    preloadImages(PUFFER_FISH_IMAGES['DEAD']['orange']);
    preloadImages(PUFFER_FISH_IMAGES['DEAD']['red']);
    preloadImages(STATUS_BAR_IMAGES['IMAGES']['coins']['green']);
    preloadImages(STATUS_BAR_IMAGES['IMAGES']['coins']['orange']);
    preloadImages(STATUS_BAR_IMAGES['IMAGES']['coins']['purple']);
    preloadImages(STATUS_BAR_IMAGES['IMAGES']['life']['green']);
    preloadImages(STATUS_BAR_IMAGES['IMAGES']['life']['orange']);
    preloadImages(STATUS_BAR_IMAGES['IMAGES']['life']['purple']);
    preloadImages(STATUS_BAR_IMAGES['IMAGES']['poison']['green']);
    preloadImages(STATUS_BAR_IMAGES['IMAGES']['poison']['orange']);
    preloadImages(STATUS_BAR_IMAGES['IMAGES']['poison']['purple']);
    preloadImages(BACKGROUND_IMAGES['IMAGES']['light'][1]);
    preloadImages(BACKGROUND_IMAGES['IMAGES']['light'][2]);
    preloadImages(BACKGROUND_IMAGES['IMAGES']['dark'][1]);
    preloadImages(BACKGROUND_IMAGES['IMAGES']['dark'][2]);
    preloadImages(POISON_IMAGES['IMAGES']['animated']);
    preloadImages(POISON_IMAGES['IMAGES']['light_left']);
    preloadImages(POISON_IMAGES['IMAGES']['light_right']);
    preloadImages(POISON_IMAGES['IMAGES']['dark_left']);
    preloadImages(POISON_IMAGES['IMAGES']['dark_right']);
}

function preloadImages(array) {
    for (let i = 0; i < array.length; i++) {
        preloadImage(array[i]);
    }
}

function preloadImage(url) {
    const img = new Image();
    img.src = url;
}

// ################################################### Keyboard event handlers ###################################################

window.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
        case 32:
            keyboard.SPACE = true;
            break;
        case 37:
            keyboard.LEFT = true;
            break;
        case 38:
            keyboard.UP = true;
            break;
        case 39:
            keyboard.RIGHT = true;
            break;
        case 40:
            keyboard.DOWN = true;
            break;
        case 68:
            keyboard.D = true;
            break;
        case 70:
            keyboard.F = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.keyCode) {
        case 32:
            keyboard.SPACE = false;
            break;
        case 37:
            keyboard.LEFT = false;
            break;
        case 38:
            keyboard.UP = false;
            break;
        case 39:
            keyboard.RIGHT = false;
            break;
        case 40:
            keyboard.DOWN = false;
            break;
        case 68:
            keyboard.D = false;
            break;
        case 70:
            keyboard.F = false;
            break;
    }
});

// ################################################### Mobile device detection ###################################################

window.mobileAndTabletCheck = function() {
    let isMobile = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return isMobile;
};

// ################################################### Main game control functions ###################################################

function startGame() {
    content.innerHTML = generateGameHTML();

    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    document.getElementById('toggle-fullscreen-btn').classList.remove('d-none');
}

function renderStartScreen() {
    content.innerHTML = generateStartScreenHTML();
}

function checkForLevelWin() {
    setInterval(() => {
        if (endBossKilled && !levelEnded && !maxLevelReached) {
            setTimeout(() => {
                content.innerHTML = generateEndScreenHTML();

                if (soundOn && !levelEnded) {
                    WIN_SOUND.play();
                }

                levelEnded = true;
            }, 3000);
        } else if (endBossKilled && !levelEnded && maxLevelReached) {
            setTimeout(() => {
                content.innerHTML = generateMaxEndScreenHTML();

                if (soundOn && !levelEnded) {
                    WIN_SOUND.play();
                }

                levelEnded = true;
            }, 3000);
        } else if (characterIsDead && !levelEnded) {
            setTimeout(() => {
                content.innerHTML = generateGameOverScreenHTML();

                if (soundOn && !levelEnded) {
                    GAME_OVER_SOUND.play();
                }

                levelEnded = true;
            }, 3000);
        }
    }, 250)
}

function saveToLocalStorage() {
    let currentLevelAsString = JSON.stringify(currentLevel);
    localStorage.setItem('currentLevel', currentLevelAsString);

    let soundOnAsString = JSON.stringify(soundOn);
    localStorage.setItem('soundOn', soundOnAsString);
}

function loadFromLocalStorage() {
    let currentLevelAsString = localStorage.getItem('currentLevel');
    currentLevel = JSON.parse(currentLevelAsString);

    let soundOnAsString = localStorage.getItem('soundOn');
    soundOn = JSON.parse(soundOnAsString);
}

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

// ################################################### Navbar interaction handlers ###################################################

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

    if (soundOn) {
        document.getElementById('sound-img').src = './assets/img/icons/speaker.svg';
    } else {
        document.getElementById('sound-img').src = './assets/img/icons/mute.svg';
    }

    saveToLocalStorage();
    updateUI();
}

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

    // Update fullscreen checkbox every 250ms
    setInterval(() => {
        function fs_status() {
            return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
        }

        if (fs_status()) {
            document.getElementById('fullscreen-checkbox').checked = true;
        } else {
            document.getElementById('fullscreen-checkbox').checked = false;
            fullscreen = false;
        }
    }, 250)
}