'use strict';

define(['angular', 'lodash'], function (ng, _) {
  AgregarEditarVehiculoTerceroController.$inject = ['$rootScope', '$scope', '$timeout', 'wpFactory'];
  function AgregarEditarVehiculoTerceroController($rootScope, $scope, $timeout, wpFactory) {
    var vm = this;
    vm.$onInit = onInit;
    vm.grabarVehiculoTercero = grabarVehiculoTercero;
    vm.cerrarFrm = cerrarFrm;
    vm.getPerson = getPerson;

    function onInit() {
      vm.frm = {}
      vm.frmTitulo = vm.esFrmAgregar ? 'Agregando Vehiculo Tercero' : 'Editando Vehiculo Tercero';
      !vm.esFrmAgregar && asignarDatosAlModelo();
    }

    function asignarDatosAlModelo() {
      vm.frm = ng.copy(vm.vehiculoTercero);
    }

    function grabarVehiculoTercero() {
      if (vm.frmVehiculoTercero.$invalid) {
        vm.frmVehiculoTercero.markAsPristine();
        return void 0;
      }
      var frmVehiculoSoat =  vm.frmVehiculoTercero.frmVehiculoSoat
      vm.frm.codigoSoatVehiculo = frmVehiculoSoat.codigoSoatVehiculo.codigoValor;
      vm.frm.codigoTipoVehiculo  = frmVehiculoSoat.codigoTipoVehiculo.codigoValor;
      vm.frm.codigoUsoVehiculo = frmVehiculoSoat.codigoUsoVehiculo.codigoValor;
      vm.frm.placaVehiculo = frmVehiculoSoat.nPlaca.$modelValue;
      debugger;
      
      vm.ngIf = false;
      vm.esFrmAgregar && vm.onAgregar({$event: {vehiculoTercero: vm.frm}});
      if (!vm.esFrmAgregar) {
        vm.onEditar({$event: {idx: vm.idxVehiculoTercero, vehiculoTercero: vm.frm}});
        $scope.$emit('vehiculoTercero:frmEditCerrado');
      }
      $timeout(function() {
        $rootScope.$emit('vehiculoTercero:frmCerrado');
      });
    }

    function cerrarFrm() {
      vm.ngIf = false;
      $scope.$emit('vehiculoTercero:frmEditCerrado');
      $rootScope.$emit('vehiculoTercero:frmCerrado');
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
    .component('wpAgregarEditarVehiculoTercero', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/common/agregar-vehiculo-tercero/agregar-editar-vehiculo-tercero/agregar-editar-vehiculo-tercero.html',
      controller: 'AgregarEditarVehiculoTerceroController',
      bindings: {
        vehiculoTercero: '<?',
        esFrmAgregar: '<?',
        idxVehiculoTercero: '<?',
        ngIf: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        modoLectura: '=?'
      }
    });
});
