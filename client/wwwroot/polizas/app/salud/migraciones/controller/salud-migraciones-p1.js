(function($root, deps, action) {
  define(deps, action)
})(this,
  ['angular', 'constants'],

  function(angular, constants) {
    angular
      .module("appSalud")
      .controller('saludMigracionesS1', ['$scope', '$state', 'mpSpin', '$timeout', '$stateParams', '$rootScope', '$q', '$http', 'saludFactory',
        function($scope, $state, mpSpin, $timeout, $stateParams, $rootScope, $q, $http, saludFactory) {

          $scope.activeTab = 0;
          $scope.loading = false;

          $scope.cambiarTab = function ($event, $selectedIndex){
            $scope.activeTab = $selectedIndex;
          };

          $scope.validatationDatosPoliza = function ($event) {
           if(!$event.evento){
             $scope.activeTab = 0;
           }
          };

          $scope.goPlanMigracion = function ($event) {
            if($event.evento){
              $scope.activeTab = 1;
            }
          };

        }]);
  });
