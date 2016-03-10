/**
 * ImportIndex
 *
 * @class ReferralImportIndex
 * @description model for migration process tracking importing of external referral records
 */

module.exports= {
  schema: true,
  meta: {
    schemaName: 'altum'
  },
  attributes: {

    /**
     * id
     * @description external referral id
     * @type {String}
     */
    id: {
      type: 'string',
    },

    /**
     * status
     * @description external referral's status
     * @type {String}
     */
    status: {
      type: 'string',
    }
  }
}

