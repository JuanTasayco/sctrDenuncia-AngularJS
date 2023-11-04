'use strict';

define(['angular'], function(ng) {
  AgregarVehiculoTerceroController.$inject = ['$rootScope'];
  function AgregarVehiculoTerceroController($rootScope) {
    var vm = this;
    var onFrmAtropelladoCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.handleAgregarAtropellado = handleAgregarAtropellado;
    vm.handleEditarAtropellado = handleEditarAtropellado;
    vm.handleEliminarAtropellado = handleEliminarAtropellado;
    vm.showFrmAddAtropellado = showFrmAddAtropellado;
    
    function onInit() {
      onFrmAtropelladoCerrado = $rootScope.$on('atropellado:frmCerrado', frmAtropelladoCerrado);
      vm.atropellados = vm.atropellados || [];
      vm.showAddFrm = false;
      showBtnsSegunCantidadAtropellados();
    }

    function onDestroy() {
      onFrmAtropelladoCerrado();
    }

    function areThereAtropellados() {
      return vm.atropellados.length ? true : false;
    }

    function handleAgregarAtropellado(event) {
      vm.onAgregar({
        $event: {
          atropellado: event.atropellado
        }
      });
    }

    function handleEditarAtropellado(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          atropellado: event.atropellado
        }
      });
    }

    function handleEliminarAtropellado(idx) {
      vm.onEliminar({
        $event: {
          idx: idx
        }
      });
      showBtnsSegunCantidadAtropellados();
    }

    function frmAtropelladoCerrado() {
      showBtnsSegunCantidadAtropellados();
    }

    function showBtnsSegunCantidadAtropellados() {
      vm.showBoxInicialAgregar = !areThereAtropellados();
      vm.showBtnAddAtropellado = areThereAtropellados();
    }

    function showFrmAddAtropellado() {
      vm.showBoxInicialAgregar = false;
      vm.showBtnAddAtropellado = false;
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
        atropellados: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        onEliminar: '&?',
        modoLectura: '=?'
      }
    });
});
