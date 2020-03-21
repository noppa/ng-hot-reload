# 🔥 ng-hot-reload

#### Developing legacy apps doesn't need to suck <sup><i>(so bad)</i></sup>!

**ng-hot-reload** uses a suite of clever tricks (read: dirty, unstable hacks) to "hot" reload [AngularJS](https://angularjs.org/) (version 1.x) components and directives, reducing the need to refresh page between code updates.  
Moreover, it doesn't depend on build tools like Webpack or specific JavaScript features like ES6 modules.
Webpack is superb and ESNext features are awesome, but many great projects predate those and I think they deserve to have the same great development experience that modern *&lt;name-your-favourite-JS-library&gt;* apps do. 

![hot](https://github.com/noppa/ng-hot-reload/raw/master/assets/preview.gif "hot hot hot")

Hot Module Replacement (HMR) is a technique popularized by [Webpack](https://webpack.js.org/), [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/) to modify the modules of an application while the app is running, without a full reload. This library provides the tools to do something very similar for angularjs apps: when a file is modified, ng-hot-reload swaps the implementation of the changed directive or component on a running browser environment so that you'll be able to see the result of code changes immediately.  
It also attempts to preserve some of the component state so that your debugging efforts don't need to start from scratch, although admittedly this feature is not as thorough or reliable as the state reloading that you would get with Redux.

## Usage
**Warning:** Some of the stuff that this library does is quite hackish and use angular's
internal/private apis, so **they might break in the future**. Luckily this is
a development tool that you can easily opt in and out of, so it doesn't really
matter if it's "production ready" or not.

This repository is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) that contains these four packages:
- [core](https://www.npmjs.com/package/ng-hot-reload-core) is a base-implementation for this library that runs on the client (browser). It's something that the other packages depend on, you probably won't need to use it directly.
- [loader](https://www.npmjs.com/package/ng-hot-reload-loader) is a Webpack loader that uses [Webpack’s HMR feature](https://webpack.js.org/concepts/hot-module-replacement/) to load the file changes.
- [standalone](https://www.npmjs.com/package/ng-hot-reload-standalone) provides methods to start a standalone WebSocket server and send updates to the client. This package integrates quite nicely with [Gulp](https://gulpjs.com/) but it should also be possible to use it with pretty much any other build tool that is able to watch and react to file changes if you are willing to put some effort into gluing the pieces together.
- [demo](https://github.com/noppa/ng-hot-reload/tree/master/packages/demo) package contains demo implementations using both Webpack and Gulp. It's a good read-through if you are planning to integrate this library to your build. The package also contains some e2e tests for this project which you only need to worry about if you want to contribute to the project.

### Limitations

ng-hot-reload is a tool focused on making UI development more pleasant with AngularJS. It's not perfect, and it won't cover 100% of the code edits you make — a full reload is still needed every once in a while. Understanding the limitations of this library may help you achieve the best development experience with hot reloading.

For a noncomprehensive guide to what you might want to do or avoid doing with the library, see [Limitations](Limitations.md).

### Installation for Webpack build

`npm install --save-dev ng-hot-reload-loader`

Example webpack config is in [the demo package](https://github.com/noppa/ng-hot-reload/tree/master/packages/demo), demo project sources are in `webpack-example` folder.

### Installation for Gulp or any other build setup

`npm install --save-dev ng-hot-reload-standalone`

Check out `gulpfile.js` in [the demo package](https://github.com/noppa/ng-hot-reload/tree/master/packages/demo), demo project sources are in `gulp-example` folder. 

## Client options
The options that you can pass to the library depend on the package you use, but these options should work in all:

- `angular` (string, default: `"angular"` for standalone package and
`'require("angular")'` for Webpack) JavaScript expression that
will be evaluated to get a reference to angular.
- `forceRefresh` (boolean,
default: `true`) Whether to reload window automatically when a change in
source files can't be hot-reloaded. Note that Webpack DevServer also has its
own option
[hotOnly](https://webpack.js.org/configuration/dev-server/#devserver-hotonly),
which should also be configured correctly to get the behaviour you want when
hot reloading fails.
- `preserveState` (boolean, default: `true`) If true,
the library attempts to preserve some state in scope and controller instances
when they are reloaded. Preserving state is an experimental feature and quite
"hackish" so it may cause problems in some cases. Setting this to `false`
might help if you run into weird errors.

## License
MIT
