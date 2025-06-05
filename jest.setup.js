const { createCanvas } = require('canvas');

// global.HTMLCanvasElement mocken
Object.defineProperty(global, 'HTMLCanvasElement', {
  value: class HTMLCanvasElement {},
  writable: true,
});

global.HTMLCanvasElement.prototype.getContext = function(type) {
  return createCanvas(800, 600).getContext(type);
};