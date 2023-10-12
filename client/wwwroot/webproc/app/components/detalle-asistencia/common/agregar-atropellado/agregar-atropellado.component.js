'use strict';

define(['angular'], function(ng) {
  AgregarAtropelladoController.$inject = ['$rootScope'];
  function AgregarAtropelladoController($rootScope) {
    var vm = this;
    var onFrmAtropelladoCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.handleAgregarAtropellado = handleAgregarAtropellado;
    vm.handleEditarAtropellado = handleEditarAtropellado;
    vm.handleEliminarAtropellado = handleEliminarAtropellado;
    vm.showFrmAddAtropellado = showFrmAddAtropellado;

    // declaracion

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
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarAtropelladoController', AgregarAtropelladoController)
    .component('wpAgregarAtropellado', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/agregar-atropellado/agregar-atropellado.html',
      controller: 'AgregarAtropelladoController',
      bindings: {
        atropellados: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        onEliminar: '&?'
      }
    });
});
