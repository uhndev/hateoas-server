/**
 * Status
 *
 * @class Status
 * @description Model representation of a Status
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
       * @description A status's name
       * @type {String}
       */
      name: {
        type: 'string',
        unique: true
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
          'approval',
          'completion'
        ]
      },

      /**
       * iconClass
       * @description A status's optional icon class
       * @type {String}
       */
      iconClass: {
        type: 'string'
      },

      /**
       * rowClass
       * @description A status's optional row class
       * @type {String}
       */
      rowClass: {
        type: 'string'
      },

      /**
       * requiresConfirmation
       * @description Simple boolean flag to denote if additional information is required
       * @type {Boolean}
       */
      requiresConfirmation: {
        type: 'boolean',
        defaultsTo: false
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return [
        { name: 'Open', category: 'referral' },
        { name: 'Discharged', category: 'referral' },
        { name: 'Follow-up', category: 'referral' },
        { name: 'Pending', category: 'approval', iconClass: 'fa-exclamation-circle', rowClass: 'warning' },
        { name: 'Misentered', category: 'approval', iconClass: 'fa-question-circle', rowClass: 'info' },
        { name: 'Denied', category: 'approval', iconClass: 'fa-ban', rowClass: 'danger' },
        {
          name: 'Approved',
          category: 'approval',
          iconClass: 'fa-check-circle',
          rowClass: 'success',
          requiresConfirmation: true
        },
        { name: 'Incomplete', category: 'completion', iconClass: 'fa-exclamation-circle', rowClass: 'warning' },
        { name: 'No Show', category: 'completion', iconClass: 'fa-question-circle', rowClass: 'info' },
        {
          name: 'Cancellation',
          category: 'completion',
          iconClass: 'fa-ban',
          rowClass: 'danger',
          requiresConfirmation: true
        },
        {
          name: 'Completed',
          category: 'completion',
          iconClass: 'fa-check-circle',
          rowClass: 'success',
          requiresConfirmation: true
        }
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

