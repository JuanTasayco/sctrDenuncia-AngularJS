define([
  'angular', 'constants', 'constantsSepelios', 'cpsformEmision'
], function (ng, constants, constantsSepelios, cpsformEmision) {
  datosAvalController.$inject = ['mModalAlert', 'campoSantoFactory', 'campoSantoService', 'mModalConfirm'];
  function datosAvalController(mModalAlert, campoSantoFactory, campoSantoService, mModalConfirm) {
    var vm = this;
    vm.agregarAval = agregarAval;
    vm.eliminarAval = eliminarAval;
    vm.isReadOnly = !campoSantoFactory.isPreemitidoEditable();
    vm.ramo = campoSantoFactory.cotizacion.datosCotizacion.idRamo;
    vm.$onInit = function () {
      vm.constantsRrgg = constantsSepelios;
      vm.userRoot = campoSantoFactory.userRoot();

      campoSantoService.leerAval(vm.cotizacion.datosCotizacion.idCotizacion).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          if (response.Data) {
            vm.cotizacion.datosAval.modelo = response.Data;
            response.Data.idDocumento  ? vm.cotizacion.datosAval.modelo.idDocumento = {Codigo: response.Data.idDocumento} : "";
            vm.cotizacion.datosAval.editar = true;
            if (!vm.cotizacion.datosAval.modelo.ImporteAFinanciar){
              vm.cotizacion.datosAval.modelo.ImporteAFinanciar =  vm.cotizacion.datosCotizacion.ConceptoDesglose ? 
                (((vm.cotizacion.datosCotizacion.ConceptoDesglose.impNetaBoni || 0) + (vm.cotizacion.datosCotizacion.ConceptoDesglose.impImptos || 0)) - (vm.cotizacion.datosCotizacion.cuotaInicial || 0)).toFixed(2)
                : null;
            }
          } else {
            setDefaultValues();
          }
        }else{
          setDefaultValues();
        }
      });

      if (vm.userRoot) {
        vm.reqImporteAFinanciar = false;
      }
    };
    
    function setDefaultValues(){
      vm.cotizacion.datosAval.modelo = {};
      vm.cotizacion.datosAval.modelo.NumeroContrato = null;
      vm.cotizacion.datosAval.modelo.ImporteAFinanciar =  vm.cotizacion.datosCotizacion.ConceptoDesglose ? 
        (((vm.cotizacion.datosCotizacion.ConceptoDesglose.impNetaBoni || 0) + (vm.cotizacion.datosCotizacion.ConceptoDesglose.impImptos || 0)) - (vm.cotizacion.datosCotizacion.cuotaInicial || 0)).toFixed(2)
      : null;
    }  
    function agregarAval() {
      vm.cotizacion.datosAval.modelo.eliminado = false;
    }
    function eliminarAval() {
      mModalConfirm.confirmWarning('', '¿ESTA SEGURO DE ELIMINAR EL REGISTRO?', 'ACEPTAR').then(function (res) {

        vm.cotizacion.datosAval.modelo.eliminado = true;

        mModalAlert.showSuccess("Registro eliminado correctamente", "REGISTRO ELIMINADO");
        
      });
    }

  } // end controller
  return ng.module('appSepelio')
    .controller('datosAvalController', datosAvalController)
    .component('cpsDatosAval', {
      templateUrl: '/polizas/app/sepelio/components/datos-aval/datos-aval.component.html',
      controller: 'datosAvalController',
      bindings: {
        cotizacion: '=',
        form: '=?form',
      }
    })
});
