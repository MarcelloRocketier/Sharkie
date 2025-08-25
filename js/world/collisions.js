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
  _checkEnemyCollisions(world, char);
  _checkBossCollision(world, char);
}

/**
 * Checks collisions with regular enemies and applies damage.
 * @param {World} world
 * @param {Character} char
 */
function _checkEnemyCollisions(world, char) {
  const enemies = getEnemies(world);
  enemies.forEach((e) => {
    if (!e) return;
    const neutralized = e && e.neutralized && (!e.neutralizedUntil || e.neutralizedUntil > Date.now());
    if (neutralized) return;
    if (objectsCollide(char, e) && !(typeof char.isHurt === 'function' && char.isHurt())) {
      _applyEnemyHit(char, e, world);
    }
  });
}

/**
 * Applies damage and statusBar update for a collision with a given enemy.
 * @param {Character} char
 * @param {Object} enemy
 * @param {World} world
 */
function _applyEnemyHit(char, enemy, world) {
  try {
    if (typeof PufferFish !== 'undefined' && enemy instanceof PufferFish) char.hitBy = 'PufferFish';
    else if ((typeof JellyFishRegular !== 'undefined' && enemy instanceof JellyFishRegular) ||
             (typeof JellyFishDangerous !== 'undefined' && enemy instanceof JellyFishDangerous)) char.hitBy = 'JellyFish';
    else if (typeof EndBoss !== 'undefined' && enemy instanceof EndBoss) char.hitBy = 'EndBoss';
    else char.hitBy = 'Enemy';

    char.hit(enemy.attack ?? 5);
    if (world.statusBarLife && typeof world.statusBarLife.set === 'function') {
      world.statusBarLife.setPercentage(
        (char.energy / 100) * 100,
        world.statusBarLife.type,
        world.statusBarLife.color
      );
    }
  } catch(_) {}
}

/**
 * Checks collision with the end boss and applies damage.
 * @param {World} world
 * @param {Character} char
 */
function _checkBossCollision(world, char) {
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
 * Handles bubble projectiles colliding with jellyfish (applies damage via hit()).
 * Boss damage stays in boss-specific logic to avoid duplicates.
 * @param {World} world
 * @returns {void}
 */
function handleBubbleVsJelly(world) {
  if (!world || world.stopped) return;
  const bubbles = _gatherBubbles(world);
  const jelly = getJellyfish(world);
  _applyBubbleHitsOnJelly(bubbles, jelly);
}

/**
 * Collects all active bubbles (array + single current bubble).
 * @param {World} world
 * @returns {Array<Object>}
 */
function _gatherBubbles(world) {
  const arr = Array.isArray(world.bubbles) ? world.bubbles.slice() : [];
  if (world.bubble) arr.push(world.bubble);
  return arr;
}

/**
 * Applies bubble hits to all jellyfish; calls hit(damage) if available.
 * @param {Array<Object>} bubbles
 * @param {Array<Object>} jellyfishAll
 * @returns {void}
 */
function _applyBubbleHitsOnJelly(bubbles, jellyfishAll) {
  bubbles.forEach((b) => {
    if (!b) return;
    jellyfishAll.forEach((j) => {
      if (!j) return;
      if (objectsCollide(b, j)) {
        if (typeof j.hit === 'function') { try { j.hit(b.attack ?? 20); } catch(_){} } else { tryKillEnemy(j); }
        try { j.neutralized = true; j.neutralizedUntil = Date.now() + 3000; } catch(_){ }
        tryRemoveBubble(b);
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
  _handleAllPickups(world, char);
}

/**
 * Checks all pickup types for collisions.
 * @param {World} world
 * @param {Character} char
 */
function _handleAllPickups(world, char) {
  _checkCoinPickups(world, char);
  _checkLifePickups(world, char);
  _checkPoisonPickups(world, char);
}

/** Handles coin pickups. */
function _checkCoinPickups(world, char) {
  getCoins(world).forEach((c) => {
    if (!c || c.collected) return;
    if (objectsCollide(char, c)) {
      tryCollectItem(c, world);
      try { world.statusBarCoins?.increase?.(10); } catch(_){ }
      removeFromArray(world.level && world.level.coins, c);
    }
  });
}

/** Handles life pickups. */
function _checkLifePickups(world, char) {
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
}

/** Handles poison pickups. */
function _checkPoisonPickups(world, char) {
  getPoisons(world).forEach((p) => {
    if (!p || p.collected) return;
    if (objectsCollide(char, p)) {
      tryCollectItem(p, world);
      char.poison = (typeof char.poison === 'number' ? char.poison : 0) + 1;
      try { world.statusBarPoison?.increase?.(1); } catch(_){ }
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