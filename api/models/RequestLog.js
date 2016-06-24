/**
 * RequestLog
 *
 * @class RequestLog
 * @description Model responsible for capturing all CRUD access operations
 *              user info, url, and responses during usage of the application.
 * @extends https://github.com/tjwebb/sails-permissions/blob/master/api/models/RequestLog.js
 */

(function() {

  var _ = require('lodash');
  var _super = require('sails-permissions/dist/api/models/RequestLog');

  _.merge(exports, _super);
  _.merge(exports, {

    connection: 'altum_mongo'

  });
})();
