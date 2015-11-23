/**
 * FormVersionController
 *
 * @description :: Server-side logic for managing form versions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function(req, res) {
    var formID = req.param('id');
    var formOptions = _.pick(req.body, 'name', 'metaData', 'questions');

    FormVersion.find({ form: formID })
      .sort('revision DESC')
      .then(function (latestFormVersions) {
        this.latestFormVersion = _.first(latestFormVersions);
        return AnswerSet.count({formVersion: _.pluck(latestFormVersions, 'id')});
      })
      .then(function (answerSets) {
        // if AnswerSets exist for any form versions, Form has been published
        if (answerSets > 0) {
          // create new form version with updated revision number
          var newFormVersion = {
            revision: this.latestFormVersion.revision + 1,
            form: formID
          };
          _.merge(newFormVersion, formOptions);
          return FormVersion.create(newFormVersion).then(function (formVersion) {
            res.created(formVersion);
          });
        }
        // otherwise updates are done in place for the current head
        else {
          var updatedFormVersion = {
            revision: this.latestFormVersion.revision,
            form: formID
          };
          _.merge(updatedFormVersion, formOptions);
          return FormVersion.update({ id: this.latestFormVersion.id }, updatedFormVersion)
            .then(function (formVersion) {
              res.ok(_.first(formVersion));
            });
        }
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

