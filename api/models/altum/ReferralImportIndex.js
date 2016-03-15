/**
 * ImportIndex
 *
 * @class ReferralImportIndex
 * @description model for migration process tracking importing of external referral records
 */

module.exports = {
  schema: true,
  meta: {
    schemaName: 'altum'
  },
  attributes: {

    /**
     * externalID
     * @description external referral id
     * @type {String}
     */
    externalID: {
      type: 'string'
    },

    /**
     * status
     * @description external referral's status
     * @type {String}
     */
    status: {
      type: 'string'
    }
  }
};

