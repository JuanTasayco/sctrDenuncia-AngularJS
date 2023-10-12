'use strict';

define(['angular', 'lodash'], function (ng, _) {
  AgregarEditarBienController.$inject = ['$rootScope', '$scope', '$timeout', 'wpFactory'];
  function AgregarEditarBienController($rootScope, $scope, $timeout, wpFactory) {
    var vm = this;
    vm.$onInit = onInit;
    vm.grabarBien = grabarBien;
    vm.cerrarFrm = cerrarFrm;

    function onInit() {
      vm.frm = {}
      vm.frmTitulo = vm.esFrmAgregar ? 'Agregando Bien' : 'Editando Bien';
      !vm.esFrmAgregar && asignarDatosAlModelo();
    }

    function asignarDatosAlModelo() {
      vm.frm = ng.copy(vm.bien);
    }

    function grabarBien() {
      if (vm.frmBien.$invalid) {
        vm.frmBien.markAsPristine();
        return void 0;
      }

      vm.ngIf = false;
      vm.esFrmAgregar && vm.onAgregar({$event: {bien: vm.frm}});
      if (!vm.esFrmAgregar) {
        vm.onEditar({$event: {idx: vm.idxBien, bien: vm.frm}});
        $scope.$emit('bien:frmEditCerrado');
      }

      $timeout(function() {
        $rootScope.$emit('bien:frmCerrado');
      });
    }

    function cerrarFrm() {
      vm.ngIf = false;
      $scope.$emit('bien:frmEditCerrado');
      $rootScope.$emit('bien:frmCerrado');
    }

  }

  return ng
    .module('appWp')
    .controller('AgregarEditarBienController', AgregarEditarBienController)
    .component('wpAgregarEditarBien', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/common/agregar-bien/agregar-editar-bien/agregar-editar-bien.html',
      controller: 'AgregarEditarBienController',
      bindings: {
        bien: '<?',
        esFrmAgregar: '<?',
        idxBien: '<?',
        ngIf: '=?',
        onAgregar: '&?',
        onEditar: '&?'
      }
    });
});
