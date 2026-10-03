import { SCENES } from '../../constants.js';
export class ArenaScene extends Phaser.Scene {
  constructor() { super(SCENES.ARENA); }
  create() {
    this.add.text(this.scale.width/2, this.scale.height/2, 'ARENA · Juego (próximo paso)', {
      fontFamily: 'monospace', fontSize: '28px', color: '#fff',
    }).setOrigin(0.5);
  }
}