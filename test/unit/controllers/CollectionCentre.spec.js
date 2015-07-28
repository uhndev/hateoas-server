 /**
 * Test File: Testing CollectionCentreController
 * File Location: test/controllers/CollectionCentreController.spec.js
 */

var CollectionCentreController = require('../../../api/controllers/CollectionCentreController');

describe('The CollectionCentre Controller', function () {

	var study1, cc1Id, cc2Id;

	describe('User with Admin Role', function () {

		before(function(done) {
			auth.authenticate('admin', function(resp) {
				resp.statusCode.should.be.exactly(200);
				globals.users.adminUserId = JSON.parse(resp.text).user.id;

				Study.create({
					name: 'CC-LEAP-ADMIN',
					reb: 100,
					administrator: globals.users.coordinatorUserId,
					pi: globals.users.coordinatorUserId
				})
				.then(function (res) {
					study1 = res.id;
					return res.id;
				})
				.then(function (sid) {
					CollectionCentre.create({
						name: 'CC-LEAP-ADMIN-TWH',
						study: sid
					}).then(function (cc) {
						cc1Id = cc.id;
						done();
					});
				});
			});
		});

		after(function(done) {
			CollectionCentre.destroy(cc1Id).exec(function (err, cc) {
				Study.destroy(study1).exec(function (err, cc) {
					if (err) return done(err);
					auth.logout(done);
				});
			});
		});

		describe('find()', function () {
			it('should be able to read all collection centres', function (done) {
				request.get('/api/collectioncentre')
					.set('Authorization', 'Bearer ' + globals.token)
					.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items[0].name.should.equal('CC-LEAP-ADMIN-TWH');
						collection.count.should.equal(1);
						done(err);
					});
			});

			it('should retrieve a saved collection centre form href from the workflowstate', function (done) {
				request.get('/api/collectioncentre')
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
			it('should be able to retrieve a specific collection centre', function (done) {
				request.get('/api/collectioncentre/' + cc1Id)
					.set('Authorization', 'Bearer ' + globals.token)
					.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.name.should.equal('CC-LEAP-ADMIN-TWH');
						done(err);
					});
			});

			it('should return a 404 if study does not exist', function (done) {
				request.get('/api/collectioncentre/12345')
					.set('Authorization', 'Bearer ' + globals.token)
					.expect(404)
					.end(function (err, res) {
						done(err);
					});
			});
		});

		describe('create()', function () {

			before(function (done) {
				CollectionCentre.findOne({name: 'CC-LEAP-ADMIN-TGH'})
					.exec(function (err, centre) {
						_.isUndefined(centre).should.be.true;
						done();
					});
			});

			after(function (done) {
				CollectionCentre.find().exec(function (err, centres) {
					centres.length.should.equal(2);
					done();
				});
			});

			it('should be able to create a new collection centre', function (done) {
				request.post('/api/collectioncentre')
					.set('Authorization', 'Bearer ' + globals.token)
					.send({
						name: 'CC-LEAP-ADMIN-TGH',
						contact: globals.users.coordinatorUserId,
						study: study1
					})
					.expect(201)
					.end(function(err, res) {
						var collection = JSON.parse(res.text);
						cc2Id = collection.id;
						collection.name.should.equal('CC-LEAP-ADMIN-TGH');
						done(err);
					});
			});

			it('should return an error if collection name exists in study already', function (done) {
				request.post('/api/collectioncentre')
					.set('Authorization', 'Bearer ' + globals.token)
					.send({
						name: 'CC-LEAP-ADMIN-TWH',
						study: study1
					})
					.expect(400)
					.end(function(err) {
						done(err);
					});
			});

			it('should return an error if a collection centre maps to an invalid study', function (done) {
				request.post('/api/collectioncentre')
					.set('Authorization', 'Bearer ' + globals.token)
					.send({
						name: 'CC-LEAP-ADMIN-TGH',
						study: 1234
					})
					.expect(400)
					.end(function(err) {
						done(err);
					});
			});
		});

		describe('update()', function() {
			it('should be able to update name of collection centre', function (done) {
				request.put('/api/collectioncentre/' + cc2Id)
					.set('Authorization', 'Bearer ' + globals.token)
					.send({ name: 'CC-LEAP-ADMIN-TGH-2' })
					.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items[0].name.should.equal('CC-LEAP-ADMIN-TGH-2');
						done(err);
					});
			});

			it('should not be able to switch study of collection centre', function (done) {
				request.put('/api/collectioncentre/' + cc2Id)
					.set('Authorization', 'Bearer ' + globals.token)
					.send({ study: 1234 })
 					.expect(200)
 					.end(function (err, res) {
 						var collection = JSON.parse(res.text);
 						collection.items[0].study.should.not.equal(1234);
 						done(err);
 					});
			});

			it('should be able to add users to this collection centre', function (done) {
        // TODO
        done();
			});

			it('should be able to add subjects to this collection centre', function (done) {
				// TODO
				done();
			});

			it('should be able to remove users from this collection centre', function (done) {
				// TODO
	 			done();
			});

			it('should be able to remove subjects from this collection centre', function (done) {
				// TODO
				done();
			});
		});

		describe('delete()', function() {
      var ueID;

      beforeEach(function (done) {
        UserEnrollment.create({
          user: globals.users.coordinatorUserId,
          collectionCentre: cc1Id,
          centreAccess: 'coordinator'
        }).exec(function (err, enrollment) {
          ueID = enrollment.id;
          done(err);
        });
      });

      afterEach(function (done) {
        UserEnrollment.destroy(ueID).exec(function (err, destroyed) {
          done(err);
        });
      });

			it('should set expiredAt flag to now, but persist in system', function (done) {
        request.del('/api/collectioncentre/' + cc1Id)
          .set('Authorization', 'Bearer ' + globals.token)
          .send()
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.items[0].expiredAt.should.be.truthy;
            done(err);
          });
			});

      it('should have marked all associated user enrollments as expired', function (done) {
        request.del('/api/collectioncentre/' + cc1Id)
          .set('Authorization', 'Bearer ' + globals.token)
          .send()
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            UserEnrollment.findOne(ueID).exec(function (err, enroll) {
              enroll.expiredAt.should.be.truthy;
              done(err);
            });
          });
      });

      it('should have marked all associated subject enrollments as expired', function (done) {
        // TODO
        done();
      });
		});
	});
});
