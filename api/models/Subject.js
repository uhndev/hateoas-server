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
  beforeValidation: function(subject, cb) {
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
