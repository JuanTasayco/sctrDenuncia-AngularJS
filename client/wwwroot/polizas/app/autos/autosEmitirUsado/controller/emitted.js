(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants',
	'/polizas/app/autos/autosEmitirUsado/service/usedCarEmitFactory.js', '/polizas/app/documentos/proxy/documentosFactory.js'], 
	function(angular, constants){
		angular.module("appAutos").controller('usedCarEmittedController', 
			['$scope', 'usedCarEmitFactory', '$window', 'mpSpin', '$state', 'carEmission', 'documentosFactory',
			function($scope, usedCarEmitFactory, $window, mpSpin, $state, carEmission, documentosFactory){
			
			(function onLoad(){
				$scope.mainStep = $scope.mainStep || {};

				$scope.currencyType = constants.currencyType.dollar.description;
				$scope.formatDate = constants.formats.dateFormat;

				//REDIRECCIONAR A ALGUN LADO
				(carEmission) ? $scope.mainStep.emissionData = carEmission : $state.go('homePolizasAutos');

			})();

			$scope.downloadPDF = function(){
				if ($scope.mainStep.emissionData.NumeroPoliza !== '') { 
					var vFileName = 'OIM - ' + $scope.mainStep.emissionData.NumeroPoliza + '.pdf';
					documentosFactory.generarArchivo($scope.mainStep.emissionData.NumeroPoliza, vFileName);
				}

			}

	}]).factory('loaderUsedCarEmittedController', ['usedCarEmitFactory', '$q', function(usedCarEmitFactory, $q){
		var claims, emission;

		//Claims
		function getClaims(){
			var deferred = $q.defer();
			usedCarEmitFactory.getClaims().then(function(response){
				claims = response;
				deferred.resolve(claims);
			}, function (error){
				deferred.reject(error.statusText);
			});
			return deferred.promise; 
		}

		//Emission
		function getEmission(documentNumber, showSpin){
			var deferred = $q.defer();
			usedCarEmitFactory.getEmission(documentNumber, showSpin).then(function(response){
				emission = response.Data;
				deferred.resolve(emission);
			}, function (error){
				deferred.reject(error.statusText);
			});
			return deferred.promise; 
		}

		return {
			getClaims: function(){
				if(claims) return $q.resolve(claims);
				return getClaims();
			},
			getEmission: function(documentNumber, showSpin){
				if(emission) return $q.resolve(emission);
				return getEmission(documentNumber, showSpin);
			}
		}

	}])
});