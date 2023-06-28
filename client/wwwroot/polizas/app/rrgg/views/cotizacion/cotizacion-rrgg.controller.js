define([
  'angular', 'constants', 'constantsRiesgosGenerales'
], function (angular, constants, constantsRiesgosGenerales) {
  'use strict';

  angular
    .module("appRrgg")
    .controller('cotizacionRrggController', cotizacionRrggController);

  cotizacionRrggController.$inject = ['$scope', '$state', 'oimClaims', 'riesgosGeneralesFactory'];

  function cotizacionRrggController($scope, $state, oimClaims, riesgosGeneralesFactory) {

    (function load_cotizacionRrggController() {
      riesgosGeneralesFactory.setClaims(oimClaims);
    })();


    $scope.NextStep = function (step) {
      if (step === "1") {
        $state.go('.', {
          step: step
        });
      }
    }

    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    });

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      if (riesgosGeneralesFactory.getTramite().NroTramite === 0)
        $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: constantsRiesgosGenerales.STEPS.COTIZACION });
      $scope.currentStep = toParams.step;
    });
  }

});
