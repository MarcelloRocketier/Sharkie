/**
 * Project: Sharkie 2D Game
 * File: js/world/collisions.js
 * Responsibility: Collision handling and pickups for World; extracted from world.class.js.
 * Notes: Documentation-only split. No functional changes.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

'use strict';

/**
 * Handles collisions where the character can take damage from enemies or endboss.
 * @param {World} world
 * @returns {void}
 */
function handleCharacterVsEnemies(world) {
  if (!world || world.stopped) return;
  const char = world.character;
  if (!char || char.isDead()) return;

  const enemies = [
    ...(world.level?.puffer_fish || []),
    ...(world.level?.jelly_fish_dangerous || []),
    ...(world.level?.jelly_fish_regular || []),
  ];
  enemies.forEach((e) => {
    if (e && typeof char.isColliding === 'function' && char.isColliding(e)) {
      if (typeof char.hit === 'function') char.hit(e.attack || 5);
    }
  });

  const boss = world.level?.endBoss;
  if (boss && boss.isCollidingWithCharacter && typeof char.hit === 'function') {
    char.hit(boss.attack || 20);
  }
}

/**
 * Handles bubble projectiles colliding with jellyfish and endboss.
 * @param {World} world
 * @returns {void}
 */
function handleBubbleVsJelly(world) {
  if (!world || world.stopped) return;

  const bubbles = world.bubbles || [];
  const jellyfishAll = [
    ...(world.level?.jelly_fish_dangerous || []),
    ...(world.level?.jelly_fish_regular || []),
  ];
  const boss = world.level?.endBoss || null;

  bubbles.forEach((bubble) => {
    if (!bubble || typeof bubble.isColliding !== 'function') return;

    jellyfishAll.forEach((j) => {
      if (j && !j.isDead?.() && bubble.isColliding(j)) {
        if (typeof j.kill === 'function') j.kill();
        if (typeof bubble.markForRemoval === 'function') bubble.markForRemoval();
      }
    });

    if (boss && !boss.isDead?.() && bubble.isColliding(boss)) {
      if (typeof boss.hit === 'function') boss.hit(bubble.damage || 10);
      if (typeof bubble.markForRemoval === 'function') bubble.markForRemoval();
    }
  });
}

/**
 * Handles collecting coins, life, poison.
 * @param {World} world
 * @returns {void}
 */
function handlePickups(world) {
  if (!world || world.stopped) return;
  const char = world.character;
  if (!char) return;

  (world.level?.coins || []).forEach((c) => {
    if (c && !c.collected && char.isColliding?.(c)) {
      c.collected = true;
      world.statusBarCoins?.increase?.(10);
    }
  });

  (world.level?.lifes || []).forEach((l) => {
    if (l && !l.collected && char.isColliding?.(l)) {
      l.collected = true;
      if (typeof char.heal === 'function') char.heal(l.value || 20);
      world.statusBarLife?.set?.(char.energy);
    }
  });

  (world.level?.poisons || []).forEach((p) => {
    if (p && !p.collected && char.isColliding?.(p)) {
      p.collected = true;
      world.statusBarPoison?.increase?.(1);
      if (typeof world.addPoison === 'function') world.addPoison(1);
    }
  });
}

/**
 * Triggers boss introduction when the character reaches trigger distance.
 * @param {World} world
 * @returns {void}
 */
function handleEndBossIntro(world) {
  if (!world || world.stopped) return;
  const boss = world.level?.endBoss;
  const char = world.character;
  if (!boss || !char) return;

  const dx = (boss.x ?? 0) - (char.x ?? 0);
  if (!boss.endBossIntroduced && !boss.endBossTriggered && Math.abs(dx) < (boss.triggerDistance || 500)) {
    boss.endBossTriggered = true;
  }
}