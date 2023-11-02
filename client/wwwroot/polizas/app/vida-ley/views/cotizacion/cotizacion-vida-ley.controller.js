define([
  'angular', 'constants', 'constantsVidaLey'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('cotizacionVidaLeyController', CotizacionVidaLeyController);

  CotizacionVidaLeyController.$inject = ['$scope', '$state', 'oimPrincipal', 'oimClaims', 'vidaLeyFactory', 'parametros'];

  function CotizacionVidaLeyController($scope, $state, oimPrincipal, oimClaims, vidaLeyFactory, parametros) {
    var vm = this;

    vm.userRoot = oimPrincipal.validateAgent('evoSubMenuCWVI','COTIZACION');
    vm.user = {};
    vm.currentStep = 1;

    vm.nextStep = NextStep;
    vm.saveAgent = SaveAgent;
    vm.activeSeleccionarAgente = ActiveSeleccionarAgente;

    (function load_CotizacionVidaLeyController() {
      vidaLeyFactory.setClaims(oimClaims);
      vm.userRoot = oimPrincipal.validateAgent('evoSubMenuEMISAVIDALEY','HOME');
      vm.user = vidaLeyFactory.getUser();
      vidaLeyFactory.initCotizacion();

      vm.agente = vidaLeyFactory.cotizacion.modelo.agente;

      vidaLeyFactory.setParametros(parametros);

    })();

    function SaveAgent(agente) {
      vidaLeyFactory.setAgenteCotizacion(agente);
    }

    function NextStep(step) {
      var e = { cancel: false, step: step };
      $scope.$broadcast('changingStep', e);
      return !e.cancel;
    }

    function ActiveSeleccionarAgente() {
      return !!(vidaLeyFactory.cotizacion && vidaLeyFactory.cotizacion.step && vidaLeyFactory.cotizacion.step["1"]);
    }

    var cleanup = $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      vm.currentStep = toParams.step;
    });

    $scope.$on('$destroy', function() {
      cleanup();
    });


  }

});
