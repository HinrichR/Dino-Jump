module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    "node_modules/(?!phaser)/"  // Phaser wird auch transpiliert
  ],
  transform: {},
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['js'],
};