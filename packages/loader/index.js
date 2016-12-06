

function loader(source, map) {
  if(this.cacheable) {
    this.cacheable();
  }

  const accept = true;

  /*eslint-disable*/
  const prepend = `
/* ng-hot-reload */
if(module.hot) {
  console.log('module.hot');
  (function() {
    var ngHotReload = ${ JSON.stringify(require.resolve('ng-hot-reload')) };
    console.log('woop', ngHotReload, module.makeHot);
    module.makeHot = module.hot.data ? module.hot.data.makeHot : ngHotReload();
  })();
}

module.makeHot = ngHotReload();
try {
  (function(){
    console.log('Run');
    /* ng-hot-reload end */
  `;
  const append = `
  }).call(this);
} finally {
  console.log('Finally');
}

  `;
  /*eslint-enable*/


  return source;
};

export default loader;
