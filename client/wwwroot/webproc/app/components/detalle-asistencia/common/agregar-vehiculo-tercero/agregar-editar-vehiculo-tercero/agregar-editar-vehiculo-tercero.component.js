'use strict';

define(['angular', 'lodash'], function (ng, _) {
  AgregarEditarVehiculoTerceroController.$inject = ['$rootScope', '$scope', '$timeout', 'wpFactory'];
  function AgregarEditarVehiculoTerceroController($rootScope, $scope, $timeout, wpFactory) {
    var vm = this;
    vm.$onInit = onInit;
    vm.grabarAtropellado = grabarAtropellado;
    vm.cerrarFrm = cerrarFrm;
    vm.getPerson = getPerson;

    function onInit() {
      vm.frm = {}
      vm.frmTitulo = vm.esFrmAgregar ? 'Agregando Vehiculo Tercero' : 'Editando Vehiculo Tercero';
      !vm.esFrmAgregar && asignarDatosAlModelo();
    }

    function asignarDatosAlModelo() {
      vm.frm = ng.copy(vm.atropellado);
    }

    function grabarAtropellado() {
      if (vm.frmAtropellado.$invalid) {
        vm.frmAtropellado.markAsPristine();
        return void 0;
      }

      vm.ngIf = false;
      vm.esFrmAgregar && vm.onAgregar({$event: {atropellado: vm.frm}});
      if (!vm.esFrmAgregar) {
        vm.onEditar({$event: {idx: vm.idxAtropellado, atropellado: vm.frm}});
        $scope.$emit('atropellado:frmEditCerrado');
      }
      $timeout(function() {
        $rootScope.$emit('atropellado:frmCerrado');
      });
    }

    function cerrarFrm() {
      vm.ngIf = false;
      $scope.$emit('atropellado:frmEditCerrado');
      $rootScope.$emit('atropellado:frmCerrado');
    }

    function getPerson() {
      if (vm.frm.numeroDocumentoIdentidad) {
        wpFactory.siniestro.GetSiniestroPerson(vm.frm.numeroDocumentoIdentidad, 0, vm.frm.CodigoTipoDocumentoIdentidad, 1)
          .then(function (response) {
            vm.frm.nombrePeaton = response.persona.ape_paterno;
            vm.frm.paternoPeaton = response.persona.ape_paterno;
            vm.frm.telefonoPeaton = response.persona.telefono;
            vm.frm.correoPeaton = response.persona.email;
          })
      }

    }
  }

  return ng
    .module('appWp')
    .controller('AgregarEditarVehiculoTerceroController', AgregarEditarVehiculoTerceroController)
    .component('wpAgregarEditarAtropellado', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/common/agregar-vehiculo-tercero/agregar-editar-vehiculo-tercero/agregar-editar-vehiculo-tercero.html',
      controller: 'AgregarEditarVehiculoTerceroController',
      bindings: {
        atropellado: '<?',
        esFrmAgregar: '<?',
        idxAtropellado: '<?',
        ngIf: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        modoLectura: '=?'
      }
    });
});
