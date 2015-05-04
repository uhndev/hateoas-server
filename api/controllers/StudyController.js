/**
 * StudyController
 *
 * @description :: Server-side logic for managing studies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	findOne: function (req, res, next) {
		var name = req.param('name');
		Study.findOne({name: name})
			.exec(function (err, study) {
				if (_.isUndefined(study)) {
					res.status(404).send("Study " + name + " could not be found");
				} else {
					res.ok(study);
				}
			});
	}

};

