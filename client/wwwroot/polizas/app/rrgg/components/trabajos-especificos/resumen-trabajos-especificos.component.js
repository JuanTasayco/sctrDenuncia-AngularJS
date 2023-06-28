define([
  'angular','constantsRiesgosGenerales','contratante'
], function (ng,constantsRiesgosGenerales) {
  ResumenTrabajosEspecificosController.$inject = ['mModalAlert','riesgosGeneralesService', 'riesgosGeneralesFactory'];
  function ResumenTrabajosEspecificosController(mModalAlert,riesgosGeneralesService, riesgosGeneralesFactory) {
    var vm = this;
    vm.currencyType = currencyType;
    vm.getfechaValidez = getfechaValidez;
    vm.$onInit = function () {
      vm.constantsRrgg =  constantsRiesgosGenerales;
    };
    function currencyType (moneda){
      return  riesgosGeneralesFactory.currencyType(moneda)
     }
     function getfechaValidez(fechaCotizacion){
       var fecha = new Date(fechaCotizacion)
       return new Date(fecha.setDate(fecha.getDate() + 15));
     }
  } // end controller
  return ng.module('appRrgg')
    .controller('resumenTrabajosEspecificosController', ResumenTrabajosEspecificosController)
    .component('resumenTrabajosEspecificos', {
      templateUrl: '/polizas/app/rrgg/components/trabajos-especificos/resumen-trabajos-especificos.component.html',
      controller: 'resumenTrabajosEspecificosController',
      bindings: {
        resumen: '='
      }
    })
});
