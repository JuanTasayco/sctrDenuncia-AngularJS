'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant', 'wpAgregarAtropellado', 'wpAgregarBien'], function (ng, _, AsistenciaActions, wpConstant) {
  ResponsabilidadController.$inject = ['wpFactory', '$log', '$scope', '$interval', '$ngRedux', '$timeout'];
  function ResponsabilidadController(wpFactory, $log, $scope, $interval, $ngRedux, $timeout) {
    var vm = this
    vm.$onInit = onInit;
    vm.changeResponsabilidad = changeResponsabilidad;
    vm.changeConvenio = changeConvenio;

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
      vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect = {codigoValor: vm.frmSiniestro.siniestroConvenio ? vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect : null}
      if(vm.frmSiniestro.siniestroConvenio){
        vm.frmSiniestro.siniestroConvenio.codigoMoneda = 74;
        if(vm.TipomonedaAntigua[vm.frmSiniestro.siniestroConvenio.codigoMoneda]) {
          vm.frmSiniestro.siniestroConvenio.codigoMoneda = vm.TipomonedaAntigua[vm.frmSiniestro.siniestroConvenio.codigoMoneda]
        }
        vm.showHaveSeguro = vm.frmSiniestro.siniestroConvenio.flagTerceroSeguro != null ;
        vm.showImporte = vm.frmSiniestro.siniestroConvenio.codigoMoneda!= null ;
        vm.showCompanhiaTercero =  vm.frmSiniestro.siniestroConvenio.codigoEmpresaAseguradora!= null ;
        vm.showConvenio =  vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect
       
      }
      else{
        vm.frmSiniestro.siniestroConvenio = {};
        vm.frmSiniestro.siniestroConvenio.codigoMoneda = '';
        vm.frmSiniestro.siniestroConvenio.codigoEmpresaAseguradora = null;
      }
      vm.listaConvenio = wpFactory.myLookup.getConvenio();
    }

    function changeResponsabilidad() {
      vm.listaConvenio = wpFactory.myLookup.getConvenio();
      $timeout(function () {
        
        if(vm.frmSiniestro.codigoResponsaDetaSiniestro==1){
          vm.showConvenio = false;
          vm.showCompanhiaTercero = false;
          vm.showImporte = false;
          vm.listaConvenio = _.filter(vm.listaConvenio,function (item) {
            return item.codigoValor == 71 || item.codigoValor == 70;
          })
          vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect = null;
          vm.showHaveSeguro = true;
          vm.showConvenio = vm.frmSiniestro.siniestroConvenio.flagTerceroSeguro == 'S';
          vm.showCompanhiaTercero = vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect ?  vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect.codigoValor == 71 && vm.showConvenio : false; 
        }
        else if (vm.frmSiniestro.codigoResponsaDetaSiniestro==2){
          vm.showConvenio = false;
          vm.showCompanhiaTercero = false;
          vm.showImporte = false;
          if(vm.frmSiniestro.siniestroConvenio.flagTerceroSeguro == 'S'){
            vm.listaConvenio = _.filter(vm.listaConvenio,function (item) {
              return item.codigoValor == 71 || item.codigoValor == 70;
            })
          }
          else{
            vm.listaConvenio = _.filter(vm.listaConvenio,function (item) {
              return item.codigoValor == 72 || item.codigoValor == 70;
            })
          }
          vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect = null;
          vm.showHaveSeguro = true;
          vm.showConvenio = true;
          vm.showCompanhiaTercero = vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect ? vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect.codigoValor : false;
        }
        else if (vm.frmSiniestro.codigoResponsaDetaSiniestro==3){
          vm.showHaveSeguro = false;
          vm.showConvenio = false;
          vm.showCompanhiaTercero = false;
          vm.showImporte = false;
          vm.listaConvenio = _.filter(vm.listaConvenio,function (item) {
            return item.codigoValor != 72;
          })
          vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect = null;
          vm.showConvenio = true;
        }
        else{
          vm.showConvenio  = false;
          vm.showCompanhiaTercero = false;
          vm.showHaveSeguro = false;
          vm.showImporte = false;
        }
        vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpe = vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect ? vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect.codigoValor : null;
      })

    }

    function changeConvenio() {
      vm.showCompanhiaTercero =  vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect.codigoValor == 71;
      vm.showImporte =  vm.frmSiniestro.siniestroConvenio.codigoConvenioGolpeSelect.codigoValor == 72;
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
