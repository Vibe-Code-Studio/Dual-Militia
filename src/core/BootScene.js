import { SCENES } from '../constants.js';

export class BootScene extends Phaser.Scene {
  constructor() { super(SCENES.BOOT); }

  create() {
    // Aquí irían configs mínimas (escala, audio, etc.)
    this.scene.start(SCENES.PRELOADER);
  }
}