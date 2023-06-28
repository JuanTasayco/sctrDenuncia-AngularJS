'use strict';

define(['angular'], function(ng) {
  ModalConfirmController.$inject = [];
  function ModalConfirmController() {
    var vm = this;

    vm.cerrar = cerrar;
    vm.realizarCb = realizarCb;

    // declaracion

    function cerrar() {
      vm.close(void 0);
    }

    function realizarCb() {
      vm.close({status: 'ok'});
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('ModalConfirmController', ModalConfirmController)
    .component('wpModalConfirm', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/modal-confirm/modal-confirm.html',
      controller: 'ModalConfirmController',
      bindings: {
        close: '&?',
        textos: '<?'
      }
    });
});
