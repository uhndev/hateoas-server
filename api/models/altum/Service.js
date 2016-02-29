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
       * serviceType
       * @description The type of service that it falls under
       * @type {Model}
       */
      serviceType: {
        model: 'servicetype'
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
       * programSupplyItems
       * @description Collection of supplies related to this service
       * @type {Collection}
       */
      programSupplyItems: {
        collection: 'programsupplyitem',
        via: 'services'
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
      Status.findOneByName(startingState).then(function (status) {
        return Approval.create({
          status: status.id,
          service: service.id
        });
      })
      .then(function () {
        cb();
      }).catch(cb);
    }

  });
})();

