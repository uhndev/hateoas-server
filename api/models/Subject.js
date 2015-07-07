/**
* Subject
*
* @class Subject
* @description Model representation of a subject
* @docs        http://sailsjs.org/#!documentation/models
*/

(function() {
var HateoasService = require('../services/HateoasService.js');
var _ = require('lodash');

module.exports = {
  schema: true,
  attributes: {
    subjectId: {
      type: 'integer',
      autoIncrement: true,
      defaultsTo: 0
    },
    user: {
      model: 'user',
      required: true
    },
    // CCs I am enrolled in as a subject
    collectionCentres: {
      collection: 'collectioncentre',
      via: 'subjects'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  },

  findByStudyName: function(studyName, user, options, cb) {
    Study.findOneByName(studyName)
      .populate('collectionCentres')
      .then(function (study) {
        if (!study) {
          err = new Error();
          err.message = require('util')
            .format('Study with name %s does not exist.', studyName);
          err.status = 404;
          return cb(err);
        }

        this.study = study;
        return study.collectionCentres;
      })
      .then(function (centres) {
        if (user.role !== 'admin') {
          return Subject.findOne(user.id)
            .populate('user')
            .populate('collectionCentres')
            .then(function (subject) {
              if (_.has(subject, 'collectionCentres')) {
                return _.filter(subject.collectionCentres, function (centre) {
                  return _.includes(_.pluck(centres, 'id'), centre.id );
                });
              }
            });
        }
        return centres;
      })
      .then(function (centres) {
        // return all subjects from each study's collection centres
        return Promise.all(
          _.map(centres, function (centre) {
            return CollectionCentre.findOne(centre.id).populate('subjects');
          })
        );
      })
      .then(function (centres) {
        var centreIds = _.pluck(centres, 'id');
        var subjects = _.uniq(_.flattenDeep(_.pluck(centres, 'subjects')), 'id');
        return Promise.all(
          _.map(subjects, function (subject) {
            return Subject.findOne(subject.id).populate('user').populate('collectionCentres');
          })
        );
      })
      .then(function (subjects) {
        _.map(subjects, function (subject) {
          _.merge(subject, Utils.User.extractUserFields(subject.user));
          delete subject.user;
        });
        return subjects;
      })
      // .then(function (subjects) {
      //   // TODO: FIX THIS - unable to query on populated values
      //   var query = _.cloneDeep(options);
      //   query.where = query.where || {};
      //   delete query.where.name;

      //   this.subjects = _.pluck(subjects, 'id');
      //   return User.find(query).populate('person');
      // })
      // .then(function (subjects) {
      //   return Utils.User.populateUsers(subjects);
      // })
      // .then(function (subjects) {
      //   return _.filter(subjects, function (user) {
      //     return _.includes(this.subjects, user.id);
      //   });
      // })
      .then(function (subjects) {
        cb(false, subjects);
      })
      .catch(cb);
  },

  beforeValidate: function(subject, cb) {
    //Auto increment workaround
    Subject.findOne({ where: {"study": subject.study},
      sort:'studyId DESC' } )
        .exec(function(err, lastSubject){
          if (err) return err;
          subject.studyId = (lastSubject && lastSubject.studyId ?
            lastSubject.studyId + 1 : 1);
          cb();
        });
  }
};

}());
