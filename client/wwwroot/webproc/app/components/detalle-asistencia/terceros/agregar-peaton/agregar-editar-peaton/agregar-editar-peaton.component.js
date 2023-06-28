'use strict';

define(['angular'], function(ng) {
  AgregarEditarPeatonController.$inject = ['$rootScope', '$scope', '$timeout'];
  function AgregarEditarPeatonController($rootScope, $scope, $timeout) {
    var vm = this;
    vm.$onInit = onInit;
    vm.grabarPeaton = grabarPeaton;
    vm.cerrarFrm = cerrarFrm;

    // declaracion

    function onInit() {
      vm.frm = {};
      vm.dateFormat = 'dd/MM/yyyy';
      vm.frmTitulo = vm.esFrmAgregar ? 'Registro de Peatón' : 'Editando Peatón';
      !vm.esFrmAgregar && asignarDatosAlModelo();
    }

    function asignarDatosAlModelo() {
      vm.frm = ng.copy(vm.peaton);
      vm.frm.tab4At2 = {};
    }

    function grabarPeaton() {
      if (vm.frmPeaton.$invalid) {
        vm.frmPeaton.markAsPristine();
        return void 0;
      }
      vm.esFrmAgregar && vm.onAgregar({$event: {peaton: vm.frm}});
      if (!vm.esFrmAgregar) {
        vm.onEditar({$event: {idx: vm.idxPeaton, peaton: vm.frm}});
        $scope.$emit('peaton:frmEditCerrado');
      }
      // HACK: para verificar luego que el peaton ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('peaton:frmCerrado');
      });
      vm.close();
    }

    function cerrarFrm() {
      vm.close();
      $rootScope.$emit('peaton:frmCerrado');
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarEditarPeatonController', AgregarEditarPeatonController)
    .component('wpAgregarEditarPeaton', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/terceros/agregar-peaton/agregar-editar-peaton/agregar-editar-peaton.html',
      controller: 'AgregarEditarPeatonController',
      bindings: {
        close: '&?',
        esFrmAgregar: '<?',
        idxPeaton: '<?',
        onAgregar: '&?',
        onEditar: '&?',
        peaton: '<?'
      }
    });
});
