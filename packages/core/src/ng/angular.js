/* eslint-disable spaced-comment */
/// <reference types="angularjs" />

let ng;

const setAngular = _ng => ng = _ng;
/**
 * @return {angular.IAngularStatic} Angular
 */
const getAngular = () => ng;

export default getAngular;
export { setAngular };
