/**
 * FormVersionController
 *
 * @description :: Server-side logic for managing form versions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

(function() {
  var Promise = require('q');

  module.exports = {

    /**
     * create
     * @description Overrides the default FormVersion create method.  This is the endpoint on the form builder
     *              when the user clicks the save button.  (Auto-saves call the update function in Form).  After
     *              creating a new FormVersion that has answersets, we need to perform some lifecycle logic to keep
     *              data in sync.
     *
     *              Editing a Form that has AnswerSets and is in a Session in an active Survey should update
     *              sessions in those Surveys accordingly by:
     *              1) Sessions with answers keep their existing formOrders and formVersions (since they were answered)
     *              2) Sessions not yet answered have formOrder and formVersions updated moving forward
     * @param req
     * @param res
     */
    create: function(req, res) {
      var formID = req.param('id');
      var formOptions = _.pick(req.body, 'name', 'description', 'metaData', 'questions');

      FormVersion.find({ form: formID })
        .sort('revision DESC')
        .then(function (latestFormVersions) {
          this.latestFormVersion = _.first(latestFormVersions);
          // take previous form versions and leave
          return AnswerSet.find({formVersion: _.pluck(latestFormVersions, 'id')});
        })
        .then(function (answerSets) {
          this.answerSets = answerSets;
          // if AnswerSets exist for any form versions, Form has been published
          if (answerSets.length > 0) {
            // create new form version with updated revision number
            var newFormVersion = {
              revision: this.latestFormVersion.revision + 1,
              form: formID
            };
            _.merge(newFormVersion, formOptions);

            return FormVersion.create(newFormVersion)
              .then(function (createdFormVersion) {
                this.createdFormVersion = createdFormVersion;
                // find sessions that have answersets attached to them via subject schedule
                return schedulesessions.find({id: _.pluck(this.answerSets, 'subjectSchedule')});
              })
              .then(function (sessionsWithAnswerSets) {
                // these session IDs have answersets and should not be updated
                var sessionsToIgnore = _.unique(_.pluck(sessionsWithAnswerSets, 'session'));

                // return sessions to update with previous form versions and no answersets
                return formversionsessions.find({
                  id: this.latestFormVersion.id,
                  session: { '!': sessionsToIgnore }
                });
              })
              .then(function (formSessionsToUpdate) {
                // update previous session with answersets by leaving previous form version in formOrder
                return Promise.all(
                  _.map(formSessionsToUpdate, function (formsession) {
                    return Session.findOne(formsession.session).then(function (sessionToUpdate) {
                      // remove previous FormVersion and replace with newly created FormVersion
                      sessionToUpdate.formVersions.remove(this.latestFormVersion.id);
                      sessionToUpdate.formVersions.add(this.createdFormVersion.id);
                      // update each session.formOrder
                      sessionToUpdate.formOrder[sessionToUpdate.formOrder.indexOf(this.latestFormVersion.id)] = this.createdFormVersion.id;
                      return sessionToUpdate.save();
                    });
                  })
                );
              })
              .then(function () {
                res.created(this.createdFormVersion);
              });
          }
          // otherwise updates are done in place for the current head and sessions don't need to be updated
          else {
            var updatedFormVersion = {
              revision: this.latestFormVersion.revision,
              form: formID
            };
            _.merge(updatedFormVersion, formOptions);
            return FormVersion.update({ id: this.latestFormVersion.id }, updatedFormVersion)
              .then(function (updatedFormVersion) {
                return res.ok(_.first(updatedFormVersion));
              });
          }
        })
        .catch(function (err) {
          res.serverError({
            title: 'FormVersion Error: formID '+ formID,
            code: err.status,
            message: 'An error occurred when saving FormVersion ' + formOptions + ': ' + err.details
          });
        });
    }
  };
})();


