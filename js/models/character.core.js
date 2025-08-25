

/**
 * Core definition for Character (guarded).
 * If Character is already defined (legacy file still loaded), this file is a no-op.
 */
(function(){
  if (typeof window !== 'undefined' && typeof window.Character !== 'undefined') return;

  /**
   * Main player character.
   * @extends MovableObject
   */
  class Character extends MovableObject {
    /** @type {number} */ speed = 6;
    /** @type {number} */ energy = 100;
    /** @type {number} */ poison = 0;
    /** @type {boolean} */ imgMirrored = false;
    /** @type {{bubbleX:number,bubbleY:number}} */ offset = { bubbleX: 140, bubbleY: 50 };
    /** @type {number} */ lastMove = 0;
    /** @type {boolean} */ checkAlreadyRunning = false;

    /**
     * Creates the character and starts subsystems (images, events, sounds).
     */
    constructor() {
      super();
      try { this._loadCharacterImages?.(); } catch(e){}
      try { this._startSystems?.(); } catch(e){}
    }
  }

  if (typeof window !== 'undefined') {
    window.Character = Character;
  } else {
    // Fallback for non-browser environments
    globalThis.Character = Character;
  }
})();