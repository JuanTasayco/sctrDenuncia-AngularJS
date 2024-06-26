'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant','wpAgregarAtropellado','wpAgregarBien'], function(ng, _, AsistenciaActions, wpConstant) {
  TerceroConvenioController.$inject = ['wpFactory', '$log', '$scope', '$interval', '$ngRedux','mModalAlert'];
  function TerceroConvenioController(wpFactory, $log, $scope, $interval, $ngRedux,mModalAlert) {
    var vm = this
    var watchFrmRequire;
    vm.$onInit = onInit;
    vm.eliminarFotoOtros = eliminarFotoOtros;
    vm.subirFotosOtros = subirFotosOtros;
    vm.servicePhotoModal = servicePhotoModal;

    vm.agregarAtropellado = agregarAtropellado;
    vm.editarAtropellado = editarAtropellado;
    vm.eliminarAtropellado = eliminarAtropellado;

    vm.agregarVehiculoTercero = agregarVehiculoTercero;
    vm.editarVehiculoTercero = editarVehiculoTercero;
    vm.eliminarVehiculoTercero = eliminarVehiculoTercero;


    vm.agregarBien = agregarBien;
    vm.editarBien = editarBien;
    vm.eliminarBien = eliminarBien;

    vm.convenioArray = null

    function onInit() {
      vm.dateFormat = 'dd/MM/yyyy';
      vm.frmTercero = vm.siniestro;
      _loadFotosOtros(vm.documentos)
  
    }


    function _loadFotosOtros(fotosSiniestro) {
      _loadFotos(fotosSiniestro, 'documentos');
    }

    function _loadFotos(arrFotos, prop) {
      _.forEach(arrFotos, function feFn(item, idx) {
        if (item && item.nombreFisico) {
          wpFactory.siniestro.ViewImageByPath(item.nombreFisico).then(function (resp) {
            if(wpFactory.help.isCode200(resp)){
              vm[prop][idx].srcImg = resp.data
            }
            else{
              vm[prop][idx] = null
            }
          });
        }
      });
    }

    function subirFotosOtros(event) {
      vm.modoLectura? mModalAlert.showWarning("No se puede agregar documentos en el estado actual.", "Error") :  _subirFotos(event, 'documentos', 21);
    }

    function eliminarFotoOtros(event) {
      vm.modoLectura? mModalAlert.showWarning("No se puede eliminar documentos en el estado actual.", "Error") : _eliminarFoto(event, 'documentos');
    }

    function _eliminarFoto(event, propWhereSave) {
      wpFactory.siniestro.DeleteImages(event.photoToRemove.nombreFisico);
      vm[propWhereSave].splice(event.idx, 1);
      vm.fotos = [].concat(vm[propWhereSave]);
    }

    function _subirFotos(event, propWhereSave, imageTypeCode) {
      wpFactory.siniestro.UploadThirdParties(event.photoToUpload, {
        imageTypeCode: imageTypeCode,
        itemConductor: 1
      }).then(function ucsPr(resp) {
        vm.fotos = wpFactory.help.getArrayFotosNuevas(
          vm.fotos,
          resp,
          event.photoData
        );
        vm[propWhereSave] = wpFactory.help.getFotosConB64(vm[propWhereSave], resp, event.photoData);
      });
    }

    function servicePhotoModal(photo) {
      return wpFactory.siniestro.ViewImageByPath(photo.nombreFisico, 0);
    }

    // Atropellado 
    function agregarAtropellado(event) {
      vm.frmTercero.peatonesTercero.push(event.atropellado);
    }

    function editarAtropellado(event) {
      vm.frmTercero.peatonesTercero[event.idx] = event.atropellado;
    }

    function eliminarAtropellado(event) {
      vm.frmTercero.peatonesTercero.splice(event.idx, 1);
    }

    //Vehiculo Tercero
    function agregarVehiculoTercero(event) {
      vm.frmTercero.conductorTercero.push(event.vehiculoTercero);
    }

    function editarVehiculoTercero(event) {
      vm.frmTercero.conductorTercero[event.idx] = event.vehiculoTercero;
    }
    
    function eliminarVehiculoTercero(event) {
      vm.frmTercero.conductorTercero.splice(event.idx, 1);
    }

    // BienAfectado 
    function agregarBien(event) {
      vm.frmTercero.bienesTercero.push(event.bien);
    }

    function editarBien(event) {
      vm.frmTercero.bienesTercero[event.idx] = event.bien;
    }

    function eliminarBien(event) {
      vm.frmTercero.bienesTercero.splice(event.idx, 1);
    }
   
  } // end controller

  return ng
    .module('appWp')
    .controller('TerceroConvenioController', TerceroConvenioController)
    .component('wpTerceroConvenio', {
      templateUrl: '/webproc/app/components/detalle-asistencia/tercero-convenio/tercero-convenio.html',
      controller: 'TerceroConvenioController',
      bindings: {
        siniestro: '=?',
        fotos: '=?',
        conductorTercero: '=?',
        validateForm: '=?',
        modoLectura: '=?'
      }
    });
});
