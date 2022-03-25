module.exports = {
  get value() {
    return element(by.binding('$ctrl.counter'));
  },
  get increment() {
    return element(by.cssContainingText('button', '+'));
  },
};
