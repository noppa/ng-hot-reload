
angular.module('hot-reload-demo')
  .config(['$stateProvider', config]);

const homeTemplate = `
<h2>Home</h2>
<hr/>
<hello></hello>
`;

function config($stateProvider) {
  $stateProvider
    .state('home', {
      url: '',
      template: homeTemplate,
    })
    .state('counter', {
      url: '/counter',
      template: homeTemplate.replace('Home', 'Counter'),
    });
}
