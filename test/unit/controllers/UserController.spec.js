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

describe('The User Controller', function () {

	var agent, study1, cc1Id, cc2Id;

	describe('User with Admin Role', function () {

		before(function(done) {
			auth.authenticate('admin', function(loginAgent, resp) {
				agent = loginAgent;
				resp.statusCode.should.be.exactly(200);
				globals.users.adminUserId = JSON.parse(resp.text).id;
				
				Study.create({
					name: 'USER-LEAP-ADMIN',
					reb: 100,
					users: [globals.users.coordinatorUserId]
				})
				.then(function (study) {
					study1 = study.id;
					return CollectionCentre.create({
						name: 'USER-LEAP-ADMIN-TWH',
						reb: 200,
						study: study1
					});
				})
				.then(function (centre) {
					cc1Id = centre.id;
					return CollectionCentre.create({
						name: 'USER-LEAP-ADMIN-TGH',
						reb: 300,
						study: study1
					});
				})			
				.then(function (centre) {
					cc2Id = centre.id;
					return Study.create({
						name: 'USER-LEAP2-ADMIN',
						reb: 200,
						users: [globals.users.coordinatorUserId]
					})
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
					var access = {};
					access[cc1Id] = 'coordinator';
					return User.update({id: globals.users.coordinatorUserId}, {
						centreAccess: access,
						isAdding: true,
						collectionCentres: [cc1Id]
					});
				})
				.then(function (centre) {
					var access = {};
					access[cc2Id] = 'interviewer';
					return User.update({id: globals.users.interviewerUserId}, {
						centreAccess: access,
						isAdding: true,
						collectionCentres: [cc2Id]
					});
				})
				.then(function (centre) {
					var access = {};
					access[cc3Id] = 'interviewer';
					return User.update({id: globals.users.interviewerUserId}, {
						centreAccess: access,
						isAdding: true,
						collectionCentres: [cc3Id]
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
		});

		describe('find()', function () {
			it('should be able to read all users', function (done) {
				var req = request.get('/api/user');
				agent.attachCookies(req);
				req.set('Accept', 'application/collection+json')
					.expect('Content-Type', 'application/collection+json; charset=utf-8')
					.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items[0].username.should.equal('admin');
						collection.items[1].username.should.equal('subject');																		
						collection.items[2].username.should.equal('coordinator');
						collection.items[3].username.should.equal('interviewer');
						done(err);
					});
			});
			
			it('should modify response to include extracted person fields', function (done) {
				var req = request.get('/api/user');
				agent.attachCookies(req);
				req.set('Accept', 'application/collection+json')
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
			it('should be able to create a new user', function (done) {
				var req = request.post('/api/user');
				agent.attachCookies(req);

				req.set('Accept', 'application/collection+json')
					.expect('Content-Type', 'application/collection+json; charset=utf-8')
					.send({
						username: 'coordinator2',
						email: 'coordinator2@example.com',
						password: 'coordinator21234',
						role: 'coordinator',
						prefix: 'Ms.',
						firstname: 'Coord',
						lastname: 'Inator'
					})
					.expect(200)
					.end(function(err, res) {
						var collection = JSON.parse(res.text);
						collection.items.username.should.equal('coordinator2');
						globals.users.coordinator2 = collection.items.id;
						done(err);
					});
			});

			it('should return bad request if missing role', function (done) {
				var req = request.post('/api/user');
				agent.attachCookies(req);

				req.send({
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
				var req = request.post('/api/user');
				agent.attachCookies(req);

				req.send(auth.credentials.subject.create)
					.expect(400)
					.end(function(err, res) {
						done(err);
					});
			});

			it('should set role to subject if given role DNE', function (done) {
				var req = request.post('/api/user');
				agent.attachCookies(req);

				req.send({
						username: 'newuser',
						email: 'newuser@example.com',
						password: 'user1234',
						role: 'qwerty',
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

 		describe('update()', function () {
 			it('should be able to add a user to a collection centre with a role', function (done) {
 				var req = request.put('/api/user/' + globals.users.interviewerUserId);
 				agent.attachCookies(req);
 				var obj = {};
 				obj[cc2Id] = 'interviewer';
 				req.send({
	 					centreAccess: obj,
	 					isAdding: true,
	 					collectionCentres: [cc2Id]
	 				})
 					.expect(200)
 					.end(function (err, res) {
 						var collection = JSON.parse(res.text);
 						collection.items[0].username.should.equal('interviewer');
 						collection.items[0].centreAccess[cc2Id].should.equal('interviewer');
 						done(err);
 					});
 			});

 			it('should be able to add a user in a collection centre in another study', function (done) {
 				var req = request.put('/api/user/' + globals.users.interviewerUserId);
 				agent.attachCookies(req);
 				var obj = {};
 				obj[cc2Id] = 'interviewer';
 				req.send({
	 					centreAccess: obj,
	 					isAdding: true,
	 					collectionCentres: [cc2Id]
	 				})
 					.expect(200)
 					.end(function (err, res) {
 						var collection = JSON.parse(res.text);
 						collection.items[0].username.should.equal('interviewer');
 						done(err);
 					});
 			});

 			it('should retain its existing centreAccess after updating new access', function (done) {
 				var req = request.put('/api/user/' + globals.users.coordinatorUserId);
 				agent.attachCookies(req);

 				var newCentreAccess = {};
 				newCentreAccess[cc3Id] = 'coordinator';

 				User.findOne(globals.users.coordinatorUserId)
					.then(function (user) {
					// merge existing centreAccess with new attributes					
					var accessCopy = _.clone(user.centreAccess);
					_.extend(accessCopy, newCentreAccess);
					newCentreAccess = _.clone(accessCopy);

					req.send({
						centreAccess: newCentreAccess,
						isAdding: true,
						collectionCentres: [cc3Id] 					
	 				})
 					.expect(200)
 					.end(function (err, res) {
 						var collection = JSON.parse(res.text);
 						collection.items[0].centreAccess[cc1Id].should.equal('coordinator');
 						collection.items[0].centreAccess[cc3Id].should.equal('coordinator');
 						done(err);
 					});
				});
 			});
 			
 			it('should be able to update a user\'s role in a collection centre', function (done) {
 				var req = request.put('/api/user/' + globals.users.coordinatorUserId);
 				agent.attachCookies(req);

 				var newCentreAccess = {};
 				newCentreAccess[cc3Id] = 'interviewer';

 				User.findOne(globals.users.coordinatorUserId)
					.then(function (user) {
					// merge existing centreAccess with new attributes					
					var accessCopy = _.clone(user.centreAccess);
					_.extend(accessCopy, newCentreAccess);
					newCentreAccess = _.clone(accessCopy);

					req.send({
						centreAccess: newCentreAccess				
	 				})
 					.expect(200)
 					.end(function (err, res) {
 						var collection = JSON.parse(res.text);
 						collection.items[0].centreAccess[cc1Id].should.equal('coordinator');
 						collection.items[0].centreAccess[cc3Id].should.equal('interviewer');
 						done(err);
 					});
				});
 			});

 			it('should be able to switch a user\'s collection centre', function (done) {
 				var req = request.put('/api/user/' + globals.users.coordinatorUserId);
 				agent.attachCookies(req);

 				var newCentreAccess = {};
 				newCentreAccess[cc2Id] = 'coordinator';

 				User.findOne(globals.users.coordinatorUserId)
					.then(function (user) {
					// merge existing centreAccess with new attributes					
					var accessCopy = _.clone(user.centreAccess);
					_.extend(accessCopy, newCentreAccess);
					newCentreAccess = _.clone(accessCopy);

					req.send({
						centreAccess: newCentreAccess,
						swapWith: [cc2Id],
						isAdding: false,
						collectionCentres: [cc1Id]
	 				})
 					.expect(200)
 					.end(function (err, res) {
 						var collection = JSON.parse(res.text);
 						collection.items[0].centreAccess[cc1Id].should.equal('coordinator')
 						collection.items[0].centreAccess[cc2Id].should.equal('coordinator');
 						collection.items[0].centreAccess[cc3Id].should.equal('interviewer');
 						done(err);
 					});
				});
 			});

 			it('should remove the user\'s access if selected none collection centres', function (done) {
 				var req = request.put('/api/user/' + globals.users.interviewerUserId);
 				agent.attachCookies(req);

 				var newCentreAccess = {};

 				User.findOne(globals.users.interviewerUserId)
					.then(function (user) {
					// merge existing centreAccess with new attributes					
					var accessCopy = _.clone(user.centreAccess);
					_.extend(accessCopy, newCentreAccess);
					newCentreAccess = _.clone(accessCopy);

					req.send({
						centreAccess: {},
						isAdding: false,
						collectionCentres: [cc2Id]
	 				})
 					.expect(200)
 					.end(function (err, res) {
 						var collection = JSON.parse(res.text);
 						_.isEmpty(collection.items[0].centreAccess).should.be.ok;
 						done(err);
 					});
				});
 			});
 		});

		describe('allow correct headers', function() {
			it('should return full CRUD access for /api/user', function (done) {
				var req = request.get('/api/user');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var headers = res.headers['allow'];
						headers.should.equal('read,create,update,delete');
						done(err);
					});
			});

			it('should return full CRUD access for /api/user/:id', function (done) {
				var req = request.get('/api/user/' + globals.users.adminUserId);
				agent.attachCookies(req);
				req.expect(200)
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
			auth.authenticate('coordinator', function(loginAgent, resp) {
				agent = loginAgent;
				resp.statusCode.should.be.exactly(200);
				done();
			});
		});

		after(function(done) {
			auth.logout(done);
		});

		describe('find()', function () {
			it('should be able to list all coordinators my collection centres', function (done) {
				// TODO
				done();
			});
		});

		describe('findOne()', function () {
			it('should be able to read self user', function (done) {
				var req = request.get('/api/user/' + globals.users.coordinatorUserId);
				agent.attachCookies(req);
				req.expect(200)	
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.id = globals.users.coordinatorUserId;
						done(err);
					});
			});

			it('should be able to access a user only if they are in my collection centre', function (done) {
				// TODO
				done();
			});

			it('should not be able to access a user not in my collection centre', function (done) {
				// TODO
				done();
			});
		});

		describe('create()', function () {
			it('should only be able to create new user in collection centres I am part of', function (done) {
				// TODO
				done();
			});

			it('should return bad request if trying to creating user with admin role', function (done) {
				// TODO
				done();				
			});

			it('should only be able to create new user with coordinator or interviewer role', function (done) {
				// TODO
				done();
			});		
		});

		describe('update()', function() {
			it('should only be able to update self', function (done) {
				// TODO
				done();
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
				var req = request.del('/api/user/' + globals.users.coordinator2);
				agent.attachCookies(req);
				req.send().expect(400).end(function (err) {
					done(err);
				})
			});
		});		
 	});

 	describe('User with Interviewer Role', function() {
		before(function(done) {
			auth.authenticate('interviewer', function(loginAgent, resp) {
				agent = loginAgent;
				resp.statusCode.should.be.exactly(200);
				done();
			});
		});

		after(function(done) {
			auth.logout(done);
		});

		describe('find()', function () {
			it('should not be able to see other coordinators my collection centres', function (done) {
				done();
			});
		});

		describe('findOne()', function () {
			it('should be able to read self user', function (done) {
				var req = request.get('/api/user/' + globals.users.interviewerUserId);
				agent.attachCookies(req);
				req.expect(200)	
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.id.should.equal(globals.users.interviewerUserId);
						done(err);
					});
			});

			it('should not be able to access a user not in my collection centre', function (done) {
				done();
			});
		});

		describe('create()', function () {
			it('should not be able to create a new user', function (done) {
				var req = request.post('/api/user');
				agent.attachCookies(req);
				
				req.set('Accept', 'application/json')
					.expect('Content-Type', 'application/json; charset=utf-8')
					.send({
						username: 'newuser1',
						email: 'newuser1@example.com',
						password: 'lalalal1234',
						role: 'interviewer'
					})
					.expect(400)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.error.should.equal('User interviewer@example.com is not permitted to POST ');
						done(err);
					});
			});		
		});

		describe('update()', function() {
			it('should not be able to update themselves', function (done) {
				var req = request.put('/api/user/' + globals.users.coordinator2);
				agent.attachCookies(req);

				req.send({ email: 'subjectupdated@example.com' })
					.expect(400)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.error.should.equal('Cannot perform action [update] on foreign object');
						done(err);
					});
			});

			it('should not be able to update another user', function (done) {
				var req = request.put('/api/user/' + globals.users.adminUserId);
				agent.attachCookies(req);

				req.send({ email: 'crapadminemail@example.com' })
					.expect(400)
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
				var req = request.del('/api/user/' + globals.users.coordinator2);
				agent.attachCookies(req);
				req.send().expect(400).end(function (err) {
					done(err);
				})
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
			auth.authenticate('admin', function(loginAgent, resp) {
				agent = loginAgent;
				var req = request.del('/api/user/' + globals.users.coordinator2);
				agent.attachCookies(req);
				req.send().expect(200).end(function (err, res) {
					auth.logout(done);
				})
			});
		});

		describe('find()', function() {
			it('should only be able to read self user', function (done) {
				var req = request.get('/api/user');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.length.should.equal(1);
						done(err);
					});				
			});
		});

		describe('create()', function () {
			it('should not be able to create a new user', function (done) {
				var req = request.post('/api/user');
				agent.attachCookies(req);
				
				req.set('Accept', 'application/json')
					.expect('Content-Type', 'application/json; charset=utf-8')
					.send({
						username: 'newuser1',
						email: 'newuser1@example.com',
						password: 'lalalal1234',
						role: 'subject'
					})
					.expect(400)
					.end(function (err, res) {
						// var user = res.body;
						var collection = JSON.parse(res.text);
						collection.error.should.equal('User subject@example.com is not permitted to POST ');
						done(err);
					});
			});
		});

		describe('update()', function () {
			it('should not be able to update themselves', function (done) {
				var req = request.put('/api/user/' + globals.users.coordinator2);
				agent.attachCookies(req);

				req.send({ email: 'subjectupdated@example.com' })
					.expect(400)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.error.should.equal('User subject@example.com is not permitted to PUT ');
						done(err);
					});
			});

			it('should not be able to update another user', function (done) {
				var req = request.put('/api/user/' + globals.users.adminUserId);
				agent.attachCookies(req);

				req.send({ email: 'crapadminemail@example.com' })
					.expect(400)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.error.should.equal('User subject@example.com is not permitted to PUT ');
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
				var req = request.del('/api/user/' + globals.users.coordinator2);
				agent.attachCookies(req);
				req.send().expect(400).end(function (err) {
					done(err);
				})
			});
		});
	});

});