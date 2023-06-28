define([
  'angular', 'constants', 'constantsSepelios', 'cpsformEmision'
], function (ng, constants, constantsSepelios, cpsformEmision) {
  datosTomadorController.$inject = ['mModalAlert', 'campoSantoFactory', 'campoSantoService'];
  function datosTomadorController(mModalAlert, campoSantoFactory, campoSantoService) {
    var vm = this;
    vm.producto = {};
    
    vm.$onInit = function () {
      vm.constantsCps = constantsSepelios;
      campoSantoService.leerTomador(vm.cotizacion.datosCotizacion.idCotizacion).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          if (response.Data) {
            vm.cotizacion.datosTomador.modelo = response.Data; //.idProfesion = 61;
            vm.cotizacion.datosTomador.modelo.idDocumento = {Codigo: response.Data.idDocumento}
            if(!vm.cotizacion.datosTomador.modelo.idProfesion)  vm.cotizacion.datosTomador.modelo.idProfesion = "61";
            vm.cotizacion.datosTomador.editar = true;
          }
        }
      });

      vm.userRoot =  campoSantoFactory.userRoot();
    };
  } // end controller
  return ng.module('appSepelio')
    .controller('datosTomadorController', datosTomadorController)
    .component('cpsDatosTomador', {
      templateUrl: '/polizas/app/sepelio/components/datos-tomador/datos-tomador.component.html',
      controller: 'datosTomadorController',
      bindings: {
        cotizacion: '=',
        form: '=?form',
      }
    })
});
