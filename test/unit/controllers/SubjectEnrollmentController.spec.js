/**
 * Test File: Testing SubjectEnrollmentController
 * File Location: test/controllers/SubjectEnrollmentController.spec.js
 *
 * Tests the following routes:
 'post /api/subjectenrollment'    : 'SubjectController.create'
 */

var Promise = require('bluebird');

describe('The SubjectEnrollment Controller', function () {

  var study1, cc1Id, cc2Id, enrollment1, enrollment2, enrollment3, newUser, newSubject;

  before(function (done) {
    this.timeout(10000);
    auth.authenticate('admin', function (resp) {
      resp.statusCode.should.be.exactly(200);
      globals.users.adminUserId = JSON.parse(resp.text).user.id;

      Study.create({
          name: 'ENROLLMENT-LEAP-ADMIN',
          reb: 100,
          attributes: {
            procedure: ['A', 'B'],
            area: ['C', 'D']
          }
        })
        .then(function (study) {
          study1 = study.id;
          return Promise.all([
            CollectionCentre.create({
              name: 'ENROLLMENT-LEAP-ADMIN-TWH',
              reb: 200,
              study: study1
            }),
            CollectionCentre.create({
              name: 'ENROLLMENT-LEAP-ADMIN-TGH',
              reb: 300,
              study: study1
            })
          ]);
        })
        .spread(function (centre1, centre2) {
          cc1Id = centre1.id;
          cc2Id = centre2.id;
          return Promise.all([
            SubjectEnrollment.create({
              study: study1,
              status: 'ONGOING',
              subject: globals.subjects.subjectId,
              collectionCentre: cc1Id,
              doe: new Date,
              studyMapping: {
                procedure: 'A',
                area: 'C'
              }
            }),
            SubjectEnrollment.create({
              study: study1,
              status: 'ONGOING',
              subject: globals.subjects.subjectId,
              collectionCentre: cc2Id,
              doe: new Date,
              studyMapping: {
                procedure: 'B',
                area: 'D'
              }
            })
          ]);
        })
        .spread(function (e1, e2) {
          enrollment1 = e1;
          enrollment2 = e2;
          done();
        })
        .catch(done);
    });
  });

  after(function (done) {
    Study.destroy({id: study1})
      .then(function () {
        auth.logout(done);
      })
      .catch(function (err) {
        done(err);
      });
  });

  describe('User with Admin Role', function () {

    before(function (done) {
      auth.authenticate('admin', function (resp) {
        resp.statusCode.should.be.exactly(200);
        globals.users.adminUserId = JSON.parse(resp.text).user.id;
        done();
      });
    });

    after(function (done) {
      SubjectEnrollment.destroy(enrollment3).exec(function (err) {
        Subject.destroy(newSubject).exec(function (err) {
          User.destroy(newUser).exec(function (err) {
            auth.logout(done);
          });
        });
      });
    });

    describe('create()', function () {
      it('should create a new subject, user, and enrollment at a CC', function (done) {
        request.post('/api/subjectenrollment')
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            username: 'testsubject',
            email: 'testsubject@example.com',
            password: 'testsubject1234',
            group: 'subject',
            prefix: 'Mr.',
            firstName: 'Test',
            lastName: 'Subject',
            gender: 'Male',
            dateOfBirth: new Date(),
            study: study1,
            status: 'ONGOING',
            collectionCentre: cc1Id,
            studyMapping: {
              procedure: 'B',
              area: 'D'
            },
            doe: new Date()
          })
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            Subject.findOne(collection.items.subject)
              .exec(function (subjectErr, subject) {
                newUser = subject.user;
                newSubject = subject.id;
                enrollment3 = collection.items.id;
                done(subjectErr || err);
              });
          });
      });
    });

    describe('find()', function () {
      it('should show subject enrollments in given study', function (done) {
        request.get('/api/study/' + study1 + '/subjects')
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            _.pluck(collection.items, 'subject').should.containEql(newSubject);
            done(err);
          });
      });

      it('should show correct count based on study', function (done) {
        request.get('/api/study/' + study1 + '/subjects')
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.total.should.equal(3);
            done(err);
          });
      });
    });

  });

  describe('User with Coordinator Role', function () {
    before(function (done) {
      auth.authenticate('coordinator', function (resp) {
        resp.statusCode.should.be.exactly(200);
        done();
      });
    });

    after(function (done) {
      auth.logout(done);
    });

    describe('find()', function () {
    });

    describe('findOne()', function () {
    });

    describe('create()', function () {
    });

    describe('update()', function () {
    });

    describe('delete()', function () {
    });
  });

  describe('User with Subject Role', function () {

    before(function (done) {
      auth.authenticate('subject', function (resp) {
        resp.statusCode.should.be.exactly(200);
        done();
      });
    });

    after(function (done) {
      auth.logout(done);
    });

    describe('find()', function () {
    });

    describe('create()', function () {
    });

    describe('update()', function () {
    });

    describe('delete()', function () {
    });

  });

});
