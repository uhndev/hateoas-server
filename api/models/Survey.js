/**
 * Survey
 * @class Survey
 * @description Model representation of a survey to be performed within a study
 *              A survey has many sessions which dictate the points in time when
 *              data is to be collected from a subject.
 * @docs        http://sailsjs.org/#!documentation/models
 */
(function () {
  var Promise = require('q');
  var HateoasService = require('../services/HateoasService.js');

  module.exports = {
    schema: true,
    attributes: {

      /**
       * study
       * @description The study for which this survey captures data for.
       * @type {Association} linked study in survey
       */
      study: {
        model: 'study'
      },

      /**
       * name
       * @description The name of the survey, i.e. LEAP SURVEY
       * @type {String}
       */
      name: {
        type: 'string',
        required: true
      },

      /**
       * completedBy
       * @description Reference for who should be filling out this survey;
       *              the subject or a coordinator on their behalf.
       * @type {String}
       */
      completedBy: {
        type: 'string',
        enum: ['subject', 'coordinator']
      },

      /**
       * defaultFormVersions
       * @description Array storing form versions that are applicable to the study, as well
       *              as the default order for the forms in each session
       * @type {Array}
       */
      defaultFormVersions: {
        type: 'array',
        defaultsTo: [],
        array: true
      },

      /**
       * sessions
       * @description Collection of set time intervals that define when data should be collected
       *              for each subject based on their date of event.  Each session created acts as
       *              a template for SubjectSchedules to be stamped out for each subject in
       *              SubjectEnrollment
       * @type {Association} 1-to-many relationship to the Session model
       */
      sessions: {
        collection: 'session',
        via: 'survey'
      },

      /**
       * versions
       * @description Collection of versions this particular survey has, in git terms, the instance
       *              of this Survey model is the HEAD revision, and the items in this collection
       *              represent the commit history.
       * @type {Association} 1-to-many relationship to the SurveyVersion model
       */
      versions: {
        collection: 'surveyversion',
        via: 'survey'
      },

      /**
       * lastPublished
       * @description Boolean flag of null || date defining whether or not subjects have already begun
       *              participating in this Survey.  If publishedOn has a date set, this survey can only
       *              be updated by creating a new SurveyVersion and bumping up the latest version reference to match.
       *              This date should always reflect the latest SurveyVersion's activeOn date attribute.
       * @type {Date} Date denoting the day when subjects began participating in a survey
       */
      lastPublished: {
        type: 'date',
        defaultsTo: null
      },

      /**
       * expiredAt
       * @description Instead of strictly deleting objects from our system, we set a date such
       *              that if it is not null, we do not include this entity in our response.
       * @type {Date} Date of expiry
       */
      expiredAt: {
        type: 'datetime',
        defaultsTo: null,
        datetime: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * beforeCreate
     * @description Before creating survey, check if user provided a defaultFormVersion and if not
     *              retrieve from latest study forms and include all in default order.
     */
    beforeCreate: function (values, cb) {
      Study.findOne(values.study)
        .populate('forms')
        .exec(function (err, study) {
          if (_.has(values, 'defaultFormVersions') && values.defaultFormVersions.length === study.forms.length) {
            cb();
          } else {
            Form.findLatestFormVersions(study.forms)
              .then(function (latestFormVersions) {
                // default set all form versions to active
                values.defaultFormVersions = _.map(latestFormVersions, function (formVersion) {
                  var returnForm =_.pick(latestFormVersions, 'id', 'name', 'revision', 'form');
                  returnForm.active = true;
                  return returnForm;
                });
                cb();
              });
          }
        });
    },

    /**
     * afterCreate
     * @description After creating a brand new survey, create initial mirrored SurveyVersion
     */
    afterCreate: function (values, cb) {
      // stamp out initial survey version
      SurveyVersion.create({
        revision: 0,
        survey: values.id,
        name: values.name,
        completedBy: values.completedBy,
        sessions: _.pluck(values.sessions, 'id')
      }).exec(function (err, surveyVersion) {
        cb();
        // jesus take the wheel
        SurveyService.batchUpdateSessions(values).then(function () {
          sails.log.info('QUERY COMPLETE: Schedules created.');
        }).catch(function (err) {
          Session.destroy({ survey: values.id }).exec(function (sessionErr) {
            Survey.destroy(values.id).exec(function (surveyErr) {
              sails.log.error(sessionErr || surveyErr);
            });
          });
        });
      });
    },

    /**
     * afterUpdate
     * @description After updating the head revision, depending on whether or not users have
     *              filled out any AnswerSets, we create new SurveyVersions as needed.
     */
    afterUpdate: function (values, cb) {
      var promise = Survey.findOne(values.id)
        .populate('versions')
        .populate('sessions');

      if (!_.isNull(values.expiredAt)) {
        promise.then(function (survey) {
          return [
            SurveyVersion.update({id: _.pluck(survey.versions, 'id')}, {
              expiredAt: new Date()
            }),
            Session.update({id: _.pluck(survey.sessions, 'id')}, {
              expiredAt: new Date()
            })
          ];
        }).spread(function (versions, sessions) {
          cb();
        });
      } else {
        promise.then(function (survey) {
          // if lastPublished set on Survey, then there are AnswerSets referring to this version
          if (!_.isNull(survey.lastPublished) && _.isNull(survey.expiredAt)) {
            // in that case, stamp out next survey version
            // create new survey version with updated revision number
            SurveyVersion.find({survey: values.id})
              .sort('revision DESC')
              .then(function (latestSurveyVersions) {
                var currentSessions = _.pluck(survey.sessions, 'id');
                var previousSessions = _.first(latestSurveyVersions).sessions;
                if (_.difference(currentSessions, previousSessions).length > 0) {
                  var newSurveyVersion = {
                    revision: _.first(latestSurveyVersions).revision + 1,
                    survey: values.id,
                    sessions: _.pluck(survey.sessions, 'id')
                  };
                  _.merge(newSurveyVersion, _.pick(values, 'name', 'completedBy'));
                  return SurveyVersion.create(newSurveyVersion);
                }
                return null;
              })
              .then(function (newSurveyVersion) {
                cb();
              });
          }
          // otherwise updates are done in place for the current head
          else {
            cb();
          }
        });
      }

      promise.catch(cb);
    },

    findByStudyName: function (studyName, currUser, options, cb) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.name;

      // get study surveys
      return Study.findOneByName(studyName).populate('surveys')
        .then(function (study) {
          var studySurveyIds = _.pluck(study.surveys, 'id');
          return ModelService.filterExpiredRecords('survey')
            .where(query.where)
            .populate('versions')
            .then(function (surveys) {
              return _.filter(surveys, function (survey) {
                return _.contains(studySurveyIds, survey.id);
              });
            });
        })
        .then(function (filteredSurveys) {
          return [false, filteredSurveys];
        })
        .catch(function (err) {
          return [err, null];
        });
    }

  };

})();
