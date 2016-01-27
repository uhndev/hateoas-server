/**
* Study
*
* @class Study
* @description Model representation of a study.  The study model acts as the base
*              root model for application logic in DADOS.  That is to say, collection
*              centres must have an associated study and users must be enrolled in
*              collection centres.
* @docs        http://sailsjs.org/#!documentation/models
*/


(function() {
  var _super = require('./BaseModel.js');
  var faker = require('faker');

  var HateoasService = require('../services/HateoasService.js');

  /**
   * getResponseLinks
   * @description Provides the response links array in our HATEOAS response; these links
   *              should denote transitionable states that are accessible from state /api/study.
   *
   * @param  {ID} id of study
   * @return {Array} Array of response links
   */
  var getResponseLinks = function(id, name) {
    return [
      {
        'rel': 'name',
        'prompt': name,
        'name': 'name',
        'href': [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', id
        ].join('/')
      },
      {
        'rel': sails.models.study.identity,
        'prompt': 'APP.HEADER.SUBMENU.OVERVIEW',
        'name': 'name',
        'href': [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', id
        ].join('/')
      },
      {
        'rel': sails.models.collectioncentre.identity,
        'prompt': 'APP.HEADER.SUBMENU.COLLECTION_CENTRES',
        'name': 'name',
        'href' : [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', id, 'collectioncentres'
        ].join('/')
      },
      {
        'rel': sails.models.subjectenrollment.identity,
        'prompt': 'APP.HEADER.SUBMENU.SUBJECTS',
        'name': 'name',
        'href' : [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', id, 'subjects'
        ].join('/')
      },
      {
        'rel': sails.models.userenrollment.identity,
        'prompt': 'APP.HEADER.SUBMENU.USERS',
        'name': 'name',
        'href' : [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', id, 'users'
        ].join('/')
      },
      {
        'rel': sails.models.form.identity,
        'prompt': 'APP.HEADER.SUBMENU.FORMS',
        'name': 'name',
        'href' : [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', id, 'forms'
        ].join('/')
      },
      {
        'rel': sails.models.survey.identity,
        'prompt': 'APP.HEADER.SUBMENU.SURVEYS',
        'name': 'name',
        'href' : [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', id, 'surveys'
        ].join('/')
      }
    ];
  };

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * name
       * @description Unique name representing a study.  This is the only
       *              exception in our REST routes where we use a named URL
       *              slug instead of an ID.  In other words, we can reference
       *              any study by /api/study/:name rather than /api/study/:id
       *              like our other models.
       *
       * @type {String} Unique name of study
       */
      name: {
        type: 'string',
        index: true,
        required: true,
        notEmpty: true,
        unique: true,
        generator: function(state) {
          return ['STUDY', _.random(1, 10), _.first(faker.lorem.words()).toUpperCase()].join('-');
        }
      },

      /**
       * attributes
       * @description JSON object denoting what high level data the study captures.
       *              By default we have procedure and area attribute lists but they
       *              can be arbitrary.  However, it must always be a flat object
       *              of string keys and array values.
       *
       * @type {Object} Object representing procedures and areas relevant to this study
       */
      attributes: {
        type: 'json',
        defaultsTo: {},
        generator: function() {
          return {
            procedure: faker.lorem.words(),
            area: ['BOTH', 'LEFT', 'RIGHT']
          };
        }
      },

      /**
       * reb
       * @description Research ethics board number.
       * @type {String}
       */
      reb: {
        type: 'string',
        required: true,
        generator: function() {
          return [faker.address.countryCode(), _.random(100, 999)].join('-');
        }
      },

      /**
       * collectionCentres
       * @description Associated list of collection centres that are registered to
       *              collect data for this study.
       *
       * @type {Array}
       */
      collectionCentres: {
        collection: 'collectioncentre',
        via: 'study'
      },

      /**
       * forms
       * @description Associated list of user-created forms that are set up as part of
       *              the surveys for this study.
       * @type {Array}
       */
      forms: {
        collection: 'form',
        via: 'studies'
      },

      /**
       * surveys
       * @description Associated list of user-created surveys
       * @type {Array}
       */
      surveys: {
        collection: 'survey',
        via: 'study'
      },

      /**
       * administrator
       * @type {Integer}
       */
      administrator: {
        model: 'user',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'administrator', User);
        }
      },

      /**
       * pi
       * @type {Integer}
       */
      pi: {
        model: 'user',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'pi', User);
        }
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

      /**
       * getResponseLinks
       */
      getResponseLinks: function() {
        return getResponseLinks(this.id, this.name);
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * getResponseLinks
     * @see top
     */
    getResponseLinks: getResponseLinks,

    /**
     * getQueryLinks
     * @description Provides the query links array in our HATEOAS response; these links
     *              should denote optional queries that can be performed with returned data
     *
     * Each queryLink must have a JSON object with either a where key or a populate key:
     * =================================================================================
     *
     * "where": {                 // waterline query to filter on (use this to filter on model records)
     *  "administrator": user.id
     * }
     *
     * -OR-
     *
     * "populate": {
     *    collection: 'users',    // collection attribute on model to populate (use this to filter on collections)
     *    where: {                // where clause to conditionally populate on
     *      id: 1
     *    }
     * }
     *
     * @param  {Object} user - User object from req.user
     * @return {Array} Array of query links
     */
    getQueryLinks: function(user) {
      return [
        {
          "rel": "default",
          "prompt": "All Studies",
          "href": [sails.getBaseUrl() + sails.config.blueprints.prefix, 'study'].join('/'),
          "where": null
        },
        {
          "rel": "findByAdmin",
          "prompt": "My Studies",
          "href": [sails.getBaseUrl() + sails.config.blueprints.prefix, 'study'].join('/'),
          "where": {
            "administrator": user.id
          }
        }
      ];
    },

    /**
     * afterUpdate
     * @description Lifecycle callback meant to handle deletions in our system; if at
     *              any point we set this study's expiredAt attribute, this function
     *              will check and invalidate any collection centres and by extension,
     *              any users/subjects still enrolled in those collection centres.
     *
     * @param  {Object}   updated updated study object
     * @param  {Function} cb      callback function on completion
     */
    afterUpdate: function(updated, cb) {
      if (!_.isNull(updated.expiredAt)) {
        Study.findOne(updated.id)
          .populate('collectionCentres')
          .populate('surveys')
          .populate('forms')
          .then(function (study) {
            // cascading 'delete' of associated study data by updating expiry
            return [
              CollectionCentre.update({ id: _.pluck(study.collectionCentres, 'id') }, {
                expiredAt: new Date()
              }),
              Survey.update({ id: _.pluck(study.surveys, 'id') }, {
                expiredAt: new Date()
              }),
              Form.update({ id: _.pluck(study.forms, 'id') }, {
                expiredAt: new Date()
              })
            ];
          })
          .spread(function (collectionCentres, surveys, forms) {
            cb();
          })
          .catch(cb);
      } else {
        cb();
      }
    }

  });

}());
