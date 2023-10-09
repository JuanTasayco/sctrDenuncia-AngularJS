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

    function onInit() {
      vm.frmSiniestro = vm.siniestro;
      changeResponsabilidad();
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
            vm.frmSiniestro.codigoResponsaDetaSiniestro == 1 &&
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
        siniestro: '=?'
      }
    });
});
