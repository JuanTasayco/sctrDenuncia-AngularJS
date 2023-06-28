define([
  'angular', 'constantsSepelios'
], function (angular, constantsSepelios) {
  'use strict';

  angular
    .module("appSepelio")
    .controller('cotizacionSepelioController', cotizacionSepelioController);

    cotizacionSepelioController.$inject = ['$scope', '$state', 'oimClaims', 'campoSantoFactory'];

  function cotizacionSepelioController($scope, $state, oimClaims, campoSantoFactory) {

    (function load_cotizacionSepelioController() {
      campoSantoFactory.setDataStep({});
    })();
    
    $scope.nav = {}
    $scope.dataStep = {};

    $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
      $scope.currentStep = param.step;
    });

    $scope.nav.go = function (step){
      var e = { cancel : false, step: step }
      $scope.$broadcast('changingStep', e);
      return !e.cancel;
    }

  }

});
