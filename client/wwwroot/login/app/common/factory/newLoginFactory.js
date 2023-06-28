'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

	var appLogin = angular.module('appLogin');
	
	appLogin.factory('newLoginFactory', 
	['proxyUsuario',
	'proxyPerson',
	function(proxyUsuario, proxyPerson){
		
		return{
			proxyUsuario: proxyUsuario,
			proxyPerson: proxyPerson
		};

	}]);

});
