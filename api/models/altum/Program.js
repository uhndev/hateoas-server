/**
 * Program
 *
 * @class Program
 * @description A model representing all programs belonging to a particular payor
 * @docs        http://sailsjs.org/#!documentation/models
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
       * payor
       * @description a PayorProgram's payor
       * @type {Model}
       */
      payor: {
        model: 'payor',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'payor', Payor);
        }
      },

      /**
       * name
       * @description a PayorProgram's name
       * @type {String}
       */
      name: {
        type: 'string',
        generator: function(state) {
          return _.startCase(_.first(faker.lorem.words())) + ' Program';
        }
      },

      /**
       * programServices
       * @description a program's programServices
       * @type {Collection}
       */
      programServices: {
        collection: 'programservice',
        via: 'program',
        dominant: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  });
})();

