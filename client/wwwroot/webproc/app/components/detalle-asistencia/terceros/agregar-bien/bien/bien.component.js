'use strict';

define(['angular'], function(ng) {
  BienController.$inject = ['$rootScope', '$scope', '$uibModal', '$timeout', 'wpFactory'];
  function BienController($rootScope, $scope, $uibModal, $timeout, wpFactory) {
    var vm = this;
    vm.$onInit = onInit;
    vm.editarBien = editarBien;
    vm.handleOnDelete = handleOnDelete;
    vm.handleOnEditar = handleOnEditar;

    // declaracion

    function onInit() {
      var lstTipoBien = wpFactory.myLookup.getTipoBien();
      vm.tipoBien = wpFactory.help.seleccionarCombo(lstTipoBien, 'codigoValor', vm.bien.codigoTipoBien);
    }

    function editarBien() {
      openFrmEditBien(vm.bien);
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

    function openFrmEditBien(dataBien) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        template:
          '<wp-agregar-editar-bien close="close()" es-frm-agregar="false" bien="dataBien" idx-bien="idx" on-editar="handleOnEditar($event)"></wp-agregar-editar-bien>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.dataBien = dataBien;
            scope.idx = vm.idx;
            scope.close = function() {
              $uibModalInstance.close();
            };
            scope.handleOnEditar = function(event) {
              handleOnEditar(event);
            };
          }
        ]
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('BienController', BienController)
    .component('wpBienOld', {
      templateUrl: '/webproc/app/components/detalle-asistencia/terceros/agregar-bien/bien/bien.html',
      controller: 'BienController',
      bindings: {
        idx: '=?',
        onDelete: '&?',
        onEditar: '&?',
        bien: '=?'
      }
    });
});
