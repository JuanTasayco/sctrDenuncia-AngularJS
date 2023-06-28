define([
  'angular', 'constantsRiesgosGenerales', 'contratante', 'equipos'
], function (ng, constantsRiesgosGenerales) {
  resumenTrecController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory'];
  function resumenTrecController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory) {
    var vm = this;
    vm.currencyType = currencyType
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      vm.contrata = vm.constantsRrgg.CONTRATA_TRANS.filter(function (item) { return item.Codigo === "S" })[0]
    };
    function currencyType(moneda) {
      return riesgosGeneralesFactory.currencyType(moneda)
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('resumenTrecController', resumenTrecController)
    .component('resumenTrec', {
      templateUrl: '/polizas/app/rrgg/components/trec/resumen-trec.component.html',
      controller: 'resumenTrecController',
      bindings: {
        resumen: '='
      }
    })
});
