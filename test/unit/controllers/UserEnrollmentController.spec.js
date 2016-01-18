/**
 * Test File: Testing UserEnrollmentController
 * File Location: test/controllers/UserEnrollmentController.spec.js
 *
 * Tests the following routes:
 'put /api/user/:id/access'       : 'UserController.updateAccess',
 'put /api/userenrollment/:id'    : 'UserEnrollmentController.update'
 */

var UserEnrollmentController = require('../../../api/controllers/UserEnrollmentController');
var Promise = require('bluebird');

describe('The UserEnrollment Controller', function () {

  var study1, cc1Id, cc2Id, enrollment1, enrollment2, enrollment3;

  describe('User with Admin Role', function () {

    before(function (done) {
      auth.authenticate('admin', function (resp) {
        resp.statusCode.should.be.exactly(200);
        globals.users.adminUserId = JSON.parse(resp.text).user.id;

        Study.create({
            name: 'ENROLLMENT-LEAP-ADMIN',
            reb: 100
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
            return Study.create({
              name: 'ENROLLMENT-LEAP2-ADMIN',
              reb: 200
            });
          })
          .then(function (study) {
            study2 = study.id;
            return CollectionCentre.create({
              name: 'ENROLLMENT-LEAP2-ADMIN-TWH',
              reb: 200,
              study: study2
            });
          })
          .then(function (centre) {
            cc3Id = centre.id;
            return Promise.all([
              UserEnrollment.create({
                user: globals.users.coordinatorUserId,
                collectionCentre: cc1Id,
                centreAccess: 'coordinator'
              }),
              UserEnrollment.create({
                user: globals.users.interviewerUserId,
                collectionCentre: cc2Id,
                centreAccess: 'interviewer'
              }),
              UserEnrollment.create({
                user: globals.users.interviewerUserId,
                collectionCentre: cc3Id,
                centreAccess: 'interviewer'
              })
            ]);
          })
          .spread(function (e1, e2, e3) {
            enrollment1 = e1;
            enrollment2 = e2;
            enrollment3 = e3;
            done();
          })
          .catch(done);
      });
    });

    after(function (done) {
      Study.destroy({id: study1.id}).exec(function (err) {
        auth.logout(done);
      });
    });

    describe('find()', function () {
    });

    describe('create()', function () {
    });

    describe('update()', function () {

      it('should prevent user from changing role of an enrollment at a CC when user already has a role there', function (done) {
        request.post('/api/userenrollment')
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            centreAccess: 'interviewer',
            user: globals.users.interviewerUserId,
            collectionCentre: cc2Id
          })
          .expect(400)
          .end(function (err, res) {
            done(err);
          });
      });

      it('should prevent user from changing another enrollment to a CC when user already has an enrollment there', function (done) {
        request.post('/api/userenrollment')
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            centreAccess: 'coordinator',
            user: globals.users.interviewerUserId,
            collectionCentre: cc2Id
          })
          .expect(400)
          .end(function (err, res) {
            done(err);
          });
      });

      it('should be able to set enrollments to expired to invalidate them', function (done) {
        request.put('/api/userenrollment/' + enrollment3.id)
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            centreAccess: enrollment3.centreAccess,
            user: enrollment3.user,
            collectionCentre: enrollment3.collectionCentre,
            expiredAt: new Date()
          })
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.items.length.should.equal(1);
            done(err);
          });
      });

      it('should be able to add a user to a collection centre with a role', function (done) {
        request.post('/api/userenrollment')
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            centreAccess: 'coordinator',
            user: globals.users.coordinatorUserId,
            collectionCentre: cc2Id
          })
          .expect(200)
          .end(function (err, res) {
            done(err);
          });
      });

      it('should be able to add a user in a collection centre in another study', function (done) {
        request.post('/api/userenrollment')
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            centreAccess: 'interviewer',
            user: globals.users.interviewerUserId,
            collectionCentre: cc3Id
          })
          .expect(200)
          .end(function (err, res) {
            done(err);
          });
      });

    });

    describe('allow correct headers', function () {
      it('should return full CRUD access for /api/user', function (done) {
        request.get('/api/user')
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var headers = res.headers['allow'];
            headers.should.equal('read,create,update,delete');
            done(err);
          });
      });

      it('should return full CRUD access for /api/user/:id', function (done) {
        request.get('/api/user/' + globals.users.adminUserId)
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var headers = res.headers['allow'];
            headers.should.equal('read,create,update,delete');
            done(err);
          });
      })
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
      it('should not allow coordinator to access a study they are not enrolled at', function (done) {
        request.get('/api/study/' + study2)
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(403)
          .end(function (err, res) {
            done(err);
          });
      });

      it('should not allow coordinator to access a collection centre they are not enrolled at', function (done) {
        request.get('/api/collectioncentre/' + cc3Id)
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(404)
          .end(function (err, res) {
            done(err);
          });
      });
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
