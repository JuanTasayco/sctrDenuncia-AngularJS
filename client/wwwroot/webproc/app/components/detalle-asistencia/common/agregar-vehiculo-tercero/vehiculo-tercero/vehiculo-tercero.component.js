'use strict';

define(['angular'], function(ng) {
  VehiculoController.$inject = ['$rootScope', '$scope', '$timeout', 'wpFactory'];
  function VehiculoController($rootScope, $scope, $timeout, wpFactory) {
    var vm = this;
    var onFrmAtropelladoCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.editarAtropellado = editarAtropellado;
    vm.handleOnDelete = handleOnDelete;
    vm.handleOnEditar = handleOnEditar;

    // declaracion

    function onInit() {
      console.log('vehiculo tercero');
      onFrmAtropelladoCerrado = $scope.$on('atropellado:frmEditCerrado', frmAtropelladoCerrado);
      vm.showAtropellado = true;
    }

    function onDestroy() {
      onFrmAtropelladoCerrado();
    }

    function editarAtropellado() {
      vm.showEditFrm = true;
      vm.showAtropellado = false;
    }

    function frmAtropelladoCerrado() {
      vm.showAtropellado = true;
    }

    function handleOnEditar(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          atropellado: event.atropellado
        }
      });
    }

    function handleOnDelete() {
      vm.onDelete();
      // HACK: para verificar luego que el atropellado ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('atropellado:frmCerrado');
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
        atropellado: '=?',
        onDelete: '&?',
        onEditar: '&?'
      }
    });
});
