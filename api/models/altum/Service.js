/**
 * Service
 *
 * @class Service
 * @description A model representation of a service, and instance of actual work being done at altum
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {
  var _super = require('../BaseModel.js');
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
       * clinician
       * @description Reference to the clinician who assisted in the recommendation of this service
       * @type {Model}
       */
      clinician: {
        model: 'clinician'
      },

      /**
       * status
       * @description Status of recommended service
       * @type {Model}
       */
      status: {
        model: 'status'
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
       * serviceDate
       * @description Date on which this service was recommended (should technically be same as createdAt but w/e)
       * @type {Date}
       */
      serviceDate: {
        type: 'date'
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
       * siteServices
       * @description a collection of a site's services at altum
       * @type {Collection}
       */
      siteServices: {
        collection: 'siteservice',
        via: 'service'
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
       * approved
       * @description presently this is just a boolean to flag it as approved
       * @type {Boolean}
       */
      approved: {
        type: 'boolean',
        defaultsTo: false
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

    findByBaseModel: function (referralID, currUser, options) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.id;
      return referraldetail.findOne(referralID).then(function (referral) {
          this.links = referraldetail.getResponseLinks(referral.id, referral.displayName);
          return Service.find(query).where({referral: referralID});
        })
        .then(function (services) {
          return {
            data: services,
            links: this.links
          };
        });
    }

  });
})();

