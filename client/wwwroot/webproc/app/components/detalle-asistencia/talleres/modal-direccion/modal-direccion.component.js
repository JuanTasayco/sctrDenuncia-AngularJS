'use strict';

define(['angular'], function(ng) {
  ModalDireccionController.$inject = [];
  function ModalDireccionController() {
    var vm = this;
    vm.$onInit = onInit;
    vm.cerrar = cerrar;
    vm.realizarCb = realizarCb;

    // declaracion

    function onInit() {
      // TODO: verificar si siempre devolverá un array; así sea de 1 elemento
      vm.areThereDirecciones = true;
      vm.datos = vm.taller.taller;
    }

    function cerrar() {
      vm.close(void 0);
    }

    function realizarCb() {
      if (vm.frmDireccion.$invalid) {
        vm.frmDireccion.markAsPristine();
        return void 0;
      }
      vm.close({
        $event: {
          data: vm.cboDireccion || 'ok',
          status: 'ok'
        }
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('ModalDireccionController', ModalDireccionController)
    .component('wpModalDireccion', {
      templateUrl: '/webproc/app/components/detalle-asistencia/talleres/modal-direccion/modal-direccion.html',
      controller: 'ModalDireccionController',
      bindings: {
        close: '&?',
        taller: '<?'
      }
    });
});
