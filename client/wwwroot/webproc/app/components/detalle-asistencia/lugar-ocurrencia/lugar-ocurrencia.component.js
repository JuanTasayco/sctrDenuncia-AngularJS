'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant'], function (ng, _, AsistenciaActions, wpConstant) {
  LugarOcurrenciaController.$inject = ['wpFactory', '$scope', 'mModalAlert', '$uibModal','$rootScope','$timeout'];
  function LugarOcurrenciaController(wpFactory, $scope, mModalAlert , $uibModal,$rootScope, $timeout) {
    var vm = this
    var onFrmSave;
    var watchReferenciaViaObserver;

    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.selectDanio = selectDanio;
    vm.getCheckList = GetCheckList;
    vm.changeFinHoraAtencion = changeFinHoraAtencion;
    vm.servicePhotoModal = servicePhotoModal;
    vm._showModalMap = _showModalMap;
    vm.changeArray = changeArray;
    vm.changeApEtilica = changeApEtilica;
    vm.onChangeLstDetalleSiniestroChoque = onChangeLstDetalleSiniestroChoque;
    vm.subirFotosSiniestro = subirFotosSiniestro;
    vm.agregarDanho = agregarDanho;
    vm.editarDanho = editarDanho;
    vm.eliminarDanho = eliminarDanho;
    vm.servicePhotoModal = servicePhotoModal;
    vm.subirFotoSoat = subirFotoSoat;
    vm.subirFotoTarjeta = subirFotoTarjeta;
    vm.subirFotoLicencia = subirFotoLicencia;
    vm.subirFotoOdometro = subirFotoOdometro;
    vm.changePlaceAttention = changePlaceAttention;
    vm.onChangeCheckboxSiniestroDetalle = onChangeCheckboxSiniestroDetalle;


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

    vm.typeSinister = 0;
    vm.rbDetaSiniestroPorChoque;
    vm.roturaLuna = wpFactory.myLookup.getTipoSiniestroDetalle().find(function (element) {
      return element.numeroOrden ==13;
    });

    function onDestroy() {
      onFrmSave();
      if (watchReferenciaViaObserver) watchReferenciaViaObserver();
    }

    function onInit() {
      onFrmSave = $rootScope.$on('frm:save', setFrm)
      vm.dateFormat = 'dd/MM/yyyy';
      vm.frmSiniestro = vm.siniestro;
      vm.detalleTipoSiniestroArrayAux = ng.copy(vm.siniestro.detalleTipoSiniestro);
      vm.frmSiniestro.esModalidadKm = !vm.frmSiniestro.esModalidadKm ? false : vm.frmSiniestro.esModalidadKm;
      vm.maxFotos = 3
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
      vm.frmSiniestro.flagFallecidos = vm.frmSiniestro.flagFallecidos ? vm.frmSiniestro.flagFallecidos : "S";
      vm.getCheckList(null);

      vm.documentos = vm.frmSiniestro.fotosDetaSiniestro.concat(vm.frmSiniestro.documentosVehiculo).concat(vm.frmSiniestro.fotosSiniestroVehiculo);
      _loadFotosOtros(vm.documentos);

      if(vm.frmSiniestro.codigoLugarAtencion == 78) {
        registerWatchReferenciaVia();
      }
    }

    function setFrm() {
      vm.clickSave= true;
      vm.optImgsTabs.isRequired = {doc: true, siniestro: true};
      _checkAllPhotos()
      if ($scope.frmLugarOcurrencia.$invalid) {
        $scope.showUp = true;
        return void 0;
      }

    }

    function _checkAllPhotos() {
      _checkFotosDoc();
      _checkFotosSiniestro();
    }

    function _checkFotosDoc() {
      vm.optImgsTabs.isPhotoValid.doc = wpFactory.help.isArrayFotosValid(vm.frmSiniestro.documentosVehiculo, vm.maxFotos);
    }

    function _checkFotosSiniestro() {
      vm.optImgsTabs.isPhotoValid.siniestro = (vm.frmSiniestro.fotosSiniestroVehiculo || []).length > 0 ? true : false;
    }

    function changePlaceAttention(){
      $timeout(function() {
        if(vm.frmSiniestro.codigoLugarAtencion == 78) {
          registerWatchReferenciaVia();
        }else {
          vm.frmSiniestro.lugarAtencion = null
          if (watchReferenciaViaObserver) watchReferenciaViaObserver();
        }
      });
    }

    function registerWatchReferenciaVia(){
          watchReferenciaViaObserver = $scope.$watch(function (){
            return vm.frmSiniestro.referenciaVia;
          }, function(a,b,c,d){
            vm.frmSiniestro.lugarAtencion = a;
          })
    }

    function GetCheckList(valor) {
      vm.siniestro.detalleTipoSiniestro = ng.copy(vm.detalleTipoSiniestroArrayAux);
      var siniestroAux = wpFactory.myLookup.getTipoSiniestro().find(
        function (element) { return element.codigoValor == vm.frmSiniestro.codigoTipoSiniestro }
      );
      vm.typeSinister = valor || siniestroAux;

      vm.siniestroTypeCheckList = wpFactory.myLookup.getTipoSiniestroDetalle().filter(function (element) {
        return element.nombreValor == (valor ? valor.nombreValor : siniestroAux ? siniestroAux.nombreValor : null) && element.nombreValorDetalle && element.numeroOrden!=13;
      });

      if(vm.typeSinister?.numeroOrden == 1){
        vm.siniestroTypeCheckList = _.map(ng.copy(vm.siniestroTypeCheckList), function maf(item) {
          return {
            ...item,
            checked: !!vm.detalleTipoSiniestroArrayAux.find(
              function (element) { return element.codigoSubSiniestro == item.codigoValor }
            )
          };
        });
      }else if (vm.typeSinister?.numeroOrden == 2) {
        vm.rbDetaSiniestroPorChoque = null
        _.map(ng.copy(vm.detalleTipoSiniestroArrayAux), function maf2(item) {
          const coincidencia = vm.siniestroTypeCheckList.find(
            function (element) { return item.codigoSubSiniestro == element.codigoValor }
          )

          if(coincidencia){
            vm.rbDetaSiniestroPorChoque = coincidencia.codigoValor;
          }
        });

        vm.roturaLuna.checked = !!vm.detalleTipoSiniestroArrayAux.find(
          function (element) { return element.codigoSubSiniestro == vm.roturaLuna.codigoValor }
        )
      }
      vm.frmSiniestro.expediente = vm.siniestro.expediente;
    }

    function onChangeCheckboxSiniestroDetalle(item) {
      if(item.checked){
        const data = {
          codigoSubSiniestro: item.codigoValor,
          expediente: item.valEquivalence,
          codigoCausa: item.valEquivalence2,
          codigoConsecuencia: item.valEquivalence3
        }
        vm.siniestro.detalleTipoSiniestro.push(data)
      }else {
        vm.siniestro.detalleTipoSiniestro = vm.siniestro.detalleTipoSiniestro.filter(
          function (element) { return element.codigoSubSiniestro !== item.codigoValor }
        )
      }
    }

    function changeFinHoraAtencion() {
      vm.frmSiniestro.horaInicioAtencion = vm.frmSiniestro.horaInicioAtencion.replace(":", "");
      if(vm.frmSiniestro.horaInicioAtencion>vm.frmSiniestro.horaFinAtencion){
        vm.frmSiniestro.horaFinAtencion = vm.frmSiniestro.horaInicioAtencion;
      }
    }

    function onChangeLstDetalleSiniestroChoque(radioItem) {
      const data = {
        codigoSubSiniestro: radioItem.codigoValor,
        expediente: radioItem.valEquivalence,
        codigoCausa: radioItem.valEquivalence2,
        codigoConsecuencia: radioItem.valEquivalence3
      }
      vm.siniestro.detalleTipoSiniestro = vm.siniestro.detalleTipoSiniestro.filter(
        function (element) { return element.expediente == 'PPL' }
      )

      vm.siniestro.detalleTipoSiniestro.push(data);
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
