const Phaser = require('phaser');
const { MainScene, createGame } = require('../js/dinoJump.js');

describe('MainScene', () => {
  let scene;

  beforeEach(() => {
    // Neue Scene erzeugen
    scene = new MainScene();

    // Simuliere Tastatur-Input vorher, da create() darauf zugreift
    const fakeCursors = {
      left: { isDown: false },
      right: { isDown: false }
    };

    scene.input = {
      keyboard: {
        createCursorKeys: () => fakeCursors
      }
    };

    scene.add = {
      circle: jest.fn().mockImplementation((x, y, r, color) => ({ x, y, r, color }))
    };

    scene.cameras = {
      main: { width: 800, height: 600 }
    };

    // Jetzt create() aufrufen – input ist vorbereitet
    scene.create();

    // Referenz für später
    scene.cursors = fakeCursors;
  });

  test('Phaser game should initialize', () => {
    const game = createGame();
    expect(game).toBeDefined();
  });

  test('erstellt einen Kreis in der Mitte', () => {
    expect(scene.circle.x).toBe(400); // 800 / 2
    expect(scene.circle.y).toBe(300); // 600 / 2
    expect(scene.circle.r).toBe(30);
    expect(scene.circle.color).toBe(0xff0000);
  });

  test('bewegt sich nach rechts bei Tasteneingabe', () => {
    const initialX = scene.circle.x;
    scene.cursors.right.isDown = true;
    scene.update(0, 100); // 100ms delta
    expect(scene.circle.x).toBeGreaterThan(initialX);
  });
});