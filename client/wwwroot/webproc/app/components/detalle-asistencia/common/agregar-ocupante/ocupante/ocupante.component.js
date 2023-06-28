'use strict';

define(['angular'], function(ng) {
  OcupanteController.$inject = ['$rootScope', '$scope', '$timeout'];
  function OcupanteController($rootScope, $scope, $timeout) {
    var vm = this;
    var onFrmOcupanteCerrado;
    vm.$onInit = onInit;
    vm.editarOcupante = editarOcupante;
    vm.handleOnDelete = handleOnDelete;
    vm.handleOnEditar = handleOnEditar;

    $scope.$on('$destroy', function destroy() {
      onFrmOcupanteCerrado();
    });

    // declaracion

    function onInit() {
      onFrmOcupanteCerrado = $scope.$on('ocupante:frmEditCerrado', frmOcupanteCerrado);
      vm.showOcupante = true;
    }

    function editarOcupante() {
      vm.showEditFrm = true;
      vm.showOcupante = false;
    }

    function frmOcupanteCerrado() {
      vm.showOcupante = true;
    }

    function handleOnEditar(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          ocupante: event.ocupante
        }
      });
    }

    function handleOnDelete() {
      vm.onDelete();
      // HACK: para verificar luego que el ocupante ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('ocupante:frmCerrado');
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('OcupanteController', OcupanteController)
    .component('wpOcupante', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/agregar-ocupante/ocupante/ocupante.html',
      controller: 'OcupanteController',
      bindings: {
        idx: '=?',
        ocupante: '=?',
        onDelete: '&?',
        onEditar: '&?'
      }
    });
});
