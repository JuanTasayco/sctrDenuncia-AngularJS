'use strict';

define(['angular'], function(ng) {
  AgregarEditarOcupanteController.$inject = ['$rootScope', '$scope', '$timeout'];
  function AgregarEditarOcupanteController($rootScope, $scope, $timeout) {
    var vm = this;
    vm.$onInit = onInit;
    vm.grabarOcupante = grabarOcupante;
    vm.cerrarFrm = cerrarFrm;

    // declaracion

    function onInit() {
      vm.frm = {};
      vm.frmTitulo = vm.esFrmAgregar ? 'Agregando Ocupante' : 'Editando Ocupante';
      !vm.esFrmAgregar && asignarDatosAlModelo();
    }

    function asignarDatosAlModelo() {
      vm.frm = ng.copy(vm.ocupante);
      vm.frm.cOcupante = {};
    }

    function grabarOcupante() {
      if (vm.frmOcupante.$invalid) {
        vm.frmOcupante.markAsPristine();
        return void 0;
      }
      vm.ngIf = false;
      vm.esFrmAgregar && (vm.frm.itemOcupante = 0);
      vm.esFrmAgregar && vm.onAgregar({$event: {ocupante: vm.frm}});
      if (!vm.esFrmAgregar) {
        vm.onEditar({$event: {idx: vm.idxOcupante, ocupante: vm.frm}});
        $scope.$emit('ocupante:frmEditCerrado');
      }
      // HACK: para verificar luego que el ocupante ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('ocupante:frmCerrado');
      });
    }

    function cerrarFrm() {
      vm.ngIf = false;
      $scope.$emit('ocupante:frmEditCerrado');
      $rootScope.$emit('ocupante:frmCerrado');
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarEditarOcupanteController', AgregarEditarOcupanteController)
    .component('wpAgregarEditarOcupante', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/common/agregar-ocupante/agregar-editar-ocupante/agregar-editar-ocupante.html',
      controller: 'AgregarEditarOcupanteController',
      bindings: {
        esFrmAgregar: '<?',
        idxOcupante: '<?',
        ngIf: '=?',
        ocupante: '<?',
        onAgregar: '&?',
        onEditar: '&?'
      }
    });
});
