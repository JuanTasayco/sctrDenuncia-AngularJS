'use strict';

define(['angular'], function(ng) {
  AsistenciaController.$inject = ['wpFactory'];
  function AsistenciaController(wpFactory) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.txtLabel = /abierto/i.test(vm.datos.assistanceState) ? 'NUEVO' : vm.datos.assistanceState;
      vm.clsLabel = wpFactory.help.getClsTag();
    }
  }

  return ng
    .module('appWp')
    .controller('AsistenciaController', AsistenciaController)
    .component('wpAsistencia', {
      templateUrl: '/webproc/app/components/bandeja/asistencia/asistencia.html',
      controller: 'AsistenciaController',
      bindings: {
        datos: '=?',
        verDetalle: '&?'
      }
    });
});
