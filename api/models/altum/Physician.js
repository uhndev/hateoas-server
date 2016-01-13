/**
 * Physician.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * person
       * @description a physician's person model
       * @type {String}
       */
      person: {
        model: 'person'
      },

      /**
       * physicianSites
       * @description Collection of sites this physician is registered at
       * @type {Collection}
       */
      physicianSites: {
        collection: 'sitephysician',
        via: 'physician'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given physician object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      if (values.user) {
        Person.findOne(values.person).exec(function (err, person) {
          if (err) {
            cb(err);
          } else {
            values.displayName = person.displayName;
            cb();
          }
        });
      } else {
        cb();
      }
    }

  });
})();


