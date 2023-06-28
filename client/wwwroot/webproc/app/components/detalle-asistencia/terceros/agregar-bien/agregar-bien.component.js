'use strict';

define(['angular'], function(ng) {
  AgregarBienController.$inject = ['$rootScope', '$scope', '$uibModal'];
  function AgregarBienController($rootScope, $scope, $uibModal) {
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
      showBtnsSegunCantidadBienes();
    }

    function onDestroy() {
      onFrmBienCerrado();
    }

    function areThereBienes() {
      return vm.bienes.length ? true : false;
    }

    function frmBienCerrado() {
      showBtnsSegunCantidadBienes();
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

    function showBtnsSegunCantidadBienes() {
      vm.showBoxInicialAgregar = !areThereBienes();
      vm.showBtnAddBien = areThereBienes();
    }

    function showFrmAddBien() {
      openFrmAddBien();
    }

    function openFrmAddBien() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        template:
          '<wp-agregar-editar-bien close="close()" es-frm-agregar="true" on-agregar="handleAgregarBien($event)"></wp-agregar-editar-bien>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.close = function() {
              $uibModalInstance.close();
            };

            scope.handleAgregarBien = function(event) {
              handleAgregarBien(event);
            };
          }
        ]
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarBienController', AgregarBienController)
    .component('wpAgregarBien', {
      templateUrl: '/webproc/app/components/detalle-asistencia/terceros/agregar-bien/agregar-bien.html',
      controller: 'AgregarBienController',
      bindings: {
        bienes: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        onEliminar: '&?'
      }
    });
});
