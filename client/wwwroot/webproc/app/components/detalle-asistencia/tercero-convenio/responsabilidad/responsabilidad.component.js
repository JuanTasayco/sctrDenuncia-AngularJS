'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant', 'wpAgregarAtropellado', 'wpAgregarBien'], function (ng, _, AsistenciaActions, wpConstant) {
  ResponsabilidadController.$inject = ['wpFactory', '$log', '$scope', '$interval', '$ngRedux', '$timeout'];
  function ResponsabilidadController(wpFactory, $log, $scope, $interval, $ngRedux, $timeout) {
    var vm = this
    vm.$onInit = onInit;
    vm.changeResponsabilidad = changeResponsabilidad;
    vm.showConvenio = false;
    vm.showCompanhiaTercero = false;
    vm.showImporte = false;
    vm.TipomonedaAntigua = {
      "1" : 74,
      "2" : 73, 
    }
    
    function onInit() {
      vm.frmSiniestro = vm.siniestro;
      vm.frmSiniestro.monedaList = wpFactory.myLookup.getTipoMoneda();
      if(vm.frmSiniestro.siniestroConvenio){
        vm.frmSiniestro.siniestroConvenio.codigoMoneda = 74;
        if(vm.TipomonedaAntigua[vm.frmSiniestro.siniestroConvenio.codigoMoneda]) {
          vm.frmSiniestro.siniestroConvenio.codigoMoneda = vm.TipomonedaAntigua[vm.frmSiniestro.siniestroConvenio.codigoMoneda]
        }
        changeResponsabilidad();
      }
      else{
        vm.frmSiniestro.siniestroConvenio = {};
        vm.frmSiniestro.siniestroConvenio.codigoMoneda = '';
        vm.frmSiniestro.siniestroConvenio.codigoEmpresaAseguradora = null;
      }
    }

    function changeResponsabilidad() {
      $timeout(function () {
        vm.showImporte =
          (
            vm.frmSiniestro.codigoResponsaDetaSiniestro == 2 &&
            vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpe == 72
          ) ? true : false;
        vm.showCompanhiaTercero =
          (
            vm.frmSiniestro.codigoResponsaDetaSiniestro == 1 ||
            vm.frmSiniestro.codigoResponsaDetaSiniestro == 2 &&
            vm.frmSiniestro.siniestroConvenio.flagTerceroSeguro == 'S' &&
            vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpe == 71
          ) ? true : false;

        vm.showConvenio =
          (
            vm.frmSiniestro.codigoResponsaDetaSiniestro == 1 &&
            vm.frmSiniestro.siniestroConvenio.flagTerceroSeguro == 'N' ||
            !vm.frmSiniestro.siniestroConvenio.flagTerceroSeguro
          ) ? false : true;
      })
    }


  } // end controller

  return ng
    .module('appWp')
    .controller('ResponsabilidadController', ResponsabilidadController)
    .component('wpResponsabilidad', {
      templateUrl: '/webproc/app/components/detalle-asistencia/tercero-convenio/responsabilidad/responsabilidad.html',
      controller: 'ResponsabilidadController',
      bindings: {
        siniestro: '=?',
        modoLectura: '=?'
      }
    });
});
