define([
  'angular', 'constants', 'constantsVidaLey'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('emisionVidaLeyController', EmisionVidaLeyController);

  EmisionVidaLeyController.$inject = ['$scope', '$state', 'oimClaims', 'vidaLeyFactory'];

  function EmisionVidaLeyController($scope, $state, oimClaims, vidaLeyFactory) {
    var vm = this;

    vm.userRoot = false;
    vm.user = {};
    vm.currentStep = 1;
    vm.nextStep = NextStep;

    (function load_EmisionVidaLeyController() {
      vidaLeyFactory.setClaims(oimClaims);
      vm.userRoot = vidaLeyFactory.isUserRoot();
      vm.user = vidaLeyFactory.getUser();
    })();

    function NextStep(step) {
      var e = { cancel: false, step: step };
      $scope.$broadcast('changingStep', e);
      return !e.cancel;
    }

    var cleanup = $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      vm.currentStep = toParams.step;
    });

    $scope.$on('$destroy', function() {
      cleanup();
    });
  }

});
