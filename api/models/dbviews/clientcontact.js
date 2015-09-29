
  /**
   *
   * @description a ClientContact's
   * @type {string}
   */

  (function () {
    var UserModel = require('./../User.js');
    var _super = require('./baseView.js');

    _.merge(exports, _super);
    _.merge(exports, {

          /**
           * emerFirstName
           * @description a claim's payor
           * @type {string}
           */

          emergencyFirstName: {
            type: 'string'
          },

          /**
           * emerLastName
           * @description a ClientContact's emerLastName
           * @type {string}
           */

          emergencyLastName: {
            type: 'string'
          },

          /**
           * relationship
           * @description a ClientContact's relationship
           * @type {string}
           */

          relationship: {
            type: 'string'
          },

          /**
           * emerPhone
           * @description a ClientContact's emerPhone
           * @type {
           * string
           * }
           */

          emergencyPhone: {
            type: 'string'
          },

          /**
           * MRN
           * @description a ClientContact's MRN
           * @type {string}
           */

          MRN: {
                type: 'integer',
                index: true
            },

          /**
           * language
           * @description a ClientContact's language
           * @type {
           * string
           * }
           */

          language: {
            type: 'string'
          },

          /**
           * interpreter
           * @description a ClientContact's interpreter
           * @type {string}
           */

          interpreter: {
            type: 'string'
          },

          /**
           * occupation
           * @description a ClientContact's occupation
           * @type {string}
           */

          occupation: {
            type: 'string'
          },

          /**
           * occuType
           * @description a ClientContact's occuType
           * @type {
           * string
           * }
           */

          occupationType: {
            type: 'string'
          },

          /**
           * occuSector
           * @description a ClientContact's occuSector
           * @type {string}
           */

          occupationSector: {
            type: 'string'
          },

          /**
           * Salutation
           * @description a ClientContact's Salutation
           * @type {string}
           */

          salutation : {
            type : 'integer'
          },

          /**
           * FirstName
           * @description a ClientContact's FirstName
           * @type {string}
           */

          firstName : {
            type : 'string'
          },

          /**
           * MiddleName
           * @description a ClientContact's MiddleName
           * @type {string}
           */

          middleName : {
            type : 'string'
          },

          /**
           * LastName
           * @description a ClientContact's LastName
           * @type {string}
           */

          lastName: {
            type : 'string'
          },

          /**
           * Gender
           * @description a ClientContact's Gender
           * @type {string}
           */

          gender: {
            type : 'string'
          },

          /**
           * BirthDate
           * @description a ClientContact's BirthDate
           * @type {string}
           */

          dateOfBirth: {
            type : 'dateTime'
          },

          /**
           * Street
           * @description a ClientContact's Street
           * @type {string}
           */

          street: {
            type : 'string'
          },

          /**
           * City
           * @description a ClientContact's City
           * @type {string}
           */

          city: {
            type : 'string'
          },

          /**
           * Province
           * @description a ClientContact's
           * @type {string}
           */


          /**
           * Province
           * @description a ClientContact's Province
           * @type {string}
           */

          province: {
            type : 'string'
          },

          /**
           * PostalCode
           * @description a ClientContact's PostalCode
           * @type {string}
           */

          postalCode: {
            type : 'string'
          },

          /**
           * Region
           * @description a ClientContact's Region
           * @type {string}
           */

          region : {
            type : 'string'
          },

          /**
           * Country
           * @description a ClientContact's Country
           * @type {string}
           */

          country: {
            type: 'string'
          },

          /**
           * Company
           * @description a ClientContact's Company
           * @type {string}
           */

          company: {
                type: 'string'
            },

          /**
           * JobTitle
           * @description a ClientContact's JobTitle
           * @type {string}
           */


            /**
             * type
             * @description a ClientContact's type
             * @type {string}
             */

            jobTitle: {
              type: 'string'
            },

          /**
           * HomePhone
           * @description a ClientContact's HomePhone
           * @type {string}
           */

          homePhone: {
            type: 'string'
          },

          /**
           * WorkPhone
           * @description a ClientContact's WorkPhone
           * @type {string}
           */

          workPhone: {
            type: 'string'
          },

          /**
           * Fax
           * @description a ClientContact's Fax
           * @type {string}
           */

          fax: {
            type: 'string'
          },

          /**
           * OtherPhone
           * @description a ClientContact's OtherPhone
           * @type {
           * string
           * }
           */

          otherPhone: {type: 'string'},

          /**
           * HomeEmail
           * @description a ClientContact's HomeEmail
           * @type {string}
           */

          homeEmail: {
            type: 'string'
          },

          /**
           * WorkEmail
           * @description a ClientContact's WorkEmail
           * @type {string}
           */

          workEmail: {type: 'string'},

          /**
           * ContactComments
           * @description a ClientContact's ContactComments
           * @type { * string * }
           */

          contactComments: {type: 'string'},

          /**
           * createdAt
           * @description a ClientContact's createdAt
           * @type {
           * string}
           */
            createdAt:
            {
                type: 'date'

            },

          /**
           * updatedAt
           * @description a ClientContact's updatedAt
           * @type {
           * string}
           */

          updatedAt: {
                type: 'date'
            },
        })
})();
