'use strict';

define(['angular', 'AsistenciaActions', 'lodash','wpConstant'], function (ng, AsistenciaActions, _,wpConstant) {
  ConsolidadoAsistenciaPageController.$inject = ['$scope', '$ngRedux', 'wpFactory', '$state'];
  function ConsolidadoAsistenciaPageController($scope, $ngRedux, wpFactory, $state) {

    var vm = this;
    vm.$onInit = onInit;
    vm.infoAsistencia;
    vm.soat = [];

    $scope.$on('$destroy', function sod() {
      $state.params.setFrm = true;
    });

    function onInit() {
      vm.infoAsistencia = wpFactory.cache.getConsolidado();
      if (!vm.infoAsistencia) {
        $state.go('bandeja', { setFrm: true })
        
      }
      else{
        vm.departamentolist = wpFactory.myLookup.getDepartamentos();
        
        if(!vm.infoAsistencia.descripcionDepartamento || vm.infoAsistencia.descripcionDepartamento == undefined || vm.infoAsistencia.descripcionDepartamento == '--SELECCIONE--' ){
          var distritofound =  vm.departamentolist.find(function (x) {
            return x.id == vm.infoAsistencia.codigoDepartamento;
          });
          vm.infoAsistencia.descripcionDepartamento = distritofound.id  ?  distritofound.descripcion : '-'
        }

        if(!vm.infoAsistencia.descripcionProvincia || vm.infoAsistencia.descripcionProvincia == undefined || vm.infoAsistencia.descripcionProvincia == '--SELECCIONE--' ){
          vm.provincia = wpFactory.getProvincia(vm.infoAsistencia.codigoProvincia);
          vm.infoAsistencia.descripcionProvincia = vm.provincia ? vm.provincia.descripcion : '-';
        }
        
        if(!vm.infoAsistencia.descripcionDistrito || vm.infoAsistencia.descripcionDistrito == undefined || vm.infoAsistencia.descripcionDistrito == '--SELECCIONE--' ){
          vm.distrito = wpFactory.getDistrito(vm.infoAsistencia.codigoDistrito);
          vm.infoAsistencia.descripcionDistrito = vm.distrito ? vm.distrito.descripcion : '-';
        }

        setSoat();
        setSiniestro();
        setCarType();
        setSiniestroDetalle();
        setLugarAtencion();
      }
     
    }

    function setSoat() {
      var soat = wpFactory.myLookup.getTipoSoat();
      vm.soat2 = soat.find(function (x) {
        return x.codigoValor == vm.infoAsistencia.codigoSoatVehiculo;
      });
      vm.infoAsistencia.descripcionSoatVehiculo = vm.soat2 ?  vm.soat2.nombreValor : '-';
    }

    function setCarType() {
      var carType = wpFactory.myLookup.getCarTypes();
      vm.carType2 = carType.find(function (x) {
        return x.codigoValor == vm.infoAsistencia.codigoTipoVehiculo;
      });
      vm.infoAsistencia.descripcionTipoVehiculo = vm.carType2 ? vm.carType2.nombreValor : '-';
    }

    function setSiniestro() {
      var siniestro = wpFactory.myLookup.getTipoSiniestro();
      vm.siniestro2 = siniestro.find(function (x) {
        return x.codigoValor == vm.infoAsistencia.codigoTipoSiniestro;
      });
      vm.infoAsistencia.descripcionTipoSiniestro = vm.siniestro2 ?  vm.siniestro2.nombreValor : '-';
    }

    function setSiniestroDetalle() {
      var siniestroDetalle = wpFactory.myLookup.getTipoSiniestroDetalle();
      vm.siniestroDetalle2 = siniestroDetalle.find(function (x) {
        return x.codigoValor == vm.infoAsistencia.codigoSubSiniestro;
      });
      vm.infoAsistencia.descripcionSubSiniestro = vm.siniestroDetalle2 ? vm.siniestroDetalle2.nombreValorDetalle : '-';
    }

    function setLugarAtencion() {
      var lugarAtention = wpConstant.lugarAtencion;
      vm.lugarAtention2 = lugarAtention.find(function (x) {
        return x.codigoValor == vm.infoAsistencia.codigoLugarAtencion;
      });
      vm.infoAsistencia.lugarAtencionDescripcion = vm.lugarAtention2 ? vm.lugarAtention2.nombreValor : '-';
    }


  } // end controller

  return ng.module('appWp').controller('ConsolidadoAsistenciaPageController', ConsolidadoAsistenciaPageController);
});
