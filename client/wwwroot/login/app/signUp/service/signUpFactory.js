'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

		// var appLogin = angular.module('appLogin',[]);
		var appLogin = angular.module('appLogin');
		
		appLogin.factory('signUpFactory', ['oimHttpSrv', function(oimHttpSrv){
			
			// var base = constants.system.api.url;
			// var base = 'http://10.160.124.111/oim_login/api/seguridad/acceso/';
			var base = constants.system.api.endpoints.security;

			function signUp(data){
				//'api/seguridad/acceso/registrarnuevo'
				return oimHttpSrv.post(base + 'api/seguridad/acceso/registrarnuevo', data, { headers: { 'Content-Type': 'application/json' } });

			}

			function sendPasswordxEmail(data){
				//'api/seguridad/acceso/enviamail'
				return oimHttpSrv.post(base + 'api/seguridad/acceso/enviamail', data, { headers: { 'Content-Type': 'application/json' } });

			}

			return{
				signUp: signUp,
				sendPasswordxEmail: sendPasswordxEmail
			};

		}]);

});
