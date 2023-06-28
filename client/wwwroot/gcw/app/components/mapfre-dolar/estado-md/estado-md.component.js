define([
    'angular', 'constants',
   '/gcw/app/factory/gcwFactory.js'
], function(ng) {

  EstadoMdController.$inject = ['$scope', '$rootScope', 'gcwFactory', '$state', '$timeout', '$sce', 'MxPaginador', '$uibModal', 'mModalAlert',];

  function EstadoMdController($scope, $rootScope, gcwFactory, $state, $timeout, $sce, MxPaginador, $uibModal, mModalAlert) {

    var vm = this;

    vm.$onInit = function() {
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.formEstadoMD = {};
      vm.noResultB = true;
      vm.firstSearchB = false;
      vm.onlyNumber = false;
      vm.docNumMaxLength = 13;
      vm.docNumMinLength = 6;

      vm.currentPage = 1; // El paginador selecciona el nro 1
      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 4;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      var page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);
      vm.estadomd = null;
      vm.pageChanged = pageChanged; //paginacion

      vm.optRadio1 = "1";
    }

    vm.buscar = buscar;
    vm.limpiar = limpiar;
    vm.firstLoadAgent = firstLoadAgent;
    vm.obtenerAgente = obtenerAgente;

    vm.showNaturalPerson = showNaturalPerson;
    vm.cabecera = $rootScope.cabecera;

    $rootScope.$watch('cabecera' ,function(){
      vm.cabecera = $rootScope.cabecera;
    },true);

    $scope.$watch('vm.formMDolar.mTipoDoc', function(nv){
      vm.showNaturalPerson(nv);
    })

    function buscar(){
      var params;
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = obtenerAgente();

      vm.currentPage = "1";
      switch(vm.optRadio1.toString()){
        case "1":
          if(vm.cabecera && typeof vm.dataTicket != 'undefined'){
            if(!vm.rol.agenteID){
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Estado MD", "", "", "", "g-myd-modal");
            }else{
              if(ng.isUndefined(vm.formEstadoMD.Cliente)){
                mModalAlert.showInfo("Seleccione un cliente para iniciar la consulta", "Estado MD", "", "", "", "g-myd-modal");
              }else{
                params = {
                  documentType: ng.isUndefined(vm.formEstadoMD.Cliente) ? '' : vm.formEstadoMD.Cliente.documentType,
                  documentNumber: ng.isUndefined(vm.formEstadoMD.Cliente) ? '' : vm.formEstadoMD.Cliente.documentNumber,
                  policyNumber: '',
                  AgentId: vm.rol.agenteID,
                  ManagerId: vm.rol.gestorID,
                  RowByPage: "10",
                  CurrentPage: "1"
                };
                page.setCurrentTanda(vm.currentPage);
                searchEstadoMD(params);
              }

            }
          }
        break;
        case "2":
          params = {
            documentType: '',
            documentNumber: '',
            policyNumber: (vm.formEstadoMD.mNumPoliza == null) ? '' : vm.formEstadoMD.mNumPoliza,
            AgentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: "10",
            CurrentPage: "1"
          };
          page.setCurrentTanda(vm.currentPage);
          searchEstadoMD(params);
        break;
      }

    }

    function searchEstadoMD(params){
      gcwFactory.getListEstadoMD(params, true).then(
        function(response){
          if(response.data){

            if(response.data.list.length > 0){
              vm.estadomd = response.data.list;

              vm.totalRows = response.data.totalRows;
              vm.totalPages = response.data.totalPages;
            }else{
              vm.estadomd = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }
          }else{
            vm.estadomd = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.estadomd).setConfiguracionTanda();
          setLstCurrentPage();
        });
    }

    function pageChanged(event) {
      var params;
      switch(vm.optRadio1.toString()){
        case "1":
          params = {
              documentType: ng.isUndefined(vm.formEstadoMD.Cliente) ? '' : vm.formEstadoMD.Cliente.documentType,
              documentNumber: ng.isUndefined(vm.formEstadoMD.Cliente) ? '' : vm.formEstadoMD.Cliente.documentNumber,
              policyNumber: '',
              AgentId: vm.rol.agenteID,
              ManagerId: vm.rol.gestorID,
              RowByPage: "10",
              CurrentPage: vm.currentPage
          };
          break;
        case "2":
          params = {
            documentType: '',
            documentNumber: '',
            policyNumber: (vm.formEstadoMD.mNumPoliza == null) ? '' : vm.formEstadoMD.mNumPoliza,
            AgentId: vm.rol.agenteID,
            ManagerId: vm.rol.gestorID,
            RowByPage: "10",
            CurrentPage: vm.currentPage
          };
        break;
      }
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        params.CurrentPage = nroTanda;
        searchEstadoMD(params);
      }, setLstCurrentPage);
    }

    function setLstCurrentPage() {
      vm.estadomd = page.getItemsDePagina();
    }

    function limpiar(){
      vm.totalRows = 0;
      vm.totalPages = 0;
      vm.estadomd = null;
      $rootScope.$emit('cliente:borrar');
      vm.formEstadoMD.mNumPoliza = "";
      vm.optRadio1 = "1";
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
      //return item;
      vm.formEstadoMD.mNumPoliza = undefined;
      //MaxLength documentType
      if(typeof item != 'undefined')
        funDocNumMaxLength(item.typeId);
    }

    $scope.descargarPDF = function(item){
     vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+'api/mapfredollar/state/download');
          vm.downloadFile = {
            documentType: item.documentType,
            documentNumber: item.documentNumber,
            nameFull: item.nameFull
          }
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 500);

    }

  } // end controller

  return ng.module('appGcw')
    .controller('EstadoMdController', EstadoMdController)
    .component('gcwEstadoMd', {
      templateUrl: '/gcw/app/components/mapfre-dolar/estado-md/estado-md.html',
      controller: 'EstadoMdController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
