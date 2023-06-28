'use strict';

define(['angular'], function(ng) {
  PeatonController.$inject = ['$rootScope', '$scope', '$uibModal', '$timeout'];
  function PeatonController($rootScope, $scope, $uibModal, $timeout) {
    var vm = this;
    vm.editarPeaton = editarPeaton;
    vm.handleOnDelete = handleOnDelete;
    vm.handleOnEditar = handleOnEditar;

    // declaracion

    function editarPeaton() {
      openFrmEditPeaton(vm.peaton);
    }

    function handleOnEditar(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          peaton: event.peaton
        }
      });
    }

    function handleOnDelete() {
      vm.onDelete();
      // HACK: para verificar luego que el peaton ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('peaton:frmCerrado');
      });
    }

    function openFrmEditPeaton(dataPeaton) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        template:
          '<wp-agregar-editar-peaton close="close()" es-frm-agregar="false" peaton="dataPeaton" idx-peaton="idx" on-editar="handleOnEditar($event)"></wp-agregar-editar-peaton>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.dataPeaton = dataPeaton;
            scope.idx = vm.idx;
            scope.close = function() {
              $uibModalInstance.close();
            };
            scope.handleOnEditar = function(event) {
              handleOnEditar(event);
            };
          }
        ]
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('PeatonController', PeatonController)
    .component('wpPeaton', {
      templateUrl: '/webproc/app/components/detalle-asistencia/terceros/agregar-peaton/peaton/peaton.html',
      controller: 'PeatonController',
      bindings: {
        idx: '=?',
        onDelete: '&?',
        onEditar: '&?',
        peaton: '=?'
      }
    });
});
