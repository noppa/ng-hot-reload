const
  fs = require('fs'),
  util = require('util'),
  srcPath = require('./src-path.js');

const
  readFile = util.promisify(fs.readFile),
  writeFile = util.promisify(fs.writeFile);

// Tests for fixed bugs
describe('bugfixes', function() {
  it('should update all component instances when there are many',
  async function() {
    const componentFilePath = srcPath('emoji', 'emoji.component.js');
    const originalComponentFile = await readFile(componentFilePath, 'utf8');
    try {
      const headerText = () => element(by.css('h1')).getText();

      expect(await headerText()).toBe('🏠 sweet 🏠');
      // Change the emoji.
      await writeFile(
        componentFilePath,
        originalComponentFile.replace('🏠', '🚀'));
      browser.sleep(1000);
      expect(await headerText()).toBe('🚀 sweet 🚀');
    } finally {
      await writeFile(componentFilePath, originalComponentFile);
    }
  });
});
