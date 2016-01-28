/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

module.exports.models = {

  // elements in this array will be ignored as Model attributes
  validations: {
    ignoreProperties: ['generator']
  },

  limits: {
    claim: 5,
    program: 5,
    referral: 5
  },

  populateDB: function() {
    var that = this;
    var generateMultiple = function(model) {
      var promises = [];
      for (var i=0; i < that.limits[model]; i++) {
        promises.push(sails.models[model].generateAndCreate());
      }
      return Promise.all(promises).then(function(data) {
        sails.log.info(that.limits[model] + ' ' + model + '(s) generated');
        return data;
      });
    };

    Site.generateAndCreate()
      .then(Status.generateAndCreate)
      .then(ServiceCategory.generateAndCreate)
      .then(WorkStatus.generateAndCreate)
      .then(Timeframe.generateAndCreate)
      .then(Prognosis.generateAndCreate)
      .then(generateMultiple('claim'))
      .then(generateMultiple('program'))
      .then(generateMultiple('referral'));
  }
};
