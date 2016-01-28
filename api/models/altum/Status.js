/**
 * Status
 *
 * @class Status
 * @description Model representation of a Status
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultSortBy: 'createdAt ASC',

    attributes: {

      /**
       * name
       * @description A status's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

	    /**
       * category
       * @description A status's category
       * @type {String}
       */
      category: {
        type: 'string',
        enum: [
          'referral',
          'service'
        ]
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return [
        { name: 'Open', category: 'referral' },
        { name: 'Discharged', category: 'referral' },
        { name: 'Follow-up', category: 'referral' },
        { name: 'Approved', category: 'service' },
        { name: 'Pending', category: 'service' },
        { name: 'No response from WSIB', category: 'service' },
        { name: 'Denied', category: 'service' }
      ];
    },

    generateAndCreate: function (state) {
      var statuses = this.generate();
      return Promise.all(
        _.map(statuses, function (status) {
          return Status.findOrCreate({ name: status.name }, status);
        })
      ).then(function (statuses) {
        sails.log.info(statuses.length + " status(s) generated");
      });
    }

  });
})();

