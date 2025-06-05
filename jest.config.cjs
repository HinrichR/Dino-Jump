module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {},
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['js'],
};
