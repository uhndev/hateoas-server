// api/services/passport.js

(function() {

  var _ = require('lodash');
  var _super = require('sails-auth/dist/api/services/passport');

  function passport () { }

  passport.prototype = Object.create(_super);
  _.extend(passport.prototype, {

    // Extend with custom logic here by adding additional fields and methods,
    // and/or overriding methods in the superclass.
  });

  module.exports = new passport();
})();

