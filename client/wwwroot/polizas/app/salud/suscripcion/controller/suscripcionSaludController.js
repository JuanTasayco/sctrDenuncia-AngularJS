'use strict';

define(['angular'], function(angular) {

  suscripcionSaludController.$inject = ['$scope', '$state'];
  function suscripcionSaludController($scope, $state) {
    var vm = this;

    $scope.gLblTitle = 'Suscripción';

    vm.$onInit = onInit;
    $scope.$on('$destroy', function $destroy(){
      stateChangeSuccess();
    });

    var stateChangeSuccess = $scope.$on('$stateChangeSuccess', function (s, state, param) {
      $scope.currentStep = param.step;
    });

    function onInit() {
      $scope.nav = {};
      $scope.ubigeos = $scope.ubigeos || {};

      $scope.nav.go = function (step) {
        var e = { cancel : false, step: step };
        $scope.$broadcast('changingStep', e);
        return !e.cancel;
      }
    };
  }

  return angular.module('appSalud')
    .controller('suscripcionSaludController', suscripcionSaludController);

});
