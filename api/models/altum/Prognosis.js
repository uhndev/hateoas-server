/**
 * Prognosis
 *
 * @class Prognosis
 * @description Model representation of a prognosis
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * name
       * @description A prognosis's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * hasTimeframe
       * @description Denotes whether or not this prognosis has a timeframe
       * @type {Boolean}
       */
      hasTimeframe: {
        type: 'boolean',
        defaultsTo: false
      },

      /**
       * timeframe
       * @description A prognosis's timeframe
       * @type {Model}
       */
      timeframe: {
        model: 'model'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return [
        { name: 'Too soon to render a prognosis' },
        { name: 'Fully Recovered Now' },
        { name: 'Partially Recovered Now and No Further Recovery Expected' },
        { name: 'Partially Recovered Now and Full Recovery Anticipated in ', hasTimeframe: true },
        { name: 'Partially Recovered Now and Full Recovery Not Anticipated but may continue to improve for ', hasTimeframe: true}
      ];
    },

    generateAndCreate: function (state) {
      var prognosises = this.generate();
      return Promise.all(
        _.map(prognosises, function (prognosis) {
          return Prognosis.findOrCreate({ name: prognosis.name }, prognosis);
        })
      ).then(function (prognosises) {
        sails.log.info(prognosises.length + " prognosis(s) generated");
      });
    }

  });
})();

