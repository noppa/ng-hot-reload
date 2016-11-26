var parseDeps = require('./parse-deps.js');



test('should return true', () => {
  expect(parseDeps.foo()).toBe(true);
});