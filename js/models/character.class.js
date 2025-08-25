/**
 * Project: Sharkie 2D Game
 * File: js/models/character.class.js
 * Responsibility: Core Character definition (fields, timers, constructor).
 * Notes: Logic split into character.core.js, character.animation.js, character.attacks.js, character.controls.js, character.sounds.js
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */
class Character extends MovableObject {
    world;
    width = 300;
    height = 300;
    x = 0;
    y = 100;
    offset = {
        x: 55,
        y: 140,
        width: 55,
        height: 65,
        bubbleX: 220,
        bubbleY: 165
    }
    speed = 4;
    energy = 100;
    attack = 10;
    coins = 0;
    poison = 0;
    imgMirrored = false;
    lastMove = new Date().getTime();
    secondsUntilLongIdle = 10;
    hitBy;
    isAlreadyDead;
    isFinSlapping = false;
    isBubbleTrapping = false;
    isCollidingWithBarrier = false;
    isCollidingWithBarrierUp = false;
    isCollidingWithBarrierRight = false;
    isCollidingWithBarrierDown = false;
    isCollidingWithBarrierLeft = false;
    touchCtrlUpStart = false;
    touchCtrlUpEnd = false;
    touchCtrlRightStart = false;
    touchCtrlRightEnd = false;
    touchCtrlDownStart = false;
    touchCtrlDownEnd = false;
    touchCtrlLeftStart = false;
    touchCtrlLeftEnd = false;
    touchCtrlFinSlapStart = false;
    touchCtrlFinSlapEnd = false;
    touchCtrlBubbleTrapStart = false;
    touchCtrlBubbleTrapEnd = false;
    touchCtrlPoisonBubbleTrapStart = false;
    touchCtrlPoisonBubbleTrapEnd = false;
    SWIM_SOUND = new Audio('./assets/audio/swim.mp3');
    DYING_SOUND = new Audio('./assets/audio/hurt_dying.mp3');
    SLAP_SOUND = new Audio('./assets/audio/punch.mp3');
    BUBBLE_SOUND = new Audio('./assets/audio/bubble.mp3');
    HURT_SOUND = new Audio('./assets/audio/hurt.mp3');
    ELECTRIC_ZAP_SOUND = new Audio('./assets/audio/electric_zap.mp3');
    COIN_SOUND = new Audio('./assets/audio/coin.mp3');
    COLLECT_SOUND = new Audio('./assets/audio/collect.mp3');
    BUBBLING_SOUND = new Audio('./assets/audio/bubbling.mp3');
    LIFE_SOUND = new Audio('./assets/audio/health.mp3');

    /**
     * Safe timer management to prevent zombie intervals/timeouts across restarts.
     * @type {{type: ('i'|'t'), id: number}[]}
     */
    timers = [];

    /**
     * Registers an interval that auto-noops when the world is stopped and tracks its id for cleanup.
     * @param {Function} fn - Callback to execute.
     * @param {number} ms - Interval in milliseconds.
     * @returns {number} Interval id.
     */
    setSafeInterval(fn, ms) {
        const id = setInterval(() => {
            if (this.world && this.world.stopped) return;
            fn();
        }, ms);
        this.timers.push({ type: 'i', id });
        return id;
    }

    /**
     * Registers a timeout that auto-noops when the world is stopped and tracks its id for cleanup.
     * @param {Function} fn - Callback to execute.
     * @param {number} ms - Timeout in milliseconds.
     * @returns {number} Timeout id.
     */
    setSafeTimeout(fn, ms) {
        const id = setTimeout(() => {
            if (this.world && this.world.stopped) return;
            fn();
        }, ms);
        this.timers.push({ type: 't', id });
        return id;
    }

    /**
     * Clears all registered timers (intervals and timeouts).
     * @returns {void}
     */
    clearAllTimers() {
        this.timers.forEach(t => {
            if (t.type === 'i') clearInterval(t.id);
            else clearTimeout(t.id);
        });
        this.timers = [];
    }

    /**
     * Construct a new character and preload all required animation frames and sounds.
     */
    constructor() {
        super();
        // Images and system startup logic are now handled in split files (see character.core.js, etc.)
    }

    /**
     * Periodically checks the character position to trigger the EndBoss intro when in range.
     * @returns {void}
     */
    triggerEndboss() {
        this.setSafeInterval(() => {
            const eb = this.world && this.world.level && typeof this.world.level.getEndBoss === 'function' ? this.world.level.getEndBoss() : null;
            if (!eb) return;
            if (this.x > (eb.x - eb.triggerDistance) && !eb.endBossAlreadyTriggered) {
                eb.endBossTriggered = true;
            }
        }, 100);
    }
}