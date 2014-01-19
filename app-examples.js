/**
 * Sample application controllers
 */

"use strict";

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
		$log.debug('[ctrl:userCtrl] Login event');
		createUserMenu();
	});
	
	$scope.$on('logout', function(event) {
		$log.debug('[ctrl:userCtrl] Logout event');
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
			$log.error('[ctrl:userCtrl] Unknown action ' + action);
		}
	};
}]);



/**
 * Controller for the login button
 */
appCtrls.controller('loginButtonCtrl', ['dialog','$scope','$log',function(dialog,$scope,$log) {
	
	$scope.login = function() {
		dialog.open('partials/login.html').then(function() {
			$log.debug('[ctrl:loginButtonCtrl] Login success');
			//Login success
		}, function(reason) {
			$log.debug('[ctrl:loginButtonCtrl] Login failed');
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
		$log.debug("[ctrl:loginCtrl] Dismiss called: " + reason);
		dialog.cancel(reason);
	};
	
	$scope.login = function() {
		$log.debug("[ctrl:loginCtrl] User login called");
		$log.debug({username: $scope.username, password: $scope.password});
		var promise = user.login($scope.username, $scope.password);
		$log.debug("[ctrl:loginCtrl] Got promise");
		$log.debug(promise);
		promise.then(function(result) {
			$log.debug('[ctrl:loginCtrl] Got promise result');
			$log.debug(result);
			if(result) {
				$log.debug("[ctrl:loginCtrl] Login success");
			}
			else {
				$log.debug("[ctrl:loginCtrl] Login failed");
			}
			//TODO create handler for unsuccessful logins
			dialog.ok();
		});
	}
	
	$scope.logout = function() {
		$log.debug("[ctrl:loginCtrl] User logout called");
		user.logout();
	};
	
	$scope.$on('login', function(event) {
		$log.debug("[ctrl:loginCtrl] Event 'login' triggered");
		$scope.loggedIn = true;
	});
	
	$scope.$on('logout', function(event) {
		$log.debug("[ctrl:loginCtrl] Event 'logout' triggered");
		$scope.loggedIn = false;
	});
}]);

