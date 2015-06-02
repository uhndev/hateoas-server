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
				coordinators = req.param('coordinators'),
				removeUsers = req.param('removeUsers')
				subjects = req.param('subjects');

		var ccFields = {}, coordFields = {};
    if (ccName) ccFields.name = ccName;
    if (ccContact) ccFields.contact = ccContact;
    if (coordinators) coordFields.coordinators = coordinators;
    if (removeUsers) coordFields.removeUsers = removeUsers;

    if (subjects) ccFields.subjects = subjects;

    PermissionService.getCurrentRole(req)
    .then(function (role) {
    	this.role = role;
    	return CollectionCentre.findOne(ccId);
    })
    .then(function (centre) {
    	if (this.role === 'admin') {
    		if (coordFields.coordinators) {
    			_.each(coordFields.coordinators, function(user) {
    				centre.coordinators.add(user);		
    			});    			
    		}
    		if (coordFields.removeUsers) {
    			_.each(coordFields.removeUsers, function(user) {
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

	// findByStudyName: function (req, res, next) {
	// 	var studyName = req.param('name');
		// var cb = function() {
		// 	Study.findOne({name: name}).populate('users')
		// 		.then(function (study) {
		// 			if (_.some(study.users, function(user) {
		// 				return user.id === req.user.id;
		// 			})) {
		// 				res.ok(study);
		// 			} else {
		// 				res.status(403).json({
		// 					"error": "User "+req.user.email+" is not permitted to GET "
		// 				});
		// 			}
		// 		}).catch(next);
		// };

		// PermissionService.checkPermissions(req, 
		// 	function adminCb() {
		// 		Study.findOne({name: name}).populate('users')
		// 			.exec(function (err, study) {
		// 				if (err) next(err);
		// 				if (_.isUndefined(study)) {
		// 					res.status(404).send("Study " + name + " could not be found");
		// 				} else {
		// 					res.ok(study);
		// 				}
		// 			});
		// 	},
		// 	cb, //function coordinatorCb() {},
		// 	cb, //function interviewerCb() {},
		// 	cb, //function subjectCb() {},
		// 	next);		
	// }

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

