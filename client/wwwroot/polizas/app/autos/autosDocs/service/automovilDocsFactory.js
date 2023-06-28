'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

		var appAutos = angular.module('appAutos');

		appAutos.factory('automovilDocsFactory',
		['$http', '$q', '$window', 'proxyClaims',
		function($http, $q, $window, proxyClaims){

			var base = constants.system.api.endpoints.policy;
			var base2 = constants.system.api.endpoints.security;

			function concatenateUrl(params){
				var url = '';
				angular.forEach(params, function(value, key) {
					url += '/' + value;
				});
				url ? url : url = '/';
				return url;
			}

			function getData(url, params){
				var newUrl = url + concatenateUrl(params)
				var deferred = $q.defer();
				$http({
						method : 'GET',
						url : base + newUrl,
						headers: {
							'Content-Type': 'application/json'
						}
					}).then( function(response) {
						deferred.resolve(response.data);
					}
				);
				return deferred.promise;
			}

			function getDataUser(url, params){
				var newUrl = url + concatenateUrl(params)
				var deferred = $q.defer();
				$http({
						method : 'GET',
						url : base2 + newUrl,
						headers: {
							'Content-Type': 'application/json'
						}
					}).then( function(response) {
						deferred.resolve(response);
					}
				);
				return deferred.promise;
			}

			function postData(url, params){
				var deferred = $q.defer();
				$http({
						method : 'POST',
						url : base + url,
						data: params,
						headers: {
							'Content-Type': 'application/json'
						}
					}).then( function(response) {
						deferred.resolve(response.data);
					}
				);
				return deferred.promise;
			}

			var addVariableSession = function(key, newObj) {
		  var mydata = newObj;

		      $window.sessionStorage.setItem(key, JSON.stringify(mydata));
		  };

			function buscarDocumento(params){
				return getData('api/documento/documentoBuscar', params);
			}

			function buscarContratante(params){
				return getData('api/contratante/datos/1', params);
			}

			function getProducts(params){
				return postData('api/producto/usuario', params);
			}

			function getCotizaciones(paramsCotizacionesVigentes){
				return postData('api/documento/cotizacion/vigente', paramsCotizacionesVigentes);
			}

			function getClaims(){
				return proxyClaims.GetClaims();
			}

			return{
				addVariableSession: addVariableSession,
				buscarDocumento: buscarDocumento,
				buscarContratante: buscarContratante,
				getProducts: getProducts,
				getCotizaciones: getCotizaciones,
				getClaims: getClaims
			};

		}]);

});

