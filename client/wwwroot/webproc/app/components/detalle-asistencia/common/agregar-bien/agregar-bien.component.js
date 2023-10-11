'use strict';

define(['angular'], function(ng) {
  AgregarBienController.$inject = ['$rootScope'];
  function AgregarBienController($rootScope) {
    var vm = this;
    var onFrmBienCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.handleAgregarBien = handleAgregarBien;
    vm.handleEditarBien = handleEditarBien;
    vm.handleEliminarBien = handleEliminarBien;
    vm.showFrmAddBien = showFrmAddBien;

    // declaracion

    function onInit() {
      onFrmBienCerrado = $rootScope.$on('bien:frmCerrado', frmBienCerrado);
      vm.bienes = vm.bienes || [];
      vm.showAddFrm = false;
      showBtnsSegunCantidadBienes();
    }

    function onDestroy() {
      onFrmBienCerrado();
    }

    function areThereBienes() {
      return vm.bienes.length ? true : false;
    }

    function handleAgregarBien(event) {
      vm.onAgregar({
        $event: {
          bien: event.bien
        }
      });
    }

    function handleEditarBien(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          bien: event.bien
        }
      });
    }

    function handleEliminarBien(idx) {
      vm.onEliminar({
        $event: {
          idx: idx
        }
      });
      showBtnsSegunCantidadBienes();
    }

    function frmBienCerrado() {
      showBtnsSegunCantidadBienes();
    }

    function showBtnsSegunCantidadBienes() {
      vm.showBoxInicialAgregar = !areThereBienes();
      vm.showBtnAddBien = areThereBienes();
    }

    function showFrmAddBien() {
      vm.showBoxInicialAgregar = false;
      vm.showBtnAddBien = false;
      vm.showAddFrm = true;
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarBienController', AgregarBienController)
    .component('wpAgregarBien', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/agregar-bien/agregar-bien.html',
      controller: 'AgregarBienController',
      bindings: {
        bienes: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        onEliminar: '&?'
      }
    });
});
