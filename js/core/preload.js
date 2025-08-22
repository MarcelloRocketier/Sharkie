

/**
 * Project: Sharkie 2D Game
 * File: js/core/preload.js
 * Responsibility: Preloads all required images for the game (grouped by entity).
 * Notes: Extracted from game.js to reduce file size and centralize preload logic.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

'use strict';

/**
 * Preloads all required images for the game.
 * @returns {void}
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
 * @returns {void}
 */
function preloadImages(array) {
    for (let i = 0; i < array.length; i++) {
        preloadImage(array[i]);
    }
}

/**
 * Preloads a single image by URL.
 * @param {string} url - The image URL to preload.
 * @returns {void}
 */
function preloadImage(url) {
    const img = new Image();
    img.src = url;
}