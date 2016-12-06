

export default function isEmptyObj(obj) {
  return typeof obj !== 'object' || obj === null || Object.keys(obj).length;
}
