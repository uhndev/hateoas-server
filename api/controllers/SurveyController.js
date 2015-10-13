/**
 * SurveyController
 *
 * @description Server-side logic for managing surveys
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var Promise = require('bluebird');
  var util = require('util');
  var pg = require('pg');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    findOne: function (req, res) {
      Survey.findOne(req.param('id'))
        .then(function (survey) {
          this.survey = survey;
          return studysession.find({ survey: survey.id });
        })
        .then(function (sessions) {
          this.sessions = sessions;
          this.survey.sessionForms = [];
          return Study.findOne(this.survey.study).populate('forms');
        })
        .then(function (study) {
          this.survey.sessionStudy = _.pick(study, 'id', 'name');
          return Form.find({id: _.pluck(study.forms, 'id')}).populate('versions');
        })
        .then(function (studyForms) {
          this.survey.sessionStudy.forms = studyForms;
          return Promise.all(
            _.map(this.sessions, function (session) {
              return FormVersion.find({ id: session.formVersions }).then(function (formVersions) {
                session.formVersions = _.map(formVersions, function (formVersion) {
                  return _.pick(formVersion, 'id', 'name', 'revision');
                });
                return session;
              })
            })
          );
        })
        .then(function (sessions) {
          this.survey.sessionForms = sessions;
          res.ok(this.survey);
        });
    },

    /**
     * findByStudyName
     * @description Finds studies by their associations to a given study.
     */
    findByStudyName: function (req, res) {
      var studyName = req.param('name');

      Survey.findByStudyName(studyName, req.user,
        {
          where: actionUtil.parseCriteria(req),
          limit: actionUtil.parseLimit(req),
          skip: actionUtil.parseSkip(req),
          sort: actionUtil.parseSort(req)
        }
      ).then(function (surveys) {
          var err = surveys[0];
          var surveyItems = surveys[1];
          if (err) res.serverError(err);
          res.ok(surveyItems);
        });
    }
  };
})();
