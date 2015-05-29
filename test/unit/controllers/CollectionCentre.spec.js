 /**
 * Test File: Testing CollectionCentreController
 * File Location: test/controllers/CollectionCentreController.spec.js
 */

var CollectionCentreController = require('../../../api/controllers/CollectionCentreController');

describe('The CollectionCentre Controller', function () {

	var agent, adminUserId, studyId, cc1Id, cc2Id;

	describe('User with Admin Role', function () {
		
		before(function(done) {
			auth.authenticate('admin', function(loginAgent, resp) {
				agent = loginAgent;
				resp.statusCode.should.be.exactly(200);
				adminUserId = JSON.parse(resp.text).id;

				Study.create({
					name: 'LEAP-CC',
					reb: 100,
					users: [coordinatorUserId]
				})
				.then(function (res) {
					studyId = res.id;
					return res.id;
				})
				.then(function (sid) {
					CollectionCentre.create({
						name: 'TWH',
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
				Study.destroy(studyId).exec(function (err, cc) {
					if (err) return done(err);
					auth.logout(done);	
				});
			});			
		});

		describe('find()', function () {
			it('should be able to read all collection centres', function (done) {
				var req = request.get('/api/collectioncentre');
				agent.attachCookies(req);
				req.set('Accept', 'application/collection+json')
					.expect('Content-Type', 'application/collection+json; charset=utf-8')
					.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items[0].name.should.equal('TWH');
						collection.count.should.equal(1);
						done(err);
					});
			});

			it('should retrieve a saved collection centre form href from the workflowstate', function (done) {
				var req = request.get('/api/collectioncentre');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.template.should.have.property('href');
						done(err);
					});
			});

			it('should return collection centre summary totals', function (done) {
				var req = request.get('/api/study/LEAP-CC');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.centreSummary[0].id.should.equal(cc1Id);
						done(err);
					});
			});
		});

		describe('findOne()', function () {
			it('should be able to retrieve a specific collection centre', function (done) {
				var req = request.get('/api/collectioncentre/' + cc1Id);
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.name.should.equal('TWH');
						done(err);
					});				
			});

			it('should return a 404 if study does not exist', function (done) {
				var req = request.get('/api/collectioncentre/12345');
				agent.attachCookies(req);
				req.expect(404)
					.end(function (err, res) {
						done(err);
					});				
			});
		});

		describe('create()', function () {
			
			before(function (done) {
				CollectionCentre.findOne({name: 'TGH'})
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
				var req = request.post('/api/collectioncentre');
				agent.attachCookies(req);

				req.send({
						name: 'TGH',
						study: studyId
					})
					.expect(201)
					.end(function(err, res) {
						var collection = JSON.parse(res.text);
						cc2Id = collection.id;
						collection.name.should.equal('TGH');
						done(err);
					});
			});

			it('should return an error if collection name exists in study already', function (done) {
				var req = request.post('/api/collectioncentre');
				agent.attachCookies(req);

				req.send({
						name: 'TWH',
						study: studyId
					})
					.expect(400)
					.end(function(err) {
						done(err);
					});
			});

			it('should return an error if a collection centre maps to an invalid study', function (done) {
				var req = request.post('/api/collectioncentre');
				agent.attachCookies(req);

				req.send({
						name: 'TGH',
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
				var req = request.put('/api/collectioncentre/' + cc2Id);
				agent.attachCookies(req);

				req.send({ name: 'TGH-2' })
					.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items[0].name.should.equal('TGH-2');
						done(err);
					});
			});

			it('should not be able to switch study of collection centre', function (done) {
				 var req = request.put('/api/collectioncentre/' + cc2Id);
 				agent.attachCookies(req);

 				req.send({ study: 1234 })
 					.expect(200)
 					.end(function (err, res) {
 						var collection = JSON.parse(res.text);
 						collection.items[0].study.should.not.equal(1234);
 						done(err);
 					});
			});

			it('should be able to add users to this collection centre', function (done) {
				var req = request.put('/api/collectioncentre/' + cc2Id);
 				agent.attachCookies(req);

 				req.send({ coordinators: [adminUserId, coordinatorUserId] })
 					.expect(200)
 					.end(function (err, res) {
 						CollectionCentre.findOne(cc2Id).populate('coordinators')
 						.exec(function (err, centres) {
 							centres.coordinators[0].username.should.equal('admin');
 							centres.coordinators[1].username.should.equal('coordinator');
 							done(err);
 						});
 					});
			});

			it('should be able to add subjects to this collection centre', function (done) {
				done();
			});

			it('should be able to remove users from this collection centre', function (done) {
				var req = request.put('/api/collectioncentre/' + cc2Id);
 				agent.attachCookies(req);

 				req.send({ coordinators: [coordinatorUserId] })
 					.expect(200)
 					.end(function (err, res) {
 						CollectionCentre.findOne(cc2Id).populate('coordinators')
 						.exec(function (err, centres) {
 							centres.coordinators[0].username.should.equal('coordinator');
 							done(err);
 						});
 					});
			});

			it('should be able to remove subjects from this collection centre', function (done) {
				done();
			});
		});

		describe('delete()', function() {
			it('should set expiredAt flag to now, but persist in system', function (done) {
				done();
			});
		});
	});
});