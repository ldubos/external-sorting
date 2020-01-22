module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/test/*.(test|spec).+(ts|js)'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/', '/dist/']
};
