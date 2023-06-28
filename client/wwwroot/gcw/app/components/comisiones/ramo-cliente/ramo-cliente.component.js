define([
  'angular', 'constants', 'lodash', 'gcwServicePoliza'
], function(ng, constants, _) {

  RamoClienteController.$inject = ['$scope', 'gcwFactory', '$state', '$uibModal', 'mModalAlert', 'mModalConfirm', '$rootScope', '$sce', '$timeout', 'MxPaginador', 'gcwServicePoliza'];

  function RamoClienteController($scope, gcwFactory, $state, $uibModal, mModalAlert, mModalConfirm, $rootScope, $sce, $timeout, MxPaginador, gcwServicePoliza) {

    var vm = this;
    var page;

    vm.$onInit = function() {

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.formRamoCliente = {};
      vm.formFilterRamoCliente = {};
      vm.currentPage = 1; // El paginador selecciona el nro 1
      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 10;
      vm.format = 'dd/MM/yyyy'; //fechas
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);
      vm.comisionesRamoCliente = null;
      vm.pageChanged = pageChanged; //paginacion
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      vm.totalPages = 0;
      vm.totalRows = 0;

      lstAnios();
      lstMeses();

      var actual = new Date();
      vm.formFilterRamoCliente.hastaA = {};
      vm.formFilterRamoCliente.hastaM = {};
      vm.formFilterRamoCliente.hastaA.value = actual.getFullYear();
      if((actual.getMonth()+1) < 10)
        vm.formFilterRamoCliente.hastaM.value = '0'+(actual.getMonth()+1);
      else
        vm.formFilterRamoCliente.hastaM.value = actual.getMonth()+1;

      vm.formRamoCliente.mCompania = {};
      lstCompanias();
      lstRamoPorCompania();

      vm.firstLoadAgent = firstLoadAgent;
      vm.cabecera = $rootScope.cabecera;
      vm.obtenerAgente = obtenerAgente;

      gcwFactory.cleanStorage();
      $timeout(firstLoadAgent(), 1000);
    }

    vm.buscar = buscar;
    vm.limpiar = limpiar;
    vm.firstSearch = true;

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

    function lstCompanias(){
      gcwServicePoliza.getListCompanias().then(
        function glpPr(req){
          vm.lstCompanias = req.Data;
        });
    }

    function lstRamoPorCompania(value){
      gcwFactory.getRamoPorCompania(value).then(
        function glpPq(res){
          vm.lstRamoPorCompania = res.data;
        });
    }

    $scope.$watch('vm.formRamoCliente.mCompania', function(){
      if(!ng.isUndefined(vm.formRamoCliente.mCompania)){
        var value = vm.formRamoCliente.mCompania.Value
        if(value == 4) value = 0;
        lstRamoPorCompania(value);
      }
    });

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
            agenteID: (vm.cabecera.agente == null) ? 0 : vm.cabecera.agente.id
          };
          break;
        case "DIRECTOR":
        case "GESTOR":
        case "ADM-COBRA":
        case "ADM-COMI":
        case "ADM-RENOV":
        case "ADM-SINIE":
        case "ADM-CART":
          // TODO: Quitar mensaje de error: TypeError: Cannot read property 'agente' of undefined
          return {
            gestorID: (ng.isUndefined(vm.cabecera.gestor)) ? 0 : vm.cabecera.gestor.id,
            agenteID: (vm.cabecera.agente == null) ? 0 : vm.cabecera.agente.id
          }
          break;
        default:
          return {
            gestorID: 0,
            agenteID: vm.dataTicket.oimClaims.agentID
          }
      }
    }

    function buscar(){
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = obtenerAgente();

      if(vm.cabecera && typeof vm.dataTicket != 'undefined'){
        if(!vm.rol.agenteID){
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Comisiones: Ramo y/o Cliente", "", "", "", "g-myd-modal");
        }else{
          if(vm.formRamoCliente.mRamo.ramoId == null && ng.isUndefined(vm.formRamoCliente.Cliente)){
            mModalAlert.showInfo("Seleccione un Ramo o un Cliente para realizar la búsqueda", "Advertencia", "", "", "", "g-myd-modal");
          }else{
            vm.currentPage = 1; // El paginador selecciona el nro 1
            vm.firstSearch = false;
            vm.filter = _.assign({}, getParams(), {
              CurrentPage: vm.currentPage
            });
            page.setCurrentTanda(vm.filter);
            getComisionesRamoCliente(vm.filter);
          }
        }
      }
    }

    function limpiar(){
      if(vm.formRamoCliente.Cliente){
        $rootScope.$emit('cliente:borrar');
        vm.formRamoCliente.Cliente = undefined;
      }
      vm.formRamoCliente.mCompania.Value = null;
      vm.formRamoCliente.mRamo.ramoId = null;
      vm.formFilterRamoCliente.desdeA = {};
      vm.formFilterRamoCliente.desdeM = {};
      vm.formFilterRamoCliente.desdeA.value = '2008';
      vm.formFilterRamoCliente.desdeM.value = '01';

      vm.comisionesRamoCliente = null
      vm.totalPages = 0;
      vm.totalRows = 0;

      var actual = new Date();
      vm.formFilterRamoCliente.hastaA = {};
      vm.formFilterRamoCliente.hastaM = {};
      vm.formFilterRamoCliente.hastaA.value = actual.getFullYear();
      if((actual.getMonth()+1) < 10)
        vm.formFilterRamoCliente.hastaM.value = '0'+(actual.getMonth()+1);
      else
        vm.formFilterRamoCliente.hastaM.value = actual.getMonth()+1;
    }

    function getParams(){

      var desde = Array();
      var hasta = Array();

      desde[0] = vm.formFilterRamoCliente.desdeA.value;
      desde[1] = vm.formFilterRamoCliente.desdeM.value;

      hasta[0] = vm.formFilterRamoCliente.hastaA.value;
      hasta[1] = vm.formFilterRamoCliente.hastaM.value;

      return {
        dateStart: desde[0].toString()+desde[1].toString(),
        dateEnd: hasta[0].toString()+hasta[1].toString(),
        companyId: (ng.isUndefined(vm.formRamoCliente.mCompania)) ? 0 : vm.formRamoCliente.mCompania.Value,
        branch: (vm.formRamoCliente.mRamo == null) ? 0 : vm.formRamoCliente.mRamo.ramoId,
        documentType: ng.isUndefined(vm.formRamoCliente.Cliente) ? '' : vm.formRamoCliente.Cliente.documentType,
        documentNumber: ng.isUndefined(vm.formRamoCliente.Cliente) ? "" : vm.formRamoCliente.Cliente.documentNumber,
        policyNumber: "",
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda,
        CurrentPage: vm.currentPage
      };
    }

    function pageChanged(event) {
      vm.filter = _.assign({}, getParams());
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        vm.filter.CurrentPage = nroTanda;
        getComisionesRamoCliente(vm.filter);
      }, setLstCurrentPage);
    }

    function getComisionesRamoCliente(filter){
      gcwFactory.getComisionesRamoCliente(filter, true).then(
        function(response){
          if(response.data){
            vm.totalRows = response.data.totalRows;
            vm.totalPages = response.data.totalPages;
            if(response.data.list.length > 0){
              vm.comisionesRamoCliente = response.data.list;
            }else{
              vm.comisionesRamoCliente = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }
          }else{
            vm.comisionesRamoCliente = null;
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.comisionesRamoCliente).setConfiguracionTanda();
          setLstCurrentPage();
      });
    }

    function setLstCurrentPage() {
      vm.comisionesRamoCliente = page.getItemsDePagina();
    }

    $scope.exportar = function(){

      var desde = Array();
      var hasta = Array();

      desde[0] = vm.formFilterRamoCliente.desdeA.value;
      desde[1] = vm.formFilterRamoCliente.desdeM.value;

      hasta[0] = vm.formFilterRamoCliente.hastaA.value;
      hasta[1] = vm.formFilterRamoCliente.hastaM.value;

      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/commission/branchClient/download');

      vm.downloadFile = {
        dateStart: desde[0].toString()+desde[1].toString(),
        dateEnd: hasta[0].toString()+hasta[1].toString(),
        companyId: (vm.formRamoCliente.mCompania.Value == null) ? 0 : vm.formRamoCliente.mCompania.Value,
        branch: (vm.formRamoCliente.mRamo == null) ? 0 : vm.formRamoCliente.mRamo.ramoId,
        documentType: ng.isUndefined(vm.formRamoCliente.Cliente) ? '' : vm.formRamoCliente.Cliente.documentType,
        documentNumber: ng.isUndefined(vm.formRamoCliente.Cliente) ? "" : vm.formRamoCliente.Cliente.documentNumber,
        policyNumber: "",
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        BranchName : vm.formRamoCliente.mRamo.ramoDescription,
        ClientName : ng.isUndefined(vm.formRamoCliente.Cliente) ? "" : vm.formRamoCliente.Cliente.fullName
      }
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 1500);
    }


  } // end controller

  return ng.module('appGcw')
    .controller('RamoClienteController', RamoClienteController)
    .component('gcwRamoCliente', {
      templateUrl: '/gcw/app/components/comisiones/ramo-cliente/ramo-cliente.html',
      controller: 'RamoClienteController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
