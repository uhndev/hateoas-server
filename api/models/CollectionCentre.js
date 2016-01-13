/**
 * CollectionCentre
 *
 * @class CollectionCentre
 * @description Model representation of a Collection Centre
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {
  var _super = require('./BaseModel.js');
  var HateoasService = require('../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultSortBy: 'name ASC', // overrides BaseModel.defaultSortBy

    schema: true,
    attributes: {
      /**
       * name
       * @description The name of the collection centre.  This must be unique
       *              local to the scope of the current study.  Global uniqueness,
       *              however is not supported.
       * @type {String} name of collection centre
       */
      name: {
        type: 'string',
        required: true
      },

      /**
       * study
       * @description Associated study for which this collection centre is attached
       *              to.  A study can have multiple collection centres attached
       *              and each must have a unique name across this study.
       * @type {Association} linked study reference
       */
      study: {
        model: 'study'
      },

      /**
       * contact
       * @description Point of contact for this collection centre; usually used for
       *              sending messages to all enrolled users from this specified
       *              user.
       * @type {Association} linked user representing main point of contact for this collection centre
       */
      contact: {
        model: 'user'
      },

      /**
       * subjectEnrollments
       * @description List of registered subject enrollments taking place at this
       *              collection centre.
       * @type {Association}
       */
      subjectEnrollments: {
        collection: 'subjectenrollment',
        via: 'collectionCentre'
      },

      /**
       * userEnrollments
       * @description List of enrolled users who can be overseeing the data collected at
       *              this collection centre.
       * @type {Association}
       */
      userEnrollments: {
        collection: 'userenrollment',
        via: 'collectionCentre'
      },

      /**
       * expiredAt
       * @description Instead of strictly deleting objects from our system, we set a date such
       *              that if it is not null, we do not include this entity in our response.
       * @type {Date} Date of expiry
       */
      expiredAt: {
        type: 'datetime',
        defaultsTo: null,
        datetime: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    findByBaseModel: function (studyID, currUser, options) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.id;
      return Study.findOne(studyID).then(function (study) {
          this.links = study.getResponseLinks();
          return studycollectioncentre.find(query).where({ study: studyID })
        })
        .then(function (centres) {
          return {
            data: _.unique(centres, 'id'),
            links: this.links
          };
        });
    },

    /**
     * afterUpdate
     * @description Lifecycle callback meant to handle deletions in our system; if at
     *              any point we set this collection centre's expiredAt attribute, this
     *              function will check and invalidate any users/subjects still enrolled
     *              in this collection centre.
     *
     * @param  {Object}   updated updated collection centre object
     * @param  {Function} cb      callback function on completion
     */
    afterUpdate: function (updated, cb) {
      if (!_.isNull(updated.expiredAt)) {
        UserEnrollment.update({ collectionCentre: updated.id }, { expiredAt: new Date() })
        .then(function (userEnrollments) {
          return SubjectEnrollment.update({ collectionCentre: updated.id }, { expiredAt: new Date() });
        })
        .then(function (subjectEnrollments) {
          cb();
        })
        .catch(cb);
      } else {
        cb();
      }
    },

    afterCreate: function (values, cb) {
      PermissionService.createRole({
        name: ['CollectionCentre', values.id, 'Role'].join(''),
        permissions: [
          {
            model: 'study',
            action: 'read',
            criteria: [
              { where: { id: values.study } }
            ]
          },
          {
            model: 'collectioncentre',
            action: 'read',
            criteria: [
              { where: { id: values.id } }
            ]
          },
          {
            model: 'userenrollment',
            action: 'read',
            criteria: [
              { where: { collectionCentre: values.id } }
            ]
          },
          {
            model: 'subjectenrollment',
            action: 'read',
            criteria: [
              { where: { collectionCentre: values.id } }
            ]
          },
          {
            model: 'survey',
            action: 'read',
            criteria: [
              { where: { study: values.study } }
            ]
          },
          {
            model: 'studysubject',
            action: 'read',
            criteria: [
              { where: { collectionCentre: values.id } }
            ]
          },
          {
            model: 'schedulesubjects',
            action: 'read',
            criteria: [
              { where: { collectionCentre: values.id } }
            ]
          }
        ]
      })
      .then(function (newRole) {
        cb();
      }).catch(cb);
    }

  });

}());
