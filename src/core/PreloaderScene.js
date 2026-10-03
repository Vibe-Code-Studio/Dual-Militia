import { SCENES, COLORS, GAME } from '../constants.js';

export class PreloaderScene extends Phaser.Scene {
  constructor() { super(SCENES.PRELOADER); }

  preload() {
    // Todo es procedural por ahora → no cargamos assets.
    const { width, height } = this.scale;
    const bar = this.add.rectangle(width / 2, height / 2, 400, 20, COLORS.PANEL);
    const fill = this.add.rectangle(bar.x - 200, bar.y, 0, 20, COLORS.BTN)
      .setOrigin(0, 0.5);

    this.load.on('progress', (p) => { fill.width = 400 * p; });
    this.load.on('complete', () => {
      bar.destroy(); fill.destroy();
      this.add.text(width / 2, height / 2 - 60, GAME.NAME, {
        fontFamily: 'monospace', fontSize: '42px', color: '#fff', fontStyle: 'bold',
      }).setOrigin(0.5);
    });
  }

  create() {
    // pequeña pausa para que no sea instantáneo
    this.time.delayedCall(400, () => this.scene.start(SCENES.MENU));
  }
}