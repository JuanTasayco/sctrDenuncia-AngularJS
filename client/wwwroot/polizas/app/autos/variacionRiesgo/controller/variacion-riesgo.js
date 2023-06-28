define([
    'angular','/polizas/app/autos/variacionRiesgo/component/component.js'
], function(angular) {
    
    angular.module("appAutos").controller("riesgoController",['$scope', '$stateParams', '$q', '$rootScope', '$state', 
    	function($scope, $stateParams, $q, $rootScope, $state)
    {
        $scope.riesgo = {};

        $scope.again = function(){	        
	        $rootScope.formData = {};
	        $state.go('autosQuote.steps', {step: 1}, {reload: true, inherit: false});
	      }

    }]);
});
