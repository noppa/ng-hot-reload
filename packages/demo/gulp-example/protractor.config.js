exports.config = {
  baseUrl: 'http://localhost:8080',
  directConnect: true,
  specs: [
    './gulp-example.spec.js',
  ],
  onPrepare() {
    browser.get('http://localhost:8080');
  },
};
