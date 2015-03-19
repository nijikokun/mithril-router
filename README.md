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

## Documentation

### m.route()

Router allowing creation of Single-Page-Applications (SPA) with a DRY mechanism
(identification classified as namespaces) to prevent hard-coded URLs.

- `m.route()`: returns current route
- `m.route(element)`: bind elements while abstracting away route mode
- `m.route(namespace|route(, args))`: programmatic redirect w/ arguments
- `m.route(rootElement, routes)`: configure app routing
- `m.route(rootElement, rootRoute, routes)`: configure app routing (mithril default router style)

#### Configure Routing

To define routing specify a host DOM element, and routes with a root route. Should no root
route be specified, the first route is chosen.

```js
m.route(document.body, {
  "/": { controller: home, namespace: "index", root: true },
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

#### Examples

```js
// user => /user/
m.reverse('user')

// user => /user/:id => /user/23
m.reverse('user', { params: { id: 23 }})

// user => /user/:id => /user/23?include=profile
m.reverse('user', { params: { id: 23 }, query: { include: 'profile' }})
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

[download]: https://github.com/Nijikokun/mithril-router/archive/v1.2.0.zip
[mithril]: https://github.com/lhorie/mithril.js
[mithril-mode]: http://lhorie.github.io/mithril/mithril.route.html#mode
[mithril-param]: http://lhorie.github.io/mithril/mithril.route.html#param
