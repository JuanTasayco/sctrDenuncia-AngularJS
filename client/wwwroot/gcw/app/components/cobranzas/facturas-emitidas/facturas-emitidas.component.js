define([
  'angular'
  , 'constants'
  , '/gcw/app/factory/gcwFactory.js'
], function(ng) {

 FacturasEmitidasController.$inject = [
 '$scope'
 , '$rootScope'
 , 'gcwFactory'
 , '$uibModal'
 , 'mModalAlert'
 , 'mModalConfirm'
 , '$timeout'
 , '$sce'
 , 'MxPaginador'
 , '$state'
 , '$q'
 , '$http'
 , 'httpData'
 , '$window'
 , 'mpSpin'
 , 'mainServices'];

 function FacturasEmitidasController($scope
   , $rootScope
   , gcwFactory
   , $uibModal
   , mModalAlert
   , mModalConfirm
   , $timeout
   , $sce
   , MxPaginador
   , $state
   , $q
   , $http
   , httpData
   , $window
   , mpSpin
   , mainServices) {
   var vm = this;
   var page;
   vm.$onInit = function () {

     if ($state.current.url == "/cobranzas/facturas-emitidas") {
       $rootScope.currentURL = $state.current.url;
       $rootScope.$broadcast('comprobanteRemitido');
       $rootScope.$broadcast('dashboard');
       $rootScope.$broadcast('networkInit');
       $rootScope.$broadcast('msgSinResultados');
     }
     vm.firstLoad = true;
     vm.noResult = true;
     vm.itemsXPagina = 10;
     vm.itemsXTanda = vm.itemsXPagina * 5;
     vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
     page = new MxPaginador();
     page.setNroItemsPorPagina(vm.itemsXPagina);
     vm.pageChanged = pageChanged;

     vm.frmFacturasEmitidas = {}
     vm.frmFacturasEmitidas.mFin = new Date();
     vm.frmFacturasEmitidas.mInicio = gcwFactory.restarMes(new Date(), 1);
     $scope.sessionAgente = gcwFactory.getVariableSession('sessionAgente');
     vm.cabecera = $rootScope.cabecera;
     gcwFactory.cleanStorage();
     vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
     $rootScope.$emit('cliente:borrar');
     vm.templateFexConsult = gcwFactory.getFexConsultTemplate();
   }

   vm.fnDownloadDetail = _fnDownloadDetail;
   function _fnDownloadDetail(item) {
     var deferred = $q.defer();

     var downloadFile = {
       "TransmitterCode": item.transmitterCode,
       "DocumentNumber": item.documentNumber,
       "DocumentType": item.documentType,
       "Ramo": {
         "CompanyId": item.companyId
       }
     }

     var dataJson = "json=" + JSON.stringify(downloadFile);
     mpSpin.start();
     $http({
         method: "POST",
         url: constants.system.api.endpoints.gcw + "api/history/invoice/download",
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
         },
         data: dataJson,
         responseType: 'arraybuffer'
       })
       .then(function (data) {
         // success
         if (data.status == 200) {
           var today = new Date();
           var y = today.getFullYear();
           var m = today.getMonth();
           var d = today.getDate();
           var dateDownload = y.toString() + m.toString() + d.toString();

           var h = today.getHours();
           var min = today.getMinutes();
           var hourDownload = h.toString() + min.toString();

           var defaultFileName = item.invoiceNumber + '_' + dateDownload + '_' + hourDownload + '.pdf';
           defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
           var vtype = data.headers(["content-type"]);
           var file = new Blob([data.data], {
             type: vtype
           });
           mpSpin.end();
           $window.saveAs(file, defaultFileName);
           deferred.resolve(defaultFileName);
         } else {
           mpSpin.end();
           mModalAlert.showError("No se encontraron documentos en la consulta", "Facturas emitidas");
         }
       })
       .catch(function (err) { // optional // failed
         mpSpin.end();
         mModalAlert.showError("No se encontraron documentos en la consulta", "Facturas emitidas");
       });
   }

   vm.fnLimpiar = _fnLimpiar;
   function _fnLimpiar() {

     $rootScope.$emit('cliente:borrar');
     $rootScope.reloadAgent = false;
     $rootScope.$broadcast('anuladasPorDeuda');

     $rootScope.codeAgent = undefined;
     $rootScope.nameAgent = undefined;
     $rootScope.codeManager = undefined;
     $rootScope.descriptionManager = undefined;

     gcwFactory.cleanStorage();
     gcwFactory.eliminarVariableSession('totalItemsSession');

     vm.facturas = null;
     vm.noResult = true;
     vm.totalPages = 0;
     vm.totalRows = 0;

     vm.frmFacturasEmitidas = {}
     vm.frmFacturasEmitidas.mFin = new Date();
     vm.frmFacturasEmitidas.mInicio = gcwFactory.restarMes(new Date(), 1);
     vm.firstLoad = true;

   }

   vm.fnBuscar = _fnBuscar;
   function _fnBuscar() {
     vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

     var sessionGestor = gcwFactory.getVariableSession('rolSessionG');

     if (!vm.firstLoad) {
       vm.rol.agenteID = (ng.isUndefined(sessionAgente.id)) ? $rootScope.cabecera.agente.id : sessionAgente.id;
       vm.rol.gestorID = (ng.isUndefined(sessionGestor.id)) ? $rootScope.cabecera.gestor.id : sessionGestor.id;
     } else
       vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);

     if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
       mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cobranzas: Facturas Emitidas");
     } else {

       if (ng.isUndefined(vm.frmFacturasEmitidas.mInicio) || !vm.frmFacturasEmitidas.mInicio) {
         mModalAlert.showInfo("Debe elegir una fecha de inicio", "Cobranzas: Facturas Emitidas");
       } else if (ng.isUndefined(vm.frmFacturasEmitidas.mFin) || !vm.frmFacturasEmitidas.mFin) {
         mModalAlert.showInfo("Debe elegir una fecha final", "Cobranzas: Facturas Emitidas");
       } else if (ng.isUndefined(vm.frmFacturasEmitidas.mInicio) || !vm.frmFacturasEmitidas.mInicio) {
         mModalAlert.showInfo("Debe elegir una fecha de inicio", "Cobranzas: Facturas Emitidas");
       } else {
         vm.currentPage = 1; // El paginador selecciona el nro 1
         vm.filter = {
           DateStart: gcwFactory.formatearFecha(vm.frmFacturasEmitidas.mInicio),
           DateEnd: gcwFactory.formatearFecha(vm.frmFacturasEmitidas.mFin),
           client: {
             ClientCode: (ng.isUndefined(vm.frmFacturasEmitidas.Cliente)) ? 0 : vm.frmFacturasEmitidas.Cliente.clientCode
           },
           agentId: (vm.cabecera.agente && vm.cabecera.agente.id) ? vm.cabecera.agente.id : parseInt(vm.dataTicket.oimClaims.agentID),
           managerId: vm.cabecera.gestor.id,
           RowByPage: vm.itemsXTanda,
           CurrentPage: vm.currentPage
         }
         page.setCurrentTanda(vm.currentPage);
         getListaFacturasEmitidas();
       }
     }
   }

   //Paginacion
   function pageChanged(event) {
     vm.filter = {
       DateStart: gcwFactory.formatearFecha(vm.frmFacturasEmitidas.mInicio),
       DateEnd: gcwFactory.formatearFecha(vm.frmFacturasEmitidas.mFin),
       client: {
         ClientCode: (ng.isUndefined(vm.frmFacturasEmitidas.Cliente)) ? 0 : vm.frmFacturasEmitidas.Cliente.clientCode
       },
       agentId: (vm.cabecera.agente && vm.cabecera.agente.id) ? vm.cabecera.agente.id : parseInt(vm.dataTicket.oimClaims.agentID),
       managerId: vm.cabecera.gestor.id,
       RowByPage: vm.itemsXTanda
     }
     page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function (nroTanda) {
       vm.filter.CurrentPage = nroTanda;
       getListaFacturasEmitidas();
     }, setLstCurrentPage);
   }

   function getListaFacturasEmitidas() {
     var facturas = [];
     vm.totalRows = 0;
     vm.totalPages = 0;
     var pms = gcwFactory.getFacturasEmitidas(vm.filter, true);
     pms.then(function (response) {
       if (response.operationCode == 200) {
         vm.totalRows = response.data.totalRows;
         vm.totalPages = response.data.totalPages;
         facturas = response.data.list || response.Data.list
       } else mModalAlert.showInfo(response.message, '')
       page.setNroTotalRegistros(vm.totalRows).setDataActual(facturas).setConfiguracionTanda();
       setLstCurrentPage();
     });
   }

   function setLstCurrentPage() {
     vm.facturas = page.getItemsDePagina();
   }

   //Exportar
   $scope.exportar = function () {

     _downloadReportFile();
   }

   function _downloadReportFile(){
     const pathParams = {
      codObjeto: localStorage.getItem('codObjeto'),
      opcMenu: localStorage.getItem('currentBreadcrumb')
     };
     const downloadFileBody = {
       "DateStart": gcwFactory.formatearFecha(vm.frmFacturasEmitidas.mInicio),
       "DateEnd": gcwFactory.formatearFecha(vm.frmFacturasEmitidas.mFin),
       "client": {
         "ClientCode": (ng.isUndefined(vm.frmFacturasEmitidas.Cliente)) ? 0 : vm.frmFacturasEmitidas.Cliente.clientCode
       },
       "agentId": (vm.cabecera.agente && vm.cabecera.agente.id) ? vm.cabecera.agente.id : parseInt(vm.dataTicket.oimClaims.agentID),
       "managerId": vm.cabecera.gestor.id,
       "RowByPage": 10,
       "CurrentPage": 1
     }
     const dataJsonRequest = 'json=' + JSON.stringify(downloadFileBody);
     const urlRequest = constants.system.api.endpoints.gcw + 'api/invoicesIssued/download' +'?COD_OBJETO='+pathParams.codObjeto+'&OPC_MENU='+pathParams.opcMenu;


    httpData.postDownload(
      urlRequest,
      dataJsonRequest,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' },responseType: 'arraybuffer'},
      true
    ).then(function(data){
      mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
    });

   }

   function _calendarInicio() {
     vm.frmFacturasEmitidas = {}
     $scope.todayInicio = function () {
       vm.frmFacturasEmitidas.mInicio = new Date();
     };
     $scope.todayInicio();

     $scope.inlineOptions = {
       minDate: new Date(),
       showWeeks: true
     };

     $scope.dateOptionsInicio = {
       formatYear: 'yy',
       maxDate: new Date(),
       minDate: new Date(),
       startingDay: 1
     };

     $scope.toggleMinInicio = function () {
       $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
       $scope.dateOptionsInicio.minDate = $scope.inlineOptions.minDate;
     };
     $scope.toggleMinInicio();

     $scope.openInicio = function () {
       $scope.popupInicio.opened = true;
     };

     $scope.formatDate = constants.formats.dateFormat;
     $scope.mask = constants.formats.dateFormatMask;
     $scope.pattern = constants.formats.dateFormatRegex;

     $scope.altInputFormats = ['M!/d!/yyyy'];

     $scope.popupInicio = {
       opened: false
     };

   }

   function _calendarFin() {
     vm.frmFacturasEmitidas = {}
     $scope.todayFin = function () {
       vm.frmFacturasEmitidas.mFin = new Date();
     };
     $scope.todayFin();

     $scope.inlineOptions = {
       minDate: new Date(),
       showWeeks: true
     };

     $scope.dateOptionsFin = {
       formatYear: 'yy',
       maxDate: new Date(),
       minDate: new Date(),
       startingDay: 1
     };

     $scope.toggleMinFin = function () {
       $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
       $scope.dateOptionsFin.minDate = $scope.inlineOptions.minDate;
     };
     $scope.toggleMinFin();

     $scope.openFin = function () {
       $scope.popupFin.opened = true;
     };

     $scope.formatDate = constants.formats.dateFormat;
     $scope.mask = constants.formats.dateFormatMask;
     $scope.pattern = constants.formats.dateFormatRegex;

     $scope.altInputFormats = ['M!/d!/yyyy'];

     $scope.popupFin = {
       opened: false
     };

   }

   _calendarInicio();
   _calendarFin();

 } // end controller

 return ng.module('appGcw')
   .controller('FacturasEmitidasController', FacturasEmitidasController)
   .component('gcwFacturasEmitidas', {
     templateUrl: '/gcw/app/components/cobranzas/facturas-emitidas/facturas-emitidas.html',
     controller: 'FacturasEmitidasController',
     controllerAs: 'vm',
     bindings: {}
   });
});
