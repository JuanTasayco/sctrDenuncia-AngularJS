'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant'], function (ng, _, AsistenciaActions, wpConstant) {
  LugarOcurrenciaController.$inject = ['wpFactory', '$log', '$scope', '$interval', '$ngRedux', '$window', '$uibModal', '$timeout','$rootScope'];
  function LugarOcurrenciaController(wpFactory, $log, $scope, $interval, $ngRedux, $window, $uibModal, $timeout,$rootScope) {
    var vm = this
    var onFrmSave;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.selectDanio = selectDanio;
    vm.getCheckList = GetCheckList;
    vm.eliminarFotoOtros = eliminarFotoOtros;
    vm.subirFotosOtros = subirFotosOtros;
    vm.servicePhotoModal = servicePhotoModal;
    vm._showModalMap = _showModalMap;
    vm.changeArray = changeArray;

    vm.soatTypeSource = [];
    vm.siniestroTypeSource = [];
    vm.siniestroLicenses = [];
    vm.siniestroTypeCheckList = [];
    vm.DataCombo = null;
    vm.comisariasArray = []
    vm.frmSiniestro  = null;
    vm.pattern  = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    function onDestroy() {
      onFrmSave();
    }

    function onInit() {
      onFrmSave = $rootScope.$on('frm:save', setFrm)
      vm.dateFormat = 'dd/MM/yyyy';
      vm.frmSiniestro = vm.siniestro;
      vm.getCheckList(null);
      vm.documentos = vm.frmSiniestro.fotosDetaSiniestro.concat(vm.frmSiniestro.documentosVehiculo).concat(vm.frmSiniestro.fotosSiniestroVehiculo);
      _loadFotosOtros(vm.documentos);
    }

    function setFrm() {
      if ($scope.frmLugarOcurrencia.$invalid) {
        $scope.showUp = true;
        return void 0;
      }

    }

    function GetCheckList(valor) {
      var nombreTipoSiniestro = wpFactory.myLookup.getTipoSiniestro().find(
        function (element) { return element.codigoValor == vm.frmSiniestro.codigoTipoSiniestro }
      );
      vm.siniestroTypeCheckList = wpFactory.myLookup.getTipoSiniestroDetalle().filter(function (element) {
        return element.nombreValor == (valor ? valor.nombreValor : nombreTipoSiniestro ? nombreTipoSiniestro.nombreValor : null) && element.nombreValorDetalle;
      });

    }

    function selectDanio(code) {
      var nivelDanho = wpFactory.myLookup.getNivelDanho();
      var seleccionado = _.find(nivelDanho, function (item) {
        return item.codigoParametro === code;
      });
      vm.frmSiniestro.detalleDanioVehiculo[0].codigoNivelDanio = seleccionado.codigoParametro;
      vm.frmSiniestro.detalleDanioVehiculo[0].nivelDanio = seleccionado.descripcionParametro;
    }

    function _loadFotosOtros(fotosSiniestro) {
      _loadFotos(fotosSiniestro, 'documentos');
    }

    function _loadFotos(arrFotos, prop) {
      _.forEach(arrFotos, function feFn(item, idx) {
        if (item && item.nombreFisico) {
          wpFactory.siniestro.ViewImageByPath(item.nombreFisico).then(function (resp) {
            wpFactory.help.isCode200(resp) ? (vm[prop][idx].srcImg = resp.data) : (vm[prop][idx] = null);
          });
        }
      });
    }

    function subirFotosOtros(event) {
      _subirFotos(event, 'documentos', 21);
    }

    function eliminarFotoOtros(event) {
      _eliminarFoto(event, 'documentos');
    }

    function _eliminarFoto(event, propWhereSave) {
      wpFactory.siniestro.DeleteImages(event.photoToRemove.nombreFisico);
      vm[propWhereSave].splice(event.idx, 1);
      vm.frmSiniestro.documentosVehiculo = [].concat(vm[propWhereSave]);
    }

    function _subirFotos(event, propWhereSave, imageTypeCode) {
      wpFactory.siniestro.UploadSinisterDetail(event.photoToUpload, imageTypeCode).then(function ucsPr(resp) {
        vm.frmSiniestro.documentosVehiculo = wpFactory.help.getArrayFotosNuevas(
          vm.frmSiniestro.documentosVehiculo,
          resp,
          event.photoData
        );
        vm[propWhereSave] = wpFactory.help.getFotosConB64(vm[propWhereSave], resp, event.photoData);
      });
    }

    function servicePhotoModal(photo) {
      return wpFactory.siniestro.ViewImageByPath(photo.nombreFisico, 0);
    }


    ///// 
    function _showModalMap() {

      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<wp-modal-map close="close(status)" comisarias="comisarias"></wp-modal-map>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.close = function(type) {
              type && type === 'ok' ? $uibModalInstance.close() : $uibModalInstance.dismiss();
            };
            scope.comisarias = vm.comisariasArray;
          }
        ]
      });
    }

    function changeArray(data){
      vm.comisariasArray = data;
    }

  } // end controller

  return ng
    .module('appWp')
    .controller('LugarOcurrenciaController', LugarOcurrenciaController)
    .component('wpLugarOcurrencia', {
      templateUrl: '/webproc/app/components/detalle-asistencia/lugar-ocurrencia/lugar-ocurrencia.html',
      controller: 'LugarOcurrenciaController',
      bindings: {
        siniestro: '=?',
        validateForm: '=?'
      }
    });
});
