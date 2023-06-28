'use strict';

define(['angular'], function(ng) {
  AgregarPeatonController.$inject = ['$rootScope', '$scope', '$uibModal'];
  function AgregarPeatonController($rootScope, $scope, $uibModal) {
    var vm = this;
    var onFrmPeatonCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.handleAgregarPeaton = handleAgregarPeaton;
    vm.handleEditarPeaton = handleEditarPeaton;
    vm.handleEliminarPeaton = handleEliminarPeaton;
    vm.showFrmAddPeaton = showFrmAddPeaton;

    // declaracion

    function onInit() {
      onFrmPeatonCerrado = $rootScope.$on('peaton:frmCerrado', frmPeatonCerrado);
      vm.peatones = vm.peatones || [];
      showBtnsSegunCantidadPeatones();
    }

    function onDestroy() {
      onFrmPeatonCerrado();
    }

    function areTherePeatones() {
      return vm.peatones.length ? true : false;
    }

    function frmPeatonCerrado() {
      showBtnsSegunCantidadPeatones();
    }

    function handleAgregarPeaton(event) {
      vm.onAgregar({
        $event: {
          peaton: event.peaton
        }
      });
    }

    function handleEditarPeaton(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          peaton: event.peaton
        }
      });
    }

    function handleEliminarPeaton(idx) {
      vm.onEliminar({
        $event: {
          idx: idx
        }
      });
      showBtnsSegunCantidadPeatones();
    }

    function showBtnsSegunCantidadPeatones() {
      vm.showBoxInicialAgregar = !areTherePeatones();
      vm.showBtnAddPeaton = areTherePeatones();
    }

    function showFrmAddPeaton() {
      openFrmAddPeaton();
    }

    function openFrmAddPeaton() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        template:
          '<wp-agregar-editar-peaton close="close()" es-frm-agregar="true" on-agregar="handleAgregarPeaton($event)"></wp-agregar-editar-peaton>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.close = function() {
              $uibModalInstance.close();
            };

            scope.handleAgregarPeaton = function(event) {
              handleAgregarPeaton(event);
            };
          }
        ]
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarPeatonController', AgregarPeatonController)
    .component('wpAgregarPeaton', {
      templateUrl: '/webproc/app/components/detalle-asistencia/terceros/agregar-peaton/agregar-peaton.html',
      controller: 'AgregarPeatonController',
      bindings: {
        peatones: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        onEliminar: '&?'
      }
    });
});
