/**
 * ReferralContact.js
 *
 * @description :: manual relationship table between referrals and contacts
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    /**
     * referral
     * @description referral key from referral table side of relationship
     * @type {model}
     */

    referral: {
      model: 'referral'
    },


    /**
     * contact
     * @description contactID from contact side of the relationship
     * @type {model}
     */

    contact: {
      model: 'contact'
    },


    /**
     * role
     * @description role of this relationship
     * @type {model}
     */

    role: {
      model: 'contactRole'
    }

  }
};

