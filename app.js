"use strict";

var app = angular.module('app', ['appCtrls','ngCookies','ui.bootstrap']);

app.factory('dialog', ['$modal','$log',function($modal,$log) {
	var modalInstance;
	return {
		open: function(url) {
			$log.debug("[factory:dialog] Dialog open");
			modalInstance = $modal.open({
				templateUrl: url
			});
			return modalInstance.result;
		},
		ok: function(results) {
			$log.debug("[factory:dialog] Dialog close");
			$log.debug(results);
			if(modalInstance) {
				modalInstance.close(results);
			}
			else {
				$log.warn("No dialog instance to submit");
			}
		},
		cancel: function(reason) {
			$log.debug("[factory:dialog] Dialog dismiss");
			$log.debug(reason);
			if(modalInstance) {
				modalInstance.dismiss(reason);
			}
			else {
				$log.warn("No dialog instance to dismiss");
			}
		}
	};
}]);

app.factory('user', ['dialog', '$http', '$cookies', '$cookieStore', '$rootScope', '$interval', '$log', function(dialog, $http, $cookies, $cookieStore, $rootScope, $interval, $log) {
	
	var token;
	
	var user = {
		login: function(user, pass, persistent) {
			var request = {username: user, password: pass};
			$log.debug("[factory:user] Post login request");
			$log.debug(request);
			var promise = $http.post('api/login.php', request).then(function(response) {
				$log.debug("[factory:user] Got login response");
				$log.debug(response);
				if(response.data && response.data.status == "ok") {
					$log.debug("[factory:user] Login ok");
					$cookies.token = response.data.token; //NOTE angularjs cookies are not able to change cookie lifetime etc.
					token = response.data.token;
					$rootScope.$broadcast('login');
					renew(response.data.lifetime);
					return true;
				}
				else {
					$log.debug("[factory:user] Login failed");
					//alert("Login failed");
					return false;
				}
			});
			$log.debug('[factory:user] Login promise created')
			$log.debug(promise);
			return promise;
		},
		logout: function() {
			$log.debug("[factory:user] Post logout request");
			$log.debug(token);
			$http.post('api/logout.php', {token: token}).then(function(response) {
				$log.debug("[factory:user] Got logout response");
				$log.debug(response);
			});
			token = null;
			$cookieStore.remove('token');
			$rootScope.$broadcast('logout');
			return true;
		},
		renew: function() {
			$log.debug("[factory:user] Post token renew request for token " + token);
			var promise = $http.post('api/renew.php', {token: token}).then(function(response) {
				$log.debug("[factory:user] Got renew response");
				$log.debug(response);
				if(response.data && response.data.status == "ok") {
					$log.debug("[factory:user] Token renew ok, new token " + response.data.token);
					$cookies.token = response.data.token;
					token = response.data.token;
					renew(response.data.lifetime);
					return true;
				}
				else {
					$log.error("[factory:user] Token renew failed");
					return false;
				}
			});
			$log.debug("[factory:user] Created token renew promise");
			$log.debug(promise);
			return promise;
		},
		verify: function() {
			$log.debug('[factory:user] Post verify request');
			$log.debug({token: token});
			var promise = $http.post('api/user.php', {token: token}).then(function(response) {
				$log.debug('[factory:user] Got verify response');
				$log.debug(response);
				if(response.data && response.data.status == "ok") {
					$log.debug("[factory:user] Got username: " + response.data.username);
					return {
						username: response.data.username,
						lifetime: response.data.lifetime
					};
				}
				else {
					$log.error("[factory:user] User verify error");
					return false;
				}
				
			});
			$log.debug('[factory:user] Created verify promise');
			$log.debug(promise);
			return promise;
		}
	};
	
	var renew = function(lifetime) {
		$log.debug('[factory:user] Interval created, lifetime ' + lifetime);
		$interval(function() {
			$log.debug('[factory:user] Interval for renew');
			user.renew();
		}, lifetime*1000, 1);
		
	};
	
	if($cookies.token) {
		$log.debug("[factory:user] Has token cookie: " + $cookies.token);
		token = $cookies.token;
		var promise = user.verify();
		promise.then(function(response) {
			$log.debug("[factory:user] Verify response")
			$log.debug(response);
			if(response && response.username) {
				renew(response.lifetime);
				$rootScope.$broadcast('login');
			}
			else {
				$log.error("[factory:user] User verify error");
				token = null;
				$cookieStore.remove('token');
				$rootScope.$broadcast('logout');
			}
		});
	}
	
	return user;
}]);

