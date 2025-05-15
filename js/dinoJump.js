class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Einzelbilder laden
    for (let i = 1; i <= 10; i++) {
      this.load.image(`idle${i}`, `assets/dino/Idle (${i}).png`);
    }
    for (let i = 1; i <= 8; i++) {
      this.load.image(`run${i}`, `assets/dino/Run (${i}).png`);
    }
    this.load.image('background', 'assets/background/mountains_bg.jpg');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Animation aus Einzelbildern erstellen
    this.anims.create({
      key: 'idle',
      frames: [...Array(10)].map((_, i) => ({
        key: `idle${i + 1}`
      })),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'run',
      frames: [...Array(8)].map((_, i) => ({
        key: `run${i + 1}`
      })),
      frameRate: 12,
      repeat: -1
    });

    // Sprite mit Startbild einfügen
    this.player = this.add.sprite(centerX, 755, 'idle1');
    this.player.setScale(0.35);
    this.player.play('idle');

    this.speed = 400;
    this.cursors = this.input.keyboard.createCursorKeys();

    this.add.image(0, 0, 'background').setOrigin(0).setDepth(-1).setScale(1);;
  }

  update(time, delta) {
    const dt = delta / 1000;
    const cursors = this.cursors;
    let moving = false;
  
    if (cursors.left.isDown) {
      this.player.x -= this.speed * dt;
      this.player.setFlipX(true); // links schauen
      moving = true;
    } else if (cursors.right.isDown) {
      this.player.x += this.speed * dt;
      this.player.setFlipX(false); // rechts schauen
      moving = true;
    }

    if (cursors.up.isDown) {
      this.player.y -= this.speed * dt;
      moving = true;
    } else if (cursors.down.isDown) {
      this.player.y += this.speed * dt;
      moving = true;
    }

    // Animation wechseln nur wenn nötig
    if (moving) {
      if (this.player.anims.getName() !== 'run') {
        this.player.play('run');
      }
    } else {
      if (this.player.anims.getName() !== 'idle') {
        this.player.play('idle');
      }
    }
  }
}

// Phaser-Konfiguration
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 960,
  backgroundColor: '#222',
  scene: MainScene
};

// Spiel starten
function createGame() {
  return new Phaser.Game(config);
}

if (typeof module !== 'undefined') {
  module.exports = { MainScene, createGame };
}

if (typeof window !== 'undefined') {
  createGame();
}
