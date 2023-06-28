(function($root, deps, action){
  define(deps, action)
})(this, [
  'angular'
  , 'constants'
  , 'helper'
  , 'seguridadFactory'],
  function(
    ng
    , constants
    , helper){

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('crearUsuarioEjecMapfreController',
      ['$scope'
      , '$window'
      , '$state'
      , '$timeout'
      , '$q'
      , 'mainServices'
      , 'mModalAlert'
      , 'seguridadFactory'
      , function(
          $scope
          , $window
          , $state
          , $timeout
          , $q
          , mainServices
          , mModalAlert
          , seguridadFactory){

          (function onLoad(){
            $scope.showResultado = false;
            $scope.showFullAccess = true;

            $scope.login = seguridadFactory.getVarLS("profile");

            $scope.create = $scope.create || {};

            $scope.create.validStep1 = false;
            $scope.create.validStep2 = false;
            $scope.create.validStep3  = false;

            $scope.createS1 = $scope.createS1 || {};
            $scope.createS2 = $scope.createS2 || {};
            $scope.createS3 = $scope.createS3 || {};            
            $scope.data = $scope.data || {};

            //$scope.id = $state.params.id;

            /*########################## Steps #########################*/
            $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
              $scope.currentStep = param.step;
            });
            $scope.nav = {}
            $scope.nav.go = function (step){
              // debugger;
              var e = { cancel : false, step: step }
              $scope.$broadcast('changingStep', e);
              return !e.cancel;
            }

          })();

          function _fnBackSearch() {
            $scope.showResultado = false;
          }

          function sinResultados(){
            mModalAlert.showInfo('', 'No se encontraron resultados');
          }

        }])
  });
