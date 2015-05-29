/**
 * StudyController
 *
 * @description :: Server-side logic for managing studies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var PermissionService = require('../services/PermissionService');

module.exports = {

	findOne: function (req, res, next) {
		var name = req.param('name');
		var cb = function() {
			Study.findOne({name: name}).populate('users')
				.then(function (study) {
					if (_.isUndefined(study)) {
						res.notFound();
					} else {
						if (_.some(study.users, function(user) {
							return user.id === req.user.id;
						})) {
							res.ok(study);
						} else {
							res.status(403).json({
								"error": "User "+req.user.email+" is not permitted to GET "
							});
						}	
					}					
				})
				.catch(next);
		};

		PermissionService.checkPermissions(req, 
			function adminCb() {
				Study.findOne({name: name})
					.populate('users')
					.populate('collectionCentres')
					.then(function (study) {
						this.study = study;
						return study; //res.ok(study);
					})
					.then(function (study) {
						if (_.isUndefined(study)) {
							return study;
						} else {
							return Promise.all(
								_.map(study.collectionCentres, function (centre) {
									return CollectionCentre.findOne(centre.id)
										.populate('contact')
										.populate('coordinators')
										.populate('subjects')
										.then(function (cc) {
											var ret = _.pick(cc, 'id', 'name');
											ret.contact = (_.isUndefined(cc.contact)) ? '' : cc.contact.id;
											ret.coordinators_count = cc.coordinators.length || 0;
											ret.subjects_count = cc.subjects.length || 0;
											return ret;
										})
								})
							);
						}
					})
					.then(function (centres) {
						if (_.isUndefined(centres)) {
							res.notFound();
						} else {
							this.study.centreSummary = centres;
							res.ok(this.study);	
						}						
					}).catch(next);
			},
			cb, //function coordinatorCb() {},
			cb, //function interviewerCb() {},
			cb, //function subjectCb() {},
			next);		
	},

	update: function (req, res, next) {
		// can only update study collection centres via CollectionCentre model
		var id = req.param('id'),
				name = req.param('name'),
				reb = req.param('reb'),
				users = req.param('users');
		var fields = {};
    if (name) fields.name = name;
    if (reb) fields.reb = reb;
    if (users) fields.users = users;
    console.log(fields);

		Study.update({id: id}, fields).exec(function (err, study) {
			if (err) return next(err);
			res.ok(study);
		});
	}
	
};

