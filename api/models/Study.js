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
        defaultsTo: {
          procedure: [],
          area: ['BOTH', 'LEFT', 'RIGHT']
        }
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
       * @type {Association}
       */
      collectionCentres: {
        collection: 'collectioncentre',
        via: 'study'
      },

      /**
       * administrator
       * @type {Association}
       */
      administrator: {
        model: 'user'
      },

      /**
       * pi
       * @type {Association}
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
            'rel': 'overview',
            'prompt': this.name,
            'name': 'name',
            'href': [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name
            ].join('/')
          },
          {
            'rel': 'subject',
            'prompt': 'Subjects',
            'name': 'name',
            'href' : [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'subject'
            ].join('/')
          },
          {
            'rel': 'user',
            'prompt': 'Users',
            'name': 'name',
            'href' : [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'user'
            ].join('/')
          },
          {
            'rel': 'form',
            'prompt': 'Forms',
            'name': 'name',
            'href' : [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'form'
            ].join('/')
          },
          {
            'rel': 'survey',
            'prompt': 'Surveys',
            'name': 'name',
            'href' : [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'survey'
            ].join('/')
          },
          {
            'rel': 'collectioncentre',
            'prompt': 'Collection Centres',
            'name': 'name',
            'href' : [
              sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'collectioncentre'
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
        Study.findOne(updated.id).populate('collectionCentres')
          .then(function (study) {
            return CollectionCentre.update({ id: _.pluck(study.collectionCentres, 'id') }, {
              expiredAt: new Date()
            });
          })
          .then(function (collectionCentres) {
            cb();
          })
          .catch(cb);
      } else {
        cb();
      }
    }

  };

}());
