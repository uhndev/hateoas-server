/**
 * CollectionCentreController
 *
 * @description :: Server-side logic for managing Collectioncentres
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

module.exports = {

	findOne: function (req, res, next) {
		CollectionCentre.findOne(req.param('id'))
			.populate('coordinators')
			.populate('subjects')
		.exec(function (err, centre) {
			if (err) return res.serverError(err);
			if (_.isUndefined(centre)) {
				res.notFound();
			} else {
				this.centre = centre;
				Utils.User.populateUsers(centre.coordinators)
					.then(function (users) {
						this.centre.coordinators = users;
						res.ok(this.centre);
					});
			}
		});
	},
	
	create: function(req, res, next) {
		var ccName = req.param('name'),
				ccContact = req.param('contact'),
				studyId = req.param('study');

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
						return CollectionCentre.create({
							name: ccName,
							contact: ccContact,
							study: studyId
						});
					}				
				}
			})
			.then(function (centre) {
				res.status(201).jsonx(centre);
			})
			.catch(function (err) {
				res.badRequest({
					title: 'Error',
					code: err.status,
					message: err.message
				});
			});
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

		Group.findOne(req.user.group).then(function (group) {
			this.group = group;
			return CollectionCentre.findOne(ccId);
		})
		.then(function (centre) {
			if (this.group.level === 1 && !_.isUndefined(isAdding) && !_.isUndefined(coordinators)) {
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
			if (this.group.level === 1) {
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
	}
};

