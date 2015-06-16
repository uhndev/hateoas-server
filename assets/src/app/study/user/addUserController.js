(function() {
	'use strict';

	angular
		.module('dados.study.user.addUser.controller', [
			'ui.bootstrap'
		])
		.controller('AddUserController', AddUserController);

	AddUserController.$inject = [
		'$scope', '$modalInstance', '$resource', 'API', 'UserService', 'toastr', 'centreHref'
	];

	function AddUserController($scope, $modalInstance, $resource, API, User, toastr, centreHref) {
		var vm = this;
		// bindable variables
		vm.newUser = {};
		vm.centreHref = centreHref;
		// bindable methods
		vm.addUser = addUser;
		vm.cancel = cancel;

		///////////////////////////////////////////////////////////////////////////

		function addUser() {			
			var access = {};
			// set access level for each selected collection centre
			_.each(vm.newUser.collectioncentre, function (centre) {
				access[centre] = vm.newUser.role;
			});

			var UserRes = $resource(API.url() + '/user/' + vm.newUser.user);

			UserRes.get(function (data) {
				// merge existing centreAccess with new attributes
				_.extend(access, data.items.centreAccess);

				var user = new User({
					'centreAccess': access,
					'isAdding': true,
					'collectionCentres': vm.newUser.collectioncentre
				});
				user.$update({ id: vm.newUser.user })
				.then(function() {
					toastr.success('Added user to collection centre!', 'Collection Centre');
				}).finally(function () {
					vm.newUser = {};
					$modalInstance.close();
				});			
			});			
		}

		function cancel() {
		  $modalInstance.dismiss('cancel');
		}

	}
})();