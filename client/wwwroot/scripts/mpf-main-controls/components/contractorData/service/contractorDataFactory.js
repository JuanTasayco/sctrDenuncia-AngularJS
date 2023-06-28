'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

		var appControls = angular.module('mapfre.controls');

		appControls.factory('contractorDataFactory', ['$http', '$q', function($http, $q){

			var base = constants.system.api.endpoints.policy;

			function concatenateUrl(params){
				var url = '';
				angular.forEach(params, function(value, key) {
					url += '/' + value;
				});
				url ? url : url = '/';
				// console.log(url);
				return url;
			}
			function getContractor(documentType, documentValue){
				return getData('api/contratante/datos/1/'+ documentType+'/' + documentValue);
			}

			function getContractorSoat(params){
				return postData('api/contratante/datos/soat', params);
			}

			function getContractorAutos2(documentType, documentValue){
				return getData('api/contratante/multiempresa/'+ documentType+'/' + documentValue);
			}

			function getDocumentTypes(){
				return getData('api/general/tipodoc/nacional');
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

			//https://mxperu.atlassian.net/browse/OIM-113
			function getProfessions(){
				return getData('api/general/ocupacion');
			}

			//https://mxperu.atlassian.net/browse/OIM-114
			function getEconomicsActivities(){
				return getData('api/general/actividadeconomica');
			}

			function listarAbonado(tipoDocumento, numeroDocumento) {
        return getData('api/contratante/abonado/pendiente/' + tipoDocumento + '/' + numeroDocumento);
      }

			function getDays(){
				var arrayDay = [];
				var objDay = {};
				var days = 31;
				var description = '';
				for(var i = 1; i <= days; i++) {
					description = ('0' + i).slice (-2);
					objDay = {
						id: i,
						description: description
					};
					arrayDay.push(objDay);
				}
				return arrayDay;
			}

			function getMonths(){
				var arrayMonth = [];
				var objMonth = {};
				var months = 12;
				var description = '';
				for(var i = 1; i <= months; i++) {
					description = ('0' + i).slice (-2);
					objMonth = {
						id: i,
						description: description
					};
					arrayMonth.push(objMonth);
				}
				return arrayMonth;
			}

			function getYears(){
				var thisYear = new Date().getFullYear();
				var firstYear = thisYear - 100;
				var arrayYear = [];
				var objYear = {};
				for(var i = firstYear; i <= thisYear; i++) {
					objYear = {
						id: i,
						description:i
					};
					arrayYear.push(objYear);
				}
				return arrayYear;
			}

			return{
				getProfessions: getProfessions,
				getEconomicsActivities: getEconomicsActivities,
				getDays: getDays,
				getMonths: getMonths,
				getYears: getYears,
				getDocumentTypes: getDocumentTypes,
				getContractor: getContractor,
				getContractorSoat: getContractorSoat,
				listarAbonado: listarAbonado,
				getContractorAutos2: getContractorAutos2
			};

		}]);

});
