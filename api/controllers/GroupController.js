/**
 * GroupController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var Promise = require('q');

module.exports = {
	
	find: function(req, res, next) {
	  var query = Group.find()
			.where( actionUtil.parseCriteria(req) )
			.limit( actionUtil.parseLimit(req) )
			.skip( actionUtil.parseSkip(req) )
			.sort( actionUtil.parseSort(req) );

		query.populate('roles');
    query.exec(function found(err, groups) {
    	if (err) {
    		return res.serverErr({
    			title: 'Error',
    			code: err.status,
    			message: err.message
    		});
    	}

    	res.ok(groups);
    });
	},

	update: function (req, res, next) {
		var groupId = req.param('id'),
				roles = req.param('roles');

		Group.findOne(req.user.group).exec(function (err, group) {
			if (err) return res.serverError(err);

			if (group.level === 1) { // only admins can update groups
				return Group.findOne(groupId).populate('roles').populate('users')
				.then(function (group) {
					this.group = group;
					// roles is a list of rolename strings, so we
					// need to find ids to add to the groups' roles collection
					return Role.find({ name: roles });
				})
				.then(function (roles) {
					this.roles = roles;
					return PermissionService.revokeGroupPermissions(this.group);
				})
				.then(function (group) { // apply roles to group
					_.each(this.roles, function (role) {
						this.group.roles.add(role.id);
					});
					return this.group.save();
				})
				.then(function (updatedGroup) { // update user roles of updated group
					return Promise.all(
						_.map(updatedGroup.users, function (user) {
							return PermissionService.grantPermissions(user, this.roles);
						})
					);
				})
				.then(function (users) {
					res.ok(this.group);
				})
				.catch(function (err) {
					return res.serverError(err);
				});
			} else {
				return res.forbidden();
			}
		});
	}

};

