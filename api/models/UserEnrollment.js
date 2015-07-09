/**
* UserEnrollment
*
* @class UserEnrollment
* @description Model representation of a user's enrollment/involvement in a collection centre
* @docs        http://sailsjs.org/#!documentation/models
*/

(function() {

  module.exports = {
    schema: true,
    attributes: {

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
       * user
       * @description Many to one association between user enrollments and users.
       * @type {Association} linked coordinator in enrollment
       */
      user: {
        model: 'user',
        required: true
      },

      /**
       * centreAccess
       * @description For a particular user enrollment, a user can have multiple
       *              views of the data.  For example, a user can oversee a
       *              collection centre as a coordinator, and can oversee another
       *              collection centre as an interviewer.
       * @type {String} string value denoting type of view/access this user has.
       */
      centreAccess: {
        type: 'string',
        enum: ['coordinator', 'interviewer']
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
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  };

})();

