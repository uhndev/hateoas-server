                                                                                                      /**
 * Test File: Testing UserController
 * File Location: test/controllers/UserController.spec.js
 *
 * Tests the following routes:
	'get /api/user'         : 'UserController.getAll',
	'put /api/user/:id'     : 'UserController.update',
	'post /api/user'        : 'UserController.create'
 */

var UserController = require('../../../api/controllers/UserController');
var Promise = require('bluebird');

describe('The User Controller', function () {

	var study1, cc1Id, cc2Id, cc3Id, enrollment1, enrollment2, enrollment3;

	describe('User with Admin Role', function () {

		before(function(done) {
			auth.authenticate('admin', function(resp) {
				resp.statusCode.should.be.exactly(200);
				globals.users.adminUserId = JSON.parse(resp.text).user.id;

				Study.create({
					name: 'USER-LEAP-ADMIN',
					reb: 100
				})
				.then(function (study) {
					study1 = study.id;
					return Promise.all([
            CollectionCentre.create({
  						name: 'USER-LEAP-ADMIN-TWH',
  						reb: 200,
  						study: study1
  					}),
            CollectionCentre.create({
              name: 'USER-LEAP-ADMIN-TGH',
              reb: 300,
              study: study1
            })
          ]);
				})
				.spread(function (centre1, centre2) {
					cc1Id = centre1.id;
					cc2Id = centre2.id;
					return Study.create({
						name: 'USER-LEAP2-ADMIN',
						reb: 200
					});
				})
				.then(function (study) {
					study2 = study.id;
					return CollectionCentre.create({
						name: 'USER-LEAP2-ADMIN-TWH',
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

		after(function(done) {
			auth.logout(done);
		});

		describe('find()', function () {
			it('should be able to read all users', function (done) {
				request.get('/api/user')
					.set('Authorization', 'Bearer ' + globals.token)
					.set('Accept', 'application/collection+json')
					.expect('Content-Type', 'application/collection+json; charset=utf-8')
					.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.length.should.equal(3);
						done(err);
					});
			});

			it('should modify response to include extracted person fields', function (done) {
				request.get('/api/user')
					.set('Authorization', 'Bearer ' + globals.token)
					.set('Accept', 'application/collection+json')
					.expect('Content-Type', 'application/collection+json; charset=utf-8')
					.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						_.all(collection.items.slice(1), function(item) {
							return _.has(item, 'prefix') && _.has(item, 'firstname') && _.has(item, 'lastname')
						}).should.be.ok;
						done(err);
					});
			});
		});

		describe('create()', function () {
			it('should be able to create a new user and set appropriate permissions', function (done) {
				request.post('/api/user')
					.set('Authorization', 'Bearer ' + globals.token)
					.set('Accept', 'application/collection+json')
					.expect('Content-Type', 'application/collection+json; charset=utf-8')
					.send({
						username: 'coordinator2',
						email: 'coordinator2@example.com',
						password: 'coordinator21234',
						group: 'coordinator',
						prefix: 'Ms.',
						firstname: 'Coord',
						lastname: 'Inator'
					})
					.expect(200)
					.end(function(err, res) {
						var collection = JSON.parse(res.text);
						globals.users.coordinator2 = collection.items.id;
						collection.items.username.should.equal('coordinator2');
						User.findOneByUsername('coordinator2').populate('roles').then(function (user) {
							done(err);
						});
					});
			});

			it('should return bad request if missing group', function (done) {
				request.post('/api/user')
					.set('Authorization', 'Bearer ' + globals.token)
					.send({
						username: 'subject',
						email: 'subject@example.com',
						password: 'subject1234',
						prefix: 'Mr.',
						firstname: 'Test',
						lastname: 'Subject'
					})
					.expect(400)
					.end(function(err, res) {
						done(err);
					});
			});

			it('should return an error if a user already exists', function (done) {
				request.post('/api/user')
					.set('Authorization', 'Bearer ' + globals.token)
					.send(auth.credentials.subject.create)
					.expect(400)
					.end(function(err, res) {
						done(err);
					});
			});

			it('should return bad request if given group DNE', function (done) {
				request.post('/api/user')
					.set('Authorization', 'Bearer ' + globals.token)
					.send({
						username: 'newuser',
						email: 'newuser@example.com',
						password: 'user1234',
						group: '12345',
						prefix: 'Mrs.',
						firstname: 'Qwer',
						lastname: 'Ty'
					})
					.expect(400)
					.end(function(err, res) {
						done(err);
					});
			});
		});

    describe('delete()', function() {
      var uID, ueID;

      beforeEach(function (done) {
        request.post('/api/user')
          .set('Authorization', 'Bearer ' + globals.token)
          .set('Accept', 'application/collection+json')
          .expect('Content-Type', 'application/collection+json; charset=utf-8')
          .send({
            username: 'tempuser',
            email: 'tempuser@example.com',
            password: 'tempuser1234',
            group: 'coordinator',
            prefix: 'Mr.',
            firstname: 'Temp',
            lastname: 'User'
          })
          .expect(200)
          .end(function(err, res) {
            var collection = JSON.parse(res.text);
            uID = collection.items.id;
            UserEnrollment.create({
              user: uID,
              collectionCentre: cc1Id,
              centreAccess: 'coordinator'
            }).then(function (enrollment) {
              ueID = enrollment.id;
              done(err);
            });
          });
      });

      afterEach(function (done) {
        UserEnrollment.destroy(ueID).exec(function (err, destroyed) {
          User.destroy(uID).exec(function (err, destroyed) {
            done(err);
          });
        });
      });

      it('should set expiredAt flag to now and propagate expiry to any enrollments', function (done) {
        request.del('/api/user/' + uID)
          .set('Authorization', 'Bearer ' + globals.token)
          .send()
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            UserEnrollment.findOne(ueID).exec(function (err, enrollment) {
              enrollment.expiredAt.should.be.truthy;
              done(err);
            });
          });
      });

    });

		describe('allow correct headers', function() {
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

 	describe('User with Coordinator Role', function() {
		before(function(done) {
			auth.authenticate('coordinator', function(resp) {
				resp.statusCode.should.be.exactly(200);
				done();
			});
		});

		after(function(done) {
			auth.logout(done);
		});

		describe('find()', function () {
			it.skip('should be able to list all coordinators my collection centres', function (done) {
				// TODO
				done();
			});
		});

		describe('findOne()', function () {
			it('should be able to read self user', function (done) {
				request.get('/api/user/' + globals.users.coordinatorUserId)
					.set('Authorization', 'Bearer ' + globals.token)
					.expect(200)
					.end(function (err, res) {
						done(err);
					});
			});

			it.skip('should be able to access a user only if they are in my collection centre', function (done) {
				// TODO
				done();
			});

			it.skip('should not be able to access a user not in my collection centre', function (done) {
				// TODO
				done();
			});
		});

		describe('create()', function () {
			it.skip('should only be able to create new user in collection centres I am part of', function (done) {
				// TODO
				done();
			});

			it.skip('should return bad request if trying to creating user with admin role', function (done) {
				// TODO
				done();
			});

			it.skip('should only be able to create new user with coordinator or interviewer role', function (done) {
				// TODO
				done();
			});
		});

		describe('update()', function() {
			it.skip('should only be able to update self', function (done) {
				// TODO
				done();
			});

			it.skip('should not be able to update role', function (done) {
				// TODO
				done();
			});
		});

		describe('delete()', function() {
			it('should not be able to delete users', function (done) {
				request.del('/api/user/' + globals.users.coordinator2)
					.set('Authorization', 'Bearer ' + globals.token)
					.send().expect(403).end(function (err) {
					done(err);
				})
			});
		});
 	});

 	describe('User with Interviewer Role', function() {
		before(function(done) {
			auth.authenticate('interviewer', function(resp) {
				resp.statusCode.should.be.exactly(200);
				done();
			});
		});

		after(function(done) {
			auth.logout(done);
		});

		describe('find()', function () {
			it.skip('should not be able to see other coordinators not in my collection centres', function (done) {
				done();
			});
		});

		describe('findOne()', function () {
			it.skip('should be able to read self user', function (done) {
        done();
			});

			it.skip('should not be able to access a user not in my collection centre', function (done) {
				done();
			});
		});

		describe('create()', function () {
			it('should not be able to create a new user', function (done) {
				request.post('/api/user')
					.set('Authorization', 'Bearer ' + globals.token)
					.set('Accept', 'application/json')
					.expect('Content-Type', 'application/json; charset=utf-8')
					.send({
						username: 'newuser1',
						email: 'newuser1@example.com',
						password: 'lalalal1234',
						group: 'interviewer'
					})
					.expect(403)
					.end(function (err, res) {
						done(err);
					});
			});
		});

		describe('update()', function() {
			it('should be able to update themselves', function (done) {
				request.put('/api/user/' + globals.users.interviewerUserId)
					.set('Authorization', 'Bearer ' + globals.token)
					.send({ email: 'interviewerupdated@example.com' })
					.expect(200)
					.end(function (err, res) {
						done(err);
					});
			});

			it('should not be able to update another user', function (done) {
				request.put('/api/user/' + globals.users.adminUserId)
					.set('Authorization', 'Bearer ' + globals.token)
					.send({ email: 'crapadminemail@example.com' })
					.expect(403)
					.end(function (err, res) {
						done(err);
					});
			});

			it.skip('should not be able to update role', function (done) {
				// TODO
				done();
			});

			it.skip('should not be able to update centreAccess', function (done) {
				// TODO
				done();
			});
		});

		describe('delete()', function() {
			it('should not be able to delete users', function (done) {
				request.del('/api/user/' + globals.users.coordinator2)
					.set('Authorization', 'Bearer ' + globals.token)
					.send().expect(403).end(function (err) {
						done(err);
					});
			});
		});
 	});

	describe('User with Subject Role', function () {

		before(function(done) {
			auth.authenticate('subject', function(resp) {
				resp.statusCode.should.be.exactly(200);
				done();
			});
		});

		after(function(done) {
			auth.authenticate('admin', function(resp) {
				request.del('/api/user/' + globals.users.coordinator2)
					.set('Authorization', 'Bearer ' + globals.token)
					.send().expect(200).end(function (err, res) {
						auth.logout(done);
					});
			});
		});

		describe('find()', function() {
			it('should only be able to read self user', function (done) {
				request.get('/api/user')
					.set('Authorization', 'Bearer ' + globals.token)
					.expect(200)
					.end(function (err, res) {
						done(err);
					});
			});
		});

		describe('create()', function () {
			it('should not be able to create a new user', function (done) {
				request.post('/api/user')
					.set('Authorization', 'Bearer ' + globals.token)
					.set('Accept', 'application/json')
					.expect('Content-Type', 'application/json; charset=utf-8')
					.send({
						username: 'newuser1',
						email: 'newuser1@example.com',
						password: 'lalalal1234',
						group: 'subject'
					})
					.expect(403)
					.end(function (err, res) {
						done(err);
					});
			});
		});

		describe('update()', function () {
			it('should be able to update themselves', function (done) {
				request.put('/api/user/' + globals.users.subjectUserId)
					.set('Authorization', 'Bearer ' + globals.token)
					.send({ email: 'subjectupdated@example.com' })
					.expect(200)
					.end(function (err, res) {
						done(err);
					});
			});

			it('should not be able to update another user', function (done) {
				request.put('/api/user/' + globals.users.adminUserId)
					.set('Authorization', 'Bearer ' + globals.token)
					.send({ email: 'crapadminemail@example.com' })
					.expect(403)
					.end(function (err, res) {
						done(err);
					});
			});

			it('should not be able to update role', function (done) {
				// TODO
				done();
			});

			it('should not be able to update centreAccess', function (done) {
				// TODO
				done();
			});
		});

		describe('delete()', function() {
			it('should not be able to delete users', function (done) {
				request.del('/api/user/' + globals.users.coordinator2)
					.set('Authorization', 'Bearer ' + globals.token)
					.send().expect(403).end(function (err) {
					done(err);
				})
			});
		});
	});

});
