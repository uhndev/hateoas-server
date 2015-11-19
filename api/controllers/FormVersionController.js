/**
 * FormVersionController
 *
 * @description :: Server-side logic for managing form versions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function(req, res, next) {
    var formID = req.param('id');

    Form.findOne(formID).then(function (form){
      var options = _.pick(req.body, 'name', 'metaData', 'questions');

      FormVersion.find({ form: formID })
        .sort('revision DESC')
        .then(function (latestFormVersions) {
          // if lastPublished set on Form, then there are AnswerSets referring to this version
          if (form.lastPublished !== null) {
            // create new form version with updated revision number
            var newFormVersion = {
              revision: _.first(latestFormVersions).revision + 1,
              form: formID
            };
            _.merge(newFormVersion, options);
            return FormVersion.create(newFormVersion);
          } else {
            return _.first(latestFormVersions);
          }
        })
        .then(function (formVersion) {
          if (form.lastPublished !== null) {
            res.created(formVersion);
          } else {
            res.ok(formVersion);
          }
        });
    })
    .catch(function (err) {
      res.badRequest({
        title: 'FormVersion Error: formID '+ formID,
        code: err.status,
        message: err.details
      });
    });
  }
};

