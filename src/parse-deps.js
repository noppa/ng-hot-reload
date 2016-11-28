
const parse = _func => {
  const func = _func.toString(),
    l = func.length;

  var argnames = [],
    index = 0;

  var state = {
    inComment: false,
    inArgDef: false,
    inArgName: false,
    inSignature: false,
    openParens: 0
  };

  while(index++ < l) {
    let char = func[index];

    if (state.inComment && char === '*' && func[index+1] === '/') {
      state.inComment = false;
      index++;
      continue;
    }

    if (!state.inSignature) {
      if (!state.inComment && char === '(') {
        state.inSignature = true;
      } else {
        continue;
      }
    } else if (!state.inComment && !state.inArgDef) {

    }

    switch (char) {

      case '/':
        if (func[index+1] === '*') {
          state.inComment = true;
          index++;
        }
        break;

      case '(':
        if (!state.inSignature) {
          state.inSignature = true;
        }
        break;

      case 

    }
  }



};