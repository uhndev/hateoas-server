/**
 * Timeframe
 *
 * @class Timeframe
 * @description Model representation of a timeframe
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
       * @description A timeframe's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      var timeframes = [{ name: '1 week' }];
      for (var i=2; i <= 12; i++) {
        timeframes.push({ name: i + ' weeks' });
      }
      return timeframes.concat([
        { name: '1-4 weeks' },
        { name: '4-6 weeks' },
        { name: '6-12 weeks' },
        { name: 'With recommended interventions' }
      ]);
    },

    generateAndCreate: function (state) {
      var timeframes = this.generate();
      return Promise.all(
        _.map(timeframes, function (timeframe) {
          return Timeframe.findOrCreate({ name: timeframe.name }, timeframe);
        })
      ).then(function (timeframes) {
        sails.log.info(timeframes.length + " timeframe(s) generated");
      });
    }

  });
})();

