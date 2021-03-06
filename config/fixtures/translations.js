(function () {
  var Promise = require('bluebird');
  /**
   * Creates default Translations
   *
   * @public
   */
  exports.create = function () {
    var translations = [
      {
        language: 'en_US',
        translationKey: 'COMMON.LANGUAGES.ENGLISH',
        translation: require('../locales/en_US.json')
      },
      {
        language: 'fr',
        translationKey: 'COMMON.LANGUAGES.FRENCH',
        translation: require('../locales/fr.json')
      },
      {
        language: 'altum',
        translationKey: 'COMMON.LANGUAGES.ALTUM',
        translation: require('../locales/altum.json')
      }
    ];

    return Promise.all(
      _.map(translations, function (translation) {
        return Translation.findOrCreate({ language: translation.language }, translation);
      })
    );
  };

})();
