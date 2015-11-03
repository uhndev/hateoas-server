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

  var HateoasService = require('../services/HateoasService.js');

  module.exports = {
    schema: true,

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
        unique: true
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
        defaultsTo: {}
      },

      /**
       * reb
       * @description Research ethics board number.
       * @type {String}
       */
      reb: {
        type: 'string',
        required: true
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
        model: 'user'
      },

      /**
       * pi
       * @type {Integer}
       */
      pi: {
        model: 'user'
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
       * @description Provides the response links array in our HATEOAS response; these links
       *              should denote transitionable states that are accessible from state /api/study.
       *
       * @param  {ID} id Study ID
       * @return {Array} Array of response links
       */
      getResponseLinks: function(id) {
        return [
          {
            'rel': 'name',
            'prompt': this.name,
            'name': 'name',
            'href': [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name
            ].join('/')
          },
          {
            'rel': 'overview',
            'prompt': 'HEADER.SUBMENU.OVERVIEW',
            'name': 'name',
            'href': [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name
            ].join('/')
          },
          {
            'rel': 'collectioncentre',
            'prompt': 'HEADER.SUBMENU.COLLECTION_CENTRES',
            'name': 'name',
            'href' : [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'collectioncentre'
            ].join('/')
          },
          {
            'rel': 'subject',
            'prompt': 'HEADER.SUBMENU.SUBJECTS',
            'name': 'name',
            'href' : [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'subject'
            ].join('/')
          },
          {
            'rel': 'user',
            'prompt': 'HEADER.SUBMENU.USERS',
            'name': 'name',
            'href' : [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'user'
            ].join('/')
          },
          {
            'rel': 'form',
            'prompt': 'HEADER.SUBMENU.FORMS',
            'name': 'name',
            'href' : [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'form'
            ].join('/')
          },
          {
            'rel': 'survey',
            'prompt': 'HEADER.SUBMENU.SURVEYS',
            'name': 'name',
            'href' : [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'survey'
            ].join('/')
          }
        ]
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)
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

  };

}());
