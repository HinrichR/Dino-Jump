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
    for (let i = 1; i <= 12; i++) {
      this.load.image(`jump${i}`, `assets/dino/Jump (${i}).png`);
    }
    this.load.image('background', 'assets/background/mountains_bg.jpg');
  }

  create() {
  const centerX = this.cameras.main.width / 2;
  const centerY = this.cameras.main.height / 2;

  // Hintergrundbild
  this.add.image(0, 0, 'background').setOrigin(0).setDepth(-1).setScale(1);

  // Animationen
  this.anims.create({
    key: 'idle',
    frames: [...Array(10)].map((_, i) => ({ key: `idle${i + 1}` })),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'run',
    frames: [...Array(8)].map((_, i) => ({ key: `run${i + 1}` })),
    frameRate: 12,
    repeat: -1
  });

  this.anims.create({
    key: 'jump',
    frames: [...Array(10)].map((_, i) => ({ key: `jump${i + 1}` })),
    frameRate: 12,
    repeat: -1
  });

  this.player = this.physics.add.sprite(centerX, centerY, 'idle1');
  this.player.setScale(0.35);
  this.player.play('idle');

  this.speed = 400;
  this.cursors = this.input.keyboard.createCursorKeys(); // ← CURSORS holen
  this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // ← SPRUNGtaste

  // Boden
  this.ground = this.physics.add.staticGroup();
  this.ground.create(910, 855, null)
    .setDisplaySize(1920, 40)
    .setVisible(false)
    .refreshBody();

  // Kollision aktivieren (Dino ↔ Boden)
  this.physics.add.collider(this.player, this.ground);
}


  update(time, delta) {
  const dt = delta / 1000;
  const cursors = this.cursors;
  let moving = false;

  if (cursors.left.isDown) {
    this.player.setVelocityX(-this.speed);
    this.player.setFlipX(true);
    moving = true;
  } else if (cursors.right.isDown) {
    this.player.setVelocityX(this.speed);
    this.player.setFlipX(false);
    moving = true;
  } else {
    this.player.setVelocityX(0);
  }

  // Sprung
  if ((this.jumpKey.isDown || cursors.up.isDown) && this.player.body.blocked.down) {
    this.player.setVelocityY(-600);  // ↑ Sprungkraft anpassen
  }

  // Animation je nach Bewegung und Zustand
  if (!this.player.body.blocked.down) {
    if (this.player.anims.getName() !== 'jump') {
      this.player.play('jump');
    }
  } else if (moving) {
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
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },  // Schwerkraft hinzufügen
      debug: false           // Optional: true zeigt die Collider an
    }
  },
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
