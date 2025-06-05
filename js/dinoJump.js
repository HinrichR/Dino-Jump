class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // keine Assets nötig
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.circle = this.add.circle(centerX, centerY, 30, 0xff0000);
    this.speed = 200;

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

// Konfiguration auslagern
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#222',
  scene: MainScene
};

// Funktion für Tests und Programmstart
function createGame() {
  return new Phaser.Game(config);
}

// Nur im Node-Umfeld exportieren (z.B. für Jest)
if (typeof module !== 'undefined') {
  module.exports = { MainScene, createGame };
}

// Nur im Browser starten
if (typeof window !== 'undefined') {
  createGame();
}