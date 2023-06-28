(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper', '/polizas/app/soat/emit/service/soatFactory.js'],
  function(angular, constants, helper){

    var appSoat = angular.module('appSoat');

    appSoat.controller('soatHomeController',
      ['$scope', '$window', '$state', '$timeout', 'proxySoat', 'oimClaims',
      function($scope, $window, $state, $timeout, proxySoat, oimClaims){

        (function onLoad(){
          $scope.$parent.formData = {};
        })();

        $scope.agentID = oimClaims.agentID;

        $scope.seleccionarTipo = function(tipo){
          if(tipo)
            $state.go(tipo);
        }

        $scope.goEmmit = function(){
          if(!$scope.isBlocked){
            $state.go('soatEmit.steps', {step: 1}, {reload: true, inherit: false});
          }
        }

    }]);

  });
