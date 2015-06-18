/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {

	var promises = [];
	var crud = ['create', 'read', 'update', 'delete'];
	var dadosModels = [
		// access models
		'Role', 'Permission', 'User', 'UserOwner',
		// study administration models
		'Study', 'CollectionCentre', 'Subject', 'WorkflowState', 'Person',
		// form models
		'Form', 'AnswerSet'
	];

	// setup granular model-specific roles
	_.each(dadosModels, function(model) {
		_.each(crud, function(operation) {
			promises.push(
				Role.findOrCreate({ name: operation + model }, { name: operation + model })
			);
		})
	});	

	return Promise.all(promises);	
};
