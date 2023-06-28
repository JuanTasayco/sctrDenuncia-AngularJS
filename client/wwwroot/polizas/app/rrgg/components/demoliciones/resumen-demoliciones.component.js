define([
    'angular', 'constantsRiesgosGenerales'
  ], function (ng, constantsRiesgosGenerales) {
    resumenDemolicionesController.$inject = ['mModalAlert', 'riesgosGeneralesCommonFactory', 'riesgosGeneralesFactory', 'mModalConfirm', 'mainServices'];
    function resumenDemolicionesController(mModalAlert, riesgosGeneralesCommonFactory, riesgosGeneralesFactory, mModalConfirm, mainServices) {
      var vm = this;
      vm.currencyType = currencyType;
      vm.$onInit = function () {
      };
      function currencyType (moneda){
        return  riesgosGeneralesFactory.currencyType(moneda)
       }
    }
    return ng.module('appRrgg')
      .controller('resumenDemolicionesController', resumenDemolicionesController)
      .component('resumenDemoliciones', {
        templateUrl: '/polizas/app/rrgg/components/demoliciones/resumen-demoliciones.component.html',
        controller: 'resumenDemolicionesController',
        bindings: {
            resumen: '='
        }
      })
  });
