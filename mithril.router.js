/**
 * Plugin Constructor
 *
 * @param {Object} m Mithril
 */
function Plugin (m) {
  var RouteRegexp = new RegExp([
    // Match already escaped characters that would otherwise incorrectly appear
    // in future matches. This allows the user to escape special characters that
    // shouldn't be transformed.
    '(\\\\.)',

    // Match named parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
    // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
    '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',

    // Match regexp special characters that should always be escaped.
    '([.+*?=^!:${}()[\\]|\\/])'
  ].join('|'), 'g');

  /**
   * Mithril route collection
   * @type {Array}
   * @private
   */
  m.routes = {}

  /**
   * Mithril default router
   * @type {Function}
   * @private
   */
  m._route = m.route

  /**
   * Classic route collection
   * @type {Object}
   * @private
   */
  m._route.routes = {}

  /**
   * Router modes
   * @type {Object}
   * @private
   */
  m._route.modes = {
    pathname: "",
    hash: "#",
    search: "?"
  }

  /**
   * Default router mode, defaults to string
   * @type {String}
   * @private
   */
  m._route.mode = 'search'

  /**
   * Router allowing creation of Single-Page-Applications (SPA) with a DRY mechanism
   * (identification classified as namespaces) to prevent hard-coded URLs.
   *
   * ### API
   *
   * - `m.route()`: returns current route
   * - `m.route(element)`: bind elements while abstracting away route mode
   * - `m.route(namespace|route(, args))`: programmatic redirect w/ arguments
   * - `m.route(rootElement, routes)`: configure app routing
   * - `m.route(rootElement, rootRoute, routes)`: configure app routing (mithril default router style)
   *
   * ### Configure Routing
   *
   * To define routing specify a host DOM element, and routes with a root route. Should no root
   * route be specified, the first route is chosen.
   *
   *     m.route(document.body, {
   *       "/": { controller: home, namespace: "index", root: true },
   *       "/login": { controller: login, namespace: "login" },
   *       "/dashboard": { controller: dashboard, namespace: "dashboard" }
   *     })
   *
   * @return {void}
   */
  m.route = function () {
    // m.route()
    if (arguments.length === 0) {
      return m._route();
    }

    // m.route(namespace|route)
    if (arguments.length === 1 && typeof arguments[0] === 'string') {
      return m._route(m.routes[arguments[0]] || arguments[0])
    }

    // m.route(namespace|route(, args))
    if (arguments.length === 2 && typeof arguments[0] === 'string' && (typeof arguments[1] === 'object' || typeof arguments[1] === 'undefined')) {
      return m._route(m.routes[arguments[0]] || arguments[0], arguments[1])
    }

    // m.route(element)
    if ((arguments[0].addEventListener || arguments[0].attachEvent) && (typeof arguments[1] === 'undefined' || typeof arguments[1] === 'boolean')) {
      return m._route(arguments[0], arguments[1], arguments[2])
    }

    // m.route(rootElement, routes)
    if (arguments.length === 2 && typeof arguments[1] === 'object' && typeof arguments[0] !== 'string') {
      return m.route._config(arguments[0], arguments[1])
    }

    // m.route(rootElement, rootRoute, routes)
    if (arguments.length === 3 && typeof arguments[1] === 'string') {
      return m.route._config(arguments[0], arguments[2], arguments[1])
    }

    throw new Error("Method signature not support")
  }

  /**
   * Router mode, defaults to search
   * @type {String}
   */
  Object.defineProperty(m.route, 'mode', {
    get: function () {
      return m._route.mode
    },

    set: function (value) {
      m._route.mode = value
    },

    enumerable: true,
    configurable: true
  })

  /**
   * Normalize route by router mode
   *
   * @param  {String} route
   * @return {String}
   */
  m.route.normalize = function (namespace) {
    return (m.routes[namespace] || namespace).slice(m._route.modes[m.route.mode].length)
  }

  /**
   * Register a collection of paths to controllers with namespaces.
   *
   * @param  {DOMElement} element Host DOM Element
   * @param  {Object} routes Collection of paths to be registered
   * @param  {String} root    Route or route namespace to be registered as the default route
   * @return {void}
   * @private
   */
  m.route._config = function (element, routes, root) {
    var route

    for (var path in routes) {
      /* istanbul ignore else */
      if (routes.hasOwnProperty(path)) {
        route = routes[path]

        if (!route.namespace) {
          throw new Error("Missing namespace for route: " + path)
        }

        if (!route.controller) {
          throw new Error("Missing controller for route: " + path)
        }

        // Determine default root route
        if (root) {
          if (route.namespace === root || path === route) {
            root = path
          }
        } else if (route["default"] || route.root) {
          root = path
        }

        // Associate namespace to path
        m.routes[route.namespace] = path

        // Associate path to controller for classic Mithril router
        m._route.routes[path] = route.controller
      }
    }

    // Ensure a default root exists with a fallback to the first
    // route in the collection
    //
    // This is liable to change to throw an error in the future,
    // do not rely on this mechanism.
    if (!root) {
      root = Object.keys(routes)[0]
    }

    return m._route(element, root, m._route.routes)
  }

  /**
   * Sugar for the classic router parameter lookup
   *
   * @return {Object}
   */
  m.route.param = function () {
    if (!Object.keys(m.routes).length) {
      throw new Error("You must configure routing using m.route before calling m.route.param")
    }

    return m._route.param(arguments[0])
  }

  /**
   * Marshal querystring to object
   *
   * @param  {String} str Querystring
   * @return {Object}     Javascript Object
   */
  m.route.parseQueryString = function (str) {
    var pairs = str.split("&")
    var params = {}
    var pair

    for (var i = 0, len = pairs.length; i < len; i++) {
      pair = pairs[i].split("=")
      params[decodeURIComponent(pair[0])] = pair[1] ? decodeURIComponent(pair[1]) : ""
    }

    return params
  }

  /**
   * Marshal object to querystring
   *
   * @param  {Object} object Object to be marshalled
   * @param  {String} prefix Object key
   * @return {String}        Querystring
   */
  m.route.buildQueryString = function (object, prefix) {
    var type = Object.prototype.toString
    var str = []
    var valueType
    var value
    var pair
    var key

    function valueMapper (item) {
      return encodeURIComponent(key + "[]") + "=" + encodeURIComponent(item)
    }

    for (var prop in object) {
      /* istanbul ignore else */
      if (object.hasOwnProperty(prop)) {
        key = prefix ? prefix + "[" + prop + "]" : prop
        value = object[prop]
        valueType = type.call(value)

        if (value != null && valueType === '[object Object]') {
          pair = m.route.buildQueryString(value, key)
        } else if (valueType === '[object Array]') {
          pair = value.map(valueMapper).join('&')
        } else {
          pair = encodeURIComponent(key) + "=" + encodeURIComponent(value)
        }

        str.push(pair)
      }
    }

    return str.join("&")
  }

  /**
   * Redirect user to specified route, or route namespace with given arguments.
   * Sugar for m.route(namespace|path(, args))
   * @type {void}
   */
  m.redirect = function () {
    return m.route(arguments[0], arguments[1])
  }

  /**
   * Generate path using specified identifier (route namespace) and path arguments.
   *
   * #### Api
   *
   * - `m.reverse(namespace(, options))`: takes specified route namespace and options and generates path.
   *
   * ##### Options
   *
   * - `params`: **Object** Route parameters, named and non-named.
   * - `query`: **String | Object** Querystring
   *
   * #### Examples
   *
   *    // user => /user/
   *    m.reverse('user')
   *
   *    // user => /user/:id => /user/23
   *    m.reverse('user', { params: { id: 23 }})
   *
   *    // user => /user/:id => /user/23?include=profile
   *    m.reverse('user', { params: { id: 23 }, query: { include: 'profile' }})
   *
   * Internationalization support is **PLANNED**, the expected api syntax will be as follows:
   *
   *    m.reverse('user', { args: { id: 23 }, lang: 'en' })
   *
   * @return {String}
   */
  m.reverse = function () {
    var options = arguments[1] || {}
    var namespace = arguments[0]
    var route = m.routes[namespace]
    var reversedRoute
    var query

    if (!route) {
      throw new Error("Invalid route namespace: " + namespace)
    }

    reversedRoute = m.reverse._reverseRoute(route, options.params)

    if (options.query) {
      query = m.route.buildQueryString(options.query)
      reversedRoute += (reversedRoute.indexOf('?') !== -1 ? '&' : '?') + query
    }

    return reversedRoute
  }

  /**
   * Compile route with specified parameters
   *
   * @param  {String} route
   * @param  {Object} params  Route parameters
   * @return {String}
   * @private
   */
  m.reverse._reverseRoute = function (route, params) {
    var index = 0
    params = params || {}
    return route.replace(RouteRegexp, function (match, escaped, prefix, key, capture, group, optional, esc) {
      var value

      if (escaped) {
        return escaped
      }

      if (esc) {
        return esc
      }

      prefix = prefix || ''
      value = params[key || index++]

      if (value === undefined) {
        if (!optional) {
          throw new Error('Parameter "' + key + '" is required.')
        }

        value = ''
      }

      return prefix + value
    })
  }

  return m
}

/* istanbul ignore next */
if (typeof module !== 'undefined' && module !== null && module.exports) {
  module.exports = Plugin
} else if (typeof define === 'function' && define.amd) {
  define(['mithril'], Plugin)
} else if (typeof window !== 'undefined') {
  Plugin(m)
}