

export default class FirstPassCache {
    constructor() {
        this._passedFiles = [];
        this._firstPassHandled = false;
    }

    pass(filePath) {
        if (this._firstPassHandled) {
            // Return false to indicate that this is the
            // first pass thru for this file.
            return false;
        } else if (this._passedFiles.indexOf(filePath) !== -1) {
            // Mark that the first pass is over and return true.
            this._firstPassHandled = true;
            this._passedFiles = null;
            return false;
        } else {
            // Mark that this file has passed once already.
            this._passedFiles.push(filePath);
            return true;
        }
    }
};
