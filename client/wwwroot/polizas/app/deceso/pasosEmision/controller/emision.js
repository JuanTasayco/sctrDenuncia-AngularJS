(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/vida/proxy/vidaFactory.js'], 
  function(angular, constants, helper){

    var appAutos = angular.module('appDeceso');

    appAutos.controller('decesoEmisionController', 
      ['$scope', '$window', '$state', '$timeout', '$filter', 'oimPrincipal',  
      function($scope, $window, $state, $timeout, $filter, oimPrincipal){
        $scope.gLblTitle = 'Emision';
        (function onLoad(){
          $scope.nav = {};
          $scope.ubigeos = $scope.ubigeos || {};

          $scope.nav.go = function (step) {
            var e = { cancel : false, step: step };
            $scope.$broadcast('changingStep', e);
            return !e.cancel;
          }
        })();
        
        $scope.$on('$destroy', function $destroy(){
          stateChangeSuccess();
        });
    
        var stateChangeSuccess = $scope.$on('$stateChangeSuccess', function (s, state, param) {
          $scope.currentStep = param.step;
        });

    }])
  });