'use strict';

define(['angular', 'lodash'], function (ng, _) {
  AgregarEditarVehiculoTerceroController.$inject = ['$rootScope', '$scope', '$timeout', '$log', 'wpFactory'];
  function AgregarEditarVehiculoTerceroController($rootScope, $scope, $timeout, $log, wpFactory) {
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


    vm.docSoat = [];
    vm.docTarjeta = [];
    vm.docLicencia = [];
    vm.docOdometro = [];
    vm.arrFotosSiniestros = [];
    vm.showImages = false;

    function onInit() {
      
      vm.frm = {}
      vm.frmTitulo = vm.esFrmAgregar ? 'Agregando Vehiculo Tercero' : 'Editando Vehiculo Tercero';
      !vm.esFrmAgregar && asignarDatosAlModelo();
      vm.documentos = [];

      vm.frm = vm.vehiculoTercero || vm.frm;
      vm.documentosVehiculoTercero = vm.frm.documentosVehiculoTercero ? vm.frm.documentosVehiculoTercero : [];
      vm.frm.detalleDanioVehiculo =  vm.frm.detalleDanioVehiculo ?  vm.frm.detalleDanioVehiculo : {};
    
      vm.maxFotos = 4
      vm.optImgsTabs = {
        isPhotoValid: {},
        statusBlock: null,
        isOdometro: null
      };

      _loadFotosOtros(vm.documentosVehiculoTercero);
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
    }
    function asignarDatosAlModelo() {
      vm.frm = ng.copy(vm.vehiculoTercero);
    }

    function grabarVehiculoTercero() {
      if (vm.frmVehiculoTercero.$invalid) {
        vm.frmVehiculoTercero.markAsPristine();
        return void 0;
      }
      var frmNivelDanho = vm.frmVehiculoTercero.frmNivelDanho
      vm.frm.pregunta1 = frmNivelDanho.nDanhoPregunta1.$modelValue;
      vm.frm.pregunta2 = frmNivelDanho.nDanhoPregunta2 ? frmNivelDanho.nDanhoPregunta2.$modelValue : null;

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
      if (vm.frm.ocupanteTercero.numeroDocumentoIdentidad) {
        wpFactory.siniestro.GetSiniestroPerson(vm.frm.ocupanteTercero.numeroDocumentoIdentidad, 0, vm.frm.ocupanteTercero.codigoTipoDocumentoIdentidad, 1)
          .then(function (response) {
            vm.frm.ocupanteTercero.nombreConductor = response.persona.ape_paterno;
            vm.frm.ocupanteTercero.paternoConductor = response.persona.ape_paterno;
            vm.frm.ocupanteTercero.telefonoConductor = response.persona.telefono;
            vm.frm.ocupanteTercero.correoConductor = response.persona.email;
          })
      }

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
    function _loadFotosOtros(fotosSiniestro) {
      _loadFotos(fotosSiniestro, 'documentosVehiculoTercero');
    }

    function _loadFotos(arrFotos, prop) {
      vm.frm.documentosVehiculoTerceroAux = vm.documentosVehiculoTercero;
      if(arrFotos.length>0){
        _.forEach(arrFotos, function feFn(item, idx) {
          if (item && item.nombreFisico) {
            wpFactory.siniestro.ViewImageByPath(item.nombreFisico).then(function (resp) {
              if (wpFactory.help.isCode200(resp)) {
                vm["frm"][prop][idx].srcImg = resp.data
              }
              else {
                vm["frm"][prop][idx] = null
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
