'use strict';

define(['angular'], function(angular) {

  emisionClinicDigitalController.$inject = ['$scope', '$state'];
  function emisionClinicDigitalController($scope, $state) {
    var vm = this;

    $scope.gLblTitle = 'Emision Clinica Digital';

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

  return angular.module('appClinicaDigital')
    .controller('emisionClinicDigitalController', emisionClinicDigitalController);

});
