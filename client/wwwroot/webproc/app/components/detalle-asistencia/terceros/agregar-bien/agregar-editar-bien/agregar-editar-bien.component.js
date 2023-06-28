'use strict';

define(['angular'], function(ng) {
  AgregarEditarBienController.$inject = ['$rootScope', '$scope', '$timeout'];
  function AgregarEditarBienController($rootScope, $scope, $timeout) {
    var vm = this;
    vm.$onInit = onInit;
    vm.grabarBien = grabarBien;
    vm.cerrarFrm = cerrarFrm;

    // declaracion

    function onInit() {
      vm.frm = {};
      vm.frmTitulo = vm.esFrmAgregar ? 'Registro de Bien' : 'Editando Bien';
      !vm.esFrmAgregar && asignarDatosAlModelo();
    }

    function asignarDatosAlModelo() {
      vm.frm = ng.copy(vm.bien);
      vm.frm.tab4At3 = {};
    }

    function grabarBien() {
      if (vm.frmBien.$invalid) {
        vm.frmBien.markAsPristine();
        return void 0;
      }
      vm.esFrmAgregar && vm.onAgregar({$event: {bien: vm.frm}});
      if (!vm.esFrmAgregar) {
        vm.onEditar({$event: {idx: vm.idxBien, bien: vm.frm}});
        $scope.$emit('bien:frmEditCerrado');
      }
      // HACK: para verificar luego que el bien ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('bien:frmCerrado');
      });
      vm.close();
    }

    function cerrarFrm() {
      vm.close();
      $rootScope.$emit('bien:frmCerrado');
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarEditarBienController', AgregarEditarBienController)
    .component('wpAgregarEditarBien', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/terceros/agregar-bien/agregar-editar-bien/agregar-editar-bien.html',
      controller: 'AgregarEditarBienController',
      bindings: {
        close: '&?',
        esFrmAgregar: '<?',
        idxBien: '<?',
        onAgregar: '&?',
        onEditar: '&?',
        bien: '<?'
      }
    });
});
