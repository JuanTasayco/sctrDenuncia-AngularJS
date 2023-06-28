'use strict';

define(['angular', 'AsistenciaActions', 'lodash', 'wpConstant'], function(ng, AsistenciaActions, _, wpConstant) {
  VehiculoController.$inject = ['$interval', '$ngRedux', 'wpFactory', '$scope'];

  function VehiculoController($interval, $ngRedux, wpFactory, $scope) {
    var vm = this;
    var actionsRedux, updateIntervalPromise, oldFrm, watchFrmRequire;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.subirFotosSiniestro = subirFotosSiniestro;
    vm.agregarDanho = agregarDanho;
    vm.editarDanho = editarDanho;
    vm.eliminarDanho = eliminarDanho;
    vm.servicePhotoModal = servicePhotoModal;
    vm.subirFotoSoat = subirFotoSoat;
    vm.subirFotoTarjeta = subirFotoTarjeta;
    vm.subirFotoLicencia = subirFotoLicencia;
    vm.subirFotoOdometro = subirFotoOdometro;

    // declaracion

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
      vm.frm.esModalidadKm = !vm.frm.esModalidadKm ? false : vm.frm.esModalidadKm
      vm.maxFotos = 3
      if (vm.frm.esModalidadKm) {
        vm.maxFotos = 4
      }
      vm.optImgsTabs = {
        isPhotoValid: {},
        // uso de referencia de objs
        statusBlock: vm.statusBlock,
        isOdometro: vm.frm.esModalidadKm
      };
      vm.isValidListDanhos = true;
      vm.frm.tab3 = {};
      vm.mShowTalleresFrom = 'A';
      _autoUpdate();
      _watcherFrmRequire();
    }

    function onDestroy() {
      $interval.cancel(updateIntervalPromise);
      actionsRedux();
      watchFrmRequire();
    }

    function mapStateToThis(state) {
      return {
        frm: _.merge({}, state.detalle),
        frmsValidationStates: ng.copy(state.frmsValidationStates),
        isFrmRequire: state.frmStatus.require,
        lstDanhos: ng.copy(state.detalle.detalleDanioVehiculo),
        statusBlock: state.frmStatus
      };
    }

    function _watcherFrmRequire() {
      watchFrmRequire = $scope.$watch('$ctrl.isFrmRequire', function(nv) {
        if (nv) {
          vm.optImgsTabs.isRequired = {doc: true, siniestro: true};
          vm.isValidListDanhos = vm.lstDanhos.length > 0;
          vm.frmVehiculoObj.markAsPristine();
          _checkAllPhotos();
        }
      });
    }

    function _autoUpdate() {
      updateIntervalPromise = $interval(function() {
        _checkAllPhotos();
        var isFrmVehiculoValid = _isFrmWithDanhosValid();

        if (wpFactory.help.isObjDifferent(oldFrm, vm.frm)) {
          oldFrm = ng.copy(vm.frm);
          vm.rdxDetalleUpdate(oldFrm);
          vm.rdxFrmsValidate({
            vehiculo: isFrmVehiculoValid
          });
          vm.rdxFrmSaved(false);
        }
      }, wpConstant.timeToUpdate);
    }

    function servicePhotoModal(photo) {
      return wpFactory.siniestro.ViewImageByPath(photo.nombreFisico, 0);
    }

    function _isFrmWithDanhosValid() {
      if (vm.frm.esModalidadKm) {
        return vm.frm.kilometrajeMomentoSiniestro > 0 && (vm.lstDanhos.length > 0 && _isFrmWithPhotosValid());
      } 
      else {
        return vm.lstDanhos.length > 0 && _isFrmWithPhotosValid()
      }
    }

    function _isFrmWithPhotosValid() {
      return vm.frmVehiculoObj.$valid && vm.optImgsTabs.isPhotoValid.doc && vm.optImgsTabs.isPhotoValid.siniestro;
    }

    function _checkAllPhotos() {
      _checkFotosDoc();
      _checkFotosSiniestro();
    }

    function _checkFotosDoc() {
      vm.optImgsTabs.isPhotoValid.doc = wpFactory.help.isArrayFotosValid(vm.frm.documentosVehiculo, vm.maxFotos);
    }

    function _checkFotosSiniestro() {
      vm.optImgsTabs.isPhotoValid.siniestro = (vm.frm.fotosSiniestroVehiculo || []).length > 0 ? true : false;
    }

    function subirFotosSiniestro(event) {
      return wpFactory.siniestro.UploadCarSinister(event.photoToUpload, 4);
    }

    function subirFotoSoat(event) {
      return wpFactory.siniestro.UploadCarDocument(event.photoToUpload, 3);
    }

    function subirFotoTarjeta(event) {
      return wpFactory.siniestro.UploadCarDocument(event.photoToUpload, 2);
    }

    function subirFotoLicencia(event) {
      return wpFactory.siniestro.UploadCarDocument(event.photoToUpload, 1);
    }

    function subirFotoOdometro(event) {
      return wpFactory.siniestro.UploadCarDocument(event.photoToUpload, 5);
    }
    // danhos

    function agregarDanho(event) {
      vm.rdxDanhoVehiculoPropioAdd(event.danho);
      vm.isValidListDanhos = true;
    }

    function editarDanho(event) {
      vm.rdxDanhoVehiculoPropioEdit(event.idx, event.danho);
    }

    function eliminarDanho(event) {
      vm.rdxDanhoVehiculoPropioDelete(event.idx);
      vm.isValidListDanhos = false;
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('VehiculoController', VehiculoController)
    .component('wpVehiculo', {
      templateUrl: '/webproc/app/components/detalle-asistencia/vehiculo/vehiculo.html',
      controller: 'VehiculoController',
      bindings: {}
    });
});
