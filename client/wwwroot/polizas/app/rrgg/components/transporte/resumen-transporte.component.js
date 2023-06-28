define([
  'angular', 'constantsRiesgosGenerales'
], function (ng, constantsRiesgosGenerales) {
  resumenTransporteController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'mModalConfirm', 'mainServices'];
  function resumenTransporteController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, mModalConfirm, mainServices) {
    var vm = this;
    vm.currencyType = currencyType
    vm.$onInit = function () {
      var codramos = ["S0014","S0015","S0018"];
      setTimeout(function () {
        vm.showExceptoDeducible = codramos.includes(vm.resumen.Ramo.Codigo);
      }, 200);
    };
    function currencyType(moneda) {
      return riesgosGeneralesFactory.currencyType(moneda)
    }
  }
  return ng.module('appRrgg')
    .controller('resumenTransporteController', resumenTransporteController)
    .component('resumenTransporte', {
      templateUrl: '/polizas/app/rrgg/components/transporte/resumen-transporte.component.html',
      controller: 'resumenTransporteController',
      bindings: {
        resumen: '='
      }
    })
});
