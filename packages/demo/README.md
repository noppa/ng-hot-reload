# ng-hot-reload-demo

This is a **demo** for [ng-hot-reload](https://github.com/noppa/ng-hot-reload) monorepo.  
It includes examples on how this package can be used for both Webpack and Gulp build setups.

What works for your build might look different, of course, but I hope these examples can help at least a bit.

The package also contains some e2e tests for the whole project (not for the example apps themselves). You only need to worry about those if you are contributing to the project.

## Running the e2e tests

- Install [Lerna](https://github.com/lerna/lerna) globally (`npm i -g lerna` or `yarn global add lerna`)
- Install [Protractor](https://www.protractortest.org/#/) globally (`npm i -g protractor`)
- Run `lerna bootstrap` at the root folder of the repo
- Commit your changes! The tests actually _modify_ files on disk to emulate the file changes that this
library is supposed to react to, which might result in changes being lost if something goes really wrong.

### Gulp setup

- Start serving the Gulp example app by running `yarn gulp-example` in this folder.
- Open another shell and run `yarn test:gulp` in this folder.

### Webpack setup

- Start serving the Webpack example app by running `yarn webpack-example` in this folder.
- Open another shell and run `yarn test:webpack`
