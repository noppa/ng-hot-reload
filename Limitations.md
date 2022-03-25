# Limitations

ng-hot-reload is a tool focused on making UI development more pleasant with
AngularJS. It's not perfect, and it won't cover 100% of the code edits you
make — a full reload is still needed every once in a while. Understanding the
limitations of this library may help you achieve the best development
experience with hot reloading. It depends on your application and its needs
whether you can apply the suggestions that follow. However, you may also find
that at least some of them might lead to better overall code quality anyway.

## Focus on components and directives
Firstly, services and factories are not hot reloaded at all, and
modifications to them always cause a hard reload. Supporting services
would've been more difficult for various reasons; services are often very
stateful, they are considered singletons so there's no way to define cleanup
phase to run on hot swap and tracking all the directives and controllers that
need to be reloaded when a service changes would've meant more work. It
probably wouldn't be impossible to support them, but I didn't think it was
worth the effort. I recommend developing services and factories separately
with more TDD/unit testing and using hot reloading just for the view stuff
(**directives** and **components**, mainly).

## Use components for UI-Router states
UI-Router states don't get special hot reload handling. The library used to
have special UI-Router support in an earlier version, but I removed it as an
unnecessary (and buggy) feature when UI-Router's [component routes](https://ui-router.github.io/guide/ng1/route-to-component)
were introduced and started to get popular. Components are hot reloaded, so
there's no need for special UI-Router route handling. So I recommend
refactoring UI-Router states to the component style:
```javascript
// Before 
    .config($stateProvider => {
        $stateProvider.state("foo", {
            url: "/foo",
            template: "<foo></foo>"
        });
    })

// After 
    .config($stateProvider => {
        $stateProvider.state("foo", {
            url: "/foo",
            component: 'appFoo', // ...or whatever you name the component
        });
    })
```
For more information about component routes, see
[Migrate to components](https://ui-router.github.io/guide/ng1/route-to-component#migrate-to-components)
in UI-Router's docs.

## Separate components to different files
Use one file per one component/directive. Having multiple components in one
file will cause unnecessary reloads in the other component when you only
needed to edit the other. Separating components into their own files is
generally a good practice anyway. Having services, factories, configs etc.
defined in the same file as a directive definition will cause a hard reload
because services are not hot reloaded as mentioned before.

## Injected services
Adding or removing injected dependencies to a directive/component will cause a
hard reload, but well that's not something you can really avoid - when you
need to add a new injected dependency you just add it, it's probably not such
a common case anyway that one would need to worry about it.

## Preserving state
The library tries to preserve state of the modified component when a hot
reload happens. This can be really useful if you have some state like
```javascript
this.modalOpen = false
```
If you open the modal in that component (`this.modalOpen = true`) and then
modify the file, we can keep `this.modalOpen = true` after the hot reload. A
few general practices can help with this. First, initialize/declare the
properties that you are going to have in the controller or scope in
the constructor of the component class.
```javascript
// Good
class MyController {
  modalOpen = false
  openModal() {
    this.modalOpen = true
  }
}
// Bad
class MyController {
  openModal() {
    // modalOpen won't be preserved on hot reload because
    // the property wasn't there in initialization phase!
    this.modalOpen = true
  }
}
```
Asynchronous state can also be a bit tricky if you want that to be hot
reloaded
```javascript
class MyController {
  users = []
  constructor(userService) { this.userService = userService }
  $onInit() {
    this.userService.fetchUsers().then(users => {
      // ng-hot-reload might have preserved the earlier users array,
      // but this overwrites that
      this.users = users
    })
  }
  addUser(name) { this.users.push({name}) }
}
```
This might not be a problem because usually, async data comes from some
datastore that is kept in sync with the `this.users` property anyway, so the
users list you get after fetch is up to date. However, if that's not the
case, for example, if your view doesn't save the data automatically and you
want to edit the component without saving the changes you make to the data,
you can write checks like
```javascript
  const defaultUsersList = []
  this.users = defaultUsersList
  this.fetchUsers().then(users => {
    // If ng-hot-reload has swapped this.users list, this will be false
    const usersListIsUnchanged = this.users === defaultUsersList
    if (usersListIsUnchanged) {
      this.users = users
    }
  })
```
Note that whether that works correctly largely depends on your controller and
data. In worst-case scenario conditions like that could even cause production
bugs! So you need to use your own judgment to determine if that approach
works for you.

Finally, the preserved state properties will need to be copyable. Uncopyable
values include, for example, error objects, functions, DOM nodes, WeakMaps,
window, $rootScope, and any injected values, like services.
```javascript
  addUser(firstName, lastName) {
    const userService = this.userService
    this.users.push({
      firstName, lastName,
      // Here we are storing a fuction into the users list,
      // so it will be impossible to preserve users list on state reload.
      save() { return userService.saveUser(this) }
     })
  }
```
Class instances are preserved and can have methods in the prototype, so you
might be able to get around the limitation above by having a `User` class.
Once again it depends on your project if that's applicable.

## Problems with preserved state
On the opposite case, it's also possible that state is preserved and _that_
causes issues, due to reference equality being lost in the copying process,
for example.

```javascript
this.countryOptions = [{ countryCode: 'US' }, { countryCode: 'FI' }]
this.selectedCountry = this.countryOptions[0]
// somewhere else...
doSomething() {
  // This condition will always be false after a state reload!
  // Both selectedCountry and countryOptions have been cloned so === doesn't work anymore.
  if (this.selectedCountry === this.countryOptions[0]) {
    ..
  }
}
```
If state reloading causes issues like that, you can turn it off in the
[library options](https://github.com/noppa/ng-hot-reload#client-options) with
`preserveState: false`, or (once again if your application code so permits)
you can avoid some of the issues with e.g. using
`this.selectedCountry.countryCode === this.countryOptions[0].countryCode`.

## Known issues
Last but not least there are a few
[issues](https://github.com/noppa/ng-hot-reload/issues) that have been open
here for quite a while, related to Angular 2+ and lazy loading. I haven't had
much time to look into those, so I guess you'll have smoother sailing if you
try to avoid the use cases that are described in those issues.  
Pull requests are welcome, of course.

