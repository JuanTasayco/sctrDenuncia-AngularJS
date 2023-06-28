(function($root, deps, action){
  define(deps, action)
})(this, ['angular'
, 'constants'
, 'helper'],
  function(ng
    , constants
    , helper){

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('crearUsuarioCorredorController',
      ['$scope'
      , '$state'
      , '$timeout'
      , 'seguridadFactory'
      ,  function($scope
          , $state
          , $timeout
          , seguridadFactory){

          (function onLoad(){

            $scope.login = seguridadFactory.getVarLS("profile");

            $scope.create = $scope.create || {};
            $scope.create.numUsuario = 0;
            $scope.create.disabled = false;

            $scope.create.validStep1 = false;
            $scope.create.validStep2 = false;
            $scope.create.validStep3  = false;

            $scope.createS1 = $scope.createS1 || {};
            $scope.createS2 = $scope.createS2 || {};
            $scope.createS3 = $scope.createS3 || {};            
            $scope.data = $scope.data || {};

          })();

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

        }])
  });
