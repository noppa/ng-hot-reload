exports.config = {
  baseUrl: 'http://localhost:8080',
  directConnect: true,
  specs: [
    './e2e/**/*.spec.js',
  ],
  onPrepare() {
    browser.get('http://localhost:8080');
  },
  params: {
    package: 'standalone',
  },
};
