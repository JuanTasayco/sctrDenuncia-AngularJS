'use strict';

define(['angular'], function(ng) {
  BienController.$inject = ['$rootScope', '$scope', '$timeout', 'wpFactory'];
  function BienController($rootScope, $scope, $timeout, wpFactory) {
    var vm = this;
    var onFrmBienCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.editarBien = editarBien;
    vm.handleOnDelete = handleOnDelete;
    vm.handleOnEditar = handleOnEditar;

    // declaracion

    function onInit() {
      onFrmBienCerrado = $scope.$on('bien:frmEditCerrado', frmBienCerrado);
      vm.showBien = true;
    }

    function onDestroy() {
      onFrmBienCerrado();
    }

    function editarBien() {
      vm.showEditFrm = true;
      vm.showBien = false;
    }

    function frmBienCerrado() {
      vm.showBien = true;
    }

    function handleOnEditar(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          bien: event.bien
        }
      });
    }

    function handleOnDelete() {
      vm.onDelete();
      // HACK: para verificar luego que el bien ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('bien:frmCerrado');
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('BienController', BienController)
    .component('wpBien', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/agregar-bien/bien/bien.html',
      controller: 'BienController',
      bindings: {
        idx: '=?',
        bien: '=?',
        onDelete: '&?',
        onEditar: '&?',
        modoLectura: '=?'
      }
    });
});
