/**
 * Created by calvinsu on 15-09-11.
 */
module.exports = {

  connection: 'arm_development',

  attributes: {

    /**
     * isDeleted
     * @description deleted flag
     * @type {string}
     */

    isDeleted: {
      type: 'boolean',
      defaultsTo: false
    },


    /**
     * deletedAt
     * @description deleted date
     * @type {string}
     */

    deletedAt: {
      type: 'datetime',
      defaultsTo: null,
      datetime: true
    },


    /**
     * deletedBy
     * @description record of who deleted record
     * @type {string}
     */

    deletedBy: {
      model: 'user'

    }
  }
}
