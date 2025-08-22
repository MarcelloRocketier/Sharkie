/**
 * Project: Sharkie 2D Game
 * File: js/world/collisions.js
 * Responsibility: Collision handling and pickups for World; extracted from world.class.js.
 * Notes: Robust to method-name differences and one/both-sided collision checks.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

'use strict';

/** Safely get an array from an object by trying multiple keys. */
function getArrayByKeys(obj, keys) {
  if (!obj) return [];
  for (let k of keys) {
    if (Array.isArray(obj[k])) return obj[k];
  }
  return [];
}

/** Convenience unions for common level collections under varying naming styles. */
function getEnemies(world) {
  const lvl = world.level || {};
  if (Array.isArray(lvl.enemies)) return lvl.enemies;
  const puffer = getArrayByKeys(lvl, ['puffer_fish','pufferFish','pufferFishes','puffer_fishes']);
  const jellyDanger = getArrayByKeys(lvl, ['jelly_fish_dangerous','jellyfish_dangerous','jellyfishDangerous','jellyFishDangerous']);
  const jellyRegular = getArrayByKeys(lvl, ['jelly_fish_regular','jellyfish_regular','jellyfishRegular','jellyFishRegular']);
  return [...puffer, ...jellyDanger, ...jellyRegular];
}

function getJellyfish(world) {
  const enemies = getEnemies(world);
  const fromEnemies = enemies.filter((e) =>
    (typeof JellyFishRegular   !== 'undefined' && e instanceof JellyFishRegular) ||
    (typeof JellyFishDangerous !== 'undefined' && e instanceof JellyFishDangerous)
  );
  if (fromEnemies.length) return fromEnemies;

  const lvl = world.level || {};
  const jellyDanger = getArrayByKeys(lvl, ['jelly_fish_dangerous','jellyfish_dangerous','jellyfishDangerous','jellyFishDangerous']);
  const jellyRegular = getArrayByKeys(lvl, ['jelly_fish_regular','jellyfish_regular','jellyfishRegular','jellyFishRegular']);
  return [...jellyDanger, ...jellyRegular];
}

function getCoins(world) {
  return getArrayByKeys(world.level || {}, ['coins','coin','Coins']);
}
function getLifes(world) {
  return getArrayByKeys(world.level || {}, ['lifes','lives','life']);
}
function getPoisons(world) {
  return getArrayByKeys(world.level || {}, ['poisons','poison','Poison']);
}

/** Safely check collision in both directions (a->b or b->a). */
function objectsCollide(a, b) {
  if (!a || !b) return false;
  try { if (typeof a.isColliding === 'function' && a.isColliding(b)) return true; } catch(e){}
  try { if (typeof b.isColliding === 'function' && b.isColliding(a)) return true; } catch(e){}
  return false;
}

/** Try to 'kill' an enemy using whatever method it implements. */
function tryKillEnemy(e) {
  try { if (typeof e.kill === 'function') return e.kill(); } catch(_){ }
  try { if (typeof e.die === 'function') return e.die(); } catch(_){ }
  try { if (typeof e.gotKilled === 'function') return e.gotKilled(); } catch(_){ }
  try { if (typeof e.takeDamage === 'function') return e.takeDamage(999); } catch(_){ }
  try { e.isDeadFlag = true; } catch(_){ }
}

/** Try to remove/destroy a projectile bubble. */
function tryRemoveBubble(b) {
  try { if (typeof b.markForRemoval === 'function') return b.markForRemoval(); } catch(_){ }
  try { if (typeof b.destroy === 'function') return b.destroy(); } catch(_){ }
  try { if (typeof b.explode === 'function') return b.explode(); } catch(_){ }
  try { b.toRemove = true; } catch(_){ }
}

/** Remove an item from an array in-place if present (no-op if not found). */
function removeFromArray(arr, item) {
  if (!Array.isArray(arr)) return;
  const idx = arr.indexOf(item);
  if (idx > -1) arr.splice(idx, 1);
}

