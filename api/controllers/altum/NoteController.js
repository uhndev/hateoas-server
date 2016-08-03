(function () {
  var actionUtil = require('../../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  module.exports = {
    identity: 'Note',

    find: function (req, res) {

      var Model = actionUtil.parseModel(req);
      var query = Model.find();

      query.limit(1000);

      query.exec(function found(err, notes) {
        if (err) {
          return res.serverError(err);
        }

        res.ok(notes);
      });
    },
  };
})();
