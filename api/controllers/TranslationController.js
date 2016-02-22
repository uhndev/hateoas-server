/**
 * TranslationController
 *
 * @description Server-side logic for managing translations
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  module.exports = {

    getLocale: function(req, res) {
      var lang = req.param('lang');
      res.json(require('../../config/locales/' + lang + '.json'));
    }

  };

})();
