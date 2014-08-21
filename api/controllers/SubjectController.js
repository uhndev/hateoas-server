/**
 * SubjectController
 *
 * @description :: Server-side logic for managing Subjects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
(function() {

function findByStudyId(id, cb) {
  if (id) {
    Subject.find( { study: id } )
      .populate('person')
      .exec(function(err, subjects) {
        if (err) return res.serverError(err);
        cb(subjects);
      })
  } else {
    cb([]);
  }
}

module.exports = {
  findByStudyId : function(req, res) {
    var idStudy = req.param('id');
    findByStudyId(idStudy, res.ok);
  },
  findByStudyName: function(req, res) {
    var name = req.param('name');
    if (name) {
      Study.findOne({name: name})
        .exec(function(err, study) {
          if (err) return res.serverError(err);
          findByStudyId(study.id, res.ok);
        });
    } else {
      res.ok([]);
    }
  }
};
}());
