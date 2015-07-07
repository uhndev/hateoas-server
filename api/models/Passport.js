/**
 * Passport
 *
 * @class Passport
 * @description  The Passport model handles associating authenticators with users. An authen-
 *               ticator can be either local (password) or third-party (provider). A single
 *               user can have multiple passports, allowing them to connect and use several
 *               third-party strategies in optional conjunction with a password.
 *               Since an application will only need to authenticate a user once per session,
 *               it makes sense to encapsulate the data specific to the authentication process
 *               in a model of its own. This allows us to keep the session itself as light-
 *               weight as possible as the application only needs to serialize and deserialize
 *               the user, but not the authentication data, to and from the session.
 * @extends http://github.com/tjwebb/sails-auth/blob/master/api/models/Passport.js
 */

var _ = require('lodash');
var _super = require('sails-permissions/api/models/Passport');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  /**
   * For example:
   *
   * foo: function (bar) {
   *   bar.x = 1;
   *   bar.y = 2;
   *   return _super.foo(bar);
   * }
   */
});
