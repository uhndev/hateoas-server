/**
 * EnrollmentPolicy
 *
 * @module      Policies
 * @description Simple policy to allow/deny any authenticated user based on their enrollments.
 *              Applies to findOne methods of the Study, CollectionCentre, User/Subject Enrollment
 *              controllers, see config/policies for more detail.
 * @docs        http://sailsjs.org/#!documentation/policies
 *
 */
(function() {
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = function (req, res, next) {
    var Model = actionUtil.parseModel(req);
    var hasCollection  = _.find(Model.associations, { alias: 'collectionCentres' });
    var hasAssociation = _.find(Model.associations, { alias: 'collectionCentre'  });

    var query = (Model.adapter.identity == 'study') ?
      Model.findOne({ name: req.param('name') }) : Model.findOne(req.param('id'));
    if (hasCollection) {
      query.populate('collectionCentres');
    }
    query.exec(function found(err, matchingRecord) {
      if (err) return res.serverError(err);
      if (!matchingRecord) return res.notFound('No record found with the specified `id`.');

      var collectionCentreQuery;
      if (hasCollection) {
        collectionCentreQuery = _.pluck(matchingRecord.collectionCentres, 'id');
      } else if (hasAssociation) {
        collectionCentreQuery = matchingRecord.collectionCentre;
      } else if (Model.adapter.identity == 'collectioncentre') {
        collectionCentreQuery = matchingRecord.id;
      }

      Group.findOne(req.user.group)
        .then(function (group) {
          switch (group.level) {
            case 1: return null;
            case 2: return UserEnrollment.find({
              user: req.user.id,
              collectionCentre: collectionCentreQuery
            });
            case 3: return Subject.findOne({ user: req.user.id }).then(function (subject) {
              return SubjectEnrollment.find({
                subject: subject.id,
                collectionCentre: collectionCentreQuery
              });
            });
            default: return null;
          }
        })
        .then(function (enrollments) {
          if (_.isNull(enrollments) || enrollments.length > 0) {
            return next();
          } else {
            return res.forbidden('You are not permitted to perform this action.');
          }
        });
    });
  };
})();
