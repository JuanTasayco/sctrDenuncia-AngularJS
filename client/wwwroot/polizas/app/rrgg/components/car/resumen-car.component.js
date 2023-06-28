define([
  'angular','constantsRiesgosGenerales','contratante'
], function (ng,constantsRiesgosGenerales) {
  resumenCarController.$inject = ['riesgosGeneralesFactory'];
  function resumenCarController(riesgosGeneralesFactory) {
    var vm = this;
    vm.currencyType = currencyType
    vm.$onInit = function () {
      vm.constantsRrgg =  constantsRiesgosGenerales;
    };
    function currencyType (moneda){
      return  riesgosGeneralesFactory.currencyType(moneda)
     }
  } // end controller
  return ng.module('appRrgg')
    .controller('resumenCarController', resumenCarController)
    .component('rrggResumenCar', {
      templateUrl: '/polizas/app/rrgg/components/car/resumen-car.component.html',
      controller: 'resumenCarController',
      bindings: {
        resumen: '='
      }
    })
});
