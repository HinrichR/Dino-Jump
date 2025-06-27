export function spawnObject(scene, x, y, type) {
	let cactus_width = 130;
	let cactus_height = 170;

	let single = {
		width: cactus_width,
		height: cactus_height,
		chance: 0.5,
	};

	let double = {
		width: cactus_width * 2,
		height: cactus_height,
		chance: 0.3,
	};

	let triple = {
		width: cactus_width * 3,
		height: cactus_height,
		chance: 0.2,
	};
}

function chooseRandomObjectType() {
	const random = Math.random();
	if (random < single.chance) {
		return single;
	} else if (random < single.chance + double.chance) {
		return double;
	} else {
		return triple;
	}
}
