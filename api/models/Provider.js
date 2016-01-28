/**
 * Provider
 *
 * @class Provider
 * @description Model representation of a provider
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function() {
  var _super = require('./BaseModel.js');

  var HateoasService = require('../services/HateoasService.js');
  var _ = require('lodash');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultTemplateOmit: null,

    attributes: {
      /**
       * user
       * @description Associated user that this provider belongs to.  The User
       *              model holds the personal data as well as the access
       *              attributes for logging in and permissions.
       *
       * @type {Association}
       */
      user: {
        model: 'user',
        required: true
      },

      /**
       * subjects
       * @description List of provider subjects which denote which subjects I,
       *              as a provider am overseeing.
       *
       * @type {Collection}
       */
      subjects: {
        collection: 'subjectenrollment',
        via: 'providers'
      },

      /**
       * expiredAt
       * @description Instead of strictly deleting objects from our system, we set a date such
       *              that if it is not null, we do not include this entity in our response.
       * @type {Date} Date of expiry
       */
      expiredAt: {
        type: 'datetime',
        defaultsTo: null,
        datetime: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given subject enrollment object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      if (values.user) {
        User.findOne(values.user).exec(function (err, user) {
          if (err) {
            cb(err);
          } else {
            values.displayName = user.displayName;
            cb();
          }
        });
      } else {
        cb();
      }
    }

  });

}());
