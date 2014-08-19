/**
 * AuthController
 *
 * @description :: Server-side logic for managing Authentication
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	login: function(req, res, next) {
		var currentUser = {
			id: 'abc123',
			username: 'admin',
			email: 'admin@uhn.ca',
			first_name: 'John',
			last_name: 'Admin',
			role: 'admin'
		};
		res.json(currentUser);
	},

	register: function(req, res, next) {
		var currentUser = {
			id: 'abc123',
			username: 'admin',
			email: 'admin@uhn.ca',
			first_name: 'John',
			last_name: 'Admin',
			role: 'admin'
		};
		res.json(currentUser);
	}
};

