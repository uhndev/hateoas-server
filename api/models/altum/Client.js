/**
 * Client
 *
 * @class Client
 * @description Model representation of a Client
 */

(function () {

  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * person
       * @description A client's person record
       * @type {Model}
       */
      person: {
        model: 'person',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'person', Person);
        }
      },

      /**
       * MRN
       * @description A client's mrn
       * @type {String}
       */
      MRN: {
        type: 'string',
        index: true,
        generator: function(state) {
          return _.random(100000, 999999);
        }
      },

      /**
       * referrals
       * @description A client's referrals
       * @type {Collection}
       */
      referrals: {
        collection: 'referral',
        via: 'clients'
      },

      /**
       * notes
       * @description Collection of client notes
       * @type {Collection}
       */
      notes: {
        collection: 'note',
        via: 'client'
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

