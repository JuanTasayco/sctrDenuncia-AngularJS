'use strict';

define(['angular', 'moment', 'lodash', 'mpfPersonConstants', 'mpfPersonComponent'], function (ng, moment, _) {
  solicitudNuevaTrecController.$inject = [
    '$scope',
    'inspecConstant',
    '$state',
    '$window',
    'inspecFactory',
    'mModalConfirm',
    'mModalAlert',
    'FileSaver'
  ];
  function solicitudNuevaTrecController(
    $scope,
    inspecConstant,
    $state,
    $window,
    inspecFactory,
    mModalConfirm,
    mModalAlert,
    FileSaver
  ) {
    $window.document.title = 'OIM - Inspecciones Autos - Solicitud Nueva TREC';
    var vm = this;
    var fechaActual = new Date();
    vm.filters = {};
    vm.formData = {};
    vm.messageSuccess = 'Ok';
    vm.$onInit = onInit;
    //filter
    vm.onFechaInicioChanged = FechaInicioChanged;
    vm.onFechaFinChanged = FechaFinChanged;
    vm.searchFilter = SearchFilter;
    vm.formatDate = FormatDate;
    vm.pageChanged = PageChanged;
    vm.showNewSolicitud = ShowNewSolicitud;
    //options list
    vm.showEditSolicitud = ShowEditSolicitud;
    vm.sentMessage = SentMessage;
    vm.removeSolicitude = RemoveSolicitude;
    vm.downloadPDFUno = DownloadPDFUno;
    vm.downloadPDFDos = DownloadPDFDos;

    function onInit() {
      _valuesDefault();
      vm.formData = {};
      vm.pagination = {
        currentPage: 1,
        totalItems: 0,
        pageSize: 10,
        limit: 100
      };
      _getDocuments();
    }
    function _valuesDefault() {
      vm.nroSolicitud = '';
      vm.fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(),1);
      vm.fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth()+1,0);
    }
    //Edit dates
    function FechaInicioChanged() {
      if (vm.fechaInicio > vm.fechaFin) {
        vm.fechaFin = vm.fechaInicio;
      }
    }
    function FechaFinChanged() {
      if (vm.fechaInicio > vm.fechaFin) {
        vm.fechaInicio = vm.fechaFin;
      }
    }
    //get solicitudes
    function _getDocuments() {
      vm.filters.numeroSolicitud = vm.nroSolicitud;
      // vm.filters.fechaDesde = moment(vm.fechaInicio).toISOString();  //formato ISO
      // vm.filters.fechaHasta = moment(vm.fechaFin).toISOString();  //formato ISO
      vm.filters.fechaDesde = moment(vm.fechaInicio).format('YYYYMMDD');
      vm.filters.fechaHasta = moment(vm.fechaFin).format('YYYYMMDD');
      vm.filters.numeroPagina = vm.pagination.currentPage;
      vm.filters.cantidadPorPagina = vm.pagination.pageSize;
      vm.filters.limite = vm.pagination.limit;
      inspecFactory.autoInspeccion
        .getAutoInspeccionFilter(vm.filters)
        .then(function (response) {
          vm.formData.listSolicitudes = response.solicitudes;
          var totalItems = response.total;
          vm.pagination.totalItems = totalItems;
          vm.formData.totalPages = Math.ceil(totalItems / vm.pagination.pageSize);
        })
        .catch(function (error) {
          console.log('lo que tiene el error', error);
        });
    }
    function PageChanged(event) {
      vm.pagination.currentPage = event;
      _getDocuments();
    }
    //filter 
    function SearchFilter() {
      vm.pagination.currentPage = 1;
      _getDocuments();
    }
    //New solicitud 
    function ShowNewSolicitud() {
      $state.go('solicitudNueva', {
        solicitudId: 0,
      });
    }
    //Editar solicitud 
    function ShowEditSolicitud(solicitud) {
      $state.go('solicitudNueva', {
        solicitudId: solicitud.id_solicitud,
      });
    }
    //enviar correo  
    function SentMessage(solicitud) {
      if(solicitud.vehiculos.length <= 0){
        mModalAlert.showWarning('No se puede enviar la solicitud. Ingrese al menos una maquinaria.', 'ALERTA', null, 3000);
      }else{
        var idSolicitud = solicitud.id_solicitud;
        inspecFactory.autoInspeccion
          .sentSolicitud(idSolicitud)
          .then(function (response) {
            vm.messageSuccess = 'Solicitud ' + idSolicitud +' enviada correctamente';
            mModalAlert.showSuccess(vm.messageSuccess, 'Correcto', null, 4000);
          })
          .catch(function (error) {
            mModalAlert.showError(error.data.message, 'Error', null, 4000);
          });
      }
    }
    //eliminar solicitud
    function RemoveSolicitude(solicitud) {
      var idSolicitud = solicitud.id_solicitud; 
      mModalConfirm
        .confirmInfo('¿Está seguro que desea eliminar la solicitud '+idSolicitud+'?', 'ELIMINAR SOLICITUD', 'ACEPTAR')
        .then(function () {
          inspecFactory.autoInspeccion
            .deleteAutoInspeccionSolicitud(idSolicitud)
            .then(function (response) {
              vm.messageSuccess = 'Solicitud '+idSolicitud+' eliminada correctamente';
              mModalAlert
                .showSuccess(vm.messageSuccess, 'Correcto', null, 4000)
                .then(function () {
                  _getDocuments();
                });
            })
            .catch(function (error) {
              mModalAlert.showError(error.data.message, 'Error', null, 4000);
            });
        });
    }
    //descargar pdf1
    function DownloadPDFUno(solicitud) {
      if(solicitud.vehiculos.length <= 0){
        mModalAlert.showWarning('No se puede descargar la solicitud. Ingrese al menos una maquinaria.', 'ALERTA', null, 3000);
      }else{
        var idSolicitud = solicitud.id_solicitud;
        inspecFactory.autoInspeccion
          .downloadSolicitud(idSolicitud, inspecConstant.TYPE_DOWNLOAD_TREC.SOLICITUD)
          .then(function (response) {
            var nameFile = 'solicitud_'+idSolicitud;
            vm.messageSuccess = 'Solicitud '+idSolicitud+' descargada correctamente';
            _downloadFileBase64(response.file, 'pdf', nameFile);
            mModalAlert.showSuccess(vm.messageSuccess, 'Correcto', null, 3000);
          })
          .catch(function (error) {
            mModalAlert.showError(error.data.message, 'Error', null, 4000);
          });
      }
    }
    //descargar pdf2
    function DownloadPDFDos(solicitud) {      
      if(solicitud.vehiculos.length <= 0){
        mModalAlert.showWarning('No se puede descargar el consolidado. Ingrese al menos una maquinaria.', 'ALERTA', null, 3000);
      }else{
        var idSolicitud = solicitud.id_solicitud;
        inspecFactory.autoInspeccion
          .downloadSolicitud(idSolicitud, inspecConstant.TYPE_DOWNLOAD_TREC.INFORME)
          .then(function (response) {
            vm.messageSuccess = 'Consolidado '+idSolicitud+' descargado correctamente';
            var nameFile = 'consolidado_'+idSolicitud;
            _downloadFileBase64(response.file, 'pdf', nameFile);
            mModalAlert.showSuccess(vm.messageSuccess, 'Correcto', null, 3000);
          })
          .catch(function (error) {
            mModalAlert.showError(error.data.message, 'Error', null, 4000);
          });
      }
    }
    function FormatDate(date) {
      moment.defaultFormat = "DD/MM/YYYY HH:mm:ss";
      var fecha = moment(date, moment.defaultFormat).toDate();
      return moment(fecha).format('DD/MM/YYYY');
    }

    function _downloadFileBase64(base64, documentType, fileName) {
      var vType = {
        pdf: 'application/pdf',
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        png: 'image/png',
        jpeg: 'image/jpeg'
      };
      var vExtension = {
        pdf: 'pdf',
        excel: 'xlsx',
        png: 'png',
        jpeg: 'jpeg'
      };
      var vDocumentType = documentType || '';
      var contentType = vType[vDocumentType.toLowerCase()] || documentType;
      var contentExtension = vExtension[vDocumentType.toLowerCase()] || documentType;
      var blob = new Blob([_base64toBlob(base64, contentType)], {});

      var vFileName = (fileName || 'documento') + '.' + contentExtension;
      FileSaver.saveAs(blob, vFileName);
    }
    function _base64toBlob(base64Data, contentType) {
      contentType = contentType || '';
      var sliceSize = 1024;
      var byteCharacters = atob(base64Data);
      var bytesLength = byteCharacters.length;
      var slicesCount = Math.ceil(bytesLength / sliceSize);
      var byteArrays = new Array(slicesCount);
      for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);
        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
      }
      return new Blob(byteArrays, { type: contentType });
    }

  }

  return ng
    .module('appInspec')
    .controller('SolicitudNuevaTrecController', solicitudNuevaTrecController)
    .directive(
      '$window',
      function ($window) {
        return {
          restrict: 'A'
        };
      }
    );
});
