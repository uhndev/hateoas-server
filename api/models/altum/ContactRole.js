/**
 * ContactRole.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {


    /**
     * name
     * @description a contact role's name
     * @type {string}
     */

    name: {
      type: 'string'
    },


    /**
     * description
     * @description a contact role's description
     * @type {string}
     */

    description: {
      type: 'string'
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)

  }
};

