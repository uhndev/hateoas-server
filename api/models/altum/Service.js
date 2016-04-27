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
        generator: function(state) {
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
       * numberDetail
       * @description Optional number detail that is captured from service variation
       * @type {Number}
       */
      numberDetail: {
        type: 'integer',
        defaultsTo: null
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
       * dateDetail
       * @description Optional date detail that is captured from service variation
       * @type {Date}
       */
      dateDetail: {
        type: 'date',
        defaultsTo: null
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
       * staffDetail
       * @description Optional staff detail that is captured from service variation
       * @type {Model}
       */
      staffDetail: {
        model: 'staff',
        defaultsTo: null
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
      var startingState = (service.approvalNeeded) ? 'Pending' : 'Approved';
      Status.find({ name: [startingState, 'Incomplete'] }).then(function (statuses) {
        return [
          Approval.create({
            status: _.find(statuses, {name: startingState}).id,
            service: service.id,
            createdBy: service.createdBy,
            owner: service.owner
          }),
          Completion.create({
            status: _.find(statuses, {name: 'Incomplete'}).id,
            service: service.id,
            createdBy: service.createdBy,
            owner: service.owner
          })
        ];
      })
      .spread(function (createdApproval, createdCompletion) {
        cb();
      }).catch(cb);
    }

  });
})();

