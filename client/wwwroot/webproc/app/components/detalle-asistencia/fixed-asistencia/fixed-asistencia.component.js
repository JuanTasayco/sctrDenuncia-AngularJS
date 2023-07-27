'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant'], function(ng, _, AsistenciaActions, wpConstant) {
  FixedAsistenciaController.$inject = ['wpFactory', '$log', '$scope', '$interval', '$ngRedux','mModalConfirm','$state','$uibModal','mModalAlert'];
  function FixedAsistenciaController(wpFactory, $log, $scope, $interval, $ngRedux,mModalConfirm,$state,$uibModal,mModalAlert) {
    var vm = this;
    vm.desestimar = desestimar;
    vm.investigar = investigar;
    vm.autorizar = autorizar;

    vm.nroAsistencia =  $state.params.nroAsistencia;

    function desestimar() {
      vm.onDesestimar();
      // var textos = {
      //   btnCancel: 'Cancelar',
      //   btnOk: 'Desistir',
      //   titulo: '¿Está seguro que el cliente desea desistir de la Asistencia?'
      // };
    
      // _showModalConfirm(textos)
      //   .result.then(function () {
      //     console.log(vm.nroAsistencia);
      //     vm.onDesestimar();
      //   });
    }

    function autorizar() {
      vm.onAutorizar();
      // var textos = {
      //   btnCancel: 'Cancelar',
      //   btnOk: 'Autorizar',
      //   titulo: '¿Está seguro de autotizar el siniestro?'
      // };
    
      // _showModalConfirm(textos)
      //   .result.then(function () {
      //     console.log(vm.nroAsistencia);
      //     vm.onAutorizar();
      //   });
    }

    function investigar() {
      vm.onInvestigar();
      // var textos = {
      //   btnCancel: 'Cancelar',
      //   btnOk: 'Investigar',
      //   titulo: '¿Está seguro de poner en investigación la Asistencia?'
      // };
      // _showModalConfirm(textos)
      //   .result.then(function () {
      //     console.log(vm.nroAsistencia);
      //     vm.onInvestigar();
      //   });
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



    

  } // end controller

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
