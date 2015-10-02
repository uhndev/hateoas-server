/**
 * Data service for handling all Authentication data
 */
(function() {
  'use strict';

  angular
    .module('dados.auth.service', [
      'ngCookies',
      'ngResource',
      'dados.auth.constants',
      'dados.header.constants'
    ])
    .service('AuthService', AuthService);

  AuthService.$inject = [
    'AUTH_API', '$rootScope', '$location', '$resource', '$cookies', 'TABVIEW', 'SUBVIEW'
  ];

  function AuthService(Auth, $rootScope, $location, $resource, $cookies, TABVIEW, SUBVIEW) {

    var LoginAuth = $resource(Auth.LOGIN_API);
    var self = this;

    /**
     * [isAuthenticated]
     * Checks cookie and fires events depending on whether user is authenticated
     * @return {Boolean}
     */
    this.isAuthenticated = function() {
      var auth = Boolean($cookies.get('user'));
      if (!auth) {
        this.setUnauthenticated();
      } else {
        this.setAuthenticated();
      }
      return auth;
    };

    /**
     * [setUnauthenticated]
     * Fires events to app (dados-header) to remove main/sub menus from view
     */
    this.setUnauthenticated = function() {
      $cookies.remove('user');
      delete this.currentUser;
      $rootScope.$broadcast("events.unauthorized");
      $location.url('/login');
    };

    /**
     * [setAuthenticated]
     * Once authenticated, retrieve user's associated main/submenu options
     * from response, or from angular constant settings
     */
    this.setAuthenticated = function() {
      this.currentUser = $cookies.getObject('user');
      var view = this.currentUser.group.name.toString().toUpperCase();
      this.tabview = $cookies.getObject('user').group.tabview || TABVIEW[view];
      this.subview = $cookies.getObject('user').group.subview || SUBVIEW[view];
      $rootScope.$broadcast("events.authorized");
    };

    /**
     * [getRoleLinks]
     * Depending on user's role, context submenu is filtered down based on
     * access level.
     * @param  {Array} links  response links from HATEOAS
     * @return {Array}        filtered submenu links
     */
    this.getRoleLinks = function(links) {
      return _.filter(links, function(link) {
        return _.contains(self.subview, link.rel);
      });
    };

    /**
     * [setSubmenu]
     * From any submenu page, we need to parse and render a hateoas resource's
     * links array to populate our submenu in our top level scope
     * @param {String} currStudy     string representation of our current study state
     * @param {Object} resource      a hateoas response object containing a links array
     * @param {Object} submenuScope  a reference to the scope where the submenu is defined
     */
    this.setSubmenu = function(currStudy, resource, submenuScope) {
      // initialize submenu
      if (currStudy && _.has(resource, 'links') && resource.links.length > 0) {
        // from workflowstate and current url study
        // replace wildcards in href with study name
        _.map(resource.links, function(link) {
          if (link.rel === 'name' && link.prompt === '*') {
            link.prompt = currStudy;
          }
          if (_.contains(link.href, '*')) {
            link.href = link.href.replace(/\*/g, currStudy);
          }
          return link;
        });
        var submenu = {
          links: self.getRoleLinks(resource.links)
        };
        angular.copy(submenu, submenuScope);
      }
    };

    /**
     * [login]
     * Service function called from auth controller to handle actual
     * POST to /auth/local.
     * @param  {Object} data      passed credentials for login
     * @param  {Function} onSuccess success callback
     * @param  {Function} onError   error callback
     * @return {Null}
     */
    this.login = function(data, onSuccess, onError) {
      var state = new LoginAuth(data);
      state.$save().then(onSuccess).catch(onError);
    };

    /**
     * [logout]
     * Service function for invalidating token and removes cookie
     */
    this.logout = function(data, onSuccess, onError) {
      this.setUnauthenticated();
      $cookies.remove('user');
      return $resource(Auth.LOGOUT_API).query();
    };
  }
})();
