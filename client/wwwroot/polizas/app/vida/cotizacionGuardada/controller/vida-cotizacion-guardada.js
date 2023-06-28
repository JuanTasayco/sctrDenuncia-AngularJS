(function($root, deps, action){
		define(deps, action)
})(this, ['angular', 'constants', 'helper'], 
	function(angular, constants, helper){

		var appAutos = angular.module('appVida');

		appAutos.controller('vidaCotizacionGuardadaController', 
			['$scope', '$window', '$state', '$timeout', 
			function($scope, $window, $state, $timeout){
		
				// (function onLoad(){
				// 	$scope.mainStep = $scope.mainStep || {};
				// 	$scope.firstStep = $scope.firstStep || {};
				// 	$scope.secondStep = $scope.secondStep || {};

				// 	$scope.currencyType = constants.currencyType.dollar.description;
				// 	$scope.formatDate = constants.formats.dateFormat;
					

				// })();


		
		}])
});