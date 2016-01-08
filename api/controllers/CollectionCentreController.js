/**
 * CollectionCentreController
 *
 * @module controllers/CollectionCentre
 * @description Server-side logic for managing Collection Centres
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var _ = require('lodash');
  var Promise = require('bluebird');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  var StudyBase = require('./BaseControllers/StudyBaseController');

  _.merge(exports, StudyBase);      // inherits StudyBaseController.findByStudy
  _.merge(exports, {

    /**
     * findOne
     * @description Finds one collection centre given an id
     *              and populates enrolled coordinators and subjects
     */
    findOne: function (req, res) {
      CollectionCentre.findOne(req.param('id'))
        .populate('study')
        .populate('contact')
        .exec(function (err, centre) {
          if (err) {
            return res.serverError(err);
          }

          if (_.isUndefined(centre)) {
            res.notFound();
          } else {
            return Promise.all([
              collectioncentreuser.find({ collectionCentre: centre.id }),
              collectioncentresubject.find({ collectionCentre: centre.id })
            ]).spread(function (users, subjects) {
              centre.coordinators = users;
              centre.subjects = subjects;
              res.ok(centre);
            }).catch(function (err) {
              res.serverError(err);
            });
          }
        });
    },

    /**
     * create
     * @description Creates a collection centre given a name, user contact,
     *              and associated (existing) study.  Will fail if a collection
     *              centre has already be registered under the same name in
     *              the requested study.
     */
    create: function(req, res, next) {
      var ccName = req.param('name'),
        ccContact = req.param('contact'),
        studyId = req.param('study');
      var options = _.pick(_.pick(req.body, 'name', 'contact', 'study'), _.identity);

      Study.findOne(studyId).populate('collectionCentres')
        .then(function (study) {
          if (_.isUndefined(study)) {
            err = new Error('Study '+studyId+' does not exist.');
            err.status = 400;
            throw err;
          } else {
            if (_.some(study.collectionCentres, {name: ccName})) {
              err = new Error('Collection centre with name '+ccName+' already exists under this study.');
              err.status = 400;
              throw err;
            } else {
              return CollectionCentre.create(options);
            }
          }
        })
        .then(function (centre) {
          res.status(201).jsonx(centre);
        })
        .catch(function (err) {
          res.badRequest(err);
        });
    },

    /**
     * update
     * @description Updates a collection centre given only name or contact
     */
    update: function(req, res, next) {
      var ccId = req.param('id'),
        ccName = req.param('name'),
        ccContact = req.param('contact');
      var options = _.pick(_.pick(req.body, 'name', 'contact'), _.identity);

      CollectionCentre.update({id: ccId}, options)
        .then(function (centre) {
          res.ok(centre);
        })
        .catch(function (err) {
          res.badRequest(err);
        });
    }

  });

})();

