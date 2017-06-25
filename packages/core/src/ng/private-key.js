/**
 * Tests if an object property name is private
 * for angular's internal stuff.
 * @param {string} key Property name to test.
 * @return {boolean} True if the object property is private.
 */
export default function isPrivateKey(key) {
    return !!key && key.charAt(0) === '$';
};
