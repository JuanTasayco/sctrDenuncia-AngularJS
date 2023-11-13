'use strict';

define(['angular', 'AsistenciaActions', 'lodash'], function(ng, AsistenciaActions, _) {
  ImgTabUploadController.$inject = ['$ngRedux', 'wpFactory'];
  function ImgTabUploadController($ngRedux, wpFactory) {
    var vm = this;
    var actionsRedux;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.handleEliminarFotoLicencia = handleEliminarFotoLicencia;
    vm.handleEliminarFotoSoat = handleEliminarFotoSoat;
    vm.handleEliminarFotoTarjeta = handleEliminarFotoTarjeta;
    vm.handleSubirFotoLicencia = handleSubirFotoLicencia;
    vm.handleSubirFotoSoat = handleSubirFotoSoat;
    vm.handleSubirFotoTarjeta = handleSubirFotoTarjeta;
    vm.handleSubirFotosSiniestro = handleSubirFotosSiniestro;
    vm.handleViewImageModal = handleViewImageModal;
    vm.handleEliminarFotoSiniestro = handleEliminarFotoSiniestro;
    vm.handleSubirFotoOdometro = handleSubirFotoOdometro;
    vm.handleEliminarFotoOdometro = handleEliminarFotoOdometro;
    vm.requeTotalImagenes = 3
    // declaracion

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
      vm.fotosDoc = (vm.fotosDoc || []).length ? vm.fotosDoc : [];
      vm.fotosSiniestros = (vm.fotosSiniestros || []).length ? vm.fotosSiniestros : [];
      var arrFotosDoc = _cleanArrayFotos(vm.fotosDocs) || [];
      
      if (vm.opt.isOdometro) {
        vm.requeTotalImagenes = 4
      }
      var auxArrFotosDoc = []
      for (var idx = 0; idx < arrFotosDoc.length; idx++) {
        if (arrFotosDoc[idx]) {
          auxArrFotosDoc.push(arrFotosDoc[idx])
        }
      }
      var arrFotosDoc = auxArrFotosDoc
      // Ordenar de acuerdo a la posición del front
      // Soat - tarjeta de propiedad - Licencia - Odometro
      var imgSoat = []
      var imgTarjeta = []
      var imgLicencia = []
      var imgOdometro = []

      for (var idx = 0; idx < arrFotosDoc.length; idx++) {
        
        if (arrFotosDoc[idx].imageTypeCode === 3 || arrFotosDoc[idx].imageTypeCode === 12) { //Soat
          imgSoat = [arrFotosDoc[idx]]
        }

        if (arrFotosDoc[idx].imageTypeCode === 5) { //Odometro
          imgOdometro = [arrFotosDoc[idx]]
        }

        if (arrFotosDoc[idx].imageTypeCode === 2 || arrFotosDoc[idx].imageTypeCode === 11) { //Tarjeta
          imgTarjeta = [arrFotosDoc[idx]]
        }

        if (arrFotosDoc[idx].imageTypeCode === 1 || arrFotosDoc[idx].imageTypeCode === 10) { //Licencia
          imgLicencia = [arrFotosDoc[idx]]
        }
      } 
      vm.docSoat = imgSoat
      vm.docTarjeta = imgTarjeta
      vm.docLicencia = imgLicencia
      vm.docOdometro = imgOdometro
      vm.arrFotosSiniestros = ng.copy(vm.fotosSiniestros) || [];
      _loadFotos(arrFotosDoc, vm.arrFotosSiniestros);
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        frmsValidationStates: ng.copy(state.frmsValidationStates),
        statusBlock: state.frmStatus
      };
    }

    function handleViewImageModal(photo) {
      return vm.onViewImageModal({$event: {nombreFisico: photo.nombreFisico}});
    }

    function _loadFotos(fotosDoc, fotosSiniestro) {
      _loadFotosDoc(fotosDoc);
      _loadFotosSiniestro(fotosSiniestro);
    }

    function _loadFotosDoc(fotosDoc) {
      _.forEach(fotosDoc, function feFn(item, idx) {
        if (item && item.nombreFisico) {
          vm.onViewImage({ $event: { nombreFisico: item.nombreFisico } }).then(function (resp) {
            if (item.imageTypeCode === 3 && vm.docSoat.length > 0) {
              wpFactory.help.isCode200(resp) ? (vm.docSoat[0].srcImg = resp.data) : (vm.docSoat = []);
            }
            if (item.imageTypeCode === 2 && vm.docTarjeta.length > 0) {
              wpFactory.help.isCode200(resp) ? (vm.docTarjeta[0].srcImg = resp.data) : (vm.docTarjeta = []);
            }
            if (item.imageTypeCode === 1 && vm.docLicencia.length > 0) {
              wpFactory.help.isCode200(resp) ? (vm.docLicencia[0].srcImg = resp.data) : (vm.docLicencia = []);
            }
            if (item.imageTypeCode === 5 && vm.docOdometro.length > 0) {
              wpFactory.help.isCode200(resp) ? (vm.docOdometro[0].srcImg = resp.data) : (vm.docOdometro = []);
            }
          });
        }
      });
    }

    function _loadFotosSiniestro(fotosSiniestro) {
      _.forEach(fotosSiniestro, function feFn(item, idx) {
        if (item && item.nombreFisico) {
          vm.onViewImage({$event: {nombreFisico: item.nombreFisico}}).then(function(resp) {
            wpFactory.help.isCode200(resp)
              ? (vm.arrFotosSiniestros[idx].srcImg = resp.data)
              : (vm.arrFotosSiniestros[idx] = null);
          });
        }
      });
    }

    function _cleanArrayFotos(arrFotos) {
      return _.map(ng.copy(arrFotos), function maf(item) {
        return item && item.nombreFisico ? item : null;
      });
    }

    function _setFotoDocByIdx(idx, resp, photoData) {
      vm.fotosDocs[idx] = wpFactory.help.getObjFotoDoc(resp, photoData);
    }

    // siniestro

    function handleSubirFotosSiniestro(event) {
      vm.onSubirFotosSiniestro({$event: {photoToUpload: event.photoToUpload}}).then(function ucsPr(resp) {
        vm.fotosSiniestros = wpFactory.help.getArrayFotosNuevas(vm.fotosSiniestros, resp, event.photoData);
        vm.arrFotosSiniestros = wpFactory.help.getFotosConB64(vm.arrFotosSiniestros, resp, event.photoData);
      });
    }

    function handleEliminarFotoSiniestro(event) {
      wpFactory.siniestro.DeleteImages(event.photoToRemove.nombreFisico);
      vm.arrFotosSiniestros.splice(event.idx, 1);
      vm.fotosSiniestros = [].concat(vm.arrFotosSiniestros);
    }

    // soat

    function handleSubirFotoSoat(event) {
      vm.onSubirFotoSoat({$event: {photoToUpload: event.photoToUpload}}).then(function ucsPr(resp) {
        _setFotoDocByIdx(0, resp, event.photoData);
        vm.docSoat[0] = wpFactory.help.getFotoConB64(resp, event.photoData);
      });
    }

    function handleEliminarFotoSoat(event) {
      wpFactory.siniestro.DeleteImages(event.photoToRemove.nombreFisico);
      vm.docSoat.splice(0, 1);
      _deleteFotoByIdx(0);
    }

    // tarjeta

    function handleSubirFotoTarjeta(event) {
      vm.onSubirFotoTarjeta({$event: {photoToUpload: event.photoToUpload}}).then(function ucsPr(resp) {
        _setFotoDocByIdx(1, resp, event.photoData);
        vm.docTarjeta[0] = wpFactory.help.getFotoConB64(resp, event.photoData);
      });
    }

    function handleEliminarFotoTarjeta(event) {
      wpFactory.siniestro.DeleteImages(event.photoToRemove.nombreFisico);
      vm.docTarjeta.splice(0, 1);
      _deleteFotoByIdx(1);
    }

    // licencia

    function handleSubirFotoLicencia(event) {
      vm.onSubirFotoLicencia({$event: {photoToUpload: event.photoToUpload}}).then(function ucsPr(resp) {
        _setFotoDocByIdx(2, resp, event.photoData);
        vm.docLicencia[0] = wpFactory.help.getFotoConB64(resp, event.photoData);
      });
    }

    function handleEliminarFotoLicencia(event) {
      wpFactory.siniestro.DeleteImages(event.photoToRemove.nombreFisico);
      vm.docLicencia.splice(0, 1);
      _deleteFotoByIdx(2);
    }

    // Odometro

    function handleSubirFotoOdometro(event) {
      vm.onSubirFotoOdometro({ $event: { photoToUpload: event.photoToUpload } }).then(function ucsPr(resp) {
        _setFotoDocByIdx(3, resp, event.photoData);
        vm.docOdometro[0] = wpFactory.help.getFotoConB64(resp, event.photoData);
      });
    }


    function handleEliminarFotoOdometro(event) {
      wpFactory.siniestro.DeleteImages(event.photoToRemove.nombreFisico);
      vm.docOdometro.splice(0, 1);
      _deleteFotoByIdx(3);
    }

    function _deleteFotoByIdx(idx) {
      vm.fotosDocs[idx] = null;
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('ImgTabUploadController', ImgTabUploadController)
    .component('wpImgTabUpload', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/img-tab-upload/img-tab-upload.html',
      controller: 'ImgTabUploadController',
      bindings: {
        fotosDocs: '=?',
        fotosSiniestros: '=?',
        onSubirFotoLicencia: '&?',
        onSubirFotoSoat: '&?',
        onSubirFotoOdometro: '&?',
        onSubirFotoTarjeta: '&?',
        onSubirFotosSiniestro: '&?',
        onViewImage: '&?',
        onViewImageModal: '&?',
        opt: '=?'
      }
    });
});
