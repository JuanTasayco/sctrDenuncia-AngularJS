'use strict';

define(['angular', 'lodash'], function (ng, _) {
  AgregarEditarVehiculoTerceroController.$inject = ['$rootScope', '$scope', '$timeout', '$log', 'wpFactory', 'mainServices'];
  function AgregarEditarVehiculoTerceroController($rootScope, $scope, $timeout, $log, wpFactory,mainServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.grabarVehiculoTercero = grabarVehiculoTercero;
    vm.cerrarFrm = cerrarFrm;
    vm.getPerson = getPerson;
    vm.getPlaca = getPlaca;
    vm.setVehiculo = setVehiculo;
    vm.eliminarFotoOtros = eliminarFotoOtros;
    vm.subirFotosOtros = subirFotosOtros;
    vm.servicePhotoModal = servicePhotoModal;
    vm.subirFotosSiniestro = subirFotosSiniestro;
    vm.agregarDanho = agregarDanho;
    vm.editarDanho = editarDanho;
    vm.eliminarDanho = eliminarDanho;
    vm.servicePhotoModal = servicePhotoModal;
    vm.subirFotoSoat = subirFotoSoat;
    vm.subirFotoTarjeta = subirFotoTarjeta;
    vm.subirFotoLicencia = subirFotoLicencia;
    vm.subirFotoOdometro = subirFotoOdometro;
    vm.documentTypeChange = documentTypeChange;

    vm.docSoat = [];
    vm.docTarjeta = [];
    vm.docLicencia = [];
    vm.docOdometro = [];
    vm.arrFotosSiniestros = [];
    vm.showImages = false;

    function onInit() {

      vm.frm = {}
      vm.frmTitulo = vm.esFrmAgregar ? 'Agregando conductor tercero' : 'Editando conductor tercero';
      !vm.esFrmAgregar && asignarDatosAlModelo();
      vm.documentos = [];

      vm.frm = vm.vehiculoTercero || vm.frm;
      vm.documentosVehiculoTercero = vm.frm.documentosVehiculoTercero ? vm.frm.documentosVehiculoTercero : [];
      vm.frm.detalleDanioVehiculo =  vm.frm.detalleDanioVehiculo ?  vm.frm.detalleDanioVehiculo : [{}];

      vm.maxFotos = 4
      vm.optImgsTabs = {
        isPhotoValid: {},
        statusBlock: null,
        isOdometro: null
      };


      _asignarFotosAlModelo()
      _loadFotosOtros();
    }

    function _asignarFotosAlModelo() {
      var arrFotosVehiculo = vm.frm.vehiculoTercero.fotosVehiculo;
      if (arrFotosVehiculo.length) {
        vm.frm.tab4At1 = {};
        vm.frm.tab4At1.fotosVehiculo = wpFactory.help.getArrayBy(arrFotosVehiculo, 'imageTypeCode', 13);
        vm.frm.tab4At1.fotosDoc = []
        vm.frm.tab4At1.fotosDoc[0] = wpFactory.help.getArrayBy(arrFotosVehiculo, 'imageTypeCode', 12)[0];
        vm.frm.tab4At1.fotosDoc[1] = wpFactory.help.getArrayBy(arrFotosVehiculo, 'imageTypeCode', 11)[0];
        vm.frm.tab4At1.fotosDoc[2] = wpFactory.help.getArrayBy(arrFotosVehiculo, 'imageTypeCode', 10)[0];
    }
    }


    function getPlaca() {
      if (vm.frm.vehiculoTercero.placaVehiculo) {
        vm.isRequired = true;
        wpFactory.siniestro.GetSiniestroPlaca(vm.frm.vehiculoTercero.placaVehiculo).then(function (response) {
          response.vehiculo.respuesta == 1
            ? setVehiculo(response.vehiculo)
            : setVehiculo(null);
        }).catch(function aEPr(err) {
          $log.error('Falló al obtener equifax', err.data);
          setVehiculo(null);
        })

      }
      else {
        vm.isRequired = false
      }
    }
    function setVehiculo(data) {
      vm.frm.vehiculoTercero.placaVehiculo = data ? data.num_placa : vm.frm.vehiculoTercero.placaVehiculo;
      vm.frm.vehiculoTercero.codigoSoatVehiculo = null;
      vm.frm.vehiculoTercero.codigoTipoVehiculo = data ? data.cod_tip_vehi : null;
      vm.frm.vehiculoTercero.codigoUsoVehiculo = data ? data.cod_uso : null;
      vm.frm.vehiculoTercero.marcaVehiculo = data ? data.des_marca : null;
      vm.frm.vehiculoTercero.modeloVehiculo = data ? data.des_modelo : null;
      vm.frm.vehiculoTercero.motorVehiculo = data ? data.num_motor : null;
      vm.frm.vehiculoTercero.anioVehiculo = data ? data.anho_fabricacion : null;
      vm.frm.vehiculoTercero.serieVehiculo = data ? data.num_chasis : null;
      vm.frm.vehiculoTercero.num_chasis = data ? data.num_chasis : null;

      $scope.frmVehiculoSoat.codigoSoatVehiculo = null;
      $scope.frmVehiculoSoat.codigoTipoVehiculo = {
        codigoValor: data ? data.cod_tip_vehi : null
      }
      $scope.frmVehiculoSoat.codigoUsoVehiculo  = {
        codigoValor : data ? data.cod_uso : null
      }
    }
    function asignarDatosAlModelo() {
      vm.frm = ng.copy(vm.vehiculoTercero);
    }

    function grabarVehiculoTercero() {
      if (vm.frmVehiculoTercero.$invalid) {
        vm.frmVehiculoTercero.markAsPristine();
        return void 0;
      }
      vm.frm.detalleDanioVehiculo[0].descripcionDanios = vm.frm.descripcionDanios;
      vm.ngIf = false;
      vm.esFrmAgregar && vm.onAgregar({ $event: { vehiculoTercero: vm.frm } });
      if (!vm.esFrmAgregar) {

        vm.onEditar({ $event: { idx: vm.idxVehiculoTercero, vehiculoTercero: vm.frm } });
        $scope.$emit('vehiculoTercero:frmEditCerrado');
      }
      $timeout(function () {
        $rootScope.$emit('vehiculoTercero:frmCerrado');
      });
    }

    function cerrarFrm() {
      vm.ngIf = false;
      $scope.$emit('vehiculoTercero:frmEditCerrado');
      $rootScope.$emit('vehiculoTercero:frmCerrado');
    }

    function getPerson() {
      if (vm.frm.ocupanteTercero.numeroDocumentoIdentidad && vm.frm.ocupanteTercero.codigoTipoDocumentoIdentidad) {
        wpFactory.siniestro.GetSiniestroPerson(vm.frm.ocupanteTercero.numeroDocumentoIdentidad, 0, vm.frmVehiculoTercero.ocupanteTercero.codigoTipoDocumentoIdentidad.descripcionParametro, 1)
          .then(function (response) {
            response.persona.respuesta == "1"
              ? setConductor(response.persona)
              : setConductor(null);
          }).catch(function aEPr(err) {
            $log.error('Falló al obtener equifax', err.data);
            setConductor(null);
          })
      }

    }

    function documentTypeChange() {
      vm.frm.ocupanteTercero.numeroDocumentoIdentidad = '';
      setConductor(null);
      if (!ng.isUndefined(vm.frmVehiculoTercero.ocupanteTercero.codigoTipoDocumentoIdentidad)) {
        $timeout(function tcd() {
          documentNumberValidation();
        }, 0);
      }
    }

    function setConductor(data) {
      vm.frm.ocupanteTercero.nombreConductor = data ? data.nombres : null;
      vm.frm.ocupanteTercero.paternoConductor = data ? data.ape_paterno : null;
      vm.frm.ocupanteTercero.telefonoConductor = data ? data.telefono : null;
      vm.frm.ocupanteTercero.correoConductor = data ? data.email : null;
    }

    function documentNumberValidation(){
      var numDocValidations = {};
      mainServices.documentNumber.fnFieldsValidated(numDocValidations,vm.frmVehiculoTercero.ocupanteTercero.codigoTipoDocumentoIdentidad.descripcionParametro, 1);
      vm.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
      vm.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
      vm.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE +  ",required";
      vm.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
    }

    function eliminarFotoOtros(event) {
      vm.modoLectura ? mModalAlert.showWarning("No se puede eliminar documentos en el estado actual.", "Error") : _eliminarFoto(event, 'documentos');
    }
    function subirFotosOtros(event) {
      vm.modoLectura ? mModalAlert.showWarning("No se puede agregar documentos en el estado actual.", "Error") : _subirFotos(event, 'documentos', 21);
    }
    function servicePhotoModal(photo) {
      return wpFactory.siniestro.ViewImageByPath(photo.nombreFisico, 0);
    }
    function _eliminarFoto(event, propWhereSave) {
      wpFactory.siniestro.DeleteImages(event.photoToRemove.nombreFisico);
      vm[propWhereSave].splice(event.idx, 1);
      vm.documentosVehiculoTercero = [].concat(vm[propWhereSave]);
    }

    function _subirFotos(event, propWhereSave, imageTypeCode) {
      wpFactory.siniestro.UploadThirdParties(event.photoToUpload, {
        imageTypeCode: imageTypeCode,
        itemConductor: vm.idxVehiculoTercero
      }).then(function ucsPr(resp) {
        vm.documentosVehiculoTercero = wpFactory.help.getArrayFotosNuevas(
          vm.documentosVehiculoTercero,
          resp,
          event.photoData
        );
        vm[propWhereSave] = wpFactory.help.getFotosConB64(vm[propWhereSave], resp, event.photoData);
      });
    }
    function _loadFotosOtros() {
      _loadFotos(vm.frm.tab4At1, 'fotosVehiculo');
    }

    function _loadFotos(arrFotos, prop) {
      vm.frm.documentosVehiculoTerceroAux = vm.documentosVehiculoTercero;
      if(arrFotos.length>0){
        _.forEach(arrFotos, function feFn(item, idx) {
          if (item && item.nombreFisico) {
            wpFactory.siniestro.ViewImageByPath(item.nombreFisico).then(function (resp) {
              if (wpFactory.help.isCode200(resp)) {
                vm.frm["vehiculoTercero"][prop][idx].srcImg = resp.data
              }
              else {
                vm.frm["vehiculoTercero"][prop][idx] = null
              }
            });
          }
        });
      }
      else{
        vm.showImages = true;
      }

      vm.frm.documentosVehiculoTercero = vm.frm.documentosVehiculoTerceroAux
      $timeout(function () {
        vm.showImages = true;
      }, 1000)
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
    function subirFotoSoat(event) {

      return wpFactory.siniestro.UploadThirdParties(event.photoToUpload, {
        imageTypeCode: 12,
        itemConductor: vm.idxVehiculoTercero + 1
      });
    }

    function subirFotoTarjeta(event) {
      return wpFactory.siniestro.UploadThirdParties(event.photoToUpload, {
        imageTypeCode: 11,
        itemConductor: vm.idxVehiculoTercero + 1
      });
    }

    function subirFotoLicencia(event) {
      return wpFactory.siniestro.UploadThirdParties(event.photoToUpload, {
        imageTypeCode: 10,
        itemConductor: vm.idxVehiculoTercero + 1
      });
    }

    function subirFotosSiniestro(event) {
      return wpFactory.siniestro.UploadThirdParties(event.photoToUpload, {
        imageTypeCode: 13,
        itemConductor: vm.idxVehiculoTercero + 1
      });
    }

  }
  return ng
    .module('appWp')
    .controller('AgregarEditarVehiculoTerceroController', AgregarEditarVehiculoTerceroController)
    .component('wpAgregarEditarVehiculoTercero', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/common/agregar-vehiculo-tercero/agregar-editar-vehiculo-tercero/agregar-editar-vehiculo-tercero.html',
      controller: 'AgregarEditarVehiculoTerceroController',
      bindings: {
        vehiculoTercero: '<?',
        esFrmAgregar: '<?',
        idxVehiculoTercero: '<?',
        ngIf: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        modoLectura: '=?'
      }
    });
});
