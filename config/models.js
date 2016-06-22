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
    ignoreProperties: [
      'generator',    // function for generating fake data - see BaseModel for more info
      'preventCreate' // boolean flag for determining if the 'Create New' toggle will be available on auto-generated
                      // forms on client-side in form-builder/singleselect.
    ]
  },

  limits: {
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

    ProgramService.generateAndCreate()
      .then(generateMultiple('program'))
      .then(generateMultiple('referral'))
      .catch(function (err) {
        sails.log.info(err);
      });
  }
};
