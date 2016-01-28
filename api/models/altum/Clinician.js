/**
 * Clinician
 *
 * @class Clinician
 * @description Model representation of a Clinician
 */

(function () {

  var _super = require('../BaseModel.js');
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * person
       * @description a clinician's person model
       * @type {String}
       */
      person: {
        model: 'person',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'person', Person);
        }
      },

      /**
       * clinicianSites
       * @description Collection of sites this clinician is registered at
       * @type {Collection}
       */
      clinicianSites: {
        collection: 'sitestaff',
        via: 'clinician'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given clinician object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      if (values.person) {
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


