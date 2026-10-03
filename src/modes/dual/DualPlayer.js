export class DualPlayer {
  constructor(scene, x, y, color) {
    this.scene = scene;
    this.color = color;

    // Bloque simple (sin arte, solo color)
    this.sprite = scene.add.rectangle(x, y, 48, 48, color)
      .setStrokeStyle(2, 0xffffff, 0.3);

    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);

    this.id = null;
  }

  get x()      { return this.sprite.x; }
  get y()      { return this.sprite.y; }
  get body()   { return this.sprite.body; }
  setPosition(x, y) { this.sprite.setPosition(x, y); }
}