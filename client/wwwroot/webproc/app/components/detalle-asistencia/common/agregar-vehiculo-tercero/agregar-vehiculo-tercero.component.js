'use strict';

define(['angular'], function(ng) {
  AgregarVehiculoTerceroController.$inject = ['$rootScope'];
  function AgregarVehiculoTerceroController($rootScope) {
    var vm = this;
    var onFrmvehiculoTerceroCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.handleAgregarvehiculoTercero = handleAgregarvehiculoTercero;
    vm.handleEditarvehiculoTercero = handleEditarvehiculoTercero;
    vm.handleEliminarvehiculoTercero = handleEliminarvehiculoTercero;
    vm.showFrmAddvehiculoTercero = showFrmAddvehiculoTercero;
    
    function onInit() {
      onFrmvehiculoTerceroCerrado = $rootScope.$on('vehiculoTercero:frmCerrado', frmvehiculoTerceroCerrado);
      vm.vehiculoTercero = vm.vehiculoTercero || [];
      vm.showAddFrm = false;
      showBtnsSegunCantidadvehiculoTercero();
    }

    function onDestroy() {
      onFrmvehiculoTerceroCerrado();
    }

    function areTherevehiculoTercero() {
      return vm.vehiculoTercero.length ? true : false;
    }

    function handleAgregarvehiculoTercero(event) {
      vm.onAgregar({
        $event: {
          vehiculoTercero: event.vehiculoTercero
        }
      });
    }

    function handleEditarvehiculoTercero(event) {
      debugger;
      vm.onEditar({
        $event: {
          idx: event.idx,
          vehiculoTercero: event.VehiculoTercero
        }
      });
    }

    function handleEliminarvehiculoTercero(idx) {
      vm.onEliminar({
        $event: {
          idx: idx
        }
      });
      showBtnsSegunCantidadvehiculoTercero();
    }

    function frmvehiculoTerceroCerrado() {
      showBtnsSegunCantidadvehiculoTercero();
      vm.showFrmAddvehiculoTercero = true;
    }

    function showBtnsSegunCantidadvehiculoTercero() {
      vm.showBoxInicialAgregar = !areTherevehiculoTercero();
      vm.showBtnAddvehiculoTercero = areTherevehiculoTercero();
    }

    function showFrmAddvehiculoTercero() {
      vm.showFrmAddvehiculoTercero = false;
      vm.showBoxInicialAgregar = false;
      vm.showBtnAddvehiculoTercero = false;
      vm.showAddFrm = true;
    }
  }

  return ng
    .module('appWp')
    .controller('AgregarVehiculoTerceroController', AgregarVehiculoTerceroController)
    .component('wpAgregarVehiculoTercero', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/agregar-vehiculo-tercero/agregar-vehiculo-tercero.html',
      controller: 'AgregarVehiculoTerceroController',
      bindings: {
        vehiculoTercero: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        onEliminar: '&?',
        modoLectura: '=?'
      }
    });
});
