(function() {
	'use strict';	

	angular.module('dados.status', ['sails.io', 'toastr'])

	.config(function(toastrConfig) {
	  angular.extend(toastrConfig, {
	    autoDismiss: true,
	    closeButton: true,
	    positionClass: 'toast-top-right',
	    progressBar: true,
	    tapToDismiss: true,
	    timeOut: 5000
	  });
	})

	.directive('dadosStatus', function() {
		return {
			restrict: 'A',
			controller: StatusController,
			controllerAs: 'status'
		};
	});

	StatusController.$inject = ['$rootScope', '$sailsSocket', 'toastr'];

	function StatusController($rootScope, $sailsSocket, toastr) {
		var vm = this;

		var sendMessage = function(message) {
			switch(message.type) {
	  		case 'info': 		toastr.info(message.msg); break;
	  		case 'error': 	toastr.error(message.msg); break;
	  		case 'success': toastr.success(message.msg); break;
	  		case 'warning': toastr.warning(message.msg); break;
	  		default: 				toastr.info(message.msg);
	  	}
		};
		
		$rootScope.$on('status.authenticated', function (ev, user) {
			sendMessage({ 
				type: 'success', 
				msg: 'Hi ' + user.username + ', welcome to DADOS!' 
			});
		});

	  $rootScope.$on('status.update', function (ev, message) {
	  	sendMessage(message);
	  });
	}
})();
