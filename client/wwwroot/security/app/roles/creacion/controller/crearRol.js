(function($root, deps, action){
    define(deps, action)
  })(this, ['angular', 'constants', 'helper'],
    function(angular, constants, helper){
  
      var appSecurity = angular.module('appSecurity');
  
      appSecurity.controller('crearRolController',
        ['$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm',
          function($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm){
  
            (function onLoad(){
                $scope.create = $scope.create || {};

                $scope.create.validStep1 = false;
                $scope.create.validStep2 = false;
  
                $scope.createS1 = $scope.createS1 || {};
                $scope.createS2 = $scope.createS2 || {};

                // Code here...
                /*#### Steps ####*/
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
  
      }])
    });
  