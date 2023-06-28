'use strict';

define(['angular'], function(ng) {
  AgregarOcupanteController.$inject = ['$rootScope'];
  function AgregarOcupanteController($rootScope) {
    var vm = this;
    var onFrmOcupanteCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.handleAgregarOcupante = handleAgregarOcupante;
    vm.handleEditarOcupante = handleEditarOcupante;
    vm.handleEliminarOcupante = handleEliminarOcupante;
    vm.showFrmAddOcupante = showFrmAddOcupante;

    // declaracion

    function onInit() {
      onFrmOcupanteCerrado = $rootScope.$on('ocupante:frmCerrado', frmOcupanteCerrado);
      vm.ocupantes = vm.ocupantes || [];
      vm.showAddFrm = false;
      showBtnsSegunCantidadOcupantes();
    }

    function onDestroy() {
      onFrmOcupanteCerrado();
    }

    function areThereOcupantes() {
      return vm.ocupantes.length ? true : false;
    }

    function handleAgregarOcupante(event) {
      vm.onAgregar({
        $event: {
          ocupante: event.ocupante
        }
      });
    }

    function handleEditarOcupante(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          ocupante: event.ocupante
        }
      });
    }

    function handleEliminarOcupante(idx) {
      vm.onEliminar({
        $event: {
          idx: idx
        }
      });
      showBtnsSegunCantidadOcupantes();
    }

    function frmOcupanteCerrado() {
      showBtnsSegunCantidadOcupantes();
    }

    function showBtnsSegunCantidadOcupantes() {
      vm.showBoxInicialAgregar = !areThereOcupantes();
      vm.showBtnAddOcupante = areThereOcupantes();
    }

    function showFrmAddOcupante() {
      vm.showBoxInicialAgregar = false;
      vm.showBtnAddOcupante = false;
      vm.showAddFrm = true;
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarOcupanteController', AgregarOcupanteController)
    .component('wpAgregarOcupante', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/agregar-ocupante/agregar-ocupante.html',
      controller: 'AgregarOcupanteController',
      bindings: {
        ocupantes: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        onEliminar: '&?'
      }
    });
});
