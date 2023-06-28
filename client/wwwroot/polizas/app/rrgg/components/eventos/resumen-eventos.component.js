define([
  'angular', 'constantsRiesgosGenerales'
], function (ng, constantsRiesgosGenerales) {
  resumenEventosController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'mModalConfirm', 'mainServices'];
  function resumenEventosController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, mModalConfirm, mainServices) {
    var vm = this;
    vm.currencyType = currencyType;
    vm.$onInit = function () {
    };
    function currencyType(moneda) {
      return riesgosGeneralesFactory.currencyType(moneda)
    }
  }
  return ng.module('appRrgg')
    .controller('resumenEventosController', resumenEventosController)
    .component('resumenEventos', {
      templateUrl: '/polizas/app/rrgg/components/eventos/resumen-eventos.component.html',
      controller: 'resumenEventosController',
      bindings: {
        resumen: '='
      }
    })
});
