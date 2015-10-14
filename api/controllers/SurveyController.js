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

    addSessions: function (req, res) {
      var surveyID = req.param('id');
      var sessions = req.param('sessions');
      Promise.all(
        _.map(sessions, function (sessionToAdd) {
          sessionToAdd.survey = surveyID;
          return Session.create(sessionToAdd);
        }))
        .then(function (createdSessions) {
          return res.ok(createdSessions);
        })
        .catch(function (err) {
          return res.badRequest(err);
        });
    },

    updateSessions: function (req, res) {
      var surveyID = req.param('id');
      var sessions = req.param('sessions');
      Promise.all(
        _.map(sessions, function (sessionToUpdate) {
          return Session.update({ id: sessionToUpdate.id }, sessionToUpdate);
        }))
        .then(function (updatedSessions) {
          return res.ok(updatedSessions);
        })
        .catch(function (err) {
          return res.badRequest(err);
        });
    },

    removeSessions: function (req, res) {
      var surveyID = req.param('id');
      var sessions = req.param('sessions');
      Promise.all(
        _.map(sessions, function (sessionToRemove) {
          return Session.update({ id: sessionToRemove.id }, { expiredAt: new Date() });
        }))
        .then(function (removedSessions) {
          return res.ok(removedSessions);
        })
        .catch(function (err) {
          return res.badRequest(err);
        });
    },

    findOne: function (req, res) {
      Survey.findOne(req.param('id'))
        .then(function (survey) {
          this.survey = survey;
          return studysession.find({ survey: survey.id });
        })
        .then(function (sessions) {
          this.sessions = sessions;
          this.survey.sessionForms = [];
          return Study.findOne(this.survey.study);
        })
        .then(function (study) {
          this.survey.sessionStudy = _.pick(study, 'id', 'name');
          // get flattened dictionary of possible formVersions in each schedule
          return FormVersion.find({ id: _.flatten(_.pluck(this.sessions, 'formVersions'))})
            .then(function (formVersions) {
              return _.indexBy(_.map(formVersions, function (form) {
                return _.pick(form, 'id', 'name', 'revision', 'form');
              }), 'id');
            });
        })
        .then(function (possibleForms) {
          this.survey.sessionStudy.possibleForms = possibleForms;
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

