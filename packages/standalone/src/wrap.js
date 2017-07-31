import wrapTemplate from 'raw-loader!./wrap.tpl.js';
import { template } from 'ng-hot-reload-core';

const
  scriptFileReg = /\.(js|jsx|ts|tsx)$/,
  htmlFileReg = /\.(html)$/;

export default (path, file, options) => {
  const optionsStr = JSON.stringify(Object.assign({
    ns: 'ngHotReloadStandalone',
  }, options));
  const angular = options.angular || 'angular';

  if (scriptFileReg.test(path)) {
    return `(function(__ngHotReloadOptions) {
      ${wrapTemplate}
      ` +
      file +
      `
      })(function(angular) {
          var options = ${optionsStr};
          options.angular = angular;
          return options;
      }(${angular}));
      `;
  } else if (htmlFileReg.test(path)) {
    return file +
      template.getTemplatePathPrefix() +
      path +
      template.getTemplatePathSuffix();
  } else {
    return file;
  }
};

export {
  scriptFileReg,
  htmlFileReg,
};
