"use strict";

var app = angular.module('app', ['ngCookies','appCtrls','ui.bootstrap']);

app.factory('dialog', ['$modal','$log',function($modal,$log) {
	var modalInstance;
	return {
		open: function(url) {
			modalInstance = $modal.open({
				templateUrl: url
			});
			return modalInstance.result;
		},
		ok: function(results) {
			if(modalInstance) {
				modalInstance.close(results);
			}
			else {
				$log.warn("No dialog instance to submit");
			}
		},
		cancel: function(reason) {
			if(modalInstance) {
				modalInstance.dismiss(reason);
			}
			else {
				$log.warn("No dialog instance to dismiss");
			}
		}
	};
}]);

var appCtrls = angular.module('appCtrls', []);

appCtrls.controller('userCtrl', ['dialog','$scope','$log', function(dialog, $scope, $log) {
	
	var defaultMenu = [
		{
			name: "Login",
			action: 'login'
		}
	];
	
	$scope.userMenu = defaultMenu;
	
	var modalInstance;
	
	$scope.execute = function(action) {
		if(action == 'login') {
			var result = dialog.open('partials/login.html');
			result.then(function(result) {
				$log.debug(result);
				$scope.userMenu = [
					{
						name: 'User: ' + result.username, //NOTE don't trust this value in real apps!
						action: 'userConfig'
					}
				];
				alert('Logged in!');
			},function(reason) {
				$log.debug(reason);
			});
		}
		else {
			$log.error('Unknown action ' + action);
		}
	};
}]);


appCtrls.controller('loginCtrl', ['dialog','$scope','$cookies','$log',function(dialog,$scope,$cookies,$log) {
	
	$scope.dismiss = function(reason) {
		dialog.cancel(reason);
	};
	
	var $loginFrame = $('#loginFrame');
	
	$loginFrame.on('load',function() {
		var result = $.parseJSON($loginFrame.contents().text());
		if(result.status == 'ok') {
			$log.debug('User authentication ok');
			dialog.ok(result);
		}
		else {
			$log.warn("Login error");
			//TODO show user a error message
		}
	});
}]);

