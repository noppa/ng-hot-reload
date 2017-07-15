import wrapTemplate from 'raw-loader!./wrap.tpl.js';
import { filePathCommentPrefix, filePathCommentSuffix } from 'ng-hot-reload-core';

const
    isSciptFile = /\.(js|jsx|ts|tsx)$/,
    isHtmlFile = /\.(html)$/;

export default ({ firstPassed, port, angular }) => (path, file) => {
    const options = JSON.stringify({
        ns: 'ng-hot-reload-standalone',
        firstPassed,
        port,
    });

    if (isSciptFile.test(path)) {
        return `(function(__ngHotReloadOptions) {
            ${wrapTemplate}
            ` +
            file
            + `
        })(function(angular) {
            var options = ${options};
            options.angular = ${angular};
            return options;
        }(${angular}));
        `;
    } else if (isHtmlFile.test(path)) {
        return file + '\n' +
            filePathCommentPrefix + path + filePathCommentSuffix;
    } else {
        return file;
    }
};
