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
		PermissionService.checkPermissions(req, function() {
			Study.findOne({name: name}).populate('users')
				.exec(function (err, study) {
					if (err) next(err);
					if (_.isUndefined(study)) {
						res.status(404).send("Study " + name + " could not be found");
					} else {
						res.ok(study);
					}
				});
		}, function() {
			Study.findOne({name: name}).populate('users')
				.then(function (study) {
					if (_.some(study.users, function(user) {
						return user.id === req.user.id;
					})) {
						res.ok(study);
					} else {
						res.status(403).json({
							"error": "User "+req.user.email+" is not permitted to GET "
						});
					}
				}).catch(next);
		}, next);		
		
	}

};

