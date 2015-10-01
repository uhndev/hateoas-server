/**
 * FormVersionController
 *
 * @description :: Server-side logic for managing form versions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function(req, res, next) {
    var formID = req.param('id');
    var options = _.pick(req.body, 'name', 'metaData', 'questions');

    // create new form version with updated revision number
    FormVersion.find({ form: formID })
      .sort('revision DESC')
      .then(function (latestFormVersions) {
        var newFormVersion = {
          revision: _.first(latestFormVersions).revision + 1,
          form: formID
        };
        _.merge(newFormVersion, options);
        return FormVersion.create(newFormVersion);
      })
      .then(function (newFormVersion) {
        res.status(201).jsonx(centre);
      })
      .catch(function (err) {
        res.badRequest({
          title: 'Error',
          code: err.status,
          message: err.details
        });
      });
  },
};

