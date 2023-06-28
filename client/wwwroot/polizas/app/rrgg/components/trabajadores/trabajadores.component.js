define([
  'angular', 'constantsRiesgosGenerales'
], function (ng, constantsRiesgosGenerales) {
  trabajadoresController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'mModalConfirm', 'mainServices'];
  function trabajadoresController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, mModalConfirm, mainServices) {
    var vm = this;
    vm.validControlForm = ValidControlForm;
    vm.deleteItemTrabajadores = DeleteItemTrabajadores;
    vm.btnDeleteAllTrabajador = btnDeleteAllTrabajador;
    vm.selectedAll = selectedAll;
    vm.cambioTipoDocumento = CambioTipoDocumento;
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.TIPO_DOC)
        .then(function (response) {
          vm.tipoDocumento = response.Data;
        });
    };
    function DeleteItemTrabajadores(nroItem) {
      vm.trabajadores.splice(nroItem, 1);
    }
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
    function btnDeleteAllTrabajador() {
      mModalConfirm.confirmWarning('', '¿ESTA SEGURO DE ELIMINAR LOS TRABAJADORES?', 'ACEPTAR').then(function (response) {
        vm.trabajadores = vm.trabajadores.filter(function (trabajador) { return trabajador.checked === false })
      });
    }
    function selectedAll() {
      vm.trabajadores.forEach(function (element) {
        element["checked"] = true;
      });
    }
    function CambioTipoDocumento(trabajador) {
      if (angular.isUndefined(trabajador.TipDoc)) {
        return;
      } else {
        riesgosGeneralesFactory.setValidadores(trabajador)
        trabajador.NroDocumento = '';
        trabajador.ApePaterno = ''
        trabajador.ApeMaterno = ''
        trabajador.Nombres = ''
        trabajador.NombreCompleto = ''
      }
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('trabajadoresController', trabajadoresController)
    .component('trabajadores', {
      templateUrl: '/polizas/app/rrgg/components/trabajadores/trabajadores.component.html',
      controller: 'trabajadoresController',
      bindings: {
        trabajadores: '=',
        type: "=",
        form: "=?form"
      }
    })
});
