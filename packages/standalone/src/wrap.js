import wrapTemplate from 'raw-loader!./wrap.tpl.js';

export default ({ firstPassed, port, angular }) => (path, file) => {
    const options = JSON.stringify({
        ns: 'ng-hot-reload-standalone',
        firstPassed,
        port,
    });

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
};
