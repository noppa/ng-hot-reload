module.exports = {
  get value() {
    return element(by.binding('vm.message + vm.name'));
  },
  get input() {
    return element(by.model('vm.name'));
  },
};