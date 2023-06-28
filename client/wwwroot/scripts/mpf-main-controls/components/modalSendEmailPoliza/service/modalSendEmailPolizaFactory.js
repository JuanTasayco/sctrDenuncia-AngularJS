'use strict'

define([
	'angular', 'constants'
], function (angular, constants) {

	var appControls = angular.module('mapfre.controls');

	appControls.factory('modalSendEmailPolizaFactory', [
		'proxyMail',
		'proxySctr',
		'$http',
		'$q',
		'proxyEmpresa',
		'proxyVidaLey',
		function (
			proxyMail,
			proxySctr,
			$http,
			$q,
			proxyEmpresa,
			proxyVidaLey
		) {

			var base = constants.system.api.endpoints.gcw;

			function sendEmail(action, data) {
				var accion;

				if ((typeof action.action == 'undefined')) {
					accion = action;
				} else {
					accion = action.action;
				}
				console.log('accion:', accion); //MSAAVEDRA
				// debugger;
				switch (accion) {
					case 'enviarPoliza':
						console.log(data);
						return sendEmailPoliza(data, false);
					default:
						return $q(function (resolve, reject) {
							setTimeout(function () {
								reject("Action " + action + " no definido");
							}, 1000);
						})
				}
			}

			function sendEmailPoliza(data, showSpin) {
				console.log('msaavedra', data);
				return $http.post(base + 'api/policy/send', data, { headers: { 'Content-Type': 'application/json' } });
			}

			return {
				sendEmail: sendEmail
			};

		}]);

});