/** Try to collect an item using whatever method it implements. */
function tryCollectItem(item, world) {
  try { if (typeof item.collect === 'function') return item.collect(world); } catch(_){ }
  try { item.collected = true; } catch(_){ }
}

/**
 * Handles collisions where the character can take damage from enemies or endboss.
 * @param {World} world
 * @returns {void}
 */
function handleCharacterVsEnemies(world) {
  if (!world || world.stopped) return;
  const char = world.character;
  if (!char || (typeof char.isDead === 'function' && char.isDead())) return;

  const enemies = getEnemies(world);

  enemies.forEach((e) => {
    if (!e) return;
    if (objectsCollide(char, e) && !(typeof char.isHurt === 'function' && char.isHurt())) {
      try {
        if (typeof PufferFish !== 'undefined' && e instanceof PufferFish) char.hitBy = 'PufferFish';
        else if ((typeof JellyFishRegular !== 'undefined' && e instanceof JellyFishRegular) ||
                 (typeof JellyFishDangerous !== 'undefined' && e instanceof JellyFishDangerous)) char.hitBy = 'JellyFish';
        else if (typeof EndBoss !== 'undefined' && e instanceof EndBoss) char.hitBy = 'EndBoss';
        else char.hitBy = 'Enemy';

        char.hit(e.attack ?? 5);
        if (world.statusBarLife && typeof world.statusBarLife.set === 'function') {
          world.statusBarLife.setPercentage(
            (char.energy / 100) * 100,
            world.statusBarLife.type,
            world.statusBarLife.color
          );
        }
      } catch(_) {}
    }
  });

  const boss = world.level?.endBoss;
  if (boss && objectsCollide(char, boss) && !(typeof char.isHurt === 'function' && char.isHurt())) {
    try {
      char.hitBy = 'EndBoss';
      char.hit(boss.attack ?? 20);
      if (world.statusBarLife && typeof world.statusBarLife.set === 'function') {
        world.statusBarLife.setPercentage(
          (char.energy / 100) * 100,
          world.statusBarLife.type,
          world.statusBarLife.color
        );
      }
    } catch(_) {}
  }
}

/**
 * Handles bubble projectiles colliding with jellyfish.
 * Boss damage stays in boss-specific logic to avoid duplicates.
 * @param {World} world
 * @returns {void}
 */
function handleBubbleVsJelly(world) {
  if (!world || world.stopped) return;

  const bubbles = Array.isArray(world.bubbles) ? world.bubbles.slice() : [];
  if (world.bubble) bubbles.push(world.bubble);

  const jellyfishAll = getJellyfish(world);

  bubbles.forEach((bubble) => {
    if (!bubble) return;

    jellyfishAll.forEach((j) => {
      if (!j) return;
      if (objectsCollide(bubble, j)) {
        tryKillEnemy(j);
        tryRemoveBubble(bubble);
      }
    });
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

  getCoins(world).forEach((c) => {
    if (!c || c.collected) return;
    if (objectsCollide(char, c)) {
      tryCollectItem(c, world);
      try { world.statusBarCoins?.increase?.(10); } catch(_){ }
      removeFromArray(world.level && world.level.coins, c);
    }
  });

  getLifes(world).forEach((l) => {
    if (!l || l.collected) return;
    if (objectsCollide(char, l)) {
      tryCollectItem(l, world);
      try { if (typeof char.heal === 'function') char.heal(l.value ?? 20); } catch(_){ }
      try {
        world.statusBarLife.setPercentage(
          (char.energy / 100) * 100,
          world.statusBarLife.type,
          world.statusBarLife.color
        );
      } catch(_){ }
      removeFromArray(world.level && world.level.life, l);
    }
  });

  getPoisons(world).forEach((p) => {
    if (!p || p.collected) return;
    if (objectsCollide(char, p)) {
      tryCollectItem(p, world);
      try { world.statusBarPoison?.increase?.(1); } catch(_){ }
      try { if (typeof world.addPoison === 'function') world.addPoison(1); } catch(_){ }
      removeFromArray(world.level && world.level.poison, p);
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