const
  fs = require('fs'),
  hello = require('./page/hello.js'),
  counter = require('./page/counter.js'),
  srcPath = require('./src-path.js');

describe('updating counter component', function() {
  const counterJsPath = srcPath('counter', 'counter.js');
  let currentCounterComponent;

  function modifyComponent() {
    // Update the component source
    const modifiedCounterComponent =
      currentCounterComponent.replace('this.counter++', 'this.counter += 10');
    fs.writeFileSync(counterJsPath, modifiedCounterComponent);
    // Give the gulp task some time to do its thing
    return browser.sleep(1000);
  }

  beforeAll(function() {
    // Save the counter.js source file so the tests can modify it and
    // we can restore it after we are done.
    currentCounterComponent = fs.readFileSync(counterJsPath, 'utf8');
  });

  beforeEach(function() {
    browser.refresh();
  });

  afterEach(function() {
    fs.writeFileSync(counterJsPath, currentCounterComponent);
    browser.sleep(1000);
  });

  it('should initialize the counter correctly', function() {
    expect(counter.value.getText()).toEqual('1');
    counter.increment.click();
    expect(counter.value.getText()).toEqual('2');
  });

  it('should update counter component\'s add() method', async function() {
    expect(await counter.value.getText()).toEqual('1');
    await counter.increment.click();
    expect(await counter.value.getText()).toEqual('2');

    await modifyComponent();

    // The state should be the same as it was before
    expect(await counter.value.getText()).toEqual('2');
    counter.increment.click();
    // The + button should now increment by 10
    expect(await counter.value.getText()).toEqual('12');
  });

  it('should keep the state of the parent component', async function() {
    await hello.input.sendKeys('world');
    await modifyComponent();
    expect(await hello.value.getText()).toEqual('Hello world');
  });
});
