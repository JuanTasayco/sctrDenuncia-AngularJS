define([
    'angular', 'constants',
   '/gcw/app/factory/gcwFactory.js'
], function(ng) {

  MapfreDolarController.$inject = [
  '$scope',
  '$rootScope',
  'gcwFactory',
  '$state',
  '$sce',
  '$timeout',
  '$uibModal',
  'mModalAlert',
  'mModalConfirm',
  'MxPaginador',
  '$http'
  ];

  function MapfreDolarController(
    $scope,
    $rootScope,
    gcwFactory,
    $state,
    $sce,
    $timeout,
    $uibModal,
    mModalAlert,
    mModalConfirm,
    MxPaginador,
    $http
    ) {

    var vm = this;
    var page;

    vm.$onInit = function() {
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 10;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);

      vm.formMDolar = {};
      vm.noResultB = true;
      vm.firstSearchB = false;
      vm.onlyNumber = false;
      vm.docNumMaxLength = 13;
      vm.docNumMinLength = 5;

      vm.formMDolar.mTipoDoc = {};
      vm.formMDolar.mTipoDoc.typeId = 'CEX';
      vm.optRadio1 = "1";

      lstSegmento();
      lstMeses();
      vm.cabecera = $rootScope.cabecera;

      gcwFactory.cleanStorage();
    }

    vm.buscar = buscar;
    vm.evaluateManagerByAgent = evaluateManagerByAgent;

    vm.limpiar = limpiar;
    vm.pageChanged = pageChanged;
    vm.showNaturalPerson = showNaturalPerson;

    $rootScope.$watch('cabecera.agente.id' ,function(){
      evaluateManagerByAgent();
    },true);

    function lstSegmento(){
      gcwFactory.getListSegmento(false).then(
        function glpPr(req){
          vm.lstSegmentos = req.data;
        });
    }

    function lstMeses(){
      var mes = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];

      var meses = [];

      for(var i = 0; i < 12; i++){
        meses.push({'description': mes[i], 'value': (i+1)});
      }
      vm.lstMeses = meses;
    }

    function evaluateManagerByAgent(){

      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);

      var agentId = parseInt(vm.dataTicket.agentID);
      var agentIdSelected = vm.rol.agenteID;
      var companyId = 1;
      var roleCode = vm.dataTicket.roleCode;

      gcwFactory.validarGestorPorAgenteGet(agentId, agentIdSelected, companyId, roleCode, false)
      .then(function(response){
          if(vm.dataTicket.roleCode === "GESTOR-OIM" || vm.dataTicket.roleCode === "DIRECTOR"){
            if(response.data.code == "0"){
              vm.valida = "0";
            }else{
              vm.valida = "1";
            }
          }else{
            vm.valida = "1";
          }
        },
        function(error){
          console.log(error.message);
        });
    }

    function buscar(){
      vm.currentPage = 1;
      var params;
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);

      /*
      * En la antigua OIM este modulo solo pide agente para roles GESTOR-OIM o DIRECTOR.
      * Si se desea mejorar la busqueda en caso de que se necesite especificar el agente se debera aplicar
      * este cambio a los roles GESTOR-OIM, DIRECTOR y GESTOR. Por ejemplo:
      * switch (vm.dataTicket.roleCode){
      *   case  "GESTOR-OIM":
      *   case  "DIRECTOR":
                //instrucciones para buscar pidiendo agente
      *         break;
      *   default:
      *         //instrucciones para buscar sin necesidad de agente
      *         break;
      * }
      */
      switch(vm.dataTicket.roleCode){
        case "GESTOR-OIM":
        case "DIRECTOR":
          if(vm.rol.agenteID == 0)
            mModalAlert.showInfo("Seleccione un agente antes de iniciar la consulta", "Mapfre Dolar", "", "", "", "g-myd-modal");
          else{
            if(vm.valida == "1"){
              switch(vm.optRadio1.toString()){
                case "1":
                  params = {
                    codeSubCentral: "",
                    codeBranchOffice: "",
                    codeOffice: "",
                    documentType: "",
                    documentNumber: "",
                    monthProcess: (vm.formMDolar.mMes.value == null) ? '' : vm.formMDolar.mMes.value,
                    commercialSegment: (vm.formMDolar.mSegmento.description == 'Seleccionar') ? '' : vm.formMDolar.mSegmento.description,
                    rankStart: vm.formMDolar.mGanadoMin,
                    rankEnd: vm.formMDolar.mGanadoMax,
                    agentId: vm.rol.agenteID,
                    RowByPage: vm.itemsXTanda,
                    CurrentPage: vm.currentPage
                  }
                  page.setCurrentTanda(vm.currentPage);
                  searchMD(params)
                break;
                case "2":
                  params = {
                    codeSubCentral: "",
                    codeBranchOffice: "",
                    codeOffice: "",
                    documentType: vm.formMDolar.mTipoDoc.typeId,
                    documentNumber: vm.formMDolar.mNumeroDocumento,
                    monthProcess: '',
                    commercialSegment: '',
                    rankStart: '',
                    rankEnd: '',
                    agentId: vm.rol.agenteID,
                    RowByPage: vm.itemsXTanda,
                    CurrentPage: vm.currentPage
                  }
                  page.setCurrentTanda(vm.currentPage);
                  searchMD(params);
                break;
              } //switch optRadio
            }
            else
              mModalAlert.showInfo("Agente no asignado al Gestor", "Mapfre Dolar", "", "", "", "g-myd-modal");
          }
          break;
        default:
          if(vm.valida == "1"){
             switch(vm.optRadio1.toString()){
              case "1":
                params = {
                  codeSubCentral: "",
                  codeBranchOffice: "",
                  codeOffice: "",
                  documentType: "",
                  documentNumber: "",
                  monthProcess: (vm.formMDolar.mMes.value == null) ? '' : vm.formMDolar.mMes.value,
                  commercialSegment: (vm.formMDolar.mSegmento.description == 'Seleccionar') ? '' : vm.formMDolar.mSegmento.description,
                  rankStart: vm.formMDolar.mGanadoMin,
                  rankEnd: vm.formMDolar.mGanadoMax,
                  agentId: vm.rol.agenteID,
                  RowByPage: vm.itemsXTanda,
                  CurrentPage: vm.currentPage
                }
                page.setCurrentTanda(vm.currentPage);
                searchMD(params)
              break;
            case "2":
                params = {
                  codeSubCentral: "",
                  codeBranchOffice: "",
                  codeOffice: "",
                  documentType: vm.formMDolar.mTipoDoc.typeId,
                  documentNumber: vm.formMDolar.mNumeroDocumento,
                  monthProcess: '',
                  commercialSegment: '',
                  rankStart: '',
                  rankEnd: '',
                  agentId: vm.rol.agenteID,
                  RowByPage: vm.itemsXTanda,
                  CurrentPage: vm.currentPage
                }
                page.setCurrentTanda(vm.currentPage);
                searchMD(params);
              break;
            } //switch optRadio
          }
          else
            mModalAlert.showInfo("Agente no asignado al Gestor", "Mapfre Dolar", "", "", "", "g-myd-modal");
          break;
      }
    }

    function searchMD(params){
      gcwFactory.getListMapfreDollar(params, true).then(
        function(response) {
          if (response.data) {

            if(response.data.list.length > 0){
              vm.mapfred = response.data.list;
              vm.totalRows = response.data.totalRows;
              vm.totalPages = response.data.totalPages;
            }else{
              vm.mapfred = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }
          }else{
            vm.mapfred = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
            $rootScope.polizaAnulada = "1";
            $rootScope.$broadcast('anuladasPorDeuda');
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.mapfred).setConfiguracionTanda();
          setLstCurrentPage();
       },function(error){
       });
    }

    function setLstCurrentPage() {
      vm.mapfred = page.getItemsDePagina();
    }

    function pageChanged(event) {
      var params;
      switch(vm.optRadio1.toString()){
        case "1":
            params = {
            codeSubCentral: "",
            codeBranchOffice: "",
            codeOffice: "",
            documentType: "",
            documentNumber: "",
            monthProcess: (vm.formMDolar.mMes == null) ? '' : vm.formMDolar.mMes.value,
            commercialSegment: (vm.formMDolar.mSegmento.description == 'Seleccionar') ? '' : vm.formMDolar.mSegmento.description,
            rankStart: vm.formMDolar.mGanadoMin,
            rankEnd: vm.formMDolar.mGanadoMax,
            agentId: vm.rol.agenteID,
            RowByPage: vm.itemsXTanda
          }
        break;
        case "2":
            params = {
            codeSubCentral: "",
            codeBranchOffice: "",
            codeOffice: "",
            documentType: vm.formMDolar.mTipoDoc.typeId,
            documentNumber: vm.formMDolar.mNumeroDocumento,
            monthProcess: '',
            commercialSegment: '',
            rankStart: '',
            rankEnd: '',
            agentId: vm.rol.agenteID,
            RowByPage: vm.itemsXTanda
          }
        break;
      }
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        params.CurrentPage = nroTanda;
        searchMD(params);
      }, setLstCurrentPage);
    }

    function limpiar(){
      vm.optRadio1 = "1";
      $rootScope.$emit('cliente:borrar');
      vm.formMDolar.mSegmento.code = null;
      vm.formMDolar.mMes.value = null;
      vm.formMDolar.mGanadoMin = '';
      vm.formMDolar.mGanadoMax = '';
      vm.formMDolar.mTipoDoc.typeId = 'CEX';
      vm.formMDolar.mNumeroDocumento = "";
      vm.totalRows = 0;
      vm.totalPages = 0;
      vm.mapfred = [];
    }

    function funDocNumMaxLength(documentType){
      switch(documentType) {
        case constants.documentTypes.dni.Codigo:
          vm.docNumMaxLength = 8;
          vm.docNumMinLength = 8;
          vm.onlyNumber = true;
          break;
        case constants.documentTypes.ruc.Codigo:
          vm.docNumMaxLength = 11;
          vm.docNumMinLength = 11;
          vm.onlyNumber = true;
          break;
        default:
          vm.docNumMaxLength = 13;
          vm.docNumMinLength = 6;
          vm.onlyNumber = false;
      }
    }

    function showNaturalPerson(item){
      vm.formMDolar.mNumeroDocumento = undefined;
      if(typeof item != 'undefined')
        funDocNumMaxLength(item.typeId);
    }

    $scope.exportar = function(){
     vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/mapfredollar/download');
      vm.downloadFile = {
        codeSubCentral: "",
        codeBranchOffice: "",
        codeOffice: "",
        documentType: (ng.isUndefined(vm.formMDolar.mNumeroDocumento)) ? "" : vm.formMDolar.mTipoDoc.typeId,
        documentNumber: (ng.isUndefined(vm.formMDolar.mNumeroDocumento)) ? "" : vm.formMDolar.mNumeroDocumento,
        monthProcess: (vm.formMDolar.mMes.value == null) ? "" : vm.formMDolar.mMes.value,
        commercialSegment: (vm.formMDolar.mSegmento.description == 'Seleccionar') ? '' : vm.formMDolar.mSegmento.description,
        rankStart: ng.isUndefined(vm.formMDolar.mGanadoMin) ? "" : vm.formMDolar.mGanadoMin,
        rankEnd: ng.isUndefined(vm.formMDolar.mGanadoMax) ? "" : vm.formMDolar.mGanadoMax,
        agentId: vm.rol.agenteID
      }
      ;
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 1000);
    }

    $scope.descargarPDF = function(item){
     vm.descargarURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+'api/mapfredollar/state/download');
          vm.downloadFile2 = {
            documentType: item.documentType,
            documentNumber: item.documentNumber,
            nameFull: item.nameFull
          }
      $timeout(function() {
        document.getElementById('frmDescargar').submit();
      }, 1000);
    }

  } // end controller

  return ng.module('appGcw')
    .controller('MapfreDolarController', MapfreDolarController)
    .component('gcwMapfreDolar', {
      templateUrl: '/gcw/app/components/mapfre-dolar/mapfre-dolar/mapfre-dolar.html',
      controller: 'MapfreDolarController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
