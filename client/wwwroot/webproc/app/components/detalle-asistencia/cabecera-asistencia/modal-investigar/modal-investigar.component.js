'use strict';

define(['angular'], function(ng) {
  ModalInvestigarController.$inject = [];
  function ModalInvestigarController() {
    var vm = this;
    vm.$onInit = onInit;
    vm.cerrar = cerrar;
    vm.realizarCb = realizarCb;

    // declaracion

    function onInit() {
      vm.myData = ng.copy(vm.datos);
      vm.frm = ng.extend({}, vm.myData);
      vm.existeData = vm.frm.motivoInvestigacion ? true : false;
    }

    function cerrar() {
      vm.close(void 0);
    }

    function realizarCb() {
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
    .controller('ModalInvestigarController', ModalInvestigarController)
    .component('wpModalInvestigar', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/cabecera-asistencia/modal-investigar/modal-investigar.html',
      controller: 'ModalInvestigarController',
      bindings: {
        close: '&?',
        datos: '<?',
        textos: '<?'
      }
    });
});
