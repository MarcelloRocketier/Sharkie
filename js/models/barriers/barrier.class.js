/**
 * Project: Sharkie 2D Game
 * File: js/models/barriers/barrier.class.js
 * Responsibility: Generic Barrier with typed configuration (rock, tunnelAbove, tunnelBelow, wall).
 * Notes: JSDoc-only comments. No logic from existing barriers is lost; this class adds a superset API.
 */

/**
 * Generic Barrier. Can be used directly via type or explicit config.
 * Existing specific classes can continue to call `super(x, y, config)`.
 */
class Barrier extends MovableObject {
  /**
   * @param {number} [x=0] Horizontal position.
   * @param {number} [y=0] Vertical position.
   * @param {('rock'|'tunnelAbove'|'tunnelBelow'|'wall'|object)} [typeOrCfg] Type key or explicit config.
   */
  constructor(x = 0, y = 0, typeOrCfg = 'rock') {
    super();
    const cfg = Barrier._resolveConfig(typeOrCfg);
    this.width = cfg.width; this.height = cfg.height;
    this.offset = { x: cfg.offset.x, y: cfg.offset.y, width: cfg.offset.width, height: cfg.offset.height };
    this.loadImage(cfg.img);
    this.x = x; this.y = y;
  }

  /**
   * @param {('rock'|'tunnelAbove'|'tunnelBelow'|'wall'|object)} typeOrCfg
   * @returns {{width:number,height:number,offset:{x:number,y:number,width:number,height:number},img:string}}
   */
  static _resolveConfig(typeOrCfg) {
    const C = Barrier.CONFIG;
    if (!typeOrCfg) return C.rock;
    if (typeof typeOrCfg === 'string') return C[typeOrCfg] || C.rock;
    const d = C.rock, o = typeOrCfg.offset || d.offset;
    return {
      width: typeOrCfg.width ?? d.width,
      height: typeOrCfg.height ?? d.height,
      offset: { x: o.x ?? d.offset.x, y: o.y ?? d.offset.y, width: o.width ?? d.offset.width, height: o.height ?? d.offset.height },
      img: typeOrCfg.img ?? d.img
    };
  }
}

/**
 * @type {{[k:string]:{width:number,height:number,offset:{x:number,y:number,width:number,height:number},img:string}}}
 */
Barrier.CONFIG = {
  rock: {
    width: 720, height: 200,
    offset: { x: 50, y: 40, width: 8, height: 0 },
    img: './assets/img/3._Background/Barrier/2.png'
  },
  tunnelAbove: {
    width: 720, height: 200,
    offset: { x: 0, y: 0, width: 0, height: 90 },
    img: './assets/img/3._Background/Barrier/1.1.png'
  },
  tunnelBelow: {
    width: 720, height: 200,
    offset: { x: 0, y: 40, width: 8, height: 0 },
    img: './assets/img/3._Background/Barrier/1.2.png'
  },
  wall: {
    width: 200, height: 480,
    offset: { x: 50, y: 0, width: 40, height: 480 },
    img: './assets/img/3._Background/Barrier/3.png'
  }
};