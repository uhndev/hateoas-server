/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {

	var promises = [];
	var crud = ['create', 'read', 'update', 'delete'];

	return Model.find()
		.then(function (models) {
		  var dadosModels = _.pluck(models, 'name');
  		dadosModels.push('UserOwner');

			// setup granular model-specific roles
			_.each(dadosModels, function(model) {
				_.each(crud, function(operation) {
					promises.push(
						Role.findOrCreate({ name: operation + model }, { name: operation + model })
					);
				})
			});	

			return Promise.all(promises);	
		});
};
