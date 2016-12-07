

module.exports = function(source, map) {
  if(this.cacheable) {
    this.cacheable();
  }

  console.log('Works again');

  return source;
};
