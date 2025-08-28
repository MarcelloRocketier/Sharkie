/**
 * Project: Sharkie 2D Game
 * File: js/core/controls.js
 * Responsibility: Handles keyboard and mobile control bindings.
 * Notes: Extracted from game.js to reduce file size and centralize input handling.
 * Author: <Marcel Reyes Langenhorst>
 * License: MIT (or project license)
 */

'use strict';

/** Returns true if device supports touch (pointer:coarse or maxTouchPoints). */
function isTouchDevice() {
  return (navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
}

/** Returns array of mobile control element ids. */
function getMobileButtonIds() {
  return ['ctrl-btn-up','ctrl-btn-right','ctrl-btn-down','ctrl-btn-left','ctrl-btn-fin-slap','ctrl-btn-bubble-trap','ctrl-btn-poison-bubble-trap'];
}

/** Shows or hides mobile buttons; falls back to per-button toggle if no container. */
function setMobileControlsVisibility(show) {
  const box = document.getElementById('mobile-controls');
  if (box) { box.classList.toggle('d-none', !show); return; }
  getMobileButtonIds().forEach((id)=>{ const el=document.getElementById(id); if(el) el.classList.toggle('d-none', !show); });
}

/**
 * Binds keyboard events to update the shared keyboard object.
 */
window.addEventListener('keydown', (e) => { 
    const k = KEY_MAP[e.keyCode]; 
    if (k) keyboard[k] = true; 
});
window.addEventListener('keyup',   (e) => { 
    const k = KEY_MAP[e.keyCode]; 
    if (k) keyboard[k] = false; 
});

/**
 * Binds touch handlers for mobile controls and toggles visibility based on device.
 * @returns {void}
 */
function setupMobileControls() {
  const isTouch = isTouchDevice();
  setMobileControlsVisibility(isTouch);
  if (!isTouch || mobileControlsBound) return;
  getMobileButtonIds().forEach((id)=>_bindTouchToKey(id, KEY_FOR_ID[id] || null));
  getMobileButtonIds().forEach((id)=>{ const el=document.getElementById(id); if(el) el.addEventListener('contextmenu', (e)=>e.preventDefault()); });
  mobileControlsBound = true;
}

/** Maps control element id to keyboard flag */
const KEY_FOR_ID = { 'ctrl-btn-up':'UP','ctrl-btn-right':'RIGHT','ctrl-btn-down':'DOWN','ctrl-btn-left':'LEFT','ctrl-btn-fin-slap':'SPACE','ctrl-btn-bubble-trap':'D','ctrl-btn-poison-bubble-trap':'F' };

/**
 * Binds touchstart and touchend events on a control button to a keyboard flag.
 * @param {string} elementId - The DOM id of the control button element.
 * @param {string} keyFlag - The keyboard flag property to toggle.
 * @returns {void}
 */
function _bindTouchToKey(elementId, keyFlag) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.addEventListener('touchstart', (ev)=>{ ev.preventDefault(); if(keyFlag) keyboard[keyFlag]=true; }, {passive:false});
    el.addEventListener('touchend',   (ev)=>{ ev.preventDefault(); if(keyFlag) keyboard[keyFlag]=false; }, {passive:false});
}