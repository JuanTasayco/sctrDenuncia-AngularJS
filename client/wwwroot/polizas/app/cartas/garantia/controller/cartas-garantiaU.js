(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper'], function(angular, constants, helper) {
	angular.module('appCartas').controller('cartaGarantiaController', ['$scope', '$state','$timeout', '$window', function($scope, $state, $window){
		$scope.pasosgarantia = [
			{description: 'Buscador de cartas'}
		];

		$scope.$on('$stateChangeSuccess', function (s, state, param, d) {
			$scope.currentStep = param.step;
	    });

		$scope.gotoStep = function(step) {
	    	if ($scope.currentStep > step) {
	    		$state.go('.', {
	    			step : step
	    		});
	    	}
	    };
	}]);
});
