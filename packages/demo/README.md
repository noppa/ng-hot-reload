# ng-hot-reload-demo

This is a **demo** for [ng-hot-reload](https://github.com/noppa/ng-hot-reload) monorepo.  
It includes examples on how this package can be used for both Webpack and Gulp build setups.

What works for your build might look different, of course, but I hope these examples can help at least a bit.

The package also contains some e2e tests for the whole project (not for the example apps themselves). You only need to worry about those if you are contributing to the project.

## Running the demo
Note: the demo package is only intended to be an example for the configurations that you may need.
Your actual configurations may differ somewhat. If you still want to run it to see how the
hot loader works or perhaps to contribute to the project, start by running these commands at the
_root_ directory of the cloned repo:

```sh
yarn
yarn run lerna bootstrap
yarn run lerna run build
```
These commands will
- Install the shared dependencies that all packages need at the top level directory
- Install and link all the subpackages and their dependencies correctly
- Build all packages (you might need to run this later too if you make changes to library source files).

The example above uses [yarn](https://yarnpkg.com). `npm` should work fine too, but you might
need to change the `npmClient` option in _lerna.json_.

If you intend to run the e2e tests (only needed if you are contributing to the project), also install
[Protractor](https://www.protractortest.org/#/) with `yarn global add protractor`
(or `npm i -g protractor`) and `webdriver-manager update`.

Note: commit your changes before running the e2e tests!
The tests actually _modify_ files on disk to emulate the file changes that this library is supposed
to react to, which might result in changes being lost if something goes really wrong.

### Running Gulp demo and tests

Start serving the Gulp example app by running `yarn gulp-example` in this folder.  
To run the e2e tests, open another shell and run `yarn test:gulp` in this folder.

### Running Webpack demo and tests

Start serving the Webpack example app by running `yarn webpack-example` in this folder.  
Open another shell and run `yarn test:webpack`.
