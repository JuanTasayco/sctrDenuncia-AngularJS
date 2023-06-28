'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

		var appAutos = angular.module('appAutos');

		appAutos.factory('hogarQuoteFactory',
		['$http', '$q', 'proxyClaims',
		function($http, $q, proxyClaims){

			var base = constants.system.api.endpoints.policy;
			var baseLogin = constants.system.api.endpoints.security;

			function concatenateUrl(params){
				var url = '';
				angular.forEach(params, function(value, key) {
					url += '/' + value;
				});
				url ? url : url = '/';
				return url;
			}

			function getData(base, url, params, concatenate){
				var newUrl = url;
				var newParams = params;
				if (concatenate) {
					newUrl = url + concatenateUrl(params);
					newParams = '';
				}
				return $http({
					method : 'GET',
					url : base + newUrl,
					params: newParams,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}

			function postData(base, url, params){
				return $http({
					method : 'POST',
					url : base + url,
					data: params,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}

			function getProducts(){
				var params = {
				  codeCia: constants.module.polizas.hogar.codeCia,
				  codeRamo: constants.module.polizas.hogar.codeRamo
				}
				return getData(base, 'api/hogar/modalidad', params, true);
			}


			function getClaims(){
				return proxyClaims.GetClaims();
			}

			function getAgent(params){
				return $http.get(base + 'api/agente/buscar?codigoNombre=' + params);
			}

			function getDocumentTypes(){
				return getData(base, 'api/general/tipodoc/nacional', '', false);
			}

			function getMonitoringAlarm(){
				var params ={
					codCia: constants.module.polizas.hogar.codeCia,
					codRamo: constants.module.polizas.hogar.codeRamo
				}
				return getData(base, 'api/hogar/alarmaMonitoreo', params, false)
			}

			function getCategory(){
				var params ={
					codCia: constants.module.polizas.hogar.codeCia,
					codRamo: constants.module.polizas.hogar.codeRamo
				}
				return getData(base, 'api/hogar/categoriaConstruccion', params, false)
			}

			function getContractor(params){
				return getData(base, 'api/contratante/datos/1', params, true);
			}

			function getConstructionYears(){
				return getData(base, 'api/hogar/anioInmueble', '', false);
			}

			function getCoverage(params){
				return postData(base, 'api/cotizacion/comparativo/hogar', params);
			}
			function getDeducible(params){

				return postData(base, 'api/cotizacion/comparativo/hogar', params);
			}

			function getFinancing(params){
				return postData(base, 'api/cotizacion/financiamiento/hogar', params);
			}

			return{
				getProducts: getProducts,
				getClaims: getClaims,
				getAgent: getAgent,
				getDocumentTypes: getDocumentTypes,
				getMonitoringAlarm: getMonitoringAlarm,
				getCategory: getCategory,
				getContractor: getContractor,
				getConstructionYears: getConstructionYears,
				getCoverage: getCoverage,
				getDeducible: getDeducible,
				getFinancing: getFinancing
			};

		}]);

});
