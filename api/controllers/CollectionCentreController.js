/**
 * CollectionCentreController
 *
 * @description :: Server-side logic for managing Collectioncentres
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

module.exports = {
	
	create: function(req, res, next) {
		var ccName = req.param('name'),
				ccContact = req.param('contact'),
				studyId = req.param('study');

		Study.findOne(studyId).populate('collectionCentres')
		.then(function (study) {
			if (_.isUndefined(study)) {
				return res.badRequest();
			} else {
				if (_.some(study.collectionCentres, {name: ccName})) {
					// CC name already exists in study collectionCentres
					return res.badRequest();
				} else {
					CollectionCentre.create({
						name: ccName,
						contact: ccContact,
						study: studyId
					}).exec(function (err, centre) {
						if (err) return res.serverError(err);
						res.status(201).json(centre);
					});	
				}				
			}
		}).catch(next);
	},

	update: function(req, res, next) {
		var ccId = req.param('id'),
				ccName = req.param('name'),
				ccContact = req.param('contact'),				
				isAdding = req.param('isAdding'),
				coordinators = req.param('coordinators'),
				subjects = req.param('subjects');

		var ccFields = {}, coordFields = {};
    if (ccName) ccFields.name = ccName;
    if (ccContact) ccFields.contact = ccContact;

    PermissionService.getCurrentRole(req)
    .then(function (role) {
    	this.role = role;
    	return CollectionCentre.findOne(ccId);
    })
    .then(function (centre) {
    	if (this.role === 'admin' && !_.isUndefined(isAdding) && !_.isUndefined(coordinators)) {
    		if (isAdding) {
    			_.each(coordinators, function(user) {
    				centre.coordinators.add(user);
    			});    			
    		} else {
    			_.each(coordinators, function(user) {
    				centre.coordinators.remove(user);
    			});
    		}
    		return centre.save();    		
    	}
    	return centre;
    })
    .then(function (centre) {
    	if (role === 'admin') {
				return CollectionCentre.update({id: ccId}, ccFields);
			}
			return centre;
    })
    .then(function (centre) {
    	res.ok(centre);
    })
    .catch(next);
	},

	findByStudyName: function(req, res) {
    var studyName = req.param('name');

    CollectionCentre.findByStudyName(studyName,
      { where: actionUtil.parseCriteria(req),
        limit: actionUtil.parseLimit(req),
        skip: actionUtil.parseSkip(req),
        sort: actionUtil.parseSort(req) }, 
      function(err, centres) {
        if (err) res.serverError(err);
        res.ok(centres);
      });
  },

	findSubjects: function(req, res, next) {
		var ccId = req.param('id');
		CollectionCentre.findOne(ccId)
			.populate('subjects')
			.then(function (centre) {
					if (_.isUndefined(centre)) {
						res.notFound();
					} else {
						return Utils.User.populateAndFormat(centre.subjects);
					}
				})
				.then(function (subjects) {
					res.ok(subjects);
				}).catch(next);
	},

	findCoordinators: function(req, res, next) {
		var ccId = req.param('id');
		CollectionCentre.findOne(ccId)
			.populate('coordinators')
			.then(function (centre) {
				if (_.isUndefined(centre)) {
					res.notFound();
				} else {
					return Utils.User.populateAndFormat(centre.coordinators);
				}
			})
			.then(function (coordinators) {
				res.ok(coordinators);
			}).catch(next);
	}
};

