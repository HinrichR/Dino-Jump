// jest.setup.js
const { createCanvas } = require('canvas');

Object.defineProperty(global, 'HTMLCanvasElement', {
  value: function () {},
  writable: true,
});

Object.defineProperty(global.HTMLCanvasElement.prototype, 'getContext', {
  value: function (type) {
    return createCanvas(800, 600).getContext(type);
  },
});