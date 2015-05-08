angular.module('dados.status', ['ngSails', 'toastr'])

.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    autoDismiss: true,
    closeButton: true,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    maxOpened: 0,    
    newestOnTop: true,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    progressBar: true,
    tapToDismiss: true,
    timeOut: 5000
  });
})

.directive('dadosStatus', function() {

	var StatusController = function($scope, $sails, toastr) {
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
		
		$sails.on('status.authenticated', function (user) {
			sendMessage({ 
				type: 'success', 
				msg: 'Hi ' + user.username + ', welcome to DADOS!' 
			});
		});

	  $sails.on('status.update', function (message) {
	  	sendMessage(message);
	  });
	};

	return {
		restrict: 'A',
		controller: ['$scope', '$sails', 'toastr', StatusController],
		controllerAs: 'status'
	};
});

