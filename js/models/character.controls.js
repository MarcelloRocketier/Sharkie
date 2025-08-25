


/**
 * Character control and movement methods, attached to Character.prototype.
 */
Object.assign(Character.prototype, {
  /**
   * Binds continuous character events like movement tick.
   * @returns {void}
   */
  characterEvents() {
    this.setSafeInterval(() => this._tickMovementFrame(), 1000 / 60);
  },

  /**
   * Executes one movement frame with input and collision checks.
   * @returns {void}
   */
  _tickMovementFrame() {
    this.handleMovementInput('up', 'UP', 'touchCtrlUpStart', () => this.y > -135 && !this.isDead() && !this.world.level.getEndBoss().isDead());
    this.handleMovementInput('right', 'RIGHT', 'touchCtrlRightStart', () => this.x < this.world.level.level_end_x && !this.isDead() && !this.world.level.getEndBoss().isDead());
    this.handleMovementInput('down', 'DOWN', 'touchCtrlDownStart', () => this.y < 240 && !this.isDead() && !this.world.level.getEndBoss().isDead());
    this.handleMovementInput('left', 'LEFT', 'touchCtrlLeftStart', () => this.x > 0 && !this.isDead() && !this.world.level.getEndBoss().isDead());
    this.world.camera_x = -this.x;
  },

  /**
   * Sets up touch control event listeners.
   * @returns {void}
   */
  touchEvents() {
    this._bindTouch('ctrl-btn-up', 'touchCtrlUpStart', 'touchCtrlUpEnd');
    this._bindTouch('ctrl-btn-right', 'touchCtrlRightStart', 'touchCtrlRightEnd');
    this._bindTouch('ctrl-btn-down', 'touchCtrlDownStart', 'touchCtrlDownEnd');
    this._bindTouch('ctrl-btn-left', 'touchCtrlLeftStart', 'touchCtrlLeftEnd');
    this._bindTouch('ctrl-btn-fin-slap', 'touchCtrlFinSlapStart', 'touchCtrlFinSlapEnd');
    this._bindTouch('ctrl-btn-bubble-trap', 'touchCtrlBubbleTrapStart', 'touchCtrlBubbleTrapEnd');
    this._bindTouch('ctrl-btn-poison-bubble-trap', 'touchCtrlPoisonBubbleTrapStart', 'touchCtrlPoisonBubbleTrapEnd');
  },

  /**
   * Binds a button element to toggle character flags on touch events.
   * @param {string} elementId
   * @param {string} startFlag
   * @param {string} endFlag
   */
  _bindTouch(elementId, startFlag, endFlag) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.addEventListener('touchstart', () => this.handleTouchControl(startFlag, endFlag, true));
    el.addEventListener('touchend', () => this.handleTouchControl(startFlag, endFlag, false));
  },

  /**
   * Moves character one step in a given direction if no barrier blocks.
   * @param {string} direction
   */
  moveCharacter(direction) {
    this.lastMove = new Date().getTime();
    this.checkBarrierCollisions(direction);
    this._applyMovementIfFree(direction);
  },

  /**
   * Applies directional movement if barrier not present.
   * @param {string} direction
   */
  _applyMovementIfFree(direction) {
    if (direction === 'up' && !this.isCollidingWithBarrierUp) this.y -= this.speed;
    else if (direction === 'right' && !this.isCollidingWithBarrierRight) { this.x += this.speed; this.imgMirrored = false; }
    else if (direction === 'down' && !this.isCollidingWithBarrierDown) this.y += this.speed;
    else if (direction === 'left' && !this.isCollidingWithBarrierLeft) { this.x -= this.speed; this.imgMirrored = true; }
  },

  /**
   * Checks barrier collisions and updates flags.
   * @param {string} direction
   */
  checkBarrierCollisions(direction) {
    const cAll = this.world.level.barriers.find(b => this.isColliding(b));
    const cX = this.world.level.barriers.find(b => this.isCollidingX(b));
    const cY = this.world.level.barriers.find(b => this.isCollidingY(b));
    this._resetBarrierFlags(cAll);
    this._updateHorizontalBarrierFlags(direction, cX);
    this._updateVerticalBarrierFlags(direction, cY);
  },

  /** Resets general barrier flags. */
  _resetBarrierFlags(collidingWithBarrier) {
    if (collidingWithBarrier) {
      this.isCollidingWithBarrier = true;
      return;
    }
    this.isCollidingWithBarrier = false;
    this.isCollidingWithBarrierUp = false;
    this.isCollidingWithBarrierRight = false;
    this.isCollidingWithBarrierDown = false;
    this.isCollidingWithBarrierLeft = false;
  },

  /** Updates horizontal barrier flags. */
  _updateHorizontalBarrierFlags(direction, cX) {
    if (direction === 'right' && cX) { this.isCollidingWithBarrierRight = true; this.isCollidingWithBarrierLeft = false; }
    else if (direction === 'left' && cX) { this.isCollidingWithBarrierLeft = true; this.isCollidingWithBarrierRight = false; }
  },

  /** Updates vertical barrier flags. */
  _updateVerticalBarrierFlags(direction, cY) {
    if (direction === 'up' && cY) { this.isCollidingWithBarrierUp = true; this.isCollidingWithBarrierDown = false; }
    else if (direction === 'down' && cY) { this.isCollidingWithBarrierDown = true; this.isCollidingWithBarrierUp = false; }
  }
});