angular.module('dados.error.controller', ['dados.common.services.error'])

.controller('ErrorController', ['$modal', '$timeout', '$sails', 
	function($modal, $timeout, $sails) {
		var vm = this;
		var socketErrorModal = null;

		function closeSocketErrorModal() {
			if (socketErrorModal) {
				socketErrorModal.dismiss();
				socketErrorModal = null;
			}
		}

		function openSocketErrorModal(message) {
			closeSocketErrorModal();
			socketErrorModal = $modal.open({
				size: 'lg',
				templateUrl: 'error/dados-error.tpl.html',
				controller: function ErrorModalCtrl($modalInstance, ErrorService) {
					var sm = this;
					sm.error = ErrorService.getInfo();
					sm.error.message = message;

					sm.reconnect = function() {
						$sails.socket.connect();
					};
					sm.sendError = function() {
						console.log(sm.error);
						// ErrorService.getScreenshot();
					};
				},
				controllerAs: 'err',
				backdrop: 'static',
				keyboard: false
			});
		}

		vm.socketReady = false; // Wait for socket to connect

		$sails.on('connect', function (data) {
			closeSocketErrorModal();
			vm.socketReady = true;
		});

		$sails.on('disconnect', function (data) {
			$timeout(function() {
				openSocketErrorModal('The application cannot reach the server... Please wait');
				vm.socketReady = false;	
			}, 500);			
		});

		$sails.on('failure', function (event, data) {
			openSocketErrorModal('The application failed to connect to the server.');
		});		
	}
]);