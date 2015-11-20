# Mithril Router

Django style router for [Mithril.js][mithril]

[![version][npm-version]][npm-url]
[![License][npm-license]][license-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][npm-downloads]][npm-url]
[![Code Climate][codeclimate-quality]][codeclimate-url]
[![Coverage Status][codeclimate-coverage]][codeclimate-url]
[![Dependencies][david-image]][david-url]

## Install

- Download [the latest package][download]
- NPM: `npm install mithril-router`

## Usage

**Node.js / Browserify**

```js
// Include mithril
var m = require('mithril')

// Pass mithril to the router.
// Only required to overload once, subsequent overloads will
// return the same instance
require('mithril-router')(m)
```

**Browser**

```html
<script src="path/to/mithril.js" type="text/javascript"></script>
<script src="path/to/mithril.router.js" type="text/javascript"></script>
```

## Documentation

### m.route()

Router allowing creation of Single-Page-Applications (SPA) with a DRY mechanism
(identification classified as namespaces) to prevent hard-coded URLs.

- `m.route()`: returns current route
- `m.route(element:DOMElement)`: bind elements while abstracting away route mode
- `m.route(namespace|route(, parameters:Object))`: programmatic redirect w/ arguments
- `m.route(namespace|route(, replaceHistory:Boolean))`: programmatic redirect w/ replacing history entry
- `m.route(namespace|route(, parameters:Object, replaceHistory:Boolean))`: programmatic redirect w/ arguments and replacing history entry
- `m.route(rootElement:DOMElement, routes:Object)`: configure app routing
- `m.route(rootElement:DOMElement, rootRoute:String, routes:Object)`: configure app routing (mithril default router style)

#### Configure Routing

To define routing specify a host DOM element, and routes with a root route. Should no root
route be specified, the first route is chosen.

**New**

```js
m.route(document.body, {
  "/": { controller: home, middleware: [], namespace: "index", root: true },
  "/login": { controller: login, namespace: "login" },
  "/dashboard": { controller: dashboard, namespace: "dashboard" }
})
```

**Classic**

```js
m.route(document.body, "/", {
  "/": { controller: home, middleware: [], namespace: "index" },
  "/login": { controller: login, namespace: "login" },
  "/dashboard": { controller: dashboard, namespace: "dashboard" }
})
```

---

### m.route.mode

See [Mithril.route.html#mode][mithril-mode]

---

### m.route.param()

See [Mithril.route.html#param][mithril-param]

---

### m.route.use()

Mount middleware function(s) to all paths in the system, or mount the `m.routeErrorHandler` function.

#### Api

- `m.route.use(middleware)`

#### Middleware Arguments

By default it accepts to main arguments:

- `req`
  - `param` - Sugar for `m.route.param()`
  - `namespace` - Route namespace
  - `route` - Router path string
  - `path` - Path part of Request URL
  - `port` - Port part of Request URL
  - `hostname` - Hostname part of Request URL
  - `protocol` - Protocol part of Request URL
  - `secure` - `req.protocol === 'https'`
- `next` - Continuity method, invokes next middleware or route controller.
  - `err` - When passed, invokes `m.routeErrorHandler` should no `m.routeErrorHandler` exist,
  the controller is invoked with `req.error` set.

To mount the `m.routeErrorHandler` the middleware passed has an arity of `3`:

- `err` - Error object passed through previous middleware
- `req` - Request object as described above.
- `next` - Error handler continue (directly invokes controller with `req` object)

#### Examples

```js
// Mount Middleware
m.route.use(function (req, next) {
  // handle request logic
  return next()
})

// Mount Error Handler
m.route.use(function (err, req, next) {
  app.internalPageState.err = err
  m.redirect('/err/500')
})
```

---

### m.redirect()

Redirect user to specified route, or route namespace with given arguments.

Sugar for `m.route(namespace|path(, args))`

---

### m.reverse()

Generate path using specified identifier (route namespace) and path arguments.

#### Api

- `m.reverse(namespace(, options))`: takes specified route namespace and options and generates path.

##### Options

- `params`: **Object** Route parameters, named and non-named.
- `query`: **String | Object** Querystring
- `prefix`: **String | Boolean** Mode, when `true` prepends the mode char to the route,
  when defined as a string the string is prepended instead.

  Useful for when you are not using `config: m.route`

#### Examples

```js
// user => /user/
m.reverse('user')

// user => /user/:id => /user/23
m.reverse('user', { params: { id: 23 }})

// user => /user/:id => /user/23?include=profile
m.reverse('user', { params: { id: 23 }, query: { include: 'profile' }})

// user => /user/:id => #/user/23?include=profile
m.route.mode = 'hash'
m.reverse('user', { prefix: true, params: { id: 23 }, query: { include: 'profile' }})

// user => /user/:id => /api/user/23?include=profile
m.reverse('user', { prefix: '/api', params: { id: 23 }, query: { include: 'profile' }})
```

## License

Licensed under [The MIT License](LICENSE).

[license-url]: https://github.com/Nijikokun/mithril-router/blob/master/LICENSE

[travis-url]: https://travis-ci.org/Nijikokun/mithril-router
[travis-image]: https://img.shields.io/travis/Nijikokun/mithril-router.svg?style=flat

[npm-url]: https://www.npmjs.com/package/mithril-router
[npm-license]: https://img.shields.io/npm/l/mithril-router.svg?style=flat
[npm-version]: https://img.shields.io/npm/v/mithril-router.svg?style=flat
[npm-downloads]: https://img.shields.io/npm/dm/mithril-router.svg?style=flat

[coveralls-url]: https://coveralls.io/r/Nijikokun/mithril-router
[coveralls-coverage]: https://img.shields.io/coveralls/jekyll/jekyll.svg

[codeclimate-url]: https://codeclimate.com/github/Nijikokun/mithril-router
[codeclimate-quality]: https://img.shields.io/codeclimate/github/Nijikokun/mithril-router.svg?style=flat
[codeclimate-coverage]: https://img.shields.io/codeclimate/coverage/github/Nijikokun/mithril-router.svg?style=flat

[david-url]: https://david-dm.org/Nijikokun/mithril-router
[david-image]: https://img.shields.io/david/Nijikokun/mithril-router.svg?style=flat

[download]: https://github.com/Nijikokun/mithril-router/archive/v1.2.3.zip
[mithril]: https://github.com/lhorie/mithril.js
[mithril-mode]: http://lhorie.github.io/mithril/mithril.route.html#mode
[mithril-param]: http://lhorie.github.io/mithril/mithril.route.html#param
