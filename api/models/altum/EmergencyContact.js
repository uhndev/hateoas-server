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
       * contact
       * @description A emergency contact's associated person
       * @type {Model}
       */
      person: {
        model: 'person',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'person', Person);
        }
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

