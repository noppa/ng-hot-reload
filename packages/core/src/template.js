import angularProvider from './ng/angular';
import updates from './updates';
import manualReload from './manual-reload';

let
  templatePathPrefix =
  '<!-- File path (added by ng-hot-reload plugin): ',
  templatePathSuffix = ' -->';

function decorateTemplateRequest(moduleName = 'ng') {
  const savedFilePaths = new Map();
  /**
   * Extracts the actual file path from the template and saves the
   * link betwen the relative url and the actual path in computer.
   * @param {string} path Relative path/url where the component attempts
   *      load the template from.
   * @param {string} file Template file.
   * @return {boolean} True if the function was able to extract the
   *      original path from the template.
   */
  function setFilePath(path, file) {
    const match = matchFilePath(file);
    if (!match) {
      return false;
    } else {
      savedFilePaths.set(match.filePath, path);
      return true;
    }
  }

  // Initialized when the app first runs
  let templateUpdates, $templateCache;
  const angular = angularProvider();

  // Override the $templateCache service so we can react to template changes
  angular.module(moduleName).config(['$provide', function($provide) {
    $provide.decorator('$templateRequest', ['$delegate', '$templateCache', '$q',
    function($delegate, _$templateCache_, $q) {
      $templateCache = _$templateCache_;

      return function ngHotReloadRequestTemplate(tpl, ...rest) {
        debugger;
        const result = $delegate.call(this, tpl, ...rest);
        result.then(template => {
          debugger;
          setFilePath(tpl, template);
        });
        return result;
      };
    }]);
  }]);

  angular.module(moduleName).run(['$rootScope', function($rootScope) {
    templateUpdates = updates($rootScope, moduleName, 'template');
  }]);

  return {
    update(filePath) {
      if (templateUpdates && savedFilePaths.has(filePath)) {
        const key = savedFilePaths.get(filePath);
        templateUpdates.update(key);
      } else {
        console.log(savedFilePaths);
        const msg = templateUpdates ?
          `Template ${filePath} hasn't been used yet.`
          : 'App was not initialized yet.';
        manualReload(msg);
      }
    },
    getTemplateCache: () => $templateCache,
  };
}

function matchFilePath(file) {
  const filePathStart = file.indexOf(templatePathPrefix);
  if (filePathStart === -1) {
    return null;
  }
  const filePathEnd = file.indexOf(templatePathSuffix, filePathStart) ||
    file.length;

  const filePath = file.substring(
    filePathStart + templatePathPrefix.length, filePathEnd);

  return {
    filePath,
    filePathStart,
    filePathEnd,
  };
}

export const getTemplatePathPrefix = () => templatePathPrefix;
export const getTemplatePathSuffix = () => templatePathSuffix;
export const setTemplatePathPrefix = prefix => templatePathPrefix = prefix;
export const setTemplatePathSuffix = suffix => templatePathSuffix = suffix;
export { decorateTemplateRequest };
