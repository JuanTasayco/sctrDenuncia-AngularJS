(function($root, deps, action){
    define(deps, action)
})(this, [
'angular',
'constants',
'helper',
'/polizas/app/empresa/factory/empresasFactory.js'],
function(
	angular,
	constants,
	helper){
    var appAutos = angular.module('appAutos');
    appAutos.controller('homeCompany', [
    	'$scope',
    	'$window',
    	'$state',
    	'empresasFactory',
    	'$timeout',
      function(
      	$scope,
      	$window,
      	$state,
      	empresasFactory,
      	$timeout){

	        (function onLoad(){
	          $scope.mainStep = $scope.mainStep || {};

              $scope.goToEmit = function(){
                $state.go('emitEmpresa')
              }

	        })();

    }]);

  });
