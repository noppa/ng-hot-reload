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

  if (browser.params.package === 'loader') {
    // This test is only relevant for webpack builds.
    it('should update components that are registered in a separate file (issue #4)', // eslint-disable-line
    async function() {
      const componentFilePath = srcPath('elements', 'button.component.js');
      const originalComponentFile = await readFile(componentFilePath, 'utf8');

      const dateInput = () => element(by.css('element-date input[type="date"]'));

      // Programmatically set the value of the input element. We could just
      // .sendKeys() to it, but then we'd run into localization issues if the
      // tests are being run with different browser settings. The value property
      // has the same format regardless of localization.
      await browser.executeScript(function() {
        const el = arguments[0];
        el.value = '2018-02-03';
      }, dateInput());

      expect(await dateInput().getAttribute('value')).toBe('2018-02-03');

      const buttonInput = () => element(by.css('element-button button'));
      expect(await buttonInput().getText()).toBe('Click me!');

      try {
        await writeFile(
          componentFilePath,
          originalComponentFile.replace('!', ''));
        browser.sleep(1000);

        // The button component has been updated.
        expect(await buttonInput().getText()).toBe('Click me');
        // The date component has NOT been updated.
        expect(await dateInput().getAttribute('value')).toBe('2018-02-03');
      } finally {
        await writeFile(componentFilePath, originalComponentFile);
      }
    });
  }
});
