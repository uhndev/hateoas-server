/**
 * StudyController
 *
 * @description :: Server-side logic for managing studies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	find: function(req, res, next) {
		Study.find().populate('users')
			.exec(function (err, studies) {
				if (err) next(err);
				res.ok(studies);
			});
	},

	findOne: function (req, res, next) {
		var name = req.param('name');
		Study.findOne({name: name}).populate('users')
			.exec(function (err, study) {
				if (_.isUndefined(study)) {
					res.status(404).send("Study " + name + " could not be found");
				} else {
					res.ok(study);
				}
			});
	}

};

