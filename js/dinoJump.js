class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    for (let i = 1; i <= 10; i++) {
      this.load.image(`idle${i}`, `assets/dino/Idle (${i}).png`);
    }
    for (let i = 1; i <= 8; i++) {
      this.load.image(`run${i}`, `assets/dino/Run (${i}).png`);
    }
    for (let i = 1; i <= 12; i++) {
      this.load.image(`jump${i}`, `assets/dino/Jump (${i}).png`);
    }
    this.load.image('background', 'assets/background/desert_big.jpg');
    this.load.image('obstacle', 'assets/obstacles/cactus.png');
  }

  create() {
    this.gameIsOver = false;
    this.scrollSpeed = 8;
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.bg = this.add.tileSprite(0, 0, 1920, 960, 'background')
      .setOrigin(0)
      .setDepth(-1);

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
      frames: [...Array(12)].map((_, i) => ({ key: `jump${i + 1}` })),
      frameRate: 12,
      repeat: -1
    });

    this.player = this.physics.add.sprite(centerX, centerY, 'idle1');
    this.player.setScale(0.35);
    this.player.body.setSize(150, 375);
    this.player.body.setOffset(130, 50);
    this.player.play('idle');

    this.speed = 400;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.ground = this.physics.add.staticGroup();
    this.ground.create(910, 855, null)
      .setDisplaySize(3200, 40)
      .setVisible(false)
      .refreshBody();

    this.leftWall = this.physics.add.staticImage(0, this.cameras.main.height / 2, null)
      .setDisplaySize(10, this.cameras.main.height)
      .setVisible(false)
      .refreshBody();

    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.leftWall, () => {
      this.gameOver();
    });

    this.obstacles = this.physics.add.group();

    this.spawnObstacle = () => {
    if (this.gameIsOver) return;

    const obstacle = this.physics.add.sprite(2200, 730, 'obstacle');
    obstacle.body.allowGravity = false;
    obstacle.setImmovable(true);
    obstacle.setSize(130, 170, true);

    this.obstacles.add(obstacle);

    // Nächsten Spawn mit zufälligem Delay zwischen 1s und 3s planen
    const nextDelay = Phaser.Math.Between(4000, 7500);
    this.time.delayedCall(nextDelay, this.spawnObstacle, [], this);
  };

  // Starte den ersten Spawn (direkt oder mit kurzem Delay)
  this.spawnObstacle();

    this.physics.add.collider(this.player, this.obstacles, () => {
      this.gameOver();
    });

    this.physics.add.collider(this.obstacles, this.ground);

    this.score = 0;
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Arial'
    });
    this.scoreText.setScrollFactor(0);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
      },
      callbackScope: this,
      loop: true
    });



    this.keysPressedText = this.add.text(20, 60, 'Keys: ', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'Arial'
    });

  }

  update(time, delta) {
    const dt = delta / 1000;
    let isMoving = false;
    this.scrollSpeed = 4 + this.score * 0.1;

    this.bg.tilePositionX += this.scrollSpeed;

    if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.player.x -= this.scrollSpeed;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.setFlipX(true);
      isMoving = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.setFlipX(false);
      isMoving = true;
    } else {
      this.player.setVelocityX(0);
    }

    if (!this.player.body.blocked.down) {
      this.player.body.setSize(180, 375);
    }

    if ((this.jumpKey.isDown || this.cursors.up.isDown) && this.player.body.blocked.down) { 
      this.player.setVelocityY(-750);
    }

    if (!this.player.body.blocked.down) {
      if (this.player.anims.getName() !== 'jump') {
        this.player.play('jump');
      }
    } else if (isMoving) {
      if (this.player.anims.getName() !== 'run') {
        this.player.play('run');
      }
    } else {
      if (this.player.anims.getName() !== 'idle') {
        this.player.play('idle');
      }
    }

    if (this.player.flipX) {
      this.player.body.setOffset(380, 50);
    } else {
      this.player.body.setOffset(130, 50);
    }

    // Hindernisse manuell nach links scrollen
    this.obstacles.children.iterate((obstacle) => {
      if (!obstacle) return;

      obstacle.x -= this.scrollSpeed;

      if (obstacle.x < -obstacle.width) {
        obstacle.destroy();
      }
    });


    const pressedKeys = [];

    if (this.cursors.left.isDown) pressedKeys.push('←');
    if (this.cursors.right.isDown) pressedKeys.push('→');
    if (this.cursors.up.isDown) pressedKeys.push('↑');
    if (this.jumpKey.isDown) pressedKeys.push('SPACE');

    this.keysPressedText.setText('Keys: ' + pressedKeys.join(', '));



  }

  gameOver() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.stop();
    this.gameIsOver = true;
    this.scene.pause();
    this.scoreText.setVisible(false);

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add.text(centerX, centerY, 'Game Over\nScore: ' + this.score, {
      fontSize: '48px',
      fill: '#fff',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);
  }
}

// Phaser-Konfiguration
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1100,
  backgroundColor: '#222',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1300 },
      debug: true
    }
  },
  scene: MainScene
};

function createGame() {
  return new Phaser.Game(config);
}

if (typeof module !== 'undefined') {
  module.exports = { MainScene, createGame };
}

if (typeof window !== 'undefined') {
  createGame();
}
