/**
 * StudyController
 *
 * @module controllers/Study
 * @description Server-side logic for managing studies
 * @help        See http://links.sailsjs.org/docs/controllers
 */

/** @ignore */
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

module.exports = {

  /**
   * find
   * @description Finds and returns a list of studies with 3 modes of filtering
   *              based on the current user's group.  Admins are simply returned
   *              all studies, coordinators are filtered based on their enrollments
   *              at their respective collection centres and similarily so for
   *              subjects and their enrollments.
   *
   * @param  {Object}   req  request object
   * @param  {Object}   res  response object
   * @param  {Function} next callback function
   * @return {null}
   */
	find: function (req, res, next) {
	  var query = Study.find()
			.where( actionUtil.parseCriteria(req) )
			.limit( actionUtil.parseLimit(req) )
			.skip( actionUtil.parseSkip(req) )
			.sort( actionUtil.parseSort(req) );

		query.populate('collectionCentres');
    query.exec(function found(err, studies) {
    	if (err) return res.serverError(err);

    	Group.findOne(req.user.group).then(function (group) {
    		switch(group.level) {
    			case 1: // allow all as admin
    				return res.ok(studies);
    			case 2: // find specific user's access
    				return User.findOne(req.user.id)
            .then(function(user) {
              var filteredRecords = _.filter(studies, function (record) {
                return _.some(record.collectionCentres, function(centre) {
                  return _.has(user.centreAccess, centre.id);
                });
              });
              res.ok(filteredRecords);
            }).catch(function (err) {
              return res.serverError(err);
            });
    			case 3: // find subject's collection centre access
    				return Subject.findOne({user: req.user.id}).populate('collectionCentres')
            .then(function(user) {
              var filteredRecords = _.filter(studies, function (record) {
                return _.some(record.collectionCentres, function(centre) {
                  return _.contains(_.pluck(user.collectionCentres, 'id'), centre.id);
                });
              });
              res.ok(filteredRecords);
            }).catch(function (err) {
              return res.serverError(err);
            });
    			default: return res.notFound(); break;
    		}
    	});
		});
	},

  /**
   * findOne
   * @description Finds and returns one study with enrollment summaries including
   *              number of overseeing coordinators and enrolled subjects.  Users
   *              with coordinator or subject group permissions will only see the
   *              requested study if they are enrolled in a collection centre
   *              registered in that study.
   *
   * @param  {Object}   req  request object
   * @param  {Object}   res  response object
   * @param  {Function} next callback function
   * @return {null}
   */
	findOne: function (req, res, next) {
		var name = req.param('name');
		var getCollectionCentreSummary = function(centre) {
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
				});
		}

		Group.findOne(req.user.group).then(function (group) {
			this.group = group;
			return Study.findOne({name: name}).populate('collectionCentres');
		})
		.then(function (study) {
			this.study = study;
			switch (this.group.level) {
				case 1: return null;
				case 2: return User.findOne(req.user.id);
				case 3: return Subject.findOne({user: req.user.id});
				default: return res.notFound(); break;
			}
		})
    .then(function (user) {
    	if (this.study) {
    		switch (this.group.level) {
    			case 1: // admin users
    				return Promise.all(
						_.map(this.study.collectionCentres, getCollectionCentreSummary)
						);
    			case 2: // coordinator/physician/interviewers
			    	if (_.some(this.study.collectionCentres, function(centre) {
		          return !_.isUndefined(user.centreAccess[centre.id]);
		        })) {
		        	return Promise.all(
								_.map(this.study.collectionCentres, getCollectionCentreSummary)
							);
		    		} else {
	    			 	return null;
		    		}
    			case 3: // subjects
    				return null;
    			default: return res.notFound(); break;
    		}
    	} else {
    		// study not found
    		return null;
    	}
    })
		.then(function (centres) {
			if (_.isUndefined(this.study)) {
				return res.notFound();
			}
			else if (_.isNull(centres)) {
				return res.forbidden({
					title: 'Error',
					code: 403,
					message: "User "+req.user.email+" is not permitted to GET "
				});
      }
      else {
				this.study.centreSummary = centres;
				res.ok(this.study);
			}
		})
    .catch(function (err) {
    	return res.serverError({
    		title: 'Server Error',
    		code: err.status,
    		message: err.message
    	});
    });
	},

  /**
   * update See - {@link controllers/CollectionCentreController}
   * @description Updates the study attributes given id, name, reb, attributes,
   *              administrator or pi.  We prevent users from being able to
   *              update a study's collection centre directly, and only allow
   *              this from the CollectionCentre model.
   *
   * @see controllers/CollectionCentreController
   * @{@link controllers/CollectionCentreController}
   * @link controllers/CollectionCentreController
   * @param  {Object}   req  request object
   * @param  {Object}   res  response object
   * @param  {Function} next callback function
   * @return {null}
   */
	update: function (req, res, next) {
		// can only update study collection centres via CollectionCentre model
		var id = req.param('id'),
				name = req.param('name'),
				reb = req.param('reb'),
				attributes = req.param('attributes'),
				administrator = req.param('administrator'),
				pi = req.param('pi');

		var fields = {};
    if (name) fields.name = name;
    if (reb) fields.reb = reb;
    if (attributes) fields.attributes = attributes;
    if (administrator) fields.administrator = administrator;
    if (pi) fields.pi = pi;

		Study.update({id: id}, fields).exec(function (err, study) {
			if (err) {
				return res.serverError({
	    		title: 'Server Error',
	    		code: err.status,
	    		message: err.message
				});
			}
			res.ok(_.first(study));
		});
	}

};

