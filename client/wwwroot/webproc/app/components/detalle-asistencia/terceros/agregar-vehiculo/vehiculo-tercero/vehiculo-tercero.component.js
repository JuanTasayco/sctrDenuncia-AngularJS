'use strict';

define(['angular'], function(ng) {
  VehiculoTerceroController.$inject = ['$rootScope', '$scope', '$uibModal', '$timeout'];
  function VehiculoTerceroController($rootScope, $scope, $uibModal, $timeout) {
    var vm = this;
    vm.editarVehiculo = editarVehiculo;
    vm.handleOnDelete = handleOnDelete;

    // declaracion

    function editarVehiculo() {
      openFrmEditVehiculo(vm.vehiculo);
    }

    function handleOnEditar(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          vehiculo: event.vehiculo
        }
      });
    }

    function handleOnDelete() {
      vm.onDelete();
      // HACK: para verificar luego que el vehiculo ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('vehiculo:frmCerrado');
      });
    }

    function openFrmEditVehiculo(dataVehiculo) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        template:
          '<wp-agregar-editar-vehiculo ' +
          'close="close()" ' +
          'es-frm-agregar="false" ' +
          'vehiculo="dataVehiculo" ' +
          'idx-vehiculo="idx" ' +
          'on-editar="handleOnEditar($event)"' +
          '></wp-agregar-editar-vehiculo>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.dataVehiculo = dataVehiculo;
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
    .controller('VehiculoTerceroController', VehiculoTerceroController)
    .component('wpVehiculoTercero', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/terceros/agregar-vehiculo/vehiculo-tercero/vehiculo-tercero.html',
      controller: 'VehiculoTerceroController',
      bindings: {
        idx: '=?',
        onDelete: '&?',
        onEditar: '&?',
        vehiculo: '=?'
      }
    });
});
