'use strict';

define(['angular'], function(ng) {
  AgregarDanhoController.$inject = ['$rootScope'];
  function AgregarDanhoController($rootScope) {
    var vm = this;
    var onFrmDanhoCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.handleAgregarDanho = handleAgregarDanho;
    vm.handleEditarDanho = handleEditarDanho;
    vm.handleEliminarDanho = handleEliminarDanho;
    vm.showFrmAddDanho = showFrmAddDanho;

    // declaracion

    function onInit() {
      onFrmDanhoCerrado = $rootScope.$on('danho:frmCerrado', frmDanhoCerrado);
      vm.danhos = vm.danhos || [];
      vm.showAddFrm = false;
      showBtnsSegunCantidadDanhos();
    }

    function onDestroy() {
      onFrmDanhoCerrado();
    }

    function areThereDanhos() {
      return vm.danhos.length ? true : false;
    }

    function handleAgregarDanho(event) {
      vm.onAgregar({
        $event: {
          danho: event.danho
        }
      });
    }

    function handleEditarDanho(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          danho: event.danho
        }
      });
    }

    function handleEliminarDanho(idx) {
      vm.onEliminar({
        $event: {
          idx: idx
        }
      });
      showBtnsSegunCantidadDanhos();
    }

    function frmDanhoCerrado() {
      showBtnsSegunCantidadDanhos();
    }

    function showBtnsSegunCantidadDanhos() {
      vm.showBoxInicialAgregar = !areThereDanhos();
      vm.showBtnAddDanho = areThereDanhos();
    }

    function showFrmAddDanho() {
      vm.showBoxInicialAgregar = false;
      vm.showBtnAddDanho = false;
      vm.showAddFrm = true;
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarDanhoController', AgregarDanhoController)
    .component('wpAgregarDanho', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/agregar-danho/agregar-danho.html',
      controller: 'AgregarDanhoController',
      bindings: {
        danhos: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        onEliminar: '&?'
      }
    });
});
