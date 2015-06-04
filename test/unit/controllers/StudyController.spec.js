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

var StudyController = require('../../../api/controllers/StudyController');

describe('The Study Controller', function () {

	var agent, study1, study2, study3, cc1Id, cc2Id;

	describe('User with Admin Role', function () {
		
		before(function(done) {
			auth.authenticate('admin', function(loginAgent, resp) {
				agent = loginAgent;
				resp.statusCode.should.be.exactly(200);
				globals.users.adminUserId = JSON.parse(resp.text).id;

				Study.create({
					name: 'STUDY-LEAP-ADMIN',
					reb: 100,
					users: [globals.users.coordinatorUserId]
				})
				.then(function (res) {
					study1 = res.id;
					done();
				});
			});
		});

		after(function(done) {
			Study.destroy(study1).exec(function (err, study) {
				Study.destroy(study2).exec(function (err, study) {
					if (err) return done(err);
					auth.logout(done);		
				});				
			});
		});

		describe('find()', function () {
			it('should be able to read all studies', function (done) {
				var req = request.get('/api/study');
				agent.attachCookies(req);
				req.set('Accept', 'application/collection+json')
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
				var req = request.get('/api/study');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.template.should.have.property('href');
						done(err);
					});
			});
		});

		describe('findOne()', function () {
			it('should be able to retrieve a specific study by name', function (done) {
				var req = request.get('/api/study/STUDY-LEAP-ADMIN');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.name.should.equal('STUDY-LEAP-ADMIN');
						done(err);
					});				
			});

			it('should return a 404 if study does not exist', function (done) {
				var req = request.get('/api/study/DNE');
				agent.attachCookies(req);
				req.expect(404)
					.end(function (err, res) {
						done(err);
					});				
			});

			it('should retrieve a saved subject form href from the workflowstate', function (done) {
				var req = request.get('/api/study/STUDY-LEAP-ADMIN/subject');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.template.should.have.property('href');
						done(err);
					});					
			});

			it('should retrieve a saved user form href from the workflowstate', function (done) {
				var req = request.get('/api/study/STUDY-LEAP-ADMIN/user');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.template.should.have.property('href');
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
				var req = request.post('/api/study');
				agent.attachCookies(req);

				req.send({
						name: 'STUDY-LEAP-HIP-ADMIN',
						reb: 100,
						users: [globals.users.adminUserId, globals.users.coordinatorUserId]
					})
					.expect(201)
					.end(function(err, res) {
						var collection = JSON.parse(res.text);
						study2 = collection.id;
						collection.name.should.equal('STUDY-LEAP-HIP-ADMIN');
						done(err);
					});
			});

			it('should return an error if a study already exists', function (done) {
				var req = request.post('/api/study');
				agent.attachCookies(req);

				req.send({
						name: 'STUDY-LEAP-HIP-ADMIN',
						reb: 100,
						users: [globals.users.adminUserId]
					})
					.expect(500)
					.end(function(err) {
						done(err);
					});
			});
		});

		describe('update()', function() {
			it('should be able to update study name', function(done) {
				var req = request.put('/api/study/' + study2);
				agent.attachCookies(req);

				req.send({ name: 'STUDY-LEAP-HIP2-ADMIN', reb: 201 })
					.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.name.should.equal('STUDY-LEAP-HIP2-ADMIN');
						collection.items.reb.should.equal('201');
						done(err);
					});
			});

			it('should be able to set no users to a study', function(done) {
				var req = request.put('/api/study/' + study2);
				agent.attachCookies(req);

				req.send({ users: [] })
					.expect(200)
					.end(function (err, res) {
						done(err);
					});
			});			

			it('should be able to update users of study', function(done) {
				var req = request.put('/api/study/' + study2);
				agent.attachCookies(req);
				req.send({ users: [globals.users.adminUserId, globals.users.interviewerUserId] })
					.expect(200)
					.end(function (err, res) {
						Study.findOne(study2).populate('users')
							.then(function (data) {
								data.users[0].username.should.equal('admin');
								data.users[1].username.should.equal('interviewer');
								done(err);
							});
					});
			});					
		});

		describe('allow correct headers', function() {
			it('should return full CRUD access for /api/study', function (done) {
				var req = request.get('/api/study');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var headers = res.headers['allow'];
						headers.should.equal('read,create,update,delete');
						done(err);
					});
			});

			it('should return full CRUD access for /api/study/:name', function (done) {
				var req = request.get('/api/study/STUDY-LEAP-ADMIN');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var headers = res.headers['allow'];
						headers.should.equal('read,create,update,delete');
						done(err);
					});				
			});
		}); 
	});

	describe('User with Coordinator/Interviewer Role', function () {
		before(function(done) {
			auth.authenticate('coordinator', function(loginAgent, resp) {
				agent = loginAgent;
				resp.statusCode.should.be.exactly(200);

				Study.create({
					name: 'STUDY-LEAP-COORD',
					reb: 100,
					users: [globals.users.coordinatorUserId]
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
					var access = {};
					access[cc1Id] = globals.roles.coordinatorRoleId;
					return User.update({id: globals.users.coordinatorUserId}, {
						centreAccess: access,
						isAdding: true,
						collectionCentres: [cc1Id]
					});
				})
				.then(function (centre) {
					var access = {};
					access[cc2Id] = globals.roles.interviewerRoleId;
					return User.update({id: globals.users.interviewerUserId}, {
						centreAccess: access,
						isAdding: true,
						collectionCentres: [cc2Id]
					});
				})
				.then(function (user) {
					done();	
				})
				.catch(done);
			});
		});

		after(function(done) {
			auth.logout(done);
			// User.update({id: globals.users.coordinatorUserId}, {
			// 	centreAccess: {},
			// 	isAdding: false,
			// 	collectionCentres: [cc1Id]
			// })
			// .then(function (user) {
			// 	return User.update({id: globals.users.interviewerUserId}, {
			// 		centreAccess: {},
			// 		isAdding: false,
			// 		collectionCentres: [cc2Id]
			// 	})
			// })
			// .then(function (user) {
			// 	return CollectionCentre.destroy(cc1Id);
			// })
			// .then(function (cc) {
			// 	return Study.destroy(study3);
			// })
			// .then(function (study) {
			// 	auth.logout(done);
			// })
			// .catch(done);
		});

		describe('find()', function () {
			it('should be able to see studies where he/she is associated with a CC', function (done) {
				var req = request.get('/api/study');
				agent.attachCookies(req);
				req.expect(200)
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
				var req = request.get('/api/study/STUDY-LEAP-COORD');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.name.should.equal('STUDY-LEAP-COORD');
						done(err);
					});				
			});

			it('should not be able to retrieve a specific study by name if not associated to a CC', function (done) {
				var req = request.get('/api/study/STUDY-LEAP-COORD');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.name.should.equal('STUDY-LEAP-COORD');
						done(err);
					});				
			});			

			it('should return a 404 if study does not exist', function (done) {
				var req = request.get('/api/study/DNE');
				agent.attachCookies(req);
				req.expect(404)
					.end(function (err, res) {
						done(err);
					});				
			});

			it('should retrieve a saved subject form href from the workflowstate', function (done) {
				var req = request.get('/api/study/STUDY-LEAP-COORD/subject');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.template.should.have.property('href');
						done(err);
					});					
			});

			it('should retrieve a saved user form href from the workflowstate', function (done) {
				var req = request.get('/api/study/STUDY-LEAP-COORD/user');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.template.should.have.property('href');
						done(err);
					});					
			});	
		});

		describe('create()', function () {
			it('should not be able to create studies', function(done) {
				// TODO				
				done();
			});
		});

		describe('update()', function() {
			it('should not be able to update studies', function(done) {
				// TODO				
				done();
			})
		});

		describe('allow correct headers', function() {
			it('should only allow read access for /api/study', function (done) {
				var req = request.get('/api/study');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var headers = res.headers['allow'];
						headers.should.equal('read');
						done(err);
					});
			});

			it('should only allow read access for /api/study/:name', function (done) {
				var req = request.get('/api/study/STUDY-LEAP-COORD');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var headers = res.headers['allow'];
						headers.should.equal('read');
						done(err);
					});				
			});
		});
	});

	describe('User with Subject Role', function () {

		before(function(done) {
			auth.authenticate('subject', function(loginAgent, resp) {
				agent = loginAgent;
				resp.statusCode.should.be.exactly(200);
				done();
			});
		});

		after(function(done) {
			auth.logout(done);
		});

		describe('find()', function() {
			it('should be able to see studies where he/she is associated with a CC', function (done) {
				// TODO
				done();
			});
		});

		describe('findOne()', function() {
			it('should be allowed access to study he/she is associated with via enrollment in CC', function (done) {
				// var req = request.get('/api/study/LEAP2');
				// agent.attachCookies(req);
				// req.expect(200)
				// 	.end(function (err, res) {
				// 		var collection = JSON.parse(res.text);
				// 		collection.items.name.should.equal('LEAP2');
				// 		done(err);
				// 	});
				done();
			});

			it('should not be allowed access to restricted study', function (done) {
				var req = request.get('/api/study/STUDY-LEAP-COORD');
				agent.attachCookies(req);
				req.expect(403)
					.end(function (err, res) {
						done(err);
					});
			});
		});

		describe('create()', function () {
			it('should not be able to create a new study', function (done) {
				var req = request.post('/api/study');
				agent.attachCookies(req);
				
				req.set('Accept', 'application/json')
					.expect('Content-Type', 'application/json; charset=utf-8')
					.send({
						name: 'LEAPSUBJECT',
						reb: 100,
						users: [globals.users.coordinatorUserId]
					})
					.expect(400)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.error.should.equal('User subject@example.com is not permitted to POST ');
						done(err);
					});
			});
		});

		describe('update()', function () {
			it('should not be able to update study', function (done) {
				var req = request.put('/api/study/' + study2);
				agent.attachCookies(req);

				req.send({ reb: 2000 })
					.expect(400)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.error.should.equal('User subject@example.com is not permitted to PUT ');
						done(err);
					});
			});
		});

		describe('allow correct headers', function() {
			it('should only allow read access for /api/study', function (done) {
				var req = request.get('/api/study');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var headers = res.headers['allow'];
						headers.should.equal('read');
						done(err);
					});
			});

			it('should only allow read access for /api/study/:name', function (done) {
				// var req = request.get('/api/study/LEAP');
				// agent.attachCookies(req);
				// req.expect(200)
				// 	.end(function (err, res) {
				// 		var headers = res.headers['allow'];
				// 		headers.should.equal('read');
				// 		done(err);
				// 	});		
				done();		
			});			
		});
	});

});