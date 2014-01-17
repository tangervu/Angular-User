"use strict";

var app = angular.module('app', ['appCtrls','ngCookies','ui.bootstrap']);

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

app.factory('user', ['dialog', '$http', '$cookies', '$cookieStore', '$rootScope', '$log', function(dialog, $http, $cookies, $cookieStore, $rootScope, $log) {
	
	var token;
	
	if($cookies.token) {
		console.log('loggedIn');
		token = $cookies.token;
		$rootScope.$broadcast('login');
	}
	
	return {
		login: function(user, pass, persistent) {
			$http.post('api/login.php', {username: user, password: pass}).success(function(data) {
				$log.debug(data);
				if(data.status == "ok") {
					$log.debug("Login ok");
					$cookies.token = data.token; //NOTE angularjs cookies are not able to change cookie lifetime etc.
					token = data.token;
					$rootScope.$broadcast('login');
					return true;
				}
				else {
					alert("Login failed");
					return false;
				}
			}).error(function() {
				return false;
			});
		},
		logout: function() {
			$http.post('api/logout.php', {token: token});
			token = null;
			$cookieStore.remove('token');
			$rootScope.$broadcast('logout');
			return true;
		},
		renew: function() {
			$http.post('api/renew.php', {token: token}).success(function(data) {
				if(data.status == "ok") {
					$log.debug("Token renew ok");
					$cookies.token = data.token;
					token = data.token;
					return true;
				}
				else {
					$log.error("Token renew failed");
					return false;
				}
			});
		},
		info: {
			/* FIXME
			$http.post('api/user.php', {token: tokens}).success(function(data) {
				if(data.status == "ok") {
					$log.debug("User info ok");
					username = data.username;
				}
				else {
					$log.error("Token renew failed");
					username = null;
				}
			});
			*/
		}
	};
}]);

/**
 * Sample application controllers
 */

var appCtrls = angular.module('appCtrls', []);



/**
 * Controller for the navbar login link
 */
appCtrls.controller('userCtrl', ['user','dialog','$scope','$log', function(user, dialog, $scope, $log) {
	
	var defaultMenu = [
		{
			name: "Login",
			action: 'login'
		}
	];
	
	var createUserMenu = function() {
		$scope.userMenu = [
			{
				name: 'User: FIXME', // + user.info().username,
				action: 'userConfig'
			}
		];
	};
	
	$scope.$on('login', function(event) {
		createUserMenu();
	});
	
	$scope.$on('logout', function(event) {
		$scope.userMenu = defaultMenu;
	});
	
	$scope.userMenu = defaultMenu;
	
	var modalInstance;
	
	$scope.execute = function(action) {
		if(action == 'login') {
			dialog.open('partials/login.html').then(function() {
				createUserMenu();
			},function(reason) {
				$log.error('Bad username or password');
				$log.debug(reason);
			});
		}
		else if(action == 'userConfig') {
			alert("TODO: add some user related actions here");
		}
		else {
			$log.error('Unknown action ' + action);
		}
	};
}]);



/**
 * Controller for the login button
 */
appCtrls.controller('loginButtonCtrl', ['dialog','$scope','$log',function(dialog,$scope,$log) {
	
	$scope.login = function() {
		dialog.open('partials/login.html').then(function() {
			//Login success
		}, function(reason) {
			$log.error('Bad username or password');
			$log.debug(reason);
		});
	};
}]);



/**
 * Adds login form to the main page
 */
appCtrls.controller('loginFormCtrl', ['$scope',function($scope) {
	$scope.include = 'partials/login.html';
}]);



/**
 * Controller for the login form
 */
appCtrls.controller('loginCtrl', ['user','dialog','$scope','$log',function(user,dialog,$scope,$log) {
	
	$scope.loggedIn = false;
	
	$scope.dismiss = function(reason) {
		dialog.cancel(reason);
	};
	
	$scope.login = function() {
		user.login($scope.username, $scope.password);
		dialog.ok();
	}
	
	$scope.logout = function() {
		user.logout();
	};
	
	$scope.$on('login', function(event) {
		$log.debug(event);
		$scope.loggedIn = true;
	});
	
	$scope.$on('logout', function(event) {
		$log.debug(event);
		$scope.loggedIn = false;
	});
}]);

