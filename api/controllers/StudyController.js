/**
 * StudyController
 *
 * @description :: Server-side logic for managing studies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var PermissionService = require('../services/PermissionService');

module.exports = {

	findOne: function (req, res, next) {
		var name = req.param('name');

		Study.findOne({name: name})
			.populate('users')
			.populate('collectionCentres')
			.then(function (study) {
				this.study = study;
				return PermissionService.getCurrentRole(req);
			})
	    .then(function (role) {
	      this.role = role;
	      if (role === 'admin') {
	        return null;
	      }
	      else if (role === 'coordinator' || role === 'interviewer') {
	        return User.findOne(req.user.id);
	      }
	      else {
	        return Subject.findOne({user: req.user.id});
	      }
	    })
	    .then(function (user) {
	    	if (this.study) {
		    	if (this.role === 'admin') {
		    		return Promise.all(
							_.map(this.study.collectionCentres, function (centre) {
								return CollectionCentre.findOne(centre.id)
									.populate('contact')
									.populate('coordinators')
									.populate('subjects')
									.then(function (cc) {
										var ret = _.pick(cc, 'id', 'name');
										ret.contact = (_.isUndefined(cc.contact)) ? '' : cc.contact.id;
										ret.coordinators_count = cc.coordinators.length || 0;
										ret.subjects_count = cc.subjects.length || 0;
										return ret;
									})
							})
						);	
		    	} 
		    	else if (this.role === 'coordinator' || this.role === 'interviewer') {
			    	if (_.some(this.study.collectionCentres, function(centre) {
		          return !_.isUndefined(user.centreAccess[centre.id]);
		        })) {
		        	return Promise.all(
								_.map(this.study.collectionCentres, function (centre) {
									return CollectionCentre.findOne(centre.id)
										.populate('contact')
										.populate('coordinators')
										.populate('subjects')
										.then(function (cc) {
											var ret = _.pick(cc, 'id', 'name');
											ret.contact = (_.isUndefined(cc.contact)) ? '' : cc.contact.id;
											ret.coordinators_count = cc.coordinators.length || 0;
											ret.subjects_count = cc.subjects.length || 0;
											return ret;
										})
								})
							);
		    		} else {
	    			 	return null;
		    		}
	        } 
	        else {
	        	// subject restrictions go here
	       		return null;	
	        }	
	    	} else {
	    		// study not found
	    		return null;
	    	}	    	
	    })
			.then(function (centres) {
				if (_.isUndefined(this.study)) {
					res.notFound();
				} 
				else if (_.isNull(centres)) {
					res.status(403).json({
            "error": "User "+req.user.email+" is not permitted to GET "
          });
        }
        else {
					this.study.centreSummary = centres;
					res.ok(this.study);	
				}
			})
	    .catch(next);
	},

	update: function (req, res, next) {
		// can only update study collection centres via CollectionCentre model
		var id = req.param('id'),
				name = req.param('name'),
				reb = req.param('reb'),
				users = req.param('users');
		var fields = {};
    if (name) fields.name = name;
    if (reb) fields.reb = reb;
    if (users) fields.users = users;

		Study.update({id: id}, fields).exec(function (err, study) {
			if (err) return next(err);
			res.ok(_.first(study));
		});
	}
	
};

