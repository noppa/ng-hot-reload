const fs = require('fs');
const path = require('path');

describe('counter component', function() {
  /* globals browser, element, by */
  const counterJsPath = path.join(__dirname, 'counter.js');
  let currentCounterComponent;

  const page = {
    get counterValue() {
      return element(by.binding('$ctrl.counter'));
    },
    get counterIncrement() {
      return element(by.cssContainingText('button', '+'));
    },
  };

  it('should initialize the counter correctly', function() {
    expect(page.counterValue.getText()).toEqual('1');
    page.counterIncrement.click();
    expect(page.counterValue.getText()).toEqual('2');
  });

  beforeAll(function() {
    currentCounterComponent = fs.readFileSync(counterJsPath, 'utf8');
  });

  afterAll(function() {
    fs.writeFileSync(counterJsPath, currentCounterComponent);
  });
});
