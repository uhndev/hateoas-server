/**
 * Timeframe
 *
 * @class Timeframe
 * @description Model representation of a timeframe
 */

(function () {

  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultSortBy: 'id ASC',

    attributes: {

      /**
       * name
       * @description A timeframe's name, can be a custom timeframe
       * @type {String}
       */
      name: {
        type: 'string',
        unique: true
      },

      /**
       * timepoint
       * @description A timeframe's timepoint, used to convey date timepoints i.e. 1 week
       * @type {Number}
       */
      timepoint: {
        type: 'integer',
        integer: true,
        defaultsTo: 0
      },

      /**
       * timepointRange
       * @description A timeframe's ending window, used to convey date ranges i.e. 1-4 weeks
       * @type {Number}
       */
      timepointRange: {
        type: 'integer',
        integer: true,
        defaultsTo: 0
      },

      /**
       * unit
       * @description A timeframe's unit of measurement
       * @type {String}
       */
      unit: {
        type: 'string',
        defaultsTo: null,
        enum: [
          'N/A',
          'second',
          'minute',
          'hour',
          'day',
          'week',
          'month',
          'year'
        ]
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      var timeframes = [{name: '1 week', timepoint: 1, unit: 'week'}];
      for (var i=2; i <= 12; i++) {
        timeframes.push({ name: i + ' weeks', timepoint: i, unit: 'week' });
      }
      return timeframes.concat([
        { name: '1-4 weeks', timepoint: 1, timepointRange: 4, unit: 'week' },
        { name: '4-6 weeks', timepoint: 4, timepointRange: 6, unit: 'week' },
        { name: '6-12 weeks', timepoint: 6, timepointRange: 12, unit: 'week' },
        { name: 'With recommended interventions', unit: 'N/A' }
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

