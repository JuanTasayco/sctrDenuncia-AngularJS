'use strict';

define(['angular', 'constants'], function(ng, constants) {
  ModalReporteDiarioController.$inject = ['$filter', '$sce', 'httpData', '$scope', 'mainServices'];
  function ModalReporteDiarioController($filter, $sce, httpData, $scope, mainServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.cerrar = cerrar;
    vm.updateDates = updateDates;

    // declaracion

    function onInit() {
      vm.dateFormat = 'dd/MM/yyyy';
      vm.downloadDateStart = new Date();
      vm.downloadDateEnd = new Date();
      vm.reporteUrlApi = $sce.trustAsResourceUrl(
        constants.system.api.endpoints.webproc + 'api/report/assistance/download'
      );

    }

    function cerrar() {
      vm.close(void 0);
    }

    function updateDates() {
      vm.reqDownload = {
        startDate: $filter('date')(vm.downloadDateStart, 'MM-dd-yyyy'),
        endDate: $filter('date')(vm.downloadDateEnd, 'MM-dd-yyyy')
      };
    }

       //Exportar
   $scope.exportar = function () {

    _downloadReportFile();
  }


    function _downloadReportFile(){
      vm.updateDates();
       const downloadFileBody = {
         'StartDate': vm.reqDownload.startDate,
         'EndDate': vm.reqDownload.endDate
       };
       const pathParams = {
        opcMenu: localStorage.getItem('currentBreadcrumb')
       };
       const dataJsonRequest = JSON.stringify(downloadFileBody);
       const urlRequest = constants.system.api.endpoints.webproc + 'api/report/assistance/download' +'?COD_OBJETO=.&OPC_MENU='+pathParams.opcMenu;

       httpData.postDownload(
        urlRequest,
        dataJsonRequest,
        { headers: { 'Content-Type': 'application/json'}, responseType: 'arraybuffer'},
        true
        ).then(function(data){
          mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
        });

    }
  } // end controller

  return ng
    .module('appWp')
    .controller('ModalReporteDiarioController', ModalReporteDiarioController)
    .component('wpModalReporteDiario', {
      templateUrl: '/webproc/app/components/bandeja/modal-reporte-diario/modal-reporte-diario.html',
      controller: 'ModalReporteDiarioController',
      bindings: {
        close: '&?'
      }
    });
});
