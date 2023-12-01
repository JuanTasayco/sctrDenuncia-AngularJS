'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant'], function (ng, _, AsistenciaActions, wpConstant) {
  LugarOcurrenciaController.$inject = ['wpFactory', '$scope', 'mModalAlert', '$uibModal','$rootScope'];
  function LugarOcurrenciaController(wpFactory, $scope, mModalAlert , $uibModal,$rootScope) {
    var vm = this
    var onFrmSave;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.selectDanio = selectDanio;
    vm.getCheckList = GetCheckList;
    vm.changeFinHoraAtencion = changeFinHoraAtencion;
    vm.servicePhotoModal = servicePhotoModal;
    vm._showModalMap = _showModalMap;
    vm.changeArray = changeArray;
    vm.changeApEtilica = changeApEtilica;
    vm.onChangeLstDetalleSiniestro = onChangeLstDetalleSiniestro;
    vm.subirFotosSiniestro = subirFotosSiniestro;
    vm.agregarDanho = agregarDanho;
    vm.editarDanho = editarDanho;
    vm.eliminarDanho = eliminarDanho;
    vm.servicePhotoModal = servicePhotoModal;
    vm.subirFotoSoat = subirFotoSoat;
    vm.subirFotoTarjeta = subirFotoTarjeta;
    vm.subirFotoLicencia = subirFotoLicencia;
    vm.subirFotoOdometro = subirFotoOdometro;


    vm.soatTypeSource = [];
    vm.siniestroTypeSource = [];
    vm.siniestroLicenses = [];
    vm.siniestroTypeCheckList = [];
    vm.DataCombo = null;
    vm.comisariasArray = []
    vm.frmSiniestro  = null;
    vm.exoneracionDisabled = false;
    vm.pattern  = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    vm.docSoat = [];
    vm.docTarjeta = [];
    vm.docLicencia = [];
    vm.docOdometro = [];
    vm.arrFotosSiniestros = [];

    function onDestroy() {
      wpFactory.myLookup.resetDataLookUp();
      onFrmSave();
    }

    function onInit() {
      onFrmSave = $rootScope.$on('frm:save', setFrm)
      vm.dateFormat = 'dd/MM/yyyy';

      vm.frmSiniestro = vm.siniestro;
      vm.frmSiniestro.esModalidadKm = !vm.frmSiniestro.esModalidadKm ? false : vm.frmSiniestro.esModalidadKm;
      if (vm.frmSiniestro.esModalidadKm) {
        vm.maxFotos = 4
      }
      vm.optImgsTabs = {
        isPhotoValid: {},
        statusBlock: vm.statusBlock,
        isOdometro: vm.frmSiniestro.esModalidadKm
      };


      vm.frmSiniestro.flagLesionConductor = vm.frmSiniestro.flagLesionConductor ? vm.frmSiniestro.flagLesionConductor : "S";
      vm.frmSiniestro.flagOcupantes = vm.frmSiniestro.flagOcupantes ? vm.frmSiniestro.flagOcupantes : "S";
      vm.frmSiniestro.flagFallecidos = vm.frmSiniestro.flagFallecidos ? vm.frmSiniestro.flagOcupantes : "S";
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
      vm.frmSiniestro.expediente = vm.siniestro.expediente;
    }

    function changeFinHoraAtencion() {
      vm.frmSiniestro.horaInicioAtencion = vm.frmSiniestro.horaInicioAtencion.replace(":", "");
      if(vm.frmSiniestro.horaInicioAtencion>vm.frmSiniestro.horaFinAtencion){
        vm.frmSiniestro.horaFinAtencion = vm.frmSiniestro.horaInicioAtencion;
      }
    }

    function onChangeLstDetalleSiniestro(radioItem) {
      vm.frmSiniestro.expediente = radioItem.valEquivalence;
      vm.frmSiniestro.codigoCausa = radioItem.valEquivalence2;
      vm.frmSiniestro.codigoConsecuencia = radioItem.valEquivalence3;
    }
    
    function changeApEtilica() {
      if(vm.frmSiniestro.apreciacionEtilica==true){
        vm.frmSiniestro.exoneraDenuncia = false
        vm.exoneracionDisabled = true;
      }
      else{
        vm.exoneracionDisabled = false;
      }
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

    function servicePhotoModal(photo) {
      return wpFactory.siniestro.ViewImageByPath(photo.nombreFisico, 0);
    }
    
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
  } 

  return ng
    .module('appWp')
    .controller('LugarOcurrenciaController', LugarOcurrenciaController)
    .component('wpLugarOcurrencia', {
      templateUrl: '/webproc/app/components/detalle-asistencia/lugar-ocurrencia/lugar-ocurrencia.html',
      controller: 'LugarOcurrenciaController',
      bindings: {
        siniestro: '=?',
        validateForm: '=?',
        modoLectura: '=?'
      }
    });
});
