'use strict';

define(['angular', 'lodash'], function(ng, _) {
  AgregarEditarDanhoController.$inject = ['$rootScope', '$scope', '$timeout', 'wpFactory'];
  function AgregarEditarDanhoController($rootScope, $scope, $timeout, wpFactory) {
    var vm = this;
    vm.$onInit = onInit;
    vm.grabarDanho = grabarDanho;
    vm.cerrarFrm = cerrarFrm;
    vm.changeParte = changeParte;

    // declaracion

    function onInit() {
      vm.frm = {};
      vm.frmTitulo = vm.esFrmAgregar ? 'Agregando Daño' : 'Editando Daño';
      !vm.esFrmAgregar && asignarDatosAlModelo();
    }

    function asignarDatosAlModelo() {
      vm.frm = ng.copy(vm.danho);
      vm.frm.cDanho = {};
    }

    function _existParteDanho(codigoParte) {
      var existZona = _.some(vm.danhos, function sd(item) {
        return item.codigoZonaDanio === vm.frm.codigoZonaDanio;
      });

      var danhosByCurrentZona = _.filter(vm.danhos, function dbcz(item) {
        return item.codigoZonaDanio === vm.frm.codigoZonaDanio;
      });

      var existParte = _.some(danhosByCurrentZona, function sd(item) {
        return item.codigoParteDanio === codigoParte;
      });

      return existZona && existParte;
    }

    function changeParte() {
      // HACK: para obtener valor
      $timeout(function tcd() {
        vm.isParteDanhoRepetido = _existParteDanho(vm.frm.codigoParteDanio);
      }, 0);
    }

    function grabarDanho() {
      if (_existParteDanho(vm.frm.codigoParteDanio)) {
        return void 0;
      }
      if (vm.frmDanho.$invalid) {
        vm.frmDanho.markAsPristine();
        return void 0;
      }
      vm.ngIf = false;
      vm.frm.parteDanio = wpFactory.help.getNombreParteDanho(vm.frm);
      vm.esFrmAgregar && vm.onAgregar({$event: {danho: vm.frm}});
      if (!vm.esFrmAgregar) {
        vm.onEditar({$event: {idx: vm.idxDanho, danho: vm.frm}});
        $scope.$emit('danho:frmEditCerrado');
      }
      // HACK: para verificar luego que el danho ha sido agregado al state
      $timeout(function() {
        $rootScope.$emit('danho:frmCerrado');
      });
    }

    function cerrarFrm() {
      vm.ngIf = false;
      $scope.$emit('danho:frmEditCerrado');
      $rootScope.$emit('danho:frmCerrado');
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarEditarDanhoController', AgregarEditarDanhoController)
    .component('wpAgregarEditarDanho', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/common/agregar-danho/agregar-editar-danho/agregar-editar-danho.html',
      controller: 'AgregarEditarDanhoController',
      bindings: {
        danho: '<?',
        danhos: '=?',
        esFrmAgregar: '<?',
        idxDanho: '<?',
        ngIf: '=?',
        onAgregar: '&?',
        onEditar: '&?'
      }
    });
});
