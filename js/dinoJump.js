class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // keine Assets nötig
  }

  create() {
    // Mittelpunkt berechnen
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Kreis als Grafik erzeugen
    this.circle = this.add.circle(centerX, centerY, 30, 0xff0000);
    this.speed = 200; // Pixel pro Sekunde

    // Tasteneingaben registrieren
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    const dt = delta / 1000;

    if (this.cursors.left.isDown) {
      this.circle.x -= this.speed * dt;
    } else if (this.cursors.right.isDown) {
      this.circle.x += this.speed * dt;
    }
  }
}

// Nur exportieren, wenn in Node (z. B. Jest-Test)
if (typeof module !== 'undefined') {
  module.exports = { MainScene };
}

// Nur starten, wenn im Browser
if (typeof window !== 'undefined') {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222',
    scene: MainScene
  };

  const game = new Phaser.Game(config);
}
