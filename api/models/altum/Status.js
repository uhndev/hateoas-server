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
       * systemName
       * @description An internal system name for the status
       * @type {String}
       */
      systemName: {
        type: 'string',
        enum: [
          'PENDING', 'APPROVED',
          'INCOMPLETE', 'SUSPENDED', 'COMPLETED',
          'REPORT_NOT_REQUIRED', 'REPORT_PENDING'
        ]
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
          'completion',
          'billing',
          'report'
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
       * visitable
       * @description Boolean for controling which services show up in the visit service drop down
       * @type {Boolean}
       */
      visitable: {
        type: 'boolean',
        defaultsTo: false
      },

      /**
       * requiresConfirmation
       * @description Boolean flag denoting whether or not this status change will required confirmation
       * @type {Boolean}
       */
      requiresConfirmation: {
        type: 'boolean',
        defaultsTo: false
      },

      /**
       * rules
       * @description JSON object containing various rules for which status changes are disabled/hidden
       * @type {JSON}
       */
      rules: {
        type: 'json',
        defaultsTo: {
          "requires": {}
        }
      },

      /**
       * overrideForm
       * @description Optional setting for overriding auto generated template systemform
       * @type {Model}
       */
      overrideForm: {
        model: 'systemform',
        preventCreate: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return [
        {
          name: 'Open',
          category: 'referral'
        },
        {
          name: 'Discharged',
          category: 'referral'
        },
        {
          name: 'Follow-up',
          category: 'referral'
        },
        {
          name: 'Pending',
          systemName: 'PENDING',
          category: 'approval',
          iconClass: 'fa-exclamation-circle',
          rowClass: 'warning'
        },
        {
          name: 'Misentered',
          category: 'approval',
          iconClass: 'fa-question-circle',
          rowClass: 'info'
        },
        {
          name: 'Denied',
          category: 'approval',
          iconClass: 'fa-ban',
          rowClass: 'danger'
        },
        {
          name: 'Approved',
          systemName: 'APPROVED',
          category: 'approval',
          visitable: true,
          iconClass: 'fa-check-circle',
          rowClass: 'success',
          requiresConfirmation: true,
          rules: {
            requires: {
              approval: ["externalID"]
            }
          }
        },
        {
          name: 'Incomplete',
          systemName: 'INCOMPLETE',
          category: 'completion',
          visitable: true,
          iconClass: 'fa-exclamation-circle',
          rowClass: 'warning',
          rules: {
            requires: {}
          }
        },
        {
          name: 'No Show',
          category: 'completion',
          iconClass: 'fa-question-circle',
          rowClass: 'info',
          rules: {
            requires: {}
          }
        },
        {
          name: 'Cancellation',
          category: 'completion',
          iconClass: 'fa-ban',
          rowClass: 'danger',
          requiresConfirmation: true,
          rules: {
            requires: {
              "completion": ["cancellationDate"]
            }
          }
        },
        {
          name: 'Completed',
          systemName: 'COMPLETED',
          category: 'completion',
          iconClass: 'fa-check-circle',
          rowClass: 'success',
          requiresConfirmation: true,
          rules: {
            requires: {
              "completion": ["completionDate"]
            }
          }
        },
        {
          name: 'Service Complete/Pre-Paid',
          category: 'billing',
          iconClass: 'fa-check-circle',
          rowClass: 'info',
          requiresConfirmation: false,
          rules: {
            requires: {}
          }
        },
        {
          name: 'Suspended',
          systemName: 'SUSPENDED',
          category: 'billing',
          iconClass: 'fa-exclamation-circle',
          rowClass: 'warning',
          requiresConfirmation: false,
          rules: {
            requires: {}
          }
        },
        {
          name: 'Ready To Send To Payor',
          category: 'billing',
          iconClass: 'fa-share',
          rowClass: 'info',
          requiresConfirmation: false,
          rules: {
            requires: {}
          }
        },
        {
          name: 'Issued To Payor',
          category: 'billing',
          iconClass: 'fa-reply',
          rowClass: 'info',
          requiresConfirmation: false,
          rules: {
            requires: {}
          }
        },
        {
          name: 'Paid',
          category: 'billing',
          iconClass: 'fa-check-circle',
          rowClass: 'success',
          requiresConfirmation: true,
          rules: {
            requires: {
              "billing": ["paidDate"]
            }
          }
        },
        {
          name: 'Payor Denied',
          category: 'billing',
          iconClass: 'fa-ban',
          rowClass: 'danger',
          requiresConfirmation: true,
          rules: {
            requires: {
              "billing": ["deniedDate"]
            }
          }
        },
        {
          name: 'Rejected',
          category: 'billing',
          iconClass: 'fa-times',
          rowClass: 'danger',
          requiresConfirmation: true,
          rules: {
            requires: {
              "billing": ["rejectedDate"]
            }
          }
        },
        {
          name: 'Report Not Required',
          systemName: 'REPORT_NOT_REQUIRED',
          category: 'report',
          iconClass: 'fa-check-circle',
          rowClass: 'success',
          requiresConfirmation: false,
          rules: {
            requires: {}
          }
        },
        {
          name: 'Report Pending',
          systemName: 'REPORT_PENDING',
          category: 'report',
          iconClass: 'fa-question-circle',
          rowClass: 'warning',
          requiresConfirmation: false,
          rules: {
            requires: {}
          }
        },
        {
          name: 'Report Complete',
          category: 'report',
          iconClass: 'fa-check-circle',
          rowClass: 'success',
          requiresConfirmation: false,
          rules: {
            requires: {}
          }
        }
      ];
    },

    generateAndCreate: function (state) {
      var statuses = this.generate();
      return Promise.all(
        _.map(statuses, function (status) {
          return Status.findOrCreate({name: status.name}, status);
        })
      ).then(function (statuses) {
        sails.log.info(statuses.length + " status(s) generated");
      });
    }

  });
})();

