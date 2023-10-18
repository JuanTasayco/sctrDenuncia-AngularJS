'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant'], function(ng, _, AsistenciaActions, wpConstant) {
  FixedAsistenciaController.$inject = ['$scope','$state','$uibModal'];
  function FixedAsistenciaController($scope,$state,$uibModal) {
    var vm = this;
    vm.desestimar = desestimar;
    vm.investigar = investigar;
    vm.autorizar = autorizar;

    vm.nroAsistencia =  $state.params.nroAsistencia;

    function desestimar() {
      vm.onDesestimar();
    }

    function autorizar() {
      vm.onAutorizar();
    }

    function investigar() {
      vm.onInvestigar();
    }

  }

  return ng
    .module('appWp')
    .controller('FixedAsistenciaController', FixedAsistenciaController)
    .component('wpFixedAsistencia', {
      templateUrl: '/webproc/app/components/detalle-asistencia/fixed-asistencia/fixed-asistencia.html',
      controller: 'FixedAsistenciaController',
      bindings: {
        onInvestigar: '&?',
        onDesestimar: '&?',
        onAutorizar: '&?',
        infoAsistencia: '<?',
        disabledAsistencia: '='
      }
    });
});
