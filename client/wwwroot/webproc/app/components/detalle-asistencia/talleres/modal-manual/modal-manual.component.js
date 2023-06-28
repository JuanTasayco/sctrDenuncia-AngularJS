'use strict';

define(['angular'], function(ng) {
  ModalManualController.$inject = [];
  function ModalManualController() {
    var vm = this;

    vm.cerrar = cerrar;
    vm.realizarCb = realizarCb;

    // declaracion

    function cerrar() {
      vm.close(void 0);
    }

    function realizarCb() {
      if (vm.frmManual.$invalid) {
        vm.frmManual.markAsPristine();
        return void 0;
      }
      vm.close({
        $event: {
          data: vm.frm,
          status: 'ok'
        }
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('ModalManualController', ModalManualController)
    .component('wpModalManual', {
      templateUrl: '/webproc/app/components/detalle-asistencia/talleres/modal-manual/modal-manual.html',
      controller: 'ModalManualController',
      bindings: {
        close: '&?'
      }
    });
});
