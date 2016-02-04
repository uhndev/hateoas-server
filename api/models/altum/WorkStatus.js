/**
 * WorkStatus
 *
 * @class WorkStatus
 * @description Model representation of a workStatus
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
       * @description A workStatus's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return [
        { name: 'Full Time / Duties' },
        { name: 'Modified Time / Duties' },
        { name: 'Full Time / Modified Duties' },
        { name: 'Not Working' }
      ];
    },

    generateAndCreate: function (state) {
      var workstatuses = this.generate();
      return Promise.all(
        _.map(workstatuses, function (workstatus) {
          return WorkStatus.findOrCreate({ name: workstatus.name }, workstatus);
        })
      ).then(function (workstatuses) {
        sails.log.info(workstatuses.length + " workStatus(s) generated");
      });
    }

  });
})();

