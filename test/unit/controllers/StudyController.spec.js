 /**
 * Test File: Testing StudyController
 * File Location: test/controllers/StudyController.spec.js
 *
 * Tests the following routes:
  'get /api/study/:name'           : { model: 'study', action: 'find' },
  'get /api/study/:name/subject'   : 'SubjectController.findByStudyName',
  'get /api/study/:name/user'      : 'UserController.findByStudyName',
  'get /api/study/:name/form'      : 'FormController.findByStudyName',
  'get /api/study/:name/encounter' : 'EncounterController.findByStudyName'
 */

var StudyController = require('../../../api/controllers/StudyController');
var login = require('../utils/login'),
		should = require('should');

describe('The Study Controller', function () {

	var agent, adminUserId, subjectUserId, studyId;

	describe('User with Admin Role', function () {
		
		before(function(done) {
			login.authenticate('admin', function(loginAgent, resp) {
				agent = loginAgent;
				resp.statusCode.should.be.exactly(200);
				adminUserId = JSON.parse(resp.text).id;

				var req = request.post('/api/user');
				agent.attachCookies(req);

				req.send({
					username: 'subject',
					email: 'subject@example.com',
					password: 'subject1234',
					role: 'subject'
				})
				.expect(201)
				.end(function(err, res) {
					subjectUserId = JSON.parse(res.text).items.id
					Study.create({
						name: 'LEAP',
						reb: 100,
						users: [adminUserId]
					}).then(function (res) {
						done();
					});	
				});
			});
		});

		after(function(done) {
			login.logout(done);
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
						collection.items[0].name.should.equal('LEAP');
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
				var req = request.get('/api/study/LEAP');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.name.should.equal('LEAP');
						done(err);
					});				
			});

			it('should return a 404 if study does not exist', function (done) {
				var req = request.get('/api/study/DNE');
				agent.attachCookies(req);
				req.expect(404)
					.end(function (err, res) {
						res.text.should.equal('Study DNE could not be found');
						done(err);
					});				
			});

			it('should retrieve a saved subject form href from the workflowstate', function (done) {
				var req = request.get('/api/study/LEAP/subject');
				agent.attachCookies(req);
				req.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.template.should.have.property('href');
						done(err);
					});					
			});

			it('should retrieve a saved user form href from the workflowstate', function (done) {
				var req = request.get('/api/study/LEAP/user');
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
				Study.findOne({name: 'LEAP-HIP'})
					.exec(function (err, study) {
						_.isUndefined(study).should.be.true;
						done();
					});
			});

			it('should be able to create a new study', function (done) {
				var req = request.post('/api/study');
				agent.attachCookies(req);

				req.send({
						name: 'LEAP-HIP',
						reb: 100,
						users: [adminUserId]
					})
					.expect(201)
					.end(function(err, res) {
						var collection = JSON.parse(res.text);
						collection.name.should.equal('LEAP-HIP');
						studyId = collection.id;
						done(err);
					});
			});

			it('should return an error if a study already exists', function (done) {
				var req = request.post('/api/study');
				agent.attachCookies(req);

				req.send({
						name: 'LEAP-HIP',
						reb: 100,
						users: [adminUserId]
					})
					.expect(500)
					.end(function(err) {
						done(err);
					});
			});
		});

		describe('update()', function() {
			it('should be able to update study name', function(done) {
				var req = request.put('/api/study/' + studyId);
				agent.attachCookies(req);

				req.send({ name: 'LEAP2', reb: 201 })
					.expect(200)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.items.name.should.equal('LEAP2');
						collection.items.reb.should.equal('201');
						done(err);
					});
			});

			it('should be able to set no users to a study', function(done) {
				var req = request.put('/api/study/' + studyId);
				agent.attachCookies(req);

				req.send({ users: [] })
					.expect(200)
					.end(function (err, res) {
						done(err);
					});
			});			

			it('should be able to update users of study', function(done) {
				var req = request.put('/api/study/' + studyId);
				agent.attachCookies(req);

				req.send({ users: [adminUserId, subjectUserId] })
					.expect(200)
					.end(function (err, res) {
						Study.findOne(studyId).populate('users')
							.then(function (data) {
								data.users[0].username.should.equal('test_admin');
								data.users[1].username.should.equal('subject');
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
				var req = request.get('/api/study/LEAP');
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

	describe('User with Subject Role', function () {

		before(function(done) {
			login.authenticate('subject', function(loginAgent, resp) {
				agent = loginAgent;
				resp.statusCode.should.be.exactly(200);
				done();
			});
		});

		after(function(done) {	  	
			login.authenticate('admin', function(loginAgent, resp) {
				agent = loginAgent;
				var req = request.del('/api/user/' + subjectUserId);
				agent.attachCookies(req);
				req.send().expect(200).end(function (err, res) {
					login.logout(done);
				})
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
						role: 'admin'
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
				var req = request.put('/api/user/' + subjectUserId);
				agent.attachCookies(req);

				req.send({ email: 'newuserupdated@example.com' })
					.expect(400)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.error.should.equal('User subject@example.com is not permitted to PUT ');
						done(err);
					});
			});

			it('should not be able to update another user', function (done) {
				var req = request.put('/api/user/' + adminUserId);
				agent.attachCookies(req);

				req.send({ email: 'crapadminemail@example.com' })
					.expect(400)
					.end(function (err, res) {
						var collection = JSON.parse(res.text);
						collection.error.should.equal('User subject@example.com is not permitted to PUT ');
						done(err);
					});
			});
		});
	});

});