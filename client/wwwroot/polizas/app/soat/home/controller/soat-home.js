(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper', '/polizas/app/soat/emit/service/soatFactory.js'],
  function(angular, constants, helper){

    var appSoat = angular.module('appSoat');

    appSoat.controller('soatHomeController',
      ['$scope', '$window', '$state', '$timeout', 'proxySoat', 'oimClaims','authorizedResource',
      function($scope, $window, $state, $timeout, proxySoat, oimClaims,authorizedResource){
        $scope.valid = false;

        (function onLoad(){
          $scope.$parent.formData = {};
          var accessSubMenu = authorizedResource.accessSubMenu;
          if (angular.isArray(accessSubMenu)) {
            for (var i = 0; i < accessSubMenu.length; i++) {
              var obj = accessSubMenu[i];
              if(obj.nombreCabecera == "SOAT"){
                $scope.valid = obj.items.some(function(value) {
                   return value.nombreLargo.includes("OPC");
                });
              }
            }
          }
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
