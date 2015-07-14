
(function() {

  module.exports = {

    getLocale: function(req, res, next) {
      var lang = req.param('lang');
      res.json(require('../../config/locales/' + lang + '.json'));
    }
  };
})();
