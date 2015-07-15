/**
* SubjectEnrollment
*
* @class SubjectEnrollment
* @description Model representation of a subject's enrollment in a collection centre
* @docs        http://sailsjs.org/#!documentation/models
*/

(function() {

  module.exports = {
    schema: true,
    attributes: {
      /**
       * subjectNumber
       * @description Equivalent of DADOS 2.0 subjectId that autoincrements with each
       *              instance of a subject's enrollment at a collection centre.
       * @type {Integer}
       */
      subjectNumber: {
        type: 'integer',
        required: true,
        autoIncrement: true
      },

      /**
       * collectionCentre
       * @description The collection centre for which this subject is enrolled in.
       * @type {Association} linked collection centre in enrollment
       */
      collectionCentre: {
        model: 'collectioncentre',
        required: true
      },

      /**
       * subject
       * @description The subject whose enrollment pertains to.
       * @type {Association} linked subject in enrollment
       */
      subject: {
        model: 'subject',
        required: true
      },

      /**
       * doe
       * @description Date of event in enrollment; is typically the date of surgery performed
       *              or other important events related to the timeline of a patient's care.
       * @type {Date}
       */
      doe: {
        type: 'date',
        required: true,
        date: true
      },

      /**
       * studyMapping
       * @description Depending on the associated study, study.attributes should define what
       *              attribute keys goes in this enrollment.studyMapping.
       *
       * @example
       * @type {Object}
       */
      studyMapping: {
        type: 'json',
        required: true,
        json: true
      },

      /**
       * expiredAt
       * @description Instead of strictly deleting objects from our system, we set a date such
       *              that if it is not null, we do not include this entity in our response.
       * @type {Date} Date of expiry
       */
      expiredAt: {
        type: 'datetime',
        defaultsTo: null,
        datetime: true
      }
    },

    /**
     * beforeCreate
     * @description Before creating an enrollment entity, should validate that study mapping is
     *              valid and maps to the correct attributes of the requested study attributes.
     * @param  {Object}   values Model values submitted to create entity
     * @param  {Function} cb     Callback function to run on completion
     */
    beforeCreate: function (values, cb) {
      Study.findOne(value.study)
        .then(function (study) {
          // verify keys of study attributes mirror keys of studyMapping
          var valid = _.equals(_.keys(study.attributes), _.keys(values.studyMapping));

          // verify value of studyMapping corresponds directly to one of the values in study attributes
          _.forIn(study.attributes, function (value, key) {
            valid = valid & _.includes(value, values.studyMapping[key]);
          });

          return valid;
        })
        .then(function (valid) {
          if (valid) {
            cb();
          } else {
            cb('Study mapping is not valid!');
          }
        })
        .catch(cb);
    }

  };

})();


