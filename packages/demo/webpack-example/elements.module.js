const compRegex = /\.*\/(.*)\.component\.js$/;
const reqContext = require.context('./elements', true, /.*\.component\.js$/);
const ngMod = angular.module('elements', []);

reqContext.keys().forEach(compPath => {
  const comp = reqContext(compPath).default;
  let name = compRegex.exec(compPath)[1];
  name = name[0].toUpperCase() + name.slice(1);
  name = 'element'+ name;
  ngMod.component(name, comp);
});

export default ngMod.name;
