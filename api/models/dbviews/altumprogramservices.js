/**
 * A virtual model representing a database view.
 * See config/db/studyuser.sql for view definition.
 */
(function () {
  var UserModel = require('./../User.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * payor_id
       * @description a altumPayorService's payor id
       * @type {String}
       */
      payor_id: {
        type: 'string'
      },

      /**
       * payor_name
       * @description a altumPayorService's payor_name
       * @type {String}
       */
      payor_name: {
        type: 'string'
      },

      /**
       *
       * @description a altumPayorService's name
       * @type {String}
       */
      altumService_name: {
        type: 'string'
      },

      /**
       * altumService_id
       * @description a altumPayorService's name
       * @type {String}
       */
      altumService_id: {
        type: 'string'
      },

      /**
       *
       * @description a altumPayorService's name
       * @type {String}
       */
      altumProgramService_id: {
        type: 'string'
      },

      /**
       *
       * @description a altumPayorService's name
       * @type {String}
       */
      altumProgramService_name: {
        type: 'string'
      },

      /**
       *
       * @description a altumPayorService's name
       * @type {String}
       */
      program_id: {
        type: 'string'
      },

      /**
       *
       * @description a altumPayorService's name
       * @type {String}
       */
      program_name: {
        type: 'string'
      },

      toJSON: UserModel.attributes.toJSON
    }

  });
})();

