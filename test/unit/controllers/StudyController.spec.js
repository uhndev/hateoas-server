/**
 * Test File: Testing StudyController
 * File Location: test/controllers/StudyController.spec.js
 *
 * Tests the following routes:
 'get /api/study/:name'           : 'StudyController.findOne',
 'get /api/study/:name/subject'   : 'SubjectController.findByStudyName',
 'get /api/study/:name/user'      : 'UserController.findByStudyName',
 'get /api/study/:name/form'      : 'FormController.findByStudyName',
 'get /api/study/:name/encounter' : 'EncounterController.findByStudyName'
 */

describe('The Study Controller', function () {

  var study1, study2, study3, cc1Id, cc2Id;

  describe('User with Admin Role', function () {

    before(function (done) {
      auth.authenticate('admin', function (resp) {
        resp.statusCode.should.be.exactly(200);
        globals.users.adminUserId = JSON.parse(resp.text).user.id;

        Study.create({
            name: 'STUDY-LEAP-ADMIN',
            reb: 100,
            administrator: globals.users.coordinatorUserId,
            pi: globals.users.coordinatorUserId
          })
          .then(function (res) {
            study1 = res.id;
            done();
          });
      });
    });

    after(function (done) {
      Study.destroy(study1).exec(function (err, study) {
        Study.destroy(study2).exec(function (err, study) {
          done(err);
        });
      });
    });

    describe('find()', function () {
      it('should be able to read all studies', function (done) {
        request.get('/api/study')
          .set('Authorization', 'Bearer ' + globals.token)
          .set('Accept', 'application/collection+json')
          .expect('Content-Type', 'application/collection+json; charset=utf-8')
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.items[0].name.should.equal('STUDY-LEAP-ADMIN');
            collection.count.should.equal(1);
            done(err);
          });
      });

      it('should retrieve a saved study form href from the workflowstate', function (done) {
        request.get('/api/study')
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.template.should.have.property('href');
            done(err);
          });
      });
    });

    describe('findOne()', function () {
      it('should return a 404 if study does not exist', function (done) {
        request.get('/api/study/' + 99)
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(404)
          .end(function (err, res) {
            done(err);
          });
      });

      it('should have rel userenrollment in workflowstate template', function (done) {
        request.get('/api/study/' + study1 + '/users')
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.template.rel.should.equal('userenrollment');
            done(err);
          });
      });
    });

    describe('create()', function () {

      before(function (done) {
        Study.findOne({name: 'STUDY-LEAP-HIP-ADMIN'})
          .exec(function (err, study) {
            _.isUndefined(study).should.be.true;
            done();
          });
      });

      after(function (done) {
        Study.find().exec(function (err, studies) {
          studies.length.should.equal(2);
          done();
        });
      });

      it('should be able to create a new study', function (done) {
        request.post('/api/study')
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            name: 'STUDY-LEAP-HIP-ADMIN',
            reb: 100,
            administrator: globals.users.coordinatorUserId,
            pi: globals.users.coordinatorUserId
          })
          .expect(201)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            study2 = collection.id;
            collection.name.should.equal('STUDY-LEAP-HIP-ADMIN');
            done(err);
          });
      });

      it('should return bad request if a study already exists', function (done) {
        request.post('/api/study')
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            name: 'STUDY-LEAP-HIP-ADMIN',
            reb: 100,
            administrator: globals.users.coordinatorUserId,
            pi: globals.users.coordinatorUserId
          })
          .expect(400)
          .end(function (err) {
            done(err);
          });
      });

      it('should return bad request if given study attributes have invalid structure', function (done) {
        request.post('/api/study')
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            name: 'BAD-ATTRIBUTES-STUDY',
            reb: 100,
            attributes: {'test': 'bar', 'foo': 2},
            administrator: globals.users.coordinatorUserId,
            pi: globals.users.coordinatorUserId
          })
          .expect(400)
          .end(function (err) {
            done(err);
          });
      });
    });

    describe('update()', function () {
      it('should be able to update study name', function (done) {
        request.put('/api/study/' + study2)
          .set('Authorization', 'Bearer ' + globals.token)
          .send({name: 'STUDY-LEAP-HIP2-ADMIN', reb: 201})
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.items.name.should.equal('STUDY-LEAP-HIP2-ADMIN');
            collection.items.reb.should.equal('201');
            done(err);
          });
      });

      it('should not be able to update study name to another that already exists', function (done) {
        request.put('/api/study/' + study2)
          .set('Authorization', 'Bearer ' + globals.token)
          .send({name: 'STUDY-LEAP-ADMIN'})
          .expect(500)
          .end(function (err, res) {
            done(err);
          });
      });

      it('should return bad request if given study attributes have invalid structure', function (done) {
        request.post('/api/study/' + study2)
          .set('Authorization', 'Bearer ' + globals.token)
          .send({attributes: {'test': 'bar', 'foo': 2}})
          .expect(400)
          .end(function (err) {
            done(err);
          });
      });

      it('should be able to set no users to a study', function (done) {
        request.put('/api/study/' + study2)
          .set('Authorization', 'Bearer ' + globals.token)
          .send({administrator: null, pi: null})
          .expect(200)
          .end(function (err, res) {
            done(err);
          });
      });

      it('should be able to update users of study', function (done) {
        request.put('/api/study/' + study2)
          .set('Authorization', 'Bearer ' + globals.token)
          .send({administrator: globals.users.adminUserId, pi: globals.users.interviewerUserId})
          .expect(200)
          .end(function (err, res) {
            Study.findOne(study2).populate('administrator').populate('pi')
              .then(function (data) {
                data.administrator.username.should.equal('admin');
                data.pi.username.should.equal('interviewer');
                done(err);
              });
          });
      });
    });

    describe('delete()', function () {
      var studyID, centreID;

      beforeEach(function (done) {
        Study.create({
          name: 'DEL-TEST-STUDY',
          reb: 100
        }).exec(function (err, study) {
          studyID = study.id;
          CollectionCentre.create({
            name: 'TWG',
            study: study.id
          }).exec(function (err, centre) {
            centreID = centre.id;
            done(err);
          });
        });
      });

      afterEach(function (done) {
        CollectionCentre.destroy(centreID).exec(function (err, destroyed) {
          Study.destroy(studyID).exec(function (err, destroyed) {
            done(err);
          });
        });
      });

      it('should set expiredAt flag to now and propagate expiry to collection centres', function (done) {
        request.del('/api/study/' + studyID)
          .set('Authorization', 'Bearer ' + globals.token)
          .send()
          .expect(200)
          .end(function (err, res) {
            Study.findOne(studyID).then(function (study) {
              study.expiredAt.should.be.truthy;
              CollectionCentre.findOne(centreID).exec(function (err, centre) {
                centre.expiredAt.should.be.truthy;
                done(err);
              });
            });
          });
      });

    });

    describe('allow correct headers', function () {
      it('should return full CRUD access for /api/study', function (done) {
        request.get('/api/study')
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var headers = res.headers['allow'];
            headers.should.equal('read,create,update,delete');
            done(err);
          });
      });

      it('should return full CRUD access for /api/study/:name', function (done) {
        request.get('/api/study/' + study1)
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var headers = res.headers['allow'];
            headers.should.equal('read,create,update,delete');
            done(err);
          });
      });
    });
  });

  describe('User with Coordinator/Interviewer Role', function () {
    before(function (done) {
      auth.authenticate('coordinator', function (resp) {
        resp.statusCode.should.be.exactly(200);

        Study.create({
            name: 'STUDY-LEAP-COORD',
            reb: 100,
            administrator: globals.users.coordinatorUserId,
            pi: globals.users.coordinatorUserId
          })
          .then(function (study) {
            study3 = study.id;
            return CollectionCentre.create({
              name: 'STUDY-LEAP-COORD-TWH',
              reb: 200,
              study: study.id
            });
          })
          .then(function (centre) {
            cc1Id = centre.id;
            return CollectionCentre.create({
              name: 'STUDY-LEAP-COORD-TGH',
              reb: 300,
              study: study.id
            });
          })
          .then(function (centre) {
            cc2Id = centre.id;
            return UserEnrollment.create({
              user: globals.users.coordinatorUserId,
              collectionCentre: cc1Id,
              centreAccess: 'coordinator'
            })
            // .then(function (enrollment) {
            //   return User.findOne(globals.users.coordinatorUserId).populate('enrollments')
            //     .then(function (user) {
            //       user.enrollments.add(enrollment.id);
            //       return user.save();
            //     });
            // });
          })
          .then(function (user) {
            return UserEnrollment.create({
              user: globals.users.interviewerUserId,
              collectionCentre: cc2Id,
              centreAccess: 'interviewer'
            })
            // .then(function (enrollment) {
            //   return User.findOne(globals.users.interviewerUserId).populate('enrollments')
            //     .then(function (user) {
            //       user.enrollments.add(enrollment.id);
            //       return user.save();
            //     });
            // });
          })
          .then(function (user) {
            done();
          })
          .catch(done);
      });
    });

    describe('find()', function () {
      it('should be able to see studies where he/she is associated with a CC', function (done) {
        request.get('/api/study')
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.items[0].name.should.equal('STUDY-LEAP-COORD');
            collection.items.length.should.equal(1);
            done(err);
          });
      });
    });

    describe('findOne()', function () {
      it('should be able to retrieve a specific study by name if associated to a CC', function (done) {
        request.get('/api/study/' + study3)
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.items.name.should.equal('STUDY-LEAP-COORD');
            done(err);
          });
      });

      it('should not be able to retrieve a specific study by name if not associated to a CC', function (done) {
        request.get('/api/study/' + study3)
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.items.name.should.equal('STUDY-LEAP-COORD');
            done(err);
          });
      });

      it('should return a 404 if study does not exist', function (done) {
        request.get('/api/study/' + 99)
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(404)
          .end(function (err, res) {
            done(err);
          });
      });

      it('should have rel userenrollment in the workflowstate template', function (done) {
        request.get('/api/study/' + study3 + '/users')
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.template.rel.should.equal('userenrollment');
            done(err);
          });
      });
    });

    describe('create()', function () {
      it('should not be able to create studies', function (done) {
        request.post('/api/study')
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            name: 'TEST',
            reb: 100,
            administrator: globals.users.coordinatorUserId,
            pi: globals.users.coordinatorUserId
          })
          .expect(403)
          .end(function (err, res) {
            done(err);
          });
      });
    });

    describe('update()', function () {
      it('should not be able to update studies', function (done) {
        request.put('/api/study/' + study3)
          .set('Authorization', 'Bearer ' + globals.token)
          .send({
            name: 'TEST'
          })
          .expect(403)
          .end(function (err, res) {
            done(err);
          });
      })
    });

    describe('allow correct headers', function () {
      it('should only allow read access for /api/study', function (done) {
        request.get('/api/study')
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var headers = res.headers['allow'];
            headers.should.equal('read');
            done(err);
          });
      });

      it('should only allow read access for /api/study/:name', function (done) {
        request.get('/api/study/' + study3)
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(200)
          .end(function (err, res) {
            var headers = res.headers['allow'];
            headers.should.equal('read');
            done(err);
          });
      });
    });
  });

  describe('User with Subject Role', function () {

    before(function (done) {
      auth.authenticate('subject', function (resp) {
        resp.statusCode.should.be.exactly(200);
        done();
      });
    });

    describe('find()', function () {

    });

    describe('findOne()', function () {

      it('should not be allowed access to restricted study', function (done) {
        request.get('/api/study/' + study3)
          .set('Authorization', 'Bearer ' + globals.token)
          .expect(403)
          .end(function (err, res) {
            done(err);
          });
      });
    });

    describe('create()', function () {
      it('should not be able to create a new study', function (done) {
        request.post('/api/study')
          .set('Authorization', 'Bearer ' + globals.token)
          .set('Accept', 'application/json')
          .expect('Content-Type', 'application/json; charset=utf-8')
          .send({
            name: 'LEAPSUBJECT',
            reb: 100,
            administrator: globals.users.coordinatorUserId,
            pi: globals.users.coordinatorUserId
          })
          .expect(403)
          .end(function (err, res) {
            done(err);
          });
      });
    });

    describe('update()', function () {
      it('should not be able to update study', function (done) {
        request.put('/api/study/' + study2)
          .set('Authorization', 'Bearer ' + globals.token)
          .send({reb: 2000})
          .expect(403)
          .end(function (err, res) {
            done(err);
          });
      });
    });
  });

});
