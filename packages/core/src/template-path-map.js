
const
    filePathCommentPrefix =
        '<!-- File path (added by ng-hot-reload plugin): ',
    filePathCommentSuffix = ' -->',
    savedFilePaths = new Map();


function set(path, file) {
    const match = matchFilePath(file);
    if (!match) {
        return false;
    } else {
        savedFilePaths.set(path, match.filePath);
    }
}

function matchFilePath(file) {
    const filePathStart = file.indexOf(filePathCommentPrefix);
    if (filePathStart === -1) {
        return null;
    }
    const filePathEnd = file.indexOf(filePathCommentSuffix, filePathStart) ||
            file.length;

    const filePath = file.substring(
            filePathStart + filePathCommentPrefix.length, filePathEnd);

    return {
        filePath,
        filePathStart,
        filePathEnd,
    };
}

export {
    filePathCommentPrefix,
    filePathCommentSuffix,
};
