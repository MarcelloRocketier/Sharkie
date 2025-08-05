/**
 * Bildpfade für Animationen von Sharkie & Gegnern
 * Struktur: SHARKIE_IMAGES['IDLE'] → Array mit Bildpfaden
 */

const SHARKIE_IMAGES = {
    IDLE: Array.from({ length: 18 }, (_, i) => `./assets/img/1._Sharkie/1._Idle/${i + 1}.png`),

    LONG_IDLE: Array.from({ length: 14 }, (_, i) => `./assets/img/1._Sharkie/2._Long_Idle/${i + 1}.png`),

    SWIM: Array.from({ length: 6 }, (_, i) => `./assets/img/1._Sharkie/3._Swim/${i + 1}.png`),

    HURT_POISONED: [
        './assets/img/1._Sharkie/5._Hurt/1._Poisoned/1.png',
        './assets/img/1._Sharkie/5._Hurt/1._Poisoned/2.png',
        './assets/img/1._Sharkie/5._Hurt/1._Poisoned/3.png',
        './assets/img/1._Sharkie/5._Hurt/1._Poisoned/4.png'
    ],

    HURT_ELECTRIC_SHOCK: [
        './assets/img/1._Sharkie/5._Hurt/2._Electric_Shock/1.png',
        './assets/img/1._Sharkie/5._Hurt/2._Electric_Shock/2.png',
        './assets/img/1._Sharkie/5._Hurt/2._Electric_Shock/3.png'
    ],

    DIE_POISONED: Array.from({ length: 12 }, (_, i) => `./assets/img/1._Sharkie/6._Dead/1._Poisoned/${i + 1}.png`),

    DIE_ELECTRIC_SHOCK: Array.from({ length: 10 }, (_, i) => `./assets/img/1._Sharkie/6._Dead/2._Electric_Shock/${i + 1}.png`),

    FIN_SLAP: Array.from({ length: 8 }, (_, i) => `./assets/img/1._Sharkie/4._Attack/Fin_Slap/${i + 1}.png`),

    BUBBLE_TRAP: Array.from({ length: 8 }, (_, i) => `./assets/img/1._Sharkie/4._Attack/Bubble_Trap/Op1_(With_Bubble_Formation)/${i + 1}.png`)
};


const ENDBOSS_IMAGES = {
    INTRODUCE: getImageArray('1._Introduce', 10),
    FLOATING: getImageArray('2._Floating', 13),
    HURT: getImageArray('Hurt', 4),
    DEAD: getImageArray('Dead', 6),
    ATTACK: getImageArray('Attack', 6)
};

function getImageArray(folder, amount) {
    return Array.from({ length: amount }, (_, i) => `./assets/img/2._Enemy/3._Final_Enemy/${folder}/${i + 1}.png`);
}


const JELLYFISH_DANGEROUS_IMAGES = {
    SWIM: {
        green: getJellyfish('Super_Dangerous', 'Green', 4),
        pink: getJellyfish('Super_Dangerous', 'Pink', 4)
    },
    DEAD: {
        green: getJellyfish('Dead/Green', 'G', 4),
        pink: getJellyfish('Dead/Pink', 'P', 4)
    }
};


const JELLYFISH_REGULAR_IMAGES = {
    SWIM: {
        lila: getJellyfish('Regular_Damage', 'Lila', 4),
        yellow: getJellyfish('Regular_Damage', 'Yellow', 4)
    },
    DEAD: {
        lila: getJellyfish('Dead/Lila', 'L', 4),
        yellow: getJellyfish('Dead/Yellow', 'Y', 4)
    }
};


function getJellyfish(path, color, count) {
    return Array.from({ length: count }, (_, i) =>
        `./assets/img/2._Enemy/2._Jellyfish/${path}/${color}_${i + 1}.png`
    );
}


const PUFFER_FISH_IMAGES = {
    SWIM: {
        green: getPufferSet('1', '1'),
        orange: getPufferSet('2', '2'),
        red: getPufferSet('3', '3')
    },
    DEAD: {
        green: ['./assets/img/2._Enemy/1._Puffer_Fish_(3_Color_Options)/4._Dead/1._Dead_1.png'],
        orange: ['./assets/img/2._Enemy/1._Puffer_Fish_(3_Color_Options)/4._Dead/2._Dead_1.png'],
        red: ['./assets/img/2._Enemy/1._Puffer_Fish_(3_Color_Options)/4._Dead/3._Dead_1.png']
    }
};

function getPufferSet(colorIndex, swimNum) {
    const swim = Array.from({ length: 5 }, (_, i) =>
        `./assets/img/2._Enemy/1._Puffer_Fish_(3_Color_Options)/1._Swim/${swimNum}._Swim_${i + 1}.png`
    );

    const trans = Array.from({ length: 5 }, (_, i) =>
        `./assets/img/2._Enemy/1._Puffer_Fish_(3_Color_Options)/2._Transition/${colorIndex}._Transition_${i + 1}.png`
    );

    const transBack = [...trans].reverse();

    return [...swim, ...trans, ...transBack];
}


const STATUS_BAR_IMAGES = {
    IMAGES: {
        coins: getBarImages('Coins'),
        life: getBarImages('Life'),
        poison: getBarImages('Poison')
    }
};

function getBarImages(type) {
    return {
        green: getBarSet(type, 'Green'),
        orange: getBarSet(type, 'Orange'),
        purple: getBarSet(type, 'Purple')
    };
}

function getBarSet(type, color) {
    return [0, 20, 40, 60, 80, 100].map(p =>
        `./assets/img/4._Marks/Status_Bars/${type}/${color}/${p}.png`
    );
}


const BACKGROUND_IMAGES = {
    IMAGES: {
        light: {
            1: getBackgroundSet('L1', '1'),
            2: getBackgroundSet('L2', '2')
        },
        dark: {
            1: getBackgroundSet('D1', '1'),
            2: getBackgroundSet('D2', '2')
        }
    }
};

function getBackgroundSet(floorType, lightId) {
    return [
        `./assets/img/3._Background/Layers/5._Water/${floorType}.png`,
        `./assets/img/3._Background/Layers/4._Background_2/${floorType}.png`,
        `./assets/img/3._Background/Layers/3._Background_1/${floorType}.png`,
        `./assets/img/3._Background/Layers/2._Floor/${floorType}.png`,
        `./assets/img/3._Background/Layers/1._Light/${lightId}.png`
    ];
}


const POISON_IMAGES = {
    IMAGES: {
        animated: Array.from({ length: 8 }, (_, i) => `./assets/img/4._Marks/Poison/Animated/${i + 1}.png`),
        light_left: ['./assets/img/4._Marks/Poison/Light_Left.png'],
        light_right: ['./assets/img/4._Marks/Poison/Light_Right.png'],
        dark_left: ['./assets/img/4._Marks/Poison/Dark_Left.png'],
        dark_right: ['./assets/img/4._Marks/Poison/Dark_Right.png']
    }
};