// api/models/SecurityLog.js

(function() {
  var _super = require('./BaseModel.js');

  var _ = require('lodash');
  var _log = require('sails-permissions/api/models/SecurityLog');

  _.merge(exports, _super);
  _.merge(exports, _log);
  _.merge(exports, {

    // Extend with custom logic here by adding additional fields, methods, etc.

  });
})();
