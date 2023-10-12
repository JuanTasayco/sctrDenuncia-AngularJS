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


    function _showModalConfirm(textos) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<wp-modal-confirm close="close(status)" textos="textos"></wp-modal-confirm>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.close = function(type) {
              type && type === 'ok' ? $uibModalInstance.close() : $uibModalInstance.dismiss();
            };
            scope.textos = textos;
          }
        ]
      });
    }


    function _showModalInvestigar(textos) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<wp-modal-investigar close="close($event)" textos="textos" datos="datos"></wp-modal-investigar>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.close = function(ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
            scope.textos = textos;
            
          }
        ]
      });
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
      }
    });
});
