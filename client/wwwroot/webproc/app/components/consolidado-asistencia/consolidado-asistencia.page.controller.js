'use strict';

define(['angular', 'AsistenciaActions', 'lodash','wpConstant'], function (ng, AsistenciaActions, _,wpConstant) {
  ConsolidadoAsistenciaPageController.$inject = ['$scope', '$ngRedux', 'wpFactory', '$state'];
  function ConsolidadoAsistenciaPageController($scope, $ngRedux, wpFactory, $state) {

    var vm = this;
    vm.$onInit = onInit;
    vm.infoAsistencia;
    vm.soat = [];
    vm.descargarVersionPDF = descargarVersionPDF;


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
          var distritofound = _.find(vm.departamentolist,function (x) {
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
        _getVersiones();
      }
     
    }

    function _getVersiones() {
      wpFactory.siniestro
        .GetVersion()
        .then(function gvSP(resp) {
          vm.siniestroInforme = resp;
        })
        .catch(function gvEP(err) {
          vm.siniestroInforme = {};
          $log.error('Falló el obtener versiones', err);
        });
    }
    
    function descargarVersionPDF(objVersion) {
      if (wpFactory.getSiniestroNro()) {
        wpFactory.assistance.DownloadVersion(
          'api/Siniestro/versions/download/' + wpFactory.getNroAsistencia() + '/' + objVersion.idDocumento
        );
      } else {
        wpFactory.siniestro.DownloadVersionSinSiniestro(
          'api/Siniestro/versions/downloadSinSiniestro?fileName=' +
            objVersion.filename +
            '&idDocumento=' +
            _getNroByFileName(objVersion.filename)
        );
      }
    }

    function setSoat() {
      var soat = wpFactory.myLookup.getTipoSoat();
      vm.soat2 = _.find(soat,function (x) {
        return x.codigoValor == vm.infoAsistencia.codigoSoatVehiculo;
      });
      vm.infoAsistencia.descripcionSoatVehiculo = vm.soat2 ?  vm.soat2.nombreValor : '-';
    }

    function setCarType() {
      var carType = wpFactory.myLookup.getCarTypes();
      vm.carType2 = _.find(carType,function (x) {
        return x.codigoValor == vm.infoAsistencia.codigoTipoVehiculo;
      });
      vm.infoAsistencia.descripcionTipoVehiculo = vm.carType2 ? vm.carType2.nombreValor : '-';
    }

    function setSiniestro() {
      var siniestro = wpFactory.myLookup.getTipoSiniestro();
      vm.siniestro2 = _.find(siniestro,function (x) {
        return x.codigoValor == vm.infoAsistencia.codigoTipoSiniestro;
      });
      vm.infoAsistencia.descripcionTipoSiniestro = vm.siniestro2 ?  vm.siniestro2.nombreValor : '-';
    }

    function setSiniestroDetalle() {
      var siniestroDetalle = wpFactory.myLookup.getTipoSiniestroDetalle();
      vm.siniestroDetalle2 = _.find(siniestroDetalle,function (x) {
        return x.codigoValor == vm.infoAsistencia.codigoSubSiniestro;
      });
      vm.infoAsistencia.descripcionSubSiniestro = vm.siniestroDetalle2 ? vm.siniestroDetalle2.nombreValorDetalle : '-';
    }

    function setLugarAtencion() {
      var lugarAtention = wpFactory.myLookup.getLugarAtencionAsistencia();
      vm.lugarAtention2 = _.find(lugarAtention,function (x) {
        return x.codigoValor == vm.infoAsistencia.codigoLugarAtencion;
      });
      vm.infoAsistencia.lugarAtencionDescripcion = vm.lugarAtention2 ? vm.lugarAtention2.nombreValor : '-';
    }


  } // end controller

  return ng.module('appWp').controller('ConsolidadoAsistenciaPageController', ConsolidadoAsistenciaPageController);
});
