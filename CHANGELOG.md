## 2.0.3
- Updated build dependencies, no breaking changes

## 2.0.2
- Updated build dependencies, no breaking changes

## 2.0.0
- Fix [issue #4](https://github.com/noppa/ng-hot-reload/issues/4)
- Remove special support for UI-router  
  UI-router supports [routing to a component](https://ui-router.github.io/guide/ng1/route-to-component),
  which works much better with this library than the hacky route reloading that we tried to do before.
- Fix an issue that caused only the first component to update in cases where there were more than one
  instances of the component active
- Add options support for the Webpack loader
