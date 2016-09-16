/**
 * InvoiceController
 *
 * @module  controllers/Invoice
 * @description Server-side logic for managing Invoices
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {
  var actionUtil = require('../../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var ModelBase = require('./../BaseControllers/ModelBaseController');
  var _ = require('lodash');

  _.merge(exports, ModelBase);      // inherits ModelBaseController.findByBaseModel
  _.merge(exports, {

    identity: 'Invoice'

  });

})();
