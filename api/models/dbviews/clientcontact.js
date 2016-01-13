/**
 *
 * @description a ClientContact's
 * @type {string}
 */

(function () {
    var ClientModel = require('./../altum/Client.js');
    var _super = require('./baseView.js');

    var getResponseLinks = function(id, name) {
        return [
            {
                'rel': 'name',
                'prompt': name,
                'name': 'name',
                'href': [
                    sails.getBaseUrl() + sails.config.blueprints.prefix, 'client', id
                ].join('/')
            },
            {
                'rel': sails.models.client.identity,
                'prompt': 'APP.HEADER.SUBMENU.OVERVIEW',
                'name': 'name',
                'href': [
                    sails.getBaseUrl() + sails.config.blueprints.prefix, 'client', id
                ].join('/')
            },
            {
                'rel': sails.models.referral.identity,
                'prompt': 'Referrals',
                'name': 'name',
                'href': [
                    sails.getBaseUrl() + sails.config.blueprints.prefix, 'client', id, 'referrals'
                ].join('/')
            }
        ];
    };

    _.merge(exports, _super);
    _.merge(exports, {
       // displayFields: [ 'prefix', 'firstname', 'lastname' ],
        attributes: {

            /**
             * MRN
             * @description a ClientContact's MRN
             * @type {string}
             */

            MRN: {
                type: 'string',
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
             * Salutation
             * @description a ClientContact's Salutation
             * @type {string}
             */

            salutation: {
                type: 'integer'
            },

            /**
             * FirstName
             * @description a ClientContact's FirstName
             * @type {string}
             */

            firstName: {
                type: 'string'
            },

            /**
             * MiddleName
             * @description a ClientContact's MiddleName
             * @type {string}
             */

            middleName: {
                type: 'string'
            },

            /**
             * LastName
             * @description a ClientContact's LastName
             * @type {string}
             */

            lastName: {
                type: 'string'
            },

            /**
             * Gender
             * @description a ClientContact's Gender
             * @type {string}
             */

            gender: {
                type: 'string'
            },

            /**
             * BirthDate
             * @description a ClientContact's BirthDate
             * @type {string}
             */

            dateOfBirth: {
                type: 'dateTime'
            },

            /**
             * Street
             * @description a ClientContact's Street
             * @type {string}
             */

            address1: {
                type: 'string'
            },

            address2: {
                type: 'string'
            },

            /**
             * City
             * @description a ClientContact's City
             * @type {string}
             */

            city: {
                type: 'string'
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
                type: 'string'
            },

            /**
             * PostalCode
             * @description a ClientContact's PostalCode
             * @type {string}
             */

            postalCode: {
                type: 'string'
            },

            /**
             * Region
             * @description a ClientContact's Region
             * @type {string}
             */

            region: {
                type: 'string'
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

            displayName: {type: 'string'},

            getResponseLinks: function(){
                return getResponseLinks(this.id, this.displayName);
            },

            toJSON: ClientModel.attributes.toJSON
        },

        getResponseLinks: getResponseLinks

    });
})();
