
const makePrivateKey = typeof Symbol === 'function' ?
      key => Symbol(key) :
    key => key;

export default makePrivateKey;
