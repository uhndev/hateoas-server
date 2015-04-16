/**
* Subject.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
(function() {
var HateoasService = require('../services/HateoasService.js');

module.exports = {

  attributes: {
    studyId: {
      type: 'integer',
      autoIncrement: true,
      required: true
    },
    study: {
      model: 'study',
      required: true
    },
    person: {
      model: 'person',
      required: true
    },
    doe: {
      type: 'date'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  },
  findByStudyName: function(studyName, options, cb) {
    Study.findOneByName(studyName, {}, function found(err, study) {
      if (err) return cb(err);

      if (!study) {
        err = new Error();
        err.message = require('util')
          .format('Study with name %s does not exist.', studyName);
        err.status = 404;
        return cb(err);
      }

      var query = _.cloneDeep(options);
      query.where = query.where || {};
      query.where.study = study.id;
      delete query.where.name;

      Subject.find(query)
        .populate('person')
        .populate('study')
        .exec(cb);
    });
  },
  beforeValidate: function(subject, cb) {
    //Auto increment workaround
    Subject.findOne({ where: {"study": subject.study}, 
      sort:'studyId DESC' } )
        .exec(function(err, lastSubject){
          if (err) return err;
          subject.studyId = (lastSubject && lastSubject.studyId ? 
            lastSubject.studyId + 1 : 1);
          cb();
        });
  }
};

}());
