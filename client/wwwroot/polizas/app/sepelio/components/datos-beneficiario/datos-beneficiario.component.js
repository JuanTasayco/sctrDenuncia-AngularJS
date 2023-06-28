define([
  'angular', 'constants', 'constantsSepelios', 'cpsformEmision'
], function (ng, constants, constantsSepelios, cpsformEmision) {
  datosBeneficiarioController.$inject = ['mModalAlert', 'campoSantoFactory', 'campoSantoService', 'mModalConfirm'];
  function datosBeneficiarioController(mModalAlert, campoSantoFactory, campoSantoService, mModalConfirm) {
    var vm = this;
    vm.agregarBeneficiario = agregarBeneficiario;
    vm.eliminarBeneficiario = eliminarBeneficiario;
    vm.isReadOnly = !campoSantoFactory.isPreemitidoEditable();
    vm.cotizacion.datosBeneficiario = [];
    vm.$onInit = function () {
      vm.constantsCps = constantsSepelios;
      campoSantoService.leerBeneficiario(vm.cotizacion.datosCotizacion.idCotizacion).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          if (response.Data[0]) {
            response.Data.forEach(function (element) {
              element.idDocumento = { Codigo: element.idDocumento }
              vm.cotizacion.datosBeneficiario.push({ modelo: element })
            });
            vm.cotizacion.datosBeneficiario.editar = true;
          }else{
          vm.cotizacion.datosBeneficiario = [{ modelo: {} }]
          vm.cotizacion.datosBeneficiario[0].modelo.idDocumento = { Codigo: null }
          }
        }
      });
    };
    function agregarBeneficiario() {
      vm.cotizacion.datosBeneficiario.push({ item: 1 })
    }
    function eliminarBeneficiario(item) {
      mModalConfirm.confirmWarning('', '¿ESTA SEGURO DE ELIMINAR EL REGISTRO?', 'ACEPTAR').then(function (res) {
      vm.cotizacion.datosBeneficiario = vm.cotizacion.datosBeneficiario.filter(function (x) {
        return x != item
        });
        mModalAlert.showSuccess("Registro eliminado correctamente", "REGISTRO ELIMINADO");
      });
    }
  } // end controller
  return ng.module('appSepelio')
    .controller('datosBeneficiarioController', datosBeneficiarioController)
    .component('cpsDatosBeneficiario', {
      templateUrl: '/polizas/app/sepelio/components/datos-beneficiario/datos-beneficiario.component.html',
      controller: 'datosBeneficiarioController',
      bindings: {
        cotizacion: '=',
        form: '=?form',
      }
    })
});
