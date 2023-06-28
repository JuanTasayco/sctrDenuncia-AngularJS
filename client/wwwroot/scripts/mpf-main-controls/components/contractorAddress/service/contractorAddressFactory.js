'use strict'

define([
	'angular', 'constants'
], function(angular, constants){
		
		var appControls = angular.module('mapfre.controls');
		
		appControls.factory('contractorAddressFactory', ['$http', '$q', function($http, $q){
			
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

			//https://mxperu.atlassian.net/browse/OIM-115
			function getTypeVias(){
				//http://localhost:57689/api/general/domicilio/tipo
				return getData('api/general/domicilio/tipo');
			}

			//https://mxperu.atlassian.net/browse/OIM-116
			function getTypeNumbers(){
				//http://localhost:57689/api/general/domicilio/numeracion
				return getData('api/general/domicilio/numeracion');
			}

			//https://mxperu.atlassian.net/browse/OIM-217
			function getTypeInteriors(){
				//http://localhost:57689/api/general/domicilio/interior
				return getData('api/general/domicilio/interior');
			}

			//https://mxperu.atlassian.net/browse/OIM-118
			function getTypeZones(){
				//http://localhost:57689/api/general/domicilio/zona
				return getData('api/general/domicilio/zona');
			}

			
			return{
				getTypeVias: getTypeVias,
				getTypeNumbers: getTypeNumbers,
				getTypeInteriors: getTypeInteriors,
				getTypeZones: getTypeZones
			};

		}]);

});
