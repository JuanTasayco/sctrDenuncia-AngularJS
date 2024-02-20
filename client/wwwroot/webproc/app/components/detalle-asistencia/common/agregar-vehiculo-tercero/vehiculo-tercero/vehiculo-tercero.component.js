'use strict';

define(['angular'], function(ng) {
  VehiculoController.$inject = ['$rootScope', '$scope', '$timeout', 'wpFactory'];
  function VehiculoController($rootScope, $scope, $timeout, wpFactory) {
    var vm = this;
    var onFrmvehiculoTerceroCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.editarvehiculoTercero = editarvehiculoTercero;
    vm.handleOnDelete = handleOnDelete;
    vm.handleOnEditar = handleOnEditar;

    // declaracion

    function onInit() {
      onFrmvehiculoTerceroCerrado = $scope.$on('vehiculoTercero:frmEditCerrado', FrmvehiculoTerceroCerrado);
      vm.showVehiculoTercero = true;
    }

    function onDestroy() {
      onFrmvehiculoTerceroCerrado();
    }

    function editarvehiculoTercero() {
      vm.showEditFrm = true;
      vm.showVehiculoTercero = false;
    }

    function FrmvehiculoTerceroCerrado() {
      vm.showVehiculoTercero = true;
    }

    function handleOnEditar(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          VehiculoTercero: event.vehiculoTercero
        }
      });
    }

    function handleOnDelete() {
      vm.onDelete();
      // HACK: para verificar luego que el atropellado ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('VehiculoTercero:frmCerrado');
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('VehiculoController', VehiculoController)
    .component('wpVehiculoTercero', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/agregar-vehiculo-tercero/vehiculo-tercero/vehiculo-tercero.html',
      controller: 'VehiculoController',
      bindings: {
        idx: '=?',
        vehiculoTercero: '=?',
        onDelete: '&?',
        onEditar: '&?'
      }
    });
});
