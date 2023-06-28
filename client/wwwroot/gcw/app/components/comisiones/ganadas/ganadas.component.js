define([
  'angular', 'constants', 'lodash', 'gcwServicePoliza'
], function(ng,  constants, _) {

  GanadasController.$inject = ['$scope', 'gcwFactory', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', '$rootScope', '$sce', '$timeout', 'MxPaginador', '$state', 'gcwServicePoliza'];

  function GanadasController($scope, gcwFactory, mainServices, $uibModal, mModalAlert, mModalConfirm, $rootScope, $sce, $timeout, MxPaginador, $state, gcwServicePoliza){
    // TODO: evaluar si hay que crear las direcitvas heightRow widthWindow de ganadas.js

    var vm = this;
    var page;
    vm.filePdf = {
      nameAttachedFile : null,
      attachFile : true,
      errorAttachFile : false,
      fmUploadFile:null
    };

    vm.fileXML = {
      nameAttachedFile : null,
      attachFile : true,
      errorAttachFile : false,
      fmUploadFile:null
    };

    vm.$onInit = function(){
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

      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      vm.pageChanged = pageChanged;
      vm.firstLoad = false; //primera carga en false
      vm.noResult = true;

      vm.firstLoadAgent = firstLoadAgent;
      vm.cabecera = $rootScope.cabecera;
      vm.obtenerAgente = obtenerAgente;

      lstCompanias();
      lstEstados();

      vm.formComisionGanada = {};
      vm.formComisionGanada.mCompania = {};
      vm.formComisionGanada.Estado = {};
      vm.formComisionGanada.mCompania = null;
      vm.formComisionGanada.Estado.value = "U";

      lstAnios();
      lstMeses();

      var actual = new Date();
      vm.formComisionGanada.mConsultaDesdeA = {};
      vm.formComisionGanada.mConsultaHastaA = {};
      vm.formComisionGanada.mConsultaDesdeM = {};
      vm.formComisionGanada.mConsultaHastaM = {};

      vm.formComisionGanada.mConsultaDesdeA.value = actual.getFullYear();
      vm.formComisionGanada.mConsultaHastaA.value = actual.getFullYear();

      if((actual.getMonth()+1) < 10){
        vm.formComisionGanada.mConsultaDesdeM.value = '0'+(actual.getMonth()+1);
        vm.formComisionGanada.mConsultaHastaM.value = '0'+(actual.getMonth()+1);
      }
      else{
        vm.formComisionGanada.mConsultaDesdeM.value = (actual.getMonth()+1);
        vm.formComisionGanada.mConsultaHastaM.value = (actual.getMonth()+1);
      }

      $timeout(firstLoadAgent(), 1000);
    }// end onInit

    vm.buscar = buscar;
    vm.obtenerAgente = obtenerAgente;
    vm.limpiar = limpiar;

    vm.showUpload = showUpload

    function lstCompanias(){
      gcwServicePoliza.getListCompanias().then(
        function glpPr(req){
          vm.lstCompanias = req.Data;
        });
    }

    function lstEstados(){
      gcwFactory.getListaEstadoGanadas().then(
        function (res){
          vm.lstEstados = res.data;
      });
    }

    function lstAnios(){

      var hoy = new Date();
      var anio = hoy.getFullYear();
      var numItems = (anio+1) - 2008;

      var anios = [];

      for(var i = 0; i <= numItems; i++){
        anios.push({'description': 2008+i, 'value': 2008+i});
      }
      vm.lstAnios = anios;
    }

    function lstMeses(){

      var meses = [];

      for(var i = 1; i <= 12; i++){
        var mes = i;
        if(mes <= 9) mes = '0'+i;
        meses.push({'description': mes, 'value': mes});
      }
      vm.lstMeses = meses;
    }

    function buscar(){
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = obtenerAgente();
      vm.typeUser = gcwFactory.getTypeUser();

      var mConsultaDesde = vm.formComisionGanada.mConsultaDesdeA.value.toString()+vm.formComisionGanada.mConsultaDesdeM.value.toString();
      var mConsultaHasta = vm.formComisionGanada.mConsultaHastaA.value.toString()+vm.formComisionGanada.mConsultaHastaM.value.toString();

      vm.params = {
        companyId: (vm.formComisionGanada.mCompania.Value == null) ? "0" : vm.formComisionGanada.mCompania.Value,
        typeConsult: vm.formComisionGanada.Estado.value,
        dateStart: mConsultaDesde,
        dateEnd: mConsultaHasta,
        RowByPage: vm.itemsXTanda,
        CurrentPage: "1"
      };

      if(vm.typeUser == 3){
        vm.params.ManagerId = vm.cabecera.gestor.id
        if(vm.cabecera.agente == null){
          vm.params.AgentId = vm.rol.agenteID
          getListaGanadas(vm.params);
        }else{
          if(vm.cabecera.agente.id){
            vm.params.AgentId = vm.cabecera.agente.id
            getListaGanadas(vm.params);
          }
          else
            mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Comisiones: Ganadas");
        }
      }else{
        if(vm.cabecera && !ng.isUndefined(vm.dataTicket)){
          if(!vm.rol.agenteID || vm.rol.agenteID == 0){
            mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Comisiones: Ganadas");
          }else{
            vm.params.AgentId = vm.rol.agenteID
            vm.params.ManagerId = vm.rol.gestorID
            getListaGanadas(vm.params);
          }
        }
      }
    }

    function firstLoadAgent(){
      vm.rol = {};
      vm.rol.gestorID = 0;
      vm.rol.agenteID = 0;
      vm.cabecera = $rootScope.cabecera;
    }

    function obtenerAgente(){
      switch(vm.dataTicket.roleCode){
        case "GESTOR-OIM":
          return {
            gestorID: vm.dataTicket.oimClaims.agentID,
            agenteID: (vm.cabecera.agente == null) ? 0 : vm.cabecera.agente.id,
            agenteFullName: (vm.cabecera.agente == null) ? '' : vm.cabecera.agente.fullName
          };
          break;
        case "DIRECTOR":
        case "GESTOR":
        case "ADM-COBRA":
        case "ADM-COMI":
        case "ADM-RENOV":
        case "ADM-SINIE":
        case "ADM-CART":

          return {
            gestorID: (ng.isUndefined(vm.cabecera.gestor)) ? 0 : vm.cabecera.gestor.id,
            agenteID: (vm.cabecera.agente == null) ? 0 : vm.cabecera.agente.id,
            agenteFullName: (vm.cabecera.agente == null) ? 0 : vm.cabecera.agente.fullName
          }
          break;
        default:
          return {
            gestorID: 0,
            agenteID: vm.dataTicket.oimClaims.agentID,
            agenteFullName: vm.dataTicket.oimClaims.agentName
          }
      }
    }

    function limpiar(){
      return;
    }

    function pageChanged(event){
      var mConsultaDesde = vm.formComisionGanada.mConsultaDesdeA.value.toString()+vm.formComisionGanada.mConsultaDesdeM.value.toString();
      var mConsultaHasta = vm.formComisionGanada.mConsultaHastaA.value.toString()+vm.formComisionGanada.mConsultaHastaM.value.toString();
      vm.params = {
        companyId: (vm.formComisionGanada.mCompania.Value == null) ? "0" : vm.formComisionGanada.mCompania.Value,
        typeConsult: vm.formComisionGanada.Estado.value,
        dateStart: mConsultaDesde,
        dateEnd: mConsultaHasta,
        AgentId: vm.typeUser == 3 ? vm.cabecera.agente.id : vm.rol.agenteID,
        ManagerId: vm.typeUser == 3 ? vm.cabecera.gestor.id : vm.rol.gestorID,
        RowByPage: vm.itemsXTanda
      };
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(
        function(nroTanda) {
          vm.params.CurrentPage = nroTanda;
          getListaGanadas(vm.params);
      }, setLstCurrentPage);
    }

    function getListaGanadas(params){
      gcwFactory.getListaGanadas(params, true).then(
        function(response){
        if(response.data){
          if(response.data.totalRows > 0){
            vm.ganadas = response.data.list;

            vm.clientName = response.data.clientName;
            vm.commercialSegment = response.data.commercialSegment;
            vm.totalPages = response.data.totalPages;
            vm.totalRows = response.data.totalRows;
          }else{
            vm.ganadas = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
        }else{
          vm.ganadas = null;
          vm.totalRows = 0;
          vm.totalPages = 0;
        }
        page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.ganadas).setConfiguracionTanda();
        setLstCurrentPage();
      });

    }

    function setLstCurrentPage() {
      vm.ganadas = page.getItemsDePagina();
    }

    //actualiza registros segun agente o gestor seleccionado y carga cabecera
    $rootScope.$watch('cabecera' ,function(){
      vm.cabecera = $rootScope.cabecera;
      vm.firstLoad = true;
    }, true);

    $scope.exportar = function(){

      var mConsultaDesde = vm.formComisionGanada.mConsultaDesdeA.value.toString()+vm.formComisionGanada.mConsultaDesdeM.value.toString();
      var mConsultaHasta = vm.formComisionGanada.mConsultaHastaA.value.toString()+vm.formComisionGanada.mConsultaHastaM.value.toString();

      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ '/api/commission/liquidated/download');
      vm.downloadFile = {
        companyId: (vm.formComisionGanada.mCompania.Value == null) ? "0" : vm.formComisionGanada.mCompania.Value,
        typeConsult: vm.formComisionGanada.Estado.value,
        dateStart: mConsultaDesde,
        dateEnd: mConsultaHasta,
        AgentId: vm.typeUser == 3 ? vm.cabecera.agente.id : vm.rol.agenteID,
        ManagerId: vm.typeUser == 3 ? vm.cabecera.gestor.id : vm.rol.gestorID,
        RowByPage: "100",
        userId: vm.dataTicket.userCode
      };
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 500);
    }

    $scope.exportarDetalle = function(item){
      vm.exportURLDetalle = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/commission/liquidated/download/detail');
      if(vm.formComisionGanada.mCompania.Value == null){
        vm.valueDownload = item.companyId;
      }else{
        vm.valueDownload = vm.formComisionGanada.mCompania.Value;
      }

      vm.downloadFile2 = {
        companyId: vm.valueDownload,
        dateLiquidation: item.dateLiquidation,
        coinCode: item.coinCode,
        numberPaidOrder: item.numberPaidOrder,
        paymentDate: item.paymentDate,
        bank: item.bank,
        paymentType: item.paymentType,
        state: item.state,
        numberInvoice: item.numberInvoice,
        newBalance: item.newBalance,
        company: item.company,
        viewPreviousBalance: item.viewPreviousBalance,
        amount: item.amount,
        amountPreviousBalance: item.amountPreviousBalance,
        amountAdjustment: item.amountAdjustment,
        amountAdvance: item.amountAdvance,
        amountTax: item.amountTax,
        amount701: item.amount701,
        amountNo701: item.amountNo701,
        AgentId: vm.typeUser == 3 ? vm.params.AgentId : vm.rol.agenteID,
        userId: vm.dataTicket.userCode,
        UserNameFull: vm.dataTicket.fullName,
        RoleType: vm.dataTicket.roleType
      };
      $timeout(function() {
        document.getElementById('frmExportDetalle').submit();
      }, 500);
    }

    $scope.descargarSaldo = function(item){

      vm.exportURLSaldo = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ '/api/commission/liquidated/download/previousBalance');
      vm.downloadFile3 = {
        companyId: item.companyId,
        coinCode: item.coinCode,
        coinId: item.coinId,
        dateLiquidation: item.dateLiquidation,
        numberPaidOrder: item.numberPaidOrder,
        amountPreviousBalance: item.amountPreviousBalance,
        agentId: vm.rol.agenteID,
        agentNameFull: vm.rol.agenteFullName
      };
      $timeout(function() {
        document.getElementById('frmExportSaldo').submit();
      }, 500);
    }

    vm.override = function(item){
      mModalConfirm.confirmInfo('¿Está seguro de anular su Orden de Pago?','ANULACIÓN','ANULAR').then(function(){
        var params = {
          companyCode : item.companyId,
          agentCode: (vm.cabecera.agente == null) ? vm.rol.agenteID : vm.cabecera.agente.id
        }
        gcwFactory.cancellationPaymentOrders(item.numberPaidOrder,params).then(
          function (res){
            if(!res.data.error){
              buscar();
            }else{
              mModalAlert.showError(res.data.message, '');
            }
          }
        ).catch(function(e) {
            if(e.data.operationCode === 900){
              mModalAlert.showError(e.data.data.message, 'Error');
            }else{
              mModalAlert.showError(e.data.message, 'Error');
            }
        });
      });
    }

    function showUpload(item) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal--md fade',
        templateUrl: '/gcw/app/components/comisiones/ganadas/modal-cargar-factura.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          _setAttachFile(null,'filePdf');
          _setAttachFile(null,'fileXML');
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          }

          scope.uploadFiles = function(){
            if(_validateFiles()){
              mainServices.fnReturnSeveralPromise([
                mainServices.fnFileSerializeToBase64(vm.filePdf.fmUploadFile[0]),
                mainServices.fnFileSerializeToBase64(vm.fileXML.fmUploadFile[0])
              ], true).then(
                function(file){
                  var params = {
                    XmlFileStr : file[1],
                    XmlFileName : vm.fileXML.nameAttachedFile,
                    PdfFileStr : file[0],
                    PdfFileName : vm.filePdf.nameAttachedFile,
                    OrderId: item.numberPaidOrder,
                    CompanyCode: item.companyId,
                    TipDocum: item.tipDocum,
                    CodDocum: item.codDocum, 
                    agentCode: (vm.cabecera.agente == null) ? vm.rol.agenteID : vm.cabecera.agente.id
                  }
                  gcwFactory.selfSettlementUploadFile(params).then(
                    function(response){
                      $uibModalInstance.close();
                      if (response.operationCode === 200) {
                        mModalAlert.showSuccess('La factura se ingreso de manera correcta, el abono se realizara en el transcurso de 24 a 48 horas hábiles','','');
                        buscar();
                      }
                    }
                  ).catch(function(e) {
                    $uibModalInstance.close();
                      if(e.data.operationCode === 900){
                        mModalAlert.showError(e.data.data.message, 'Error');
                      }else{
                        mModalAlert.showError(e.data.message, 'Error');
                      }
                  })
                }
              ) 
            }
            
          }

          
          scope.fnChangedAttachedFile = function(name){
            $timeout(function(){
              var vFile = vm[name].fmUploadFile || {};
              _setAttachFile(vFile,name);
            }, 0);
          };
        }]
      });
    }

    function _setAttachFile(file,name){
      var vExistFile = file || false;
      vm[name].nameAttachedFile = (vExistFile)
                                      ? file[0].name
                                      : '';
      vm[name].attachFile = !vExistFile;
      vm[name].errorAttachFile = false;
    }

    vm.fnDeleteAttachedFile = function(name){
      _setAttachFile(null,name);
    };

    function _validateFiles(){
      vm.filePdf.errorAttachFile = vm.filePdf.attachFile;
      vm.fileXML.errorAttachFile = vm.fileXML.attachFile;
      return !vm.fileXML.errorAttachFile  && !vm.fileXML.errorAttachFile;
    }

  } // end controller

  return ng.module('appGcw')
    .controller('GanadasController', GanadasController)
    .component('gcwGanadas', {
      templateUrl: '/gcw/app/components/comisiones/ganadas/ganadas.html',
      controller: 'GanadasController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
