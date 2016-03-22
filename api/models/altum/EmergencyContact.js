/**
 * EmergencyContact
 *
 * @class EmergencyContact
 * @description Model representation of a EmergencyContact
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * firstName
       * @description A emergency contact person's first name.
       * @type {String}
       */
      firstName: {
          type: 'string'
        },
      /**
       * lastName
       * @description A emergnecy contact person's last name.
       * @type {String}
       */

      lastName: {
        type: 'string'
      },

      /**
       * phone
       * @description A emergency contact person's phone number.
       * @type {String}
       */

      phone: {
          type: 'string'
        },
      /**
       * person
       * @description A person's f.
       * @type {String}
       */
      person: {
        model: 'person'
      },
      /**
       * relationship
       * @description A emergencyContact's relationship
       * @type {String}
       */
      relationship: {
        type: 'string',
        generator: function() {
          return _.sample(['Father', 'Mother', 'Brother', 'Sister', 'Wife', 'Husband']);
        }
      },

      /**
       * priority
       * @description A emergencyContact's priority
       * @type {Integer}
       */
      priority: {
        type: 'integer',
        generator: function() {
          return _.random(1, 10);
        }
      },

      /**
       * notes
       * @description A emergencyContact's notes
       * @type {String}
       */
      notes: {
        type: 'string',
        generator: faker.lorem.sentence
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

