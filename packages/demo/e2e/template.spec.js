const
  fs = require('fs'),
  cheerio = require('cheerio'),
  srcPath = require('./src-path.js'),
  counter = require('./page/counter.js');

describe('updating counter template', function() {
  const counterHtmlPath = srcPath('counter', 'counter.html');
  let counterHtml, $counter;

  beforeAll(function() {
    counterHtml = fs.readFileSync(counterHtmlPath, 'utf8');
  });

  beforeEach(function() {
    $counter = cheerio.load(counterHtml);
    browser.refresh();
  });

  afterEach(function() {
    if (counterHtml) {
      fs.writeFileSync(counterHtmlPath, counterHtml);
    }
    browser.sleep(1000);
  });

  it('should update the template but keep the state', async function() {
    await counter.increment.click();
    const [valueTextBefore, inputTextBefore] = await Promise.all([
      counter.value.getText(),
      counter.increment.getText(),
    ]);
    // Starting values
    expect(valueTextBefore).toBe('2');
    expect(inputTextBefore).toBe('+');

    // Modify the template
    $counter('button.btn-success').text('+ Add');
    fs.writeFileSync(counterHtmlPath, $counter.html());
    await browser.sleep(1000);

    const [valueTextAfter, inputTextAfter] = await Promise.all([
      counter.value.getText(),
      counter.increment.getText(),
    ]);
    // State should remain the same
    expect(valueTextAfter).toBe('2');
    // Button text should now be "Add"
    expect(inputTextAfter).toBe('+ Add');
  });
});
