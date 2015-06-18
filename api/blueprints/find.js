/**
 * Module dependencies
 */
var Q = require('q');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

/**
 * Find Records
 *
 *  get   /:modelIdentity
 *   *    /:modelIdentity/find
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.  If an id was specified, just the instance
 * with that unique id will be returned.
 *
 * Optional:
 * @param {Object} where       - the find criteria (passed directly to the ORM)
 * @param {Integer} limit      - the maximum number of records to send back (useful for pagination)
 * @param {Integer} skip       - the number of records to skip (useful for pagination)
 * @param {String} sort        - the order of returned records, e.g. `name ASC` or `age DESC`
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

module.exports = function findRecords (req, res) {

  // Look up the model
  var Model = actionUtil.parseModel(req);

  // If an `id` param was specified, use the findOne blueprint action
  // to grab the particular instance with its primary key === the value
  // of the `id` param.   (mainly here for compatibility for 0.9, where
  // there was no separate `findOne` action)
  if ( actionUtil.parsePk(req) ) {
    return require('./findOne')(req,res);
  }

  // Lookup for records that match the specified criteria
  var query = Model.find()
  .where( actionUtil.parseCriteria(req) )
  .limit( actionUtil.parseLimit(req) )
  .skip( actionUtil.parseSkip(req) )
  .sort( actionUtil.parseSort(req) );

  // If this model has a users collection, populate it
  if (req.model.identity === 'study') {
    query.populate('collectionCentres');
  }
  else if (req.model.identity === 'user') {
    query.populate('roles');
    query.populate('person');
  }
  else if (req.model.identity === 'subject') {
    query.populate('user');
    query.populate('collectionCentres');
  }

  // TODO: .populateEach(req.options);
  query = actionUtil.populateEach(query, req);
  query.exec(function found(err, matchingRecords) {
    if (err) return res.serverError(err);

    // Only `.watch()` for new instances of the model if
    // `autoWatch` is enabled.
    if (req._sails.hooks.pubsub && req.isSocket) {
      Model.subscribe(req, matchingRecords);
      if (req.options.autoWatch) { Model.watch(req); }
      // Also subscribe to instances of all associated models
      _.each(matchingRecords, function (record) {
        actionUtil.subscribeDeep(req, record);
      });
    }

    /**
     * Currently used for: [STUDY]
     */
    // if the model has a users collection, return filtered results depending on role
    if (req.model.identity === 'study') {
      if (req.user.role === 'admin') { // allow all
        res.ok(matchingRecords);
      }
      else if (req.user.role !== 'admin' && req.user.role !== 'subject') {
        return User.findOne(req.user.id) // find specific user's access
          .then(function(user) {
            var filteredRecords = _.filter(matchingRecords, function (record) {
              return _.some(record.collectionCentres, function(centre) {
                return _.has(user.centreAccess, centre.id);
              });
            });
            res.ok(filteredRecords);  
          }).catch(function (err) {
            res.serverError(err);
          });
      }
      else {
        return Subject.findOne({user: req.user.id}).populate('collectionCentres')
          .then(function(user) {
            var filteredRecords = _.filter(matchingRecords, function (record) {
              return _.some(record.collectionCentres, function(centre) {
                return _.contains(_.pluck(user.collectionCentres, 'id'), centre.id);
              });
            });
            res.ok(filteredRecords);  
          }).catch(function (err) {
            res.serverError(err);
          });
      }      
    } 
    /**
     * Currently used for: [USER]
     */
    else if (req.model.identity === 'user') {
      _.map(matchingRecords, function (user) {
        if (user.person) {
          _.merge(user, Utils.User.extractPersonFields(user.person));
          delete user.person;
        }
      });
      res.ok(matchingRecords);
    }
    /**
     * Currently used for: [SUBJECT]
     */
    else if (req.model.identity === 'subject') {
      Utils.User.populateSubjects(matchingRecords)
      .then(function (subjects) {
        res.ok(subjects);
      });
    }
    else {
      res.ok(matchingRecords);
    }
  });
};

