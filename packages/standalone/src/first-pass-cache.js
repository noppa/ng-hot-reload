
/**
 * Helper class to keep track of files that
 * have passed through the stream.
 */
export default class FirstPassCache {
    constructor() {
        this._passedFiles = [];
        this._firstPassHandled = false;
    }
    /**
     * Marks that the given file has passed through.
     * @param {string} filePath File that is passing through
     * @return {boolean} True if this is still the first pass,
     *      false if ANY file (this or previous) has already
     *      been passed through twice.
     */
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
