/**
 * Staff
 *
 * @class Staff
 * @description Model representation of a Staff
 */

(function () {

  var _super = require('./AltumBaseModel.js');
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultTemplateOmit: null,

    attributes: {

      /**
       * person
       * @description a staff's person model
       * @type {String}
       */
      person: {
        model: 'person',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'person', Person);
        }
      },

      /**
       * staffType
       * @description A staff's type designation
       * @type {Model}
       */
      staffType: {
        model: 'stafftype',
        generator: function(state) {
          return _.random(1, 2);
        }
      },

      /**
       * staffTypeDisplayName
       * @description A staffType's name
       * @type {String}
       */
      staffTypeDisplayName: {
        type: 'string'
      },

      /**
       * staffSites
       * @description Collection of sites this staff is registered at
       * @type {Collection}
       */
      staffSites: {
        collection: 'sitestaff',
        via: 'staff'
      },

      /**
       * services
       * @description Collection of services this staff is associated with
       * @type {Collection}
       */
      services: {
        collection: 'service',
        via: 'staff'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given staff object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      if (values.person) {
        Person.findOne(values.person).exec(function (err, person) {
          values.displayName = person.displayName;
          if (values.staffType) {
            StaffType.findOne(values.staffType).exec(function (err, staffType) {
              if (err) {
                cb(err);
              } else {
                values.staffTypeDisplayName = staffType.name;
                cb();
              }
            });
          } else {
            cb();
          }
        });
      } else {
        cb();
      }
    }

  });
})();


