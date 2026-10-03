import { SCENES, COLORS, GAME, MODES } from '../constants.js';
import { Button } from '../shared/ui/Button.js';
import { GameManager } from './GameManager.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super(SCENES.MENU); }

  create() {
    const { width, height } = this.scale;

    // Título
    this.add.text(width / 2, height * 0.22, GAME.NAME.toUpperCase(), {
      fontFamily: 'monospace',
      fontSize: '72px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.22 + 55, `v${GAME.VERSION}`, {
      fontFamily: 'monospace', fontSize: '16px', color: '#888',
    }).setOrigin(0.5);

    // Botones
    const bw = 340, bh = 80, gap = 30;
    const cx = width / 2;
    const cy = height * 0.55;

    new Button(this, cx, cy,             bw, bh, 'MODO DUAL',  () => this.#startMode(MODES.DUAL));
    new Button(this, cx, cy + bh + gap,  bw, bh, 'MODO ARENA', () => this.#startMode(MODES.ARENA));

    // Footer
    this.add.text(width / 2, height - 30,
      'Móvil: inclina para moverte · Toca la derecha para disparar',
      { fontFamily: 'monospace', fontSize: '14px', color: '#666' }
    ).setOrigin(0.5);
  }

  #startMode(mode) {
    GameManager.reset();
    GameManager.mode = mode;

    if (mode === MODES.DUAL)  this.scene.start(SCENES.DUAL_LOBBY);
    if (mode === MODES.ARENA) this.scene.start(SCENES.ARENA_LOBBY);
  }
}