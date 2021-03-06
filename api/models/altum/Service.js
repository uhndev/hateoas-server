/**
 * Service
 *
 * @class Service
 * @description A model representation of a service, and instance of actual work being done at altum
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var faker = require('faker');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultTemplateOmit: null,

    attributes: {

      /**
       * referral
       * @description a service's associated referral
       * @type {Model}
       */
      referral: {
        model: 'referral',
        generator: function (state) {
          return BaseModel.defaultGenerator(state, 'referral', Referral);
        }
      },

      /**
       * altumService
       * @description a serivce's associated altumService
       * @type {Model}
       */
      altumService: {
        model: 'altumService'
      },

      /**
       * programService
       * @description a serivce's associated programService
       * @type {Model}
       */
      programService: {
        model: 'programService'
      },

      /**
       * site
       * @description A reference to the site this service will be performed at
       * @type {Model}
       */
      site: {
        model: 'site'
      },

      /**
       * invoiceServices
       * @description Collection of invoices that this service could be attached to
       * @type {Collection}
       */
      invoiceServices: {
        collection: 'invoiceservice',
        via: 'service'
      },

      /**
       * serviceProviders
       * @description a collection of a service's associated providers
       * @type {Collection}
       */
      // @TODO: Collection of physicians people who perform the service
      //serviceProviders: {
      //  collection: 'user'
      //},

      /**
       * physician
       * @description Reference to the physician who recommended this particular service
       * @type {Model}
       */
      physician: {
        model: 'physician'
      },

      /**
       * staff
       * @description Collection of staff who assisted in the recommendation of this service
       * @type {Collection}
       */
      staff: {
        collection: 'staff',
        via: 'services'
      },

      /**
       * workStatus
       * @description Reference to the current work status of the client at the time of service recommendation
       * @type {Model}
       */
      workStatus: {
        model: 'workstatus'
      },

      /**
       * prognosis
       * @description Reference to the current prognosis of the client at the time of service recommendation
       * @type {Model}
       */
      prognosis: {
        model: 'prognosis'
      },

      /**
       * timeframe
       * @description A prognosis's timeframe
       * @type {Model}
       */
      prognosisTimeframe: {
        model: 'timeframe'
      },

      /**
       * serviceDate
       * @description Date on which this service was recommended (should technically be same as createdAt but w/e)
       * @type {Datetime}
       */
      serviceDate: {
        type: 'datetime'
      },

      /**
       * visitService
       * @description Reference to the previously approved service (will be chosen from list of Approved services)
       * @type {Model}
       */
      visitService: {
        model: 'service'
      },

      /**
       * approvalNeeded
       * @description Denotes whether approval is needed or not for this service
       * @type {Boolean}
       */
      approvalNeeded: {
        type: 'boolean',
        defaultsTo: true
      },

      /**
       * currentApproval
       * @description Pointer to the current approval in our approval history
       * @type {Model}
       */
      currentApproval: {
        model: 'approval'
      },

      /**
       * approvals
       * @description Collection of approvals linked to a specific service (history of approvals)
       * @type {Collection}
       */
      approvals: {
        collection: 'approval',
        via: 'service'
      },

      /**
       * currentCompletion
       * @description Pointer to the current status in our status history
       * @type {Model}
       */
      currentCompletion: {
        model: 'completion'
      },

      /**
       * completion
       * @description Collection of completion linked to a specific service (history of completion)
       * @type {Collection}
       */
      completion: {
        collection: 'completion',
        via: 'service'
      },

      /**
       * currentBillingStatus
       * @description Pointer to the current billing status in our status history
       * @type {Model}
       */
      currentBillingStatus: {
        model: 'billingstatus'
      },

      /**
       * billingStatuses
       * @description Collection of billingStatuses linked to a specific service (history of billingStatuses)
       * @type {Collection}
       */
      billingStatuses: {
        collection: 'billingstatus',
        via: 'service'
      },

      /**
       * currentReportStatus
       * @description Pointer to the current report status in our status history
       * @type {Model}
       */
      currentReportStatus: {
        model: 'reportstatus'
      },

      /**
       * billingStatuses
       * @description Collection of reportStatuses linked to a specific service (history of reportStatuses)
       * @type {Collection}
       */
      reportStatuses: {
        collection: 'reportstatus',
        via: 'service'
      },

      /**
       * programSupplyItems
       * @description Collection of supplies related to this service
       * @type {Collection}
       */
      programSupplyItems: {
        collection: 'programsupplyitem',
        via: 'services'
      },

      /**
       * telemedicine
       * @description Boolean flag denoting whether this service will be performed via telemedicine
       */
      telemedicine: {
        type: 'boolean',
        defaultsTo: false
      },

      /**
       * billingGroup
       * @description Reference to the BillingGroup for which this service belongs to
       * @type {Model}
       */
      billingGroup: {
        model: 'billinggroup'
      },

      /**
       * billingGroupItemLabel
       * @description Text representing this service's state in a BillingGroup
       * @type {String}
       */
      billingGroupItemLabel: {
        type: 'string'
      },

      /**
       * itemCount
       * @description Number denoting the optional sequence in the BillingGroup
       * @type {Number}
       */
      itemCount: {
        type: 'integer',
        defaultsTo: 1
      },

      /**
       * numberDetailName
       * @description Optional number detail name describing what numberDetail refers to
       * @type {String}
       */
      numberDetailName: {
        type: 'string'
      },

      /**
       * numberDetail
       * @description Optional number detail that is captured from service variation
       * @type {Number}
       */
      numberDetail: {
        type: 'integer',
        defaultsTo: null
      },

      /**
       * textDetailName
       * @description Optional text detail name describing what textDetail refers to
       * @type {String}
       */
      textDetailName: {
        type: 'string'
      },

      /**
       * textDetail
       * @description Optional text detail that is captured from service variation
       * @type {String}
       */
      textDetail: {
        type: 'string',
        defaultsTo: null
      },

      /**
       * dateDetailName
       * @description Optional date detail name describing what dateDetail refers to
       * @type {String}
       */
      dateDetailName: {
        type: 'string'
      },

      /**
       * dateDetail
       * @description Optional date detail that is captured from service variation
       * @type {Date}
       */
      dateDetail: {
        type: 'date',
        defaultsTo: null
      },

      /**
       * physicianDetailName
       * @description Optional physician detail name describing what physicianDetail refers to
       * @type {String}
       */
      physicianDetailName: {
        type: 'string'
      },

      /**
       * physicianDetail
       * @description Optional physician detail that is captured from service variation
       * @type {Model}
       */
      physicianDetail: {
        model: 'physician',
        defaultsTo: null
      },

      /**
       * staffDetailName
       * @description Optional staff detail name describing what staffDetail refers to
       * @type {String}
       */
      staffDetailName: {
        type: 'string'
      },

      /**
       * staffDetail
       * @description Optional staff detail that is captured from service variation
       * @type {Model}
       */
      staffDetail: {
        model: 'staff',
        defaultsTo: null
      },

      /**
       * followupPhysicianDetail
       * @description Optional physician detail that is captured from service variation
       * @type {String}
       */
      followupPhysicianDetail: {
        model: 'physician',
        defaultsTo: null
      },

      /**
       * followupTimeframeDetail
       * @description Optional timeframe detail that is captured from service variation
       * @type {Model}
       */
      followupTimeframeDetail: {
        model: 'timeframe',
        defaultsTo: null
      },

      /**
       * timeframeDetailName
       * @description Optional timeframe detail name describing what timeframeDetail refers to
       * @type {String}
       */
      timeframeDetailName: {
        type: 'string'
      },

      /**
       * timeframeDetail
       * @description Optional timeframe detail that is captured from service variation
       * @type {Model}
       */
      timeframeDetail: {
        model: 'timeframe',
        defaultsTo: null
      },

      /**
       * programSupplyItem
       * @description model association to a service's programSupplyItem detail if the service is a supply service
       * @type {Model}
       */
      programSupplyItem: {
        model: 'programSupplyItem',
        defaultsTo: null
      },

      /**
       * supplyItem
       * @description model association to a service's supplyItem detail if the service is a supply service
       * @type {Model}
       */
      supplyItem: {
        model: 'supplyItem',
        defaultsTo: null
      },

      /**
       * cost
       * @description a service's cost
       * @type {float}
       */
      cost: {
        type: 'float',
        generator: faker.commerce.price
      },

      /**
       * costShipping
       * @description service's shippingCost
       * @type {Model}
       */
      costShipping: {
        type: 'float',
        generator: faker.commerce.price
      },

      /**
       * costSubtotal
       * @description a service's sub-total
       * @type {float}
       */
      costSubtotal: {
        type: 'float',
        generator: faker.commerce.price
      },

      /**
       * costTax
       * @description
       * @type {float} a service's taxes
       */
      costTax: {
        type: 'float',
        generator: faker.commerce.price
      },

      /**
       * costTotal
       * @description
       * @type {float} a service's total
       */
      costTotal: {
        type: 'float',
        generator: faker.commerce.price
      },

      /**
       * payorPrice
       * @description a service's payorprice
       * @type {float}
       */
      payorPrice: {
        type: 'float',
        generator: faker.commerce.price
      },

      /**
       * measureDetailName
       * @description Optional measure detail name describing what measureDetail refers to
       * @type {String}
       */
      measureDetailName: {
        type: 'string'
      },

      /**
       * measureDetail
       * @description Optional measure detail that is captured from service variation
       * @type {JSON}
       */
      measureDetail: {
        type: 'json',
        defaultsTo: null
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given Service object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      if (values.altumService) {
        AltumService.findOne(values.altumService).exec(function (err, altumService) {
          if (err) {
            cb(err);
          } else {
            values.displayName = altumService.displayName;
            cb();
          }
        });
      } else {
        cb();
      }
    },

    /**
     * afterCreate
     * @description After creating a Service as part of the recommendations process,
     *              add the default starting state of 'Pending' iff that service was
     *              created with the approvalNeeded flag set to true.
     * @param service
     * @param cb
     */
    afterCreate: function (service, cb) {
      var startingState = (service.approvalNeeded) ? 'PENDING' : 'APPROVED';
      Status.find({systemName: [startingState, 'INCOMPLETE', 'SUSPENDED', 'REPORT_NOT_REQUIRED', 'REPORT_PENDING']}).then(function (statuses) {
        return [
          Approval.create({
            status: _.find(statuses, {systemName: startingState}).id,
            service: service.id,
            createdBy: service.createdBy,
            owner: service.owner
          }),
          Completion.create({
            status: _.find(statuses, {systemName: 'INCOMPLETE'}).id,
            service: service.id,
            createdBy: service.createdBy,
            owner: service.owner
          }),
          BillingStatus.create({
            status: _.find(statuses, {systemName: 'SUSPENDED'}).id,
            service: service.id,
            createdBy: service.createdBy,
            owner: service.owner
          }),
          ProgramService.findOne(service.programService).then(function (programService) {
            var startingReportStatus = programService.reportRequired ? 'REPORT_PENDING' : 'REPORT_NOT_REQUIRED';
            return ReportStatus.create({
              status: _.find(statuses, {systemName: startingReportStatus}).id,
              service: service.id,
              createdBy: service.createdBy,
              owner: service.owner
            });
          })
        ];
      })
        .spread(function (createdApproval, createdCompletion, createdBilling, createdReport) {
          cb();
        }).catch(cb);
    }

  });
})();

