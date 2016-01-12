/**
 * A virtual model representing a database view.
 * See config/db/services.sql for view definition.
 */

(function () {
  var UserModel = require('./../User.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      approved: {
        type: 'boolean'
      },
      client_firstName: {
        type: 'string'
      },
      client_lastName: {
        type: 'string'
      },
      physician_firstName: {
        type: 'string'
      },
      physician_lastName: {
        type: 'string'
      },
      physician_title: {
        type: 'string'
      },
      programService_name: {
        type: 'string'
      },
      altumService_name: {
        type: 'string'
      },
      toJSON: UserModel.attributes.toJSON
    }
  });
})();
