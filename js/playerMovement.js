export function player_movement(scene, dt, isMoving) {
	// const dt = delta / 1000;
	// 	let isMoving = false;
	// 	this.scrollSpeed = 4 + this.score * 0.1;

	this.bg.tilePositionX += this.scrollSpeed;

	if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
		this.player.x -= this.scrollSpeed;
	}

	if (this.cursors.left.isDown) {
		this.player.setVelocityX(-this.speed * 2);
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

	if (
		(this.jumpKey.isDown || this.cursors.up.isDown) &&
		this.player.body.blocked.down
	) {
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
}
