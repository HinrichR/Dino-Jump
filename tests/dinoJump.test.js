import Phaser from 'phaser';
import { jest } from '@jest/globals';
import { MainScene } from '../js/dinoJump.js';

describe('MainScene', () => {
  let scene;

  beforeEach(() => {
    // Scene vorbereiten
    scene = new MainScene();

    // Dummy Methoden bereitstellen
    scene.add = {
      circle: jest.fn().mockImplementation((x, y, r, color) => ({ x, y, r, color })),
    };

    scene.cameras = {
      main: { width: 800, height: 600 }
    };

    // Eingabeobjekte simulieren
    scene.input = {
      keyboard: {
        createCursorKeys: () => ({
          left: { isDown: false },
          right: { isDown: false }
        })
      }
    };

    scene.create();
  });

  test('erstellt einen Kreis in der Mitte', () => {
    expect(scene.circle.x).toBe(400); // 800 / 2
    expect(scene.circle.y).toBe(300); // 600 / 2
    expect(scene.circle.r).toBe(30);
    expect(scene.circle.color).toBe(0xff0000);
  });

  test('bewegt sich nach rechts bei Tasteneingabe', () => {
    const initialX = scene.circle.x;

    // Rechte Taste simulieren
    scene.cursors.right.isDown = true;

    // update aufrufen mit 100ms delta
    scene.update(0, 100);

    // Kreis sollte sich nach rechts bewegt haben
    expect(scene.circle.x).toBeGreaterThan(initialX);
  });
});