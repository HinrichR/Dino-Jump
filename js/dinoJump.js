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
		this.isDucking = false;
		this.startScroll = false;
    this.pauseText = null;
    this.restartButton = null;
    this.gameOverText = null;
    this.isPaused = false;
    this.hasBackgroundSwitched = false;
    this.score = 0;

		const centerX = this.cameras.main.width / 2;
		const centerY = this.cameras.main.height / 2;

		this.bg = this.add
			.tileSprite(0, 0, 1920, 2000, 'background')
			.setOrigin(0)
			.setDepth(-1);

    this.currentBackground = 'background';
    this.currentobstacle = 'obstacle';
    this.lastSwitchScore = 0;  

		this.anims.create({
			key: 'idle',
			frames: [...Array(10)].map((_, i) => ({ key: `idle${i + 1}` })),
			frameRate: 10,
			repeat: -1,
		});
		this.anims.create({
			key: 'run',
			frames: [...Array(8)].map((_, i) => ({ key: `run${i + 1}` })),
			frameRate: 12,
			repeat: -1,
		});
		this.anims.create({
			key: 'jump',
			frames: [...Array(12)].map((_, i) => ({ key: `jump${i + 1}` })),
			frameRate: 12,
			repeat: -1,
		});
		this.anims.create({
			key: 'duck',
			frames: [...Array(3)].map((_, i) => ({ key: `jump${i + 1}` })),
			frameRate: 12,
			repeat: 0,
		});

		this.player = this.physics.add.sprite(350, 770, 'idle1').setScale(0.35);
		this.player.body.setSize(180, 375);
		this.player.body.setOffset(130, 50);
		this.player.play('idle');

		this.speed = 400;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

		this.ground = this.physics.add.staticGroup();
		this.ground.create(910, 855, null).setDisplaySize(5000, 40).setVisible(false).refreshBody();

		this.leftWall = this.physics.add.staticImage(0, this.cameras.main.height / 2, null)
			.setDisplaySize(10, this.cameras.main.height)
			.setVisible(false)
			.refreshBody();

		this.physics.add.collider(this.player, this.ground);
		this.physics.add.collider(this.player, this.leftWall, () => this.gameOver());

		this.obstacles = this.physics.add.group();

		this.spawnObstacle = () => {
	    if (this.gameIsOver) return;

	    const baseX = 2200;
	    const maxGroupSize = Math.min(2 + Math.floor(this.score / 50), 5); // dynamische Gruppengröße
	    const groupSize = Phaser.Math.Between(1, maxGroupSize);

	    for (let i = 0; i < groupSize; i++) {
		    const spacing = 75;
		    const x = baseX + i * spacing;
		    const obstacle = this.physics.add.sprite(x, 730, 'obstacle');
		    obstacle.body.allowGravity = false;
		    obstacle.setImmovable(true);
		    obstacle.setSize(65, 160, true);
		    obstacle.setOffset(55, 35);
		    this.obstacles.add(obstacle);
	    }

      // Dynamischer Spawn-Timer basierend auf Score
	    const minDelay = 1300;
	    const maxDelay = 4000;
	    let delay = maxDelay - this.score * 10;
	    delay = Phaser.Math.Clamp(delay, minDelay, maxDelay);
	    const nextDelay = Phaser.Math.Between(delay * 0.8, delay * 1.2);

	    this.time.delayedCall(nextDelay, this.spawnObstacle, [], this);
    };

		this.spawnObstacle();
		this.physics.add.collider(this.player, this.obstacles, () => this.gameOver());
		this.physics.add.collider(this.obstacles, this.ground);

		this.scoreText = this.add.text(20, 20, 'Score: 0', {
			fontSize: '32px', 
			fill: '#fff',
			fontFamily: 'Arial',
		}).setScrollFactor(0).setVisible(false);

		this.keysPressedText = this.add.text(20, 60, 'Keys: ', {
			fontSize: '24px',
			fill: '#fff',
			fontFamily: 'Arial',
		}).setVisible(false);

		this.startText = this.add.text(centerX, centerY, 'Drücke → um zu starten', {
			fontSize: '42px',
			fill: '#ffffff',
			fontFamily: 'Arial',
			align: 'center',
		}).setOrigin(0.5);

    // Nacht-Overlay erstellen, ganz transparent
    this.nightOverlay = this.add.rectangle(0, 0, 1920, 1100, 0x000000)
    .setOrigin(0)
    .setScrollFactor(0)
    .setDepth(9999) // ganz oben
    .setAlpha(0);   // Start transparent

	}

	startGame() {
		this.startScroll = true;
		this.startText.setVisible(false);
		this.scoreText.setVisible(true);
		this.keysPressedText.setVisible(true);
    
    this.isNight = false;
    this.time.delayedCall(45000, () => {
    this.switchDayNight();
    });

		this.scoreTimer = this.time.addEvent({
    delay: 1000,
    callback: () => {
      this.score++;
      this.scoreText.setText('Score: ' + this.score);
    },
    callbackScope: this,
    loop: true,
  });
	}

	update(time, delta) {
	if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
	if (!this.startScroll && !this.gameIsOver) {
		this.startGame();
	} else if (this.isPaused && !this.gameIsOver) {
		this.togglePause();
	} else if (this.gameIsOver) {
		this.restartGame();
	}
  }

	if (this.gameIsOver || !this.startScroll || this.isPaused) return;

	if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
		this.togglePause();
		return;
	}

	const dt = delta / 1000;
	let isMoving = false;

	this.scrollSpeed = 4 + this.score * 0.1;
	this.bg.tilePositionX += this.scrollSpeed;

	if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
		this.player.x -= this.scrollSpeed;
	}

	if (this.cursors.down.isDown && this.player.body.blocked.down) {
		this.player.refreshBody();
		this.player.setVelocityX(0);
		this.player.setFlipX(false);
		this.player.body.setSize(180, 200);
		this.player.body.setOffset(135, 220);
		this.isDucking = true;
	} else if (this.cursors.right.isDown) {
		isMoving = true;
		this.isDucking = false;
		this.player.setFlipX(false);
		this.player.setVelocityX(this.speed);
		this.player.body.setSize(180, 375);
		this.player.body.setOffset(130, 50);
	} else if (this.cursors.left.isDown) {
		isMoving = true;
		this.isDucking = false;
		this.player.setVelocityX(-this.speed * 2);
		this.player.setFlipX(true);
		this.player.body.setSize(180, 375);
		this.player.body.setOffset(380, 50);
	} else {
		this.isDucking = false;
		this.player.setVelocityX(0);
		this.player.body.setSize(180, 375);
		this.player.body.setOffset(130, 50);
	}

	if (this.player.flipX && !this.isDucking) {
		this.player.body.setOffset(380, 50);
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
	} else if (this.isDucking) {
		if (this.player.anims.getName() !== 'duck') {
			this.player.play('duck');
		}
	} else {
		if (this.player.anims.getName() !== 'idle') {
			this.player.play('idle');
		}
	}

	this.obstacles.children.iterate(obstacle => {
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
	if (this.cursors.down.isDown) pressedKeys.push('↓');
	this.keysPressedText.setText('Keys: ' + pressedKeys.join(', '));
} 

  switchDayNight() {
    this.isNight = !this.isNight;

    this.tweens.add({
      targets: this.nightOverlay,
      alpha: this.isNight ? 0.5 : 0, // z.B. 0.5 für Nacht, 0 für Tag
      duration: 5000, // 5 Sekunden Übergang
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Nächster Wechsel in 30 Sekunden
        this.time.delayedCall(45000, () => this.switchDayNight(), [], this);
      }
    });
}

	togglePause() {
  if (this.gameIsOver) return;

  this.isPaused = !this.isPaused;

  if (!this.isPaused) {
    this.physics.resume();
    this.pauseText?.destroy();
    if (this.scoreTimer) this.scoreTimer.paused = false;
  } else {
    this.physics.pause();
    this.pauseText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'PAUSE\nDrücke → zum Fortsetzen',
      { fontSize: '48px', fill: '#fff', align: 'center', fontFamily: 'Arial' }
    ).setOrigin(0.5);
    if (this.scoreTimer) this.scoreTimer.paused = true;
  }
}

	restartGame() {
		this.scene.restart();
	}

	gameOver() {
	this.physics.pause();
	this.player.setTint(0xff0000);
	this.player.anims.stop();
	this.gameIsOver = true;
	this.startScroll = false;
	this.scoreText.setVisible(false);

	const centerX = this.cameras.main.width / 2;
	const centerY = this.cameras.main.height / 2;

	this.add.text(centerX, centerY - 100, 'Game Over\nScore: ' + this.score, {
		fontSize: '48px',
		fill: '#fff',
		align: 'center',
		fontFamily: 'Arial',
	}).setOrigin(0.5);

	this.restartHintText = this.add.text(centerX, centerY + 50, 'Drücke → zum Neustarten', {
		fontSize: '36px',
		fill: '#fff',
		fontFamily: 'Arial',
	}).setOrigin(0.5);
}
}

const config = {
	type: Phaser.AUTO,
	width: 1920,
	height: 1100,
	backgroundColor: '#222',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1300 },
			debug: false,
		},
	},
	scene: MainScene,
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