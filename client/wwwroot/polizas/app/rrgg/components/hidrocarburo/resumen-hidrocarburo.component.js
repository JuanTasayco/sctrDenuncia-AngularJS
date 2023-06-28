define([
  'angular', 'constantsRiesgosGenerales', 'contratante', 'locales', 'vehiculos'
], function (ng, constantsRiesgosGenerales) {
  resumenHidrocarburoController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory'];
  function resumenHidrocarburoController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory) {
    var vm = this;
    vm.currencyType = currencyType;
    vm.unidadLocal = unidadLocal;
    vm.sumaAseguradaDolaresSoles = sumaAseguradaDolaresSoles;
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
    };
    function currencyType(moneda) {
      return riesgosGeneralesFactory.currencyType(moneda)
    }
    function unidadLocal() {
      var result = false
      if (vm.resumen.TipoAseguramiento.Codigo === vm.constantsRrgg.TIP_ASEGURAMIENTO.X_UNIDA) { result = true }
      return result;
    }
    function sumaAseguradaDolaresSoles() {
      var sumaAsegurada = "-"
      if (vm.resumen.Moneda.Codigo === vm.constantsRrgg.MONEDA.SOLES) { sumaAsegurada = vm.resumen.SumaAseguradaSoles }
      if (vm.resumen.Moneda.Codigo === vm.constantsRrgg.MONEDA.DOLARES) { sumaAsegurada = vm.resumen.SumaAseguradaDolares }
      return sumaAsegurada;
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('resumenHidrocarburoController', resumenHidrocarburoController)
    .component('resumenHidrocarburo', {
      templateUrl: '/polizas/app/rrgg/components/hidrocarburo/resumen-hidrocarburo.component.html',
      controller: 'resumenHidrocarburoController',
      bindings: {
        resumen: '='
      }
    })
});
