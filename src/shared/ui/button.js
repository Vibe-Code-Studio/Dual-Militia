import { COLORS } from '../../constants.js';

export class Button {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {string} label
   * @param {() => void} onClick
   */
  constructor(scene, x, y, w, h, label, onClick) {
    this.scene = scene;
    this.rect = scene.add.rectangle(x, y, w, h, COLORS.BTN)
      .setStrokeStyle(2, 0xffffff, 0.15)
      .setInteractive({ useHandCursor: true });

    this.text = scene.add.text(x, y, label, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: COLORS.BTN_TEXT,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.rect.on('pointerover', () => this.rect.setFillStyle(COLORS.BTN_HOVER));
    this.rect.on('pointerout',  () => this.rect.setFillStyle(COLORS.BTN));
    this.rect.on('pointerdown', () => {
      this.rect.setScale(0.97);
      scene.time.delayedCall(80, () => this.rect.setScale(1));
      onClick?.();
    });
  }
}