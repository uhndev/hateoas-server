/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#/documentation/concepts/ORM
 */

var Promise = require('bluebird');
module.exports.models = {

  /***************************************************************************
  *                                                                          *
  * Your app's default connection. i.e. the name of one of your app's        *
  * connections (see `config/connections.js`)                                *
  *                                                                          *
  ***************************************************************************/

  // elements in this array will be ignored as Model attributes
  validations: {
    ignoreProperties: ['generator']
  }
/*
  TODO: damn you async javascript
  // max number of fake data to generate for each model
  limits: {
    user: 10,
    subject: 100,
    study: 5,
    collectioncentre: 3,   // per study
    userenrollment: 20,    // total
    subjectenrollment: 20  // per collectioncentre
  },

  populateDB: function() {
    var that = this;
    var userPromises = [];
    var sequence = function(promises) {
      return _.reduce(promises, function (result, promise) {
        return result.then(function() { return sequence(promise); });
      }, Promise.resolve(0));
    };

    for (var userID = 0; userID < that.limits.user; userID++) {
      userPromises.push(User.generateAndCreate());
    }
    Promise.all(userPromises)
      .then(function (createdUsers) {
        sails.log.info('created ' + that.limits.user +  ' users');
        var subjectPromises = [];
        for (var subjectID = 0; subjectID < that.limits.subject; subjectID++) {
          subjectPromises.push(Subject.generateAndCreate());
        }
        return sequence(subjectPromises);
      })
      .then(function (createdSubjects) {
        sails.log.info('created ' + that.limits.subject +  ' subjects');
        var studyPromises = [];
        var subjectCount = 1;
        for (var studyID = 1; studyID <= that.limits.study; studyID++) {
          var study = Study.generate(studyID);
          study.collectionCentres = [];
          for (var centreID = 1; centreID <= that.limits.collectioncentre; centreID++) {
            var collectioncentre = CollectionCentre.generate(centreID);

            //collectioncentre.userEnrollments = [];
            //for (var uID = 1; uID <= that.limits.userenrollment; uID++) {
            //  var userEnrollment = UserEnrollment.generate();
            //  delete userEnrollment.collectionCentre;
            //  collectioncentre.userEnrollments.push(userEnrollment);
            //}

            //collectioncentre.subjectEnrollments = [];
            //for (var sID = 1; sID <= that.limits.subjectenrollment; sID++) {
            //  var subjectEnrollment = SubjectEnrollment.generate(subjectCount++, study, centreID);
            //  collectioncentre.subjectEnrollments.push(subjectEnrollment);
            //}
            study.collectionCentres.push(collectioncentre);
          }
          studyPromises.push(Study.create(study));
        }
        return Promise.all(studyPromises);
      })
      .then(function (createdStudies) {
        sails.log.info('created ' + that.limits.study +  ' studies');
      //  var userEnrollmentPromises = [];
      //  var enrollments = {};
      //  for (var i = 0; i < that.limits.userenrollment; i++) {
      //    var enrollment = UserEnrollment.generate();
      //    if (enrollments['user' + enrollment.user] == enrollment.collectionCentre) {
      //      enrollment = UserEnrollment.generate();
      //    } else {
      //      enrollments['user' + enrollment.user] = enrollment.collectionCentre;
      //      userEnrollmentPromises.push(UserEnrollment.create(enrollment));
      //    }
      //  }
      //  return Promise.all(userEnrollmentPromises);
      //})
      //.then(function (data) {
        sails.log.info('Populate Complete!');
      })
      .catch(function (err) {
        sails.log.error(err);
      });
  }
*/
};
