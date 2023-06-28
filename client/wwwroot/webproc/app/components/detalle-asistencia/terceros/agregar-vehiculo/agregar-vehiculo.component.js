'use strict';

define(['angular'], function(ng) {
  AgregarVehiculoController.$inject = ['$rootScope', '$scope', '$uibModal'];
  function AgregarVehiculoController($rootScope, $scope, $uibModal) {
    var vm = this;
    var onFrmVehiculoCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.handleEditarVehiculo = handleEditarVehiculo;
    vm.handleEliminarVehiculo = handleEliminarVehiculo;
    vm.openFrmAddVehiculo = openFrmAddVehiculo;

    // declaracion

    function onInit() {
      onFrmVehiculoCerrado = $rootScope.$on('vehiculo:frmCerrado', frmVehiculoCerrado);
      vm.vehiculos = vm.vehiculos || [];
      _showBtnsSegunCantidadVehiculos();
    }

    function onDestroy() {
      onFrmVehiculoCerrado();
    }

    function _areThereVehiculos() {
      return vm.vehiculos.length ? true : false;
    }

    function frmVehiculoCerrado() {
      _showBtnsSegunCantidadVehiculos();
    }

    function handleAgregarVehiculo(event) {
      vm.onAgregar({
        $event: {
          vehiculo: event.vehiculo
        }
      });
    }

    function handleEditarVehiculo(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          vehiculo: event.vehiculo
        }
      });
    }

    function handleEliminarVehiculo(idx, vehiculo) {
      vm.onEliminar({
        $event: {
          idx: idx,
          itemConductor: vehiculo.ocupanteTercero.itemConductor
        }
      });
      _showBtnsSegunCantidadVehiculos();
    }

    function _showBtnsSegunCantidadVehiculos() {
      vm.showBoxInicialAgregar = !_areThereVehiculos();
      vm.showBtnAddVehiculo = _areThereVehiculos();
    }

    function openFrmAddVehiculo() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--ovh modal--lg',
        template:
          '<wp-agregar-editar-vehiculo ' +
          'close="close()" ' +
          'es-frm-agregar="true" ' +
          'on-agregar="handleAgregarVehiculo($event)" ' +
          '></wp-agregar-editar-vehiculo>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.close = function() {
              $uibModalInstance.close();
            };
            scope.handleAgregarVehiculo = function(event) {
              handleAgregarVehiculo(event);
            };
          }
        ]
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarVehiculoController', AgregarVehiculoController)
    .component('wpAgregarVehiculo', {
      templateUrl: '/webproc/app/components/detalle-asistencia/terceros/agregar-vehiculo/agregar-vehiculo.html',
      controller: 'AgregarVehiculoController',
      bindings: {
        vehiculos: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        onEliminar: '&?'
      }
    });
});
