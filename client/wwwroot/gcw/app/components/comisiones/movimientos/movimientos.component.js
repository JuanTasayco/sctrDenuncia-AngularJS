define([
  'angular', 'constants', 'lodash', 'gcwServicePoliza'
], function(ng, constants, _) {

  MovimientosController.$inject = ['$scope', 'gcwFactory', '$state', '$uibModal', 'mModalAlert', 'mModalConfirm', '$rootScope', '$sce', '$timeout', 'MxPaginador', 'gcwServicePoliza'];

  function MovimientosController($scope, gcwFactory, $state, $uibModal, mModalAlert, mModalConfirm, $rootScope, $sce, $timeout, MxPaginador, gcwServicePoliza) {

    var vm = this;
    var page;

    vm.$onInit = function() {

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.currentPage = 1; // El paginador selecciona el nro 1
      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 4;
      vm.format = 'dd/MM/yyyy'; //fechas
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);
      vm.movimientos = null;
      vm.firstLoad = firstLoad;
      vm.pageChanged = pageChanged; //paginacion
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      vm.totalPages = 0;
      vm.totalRows = 0;

      vm.formMovimientos = {};
      vm.formMovimientos.mCompania = {};
      vm.formMovimientos.mTipoMoneda = {};
      vm.formMovimientos.mCompania.Value = 1;
      vm.formMovimientos.mTipoMoneda.value = 1;

      vm.format = 'dd/MM/yyyy';
      vm.mFechaHasta = new Date();
      vm.mFechaDesde = gcwFactory.restarDias(new Date(), 15);

      lstTipoMoneda();
      lstCompanias();

      vm.firstLoadAgent = firstLoadAgent;
      vm.cabecera = $rootScope.cabecera;
      vm.obtenerAgente = obtenerAgente;

      $timeout(firstLoadAgent(), 1000);

    }

    vm.buscar = buscar;
    vm.firstSearch = true;

    //actualiza registros segun agente o gestor seleccionado
    $rootScope.$watch('cabecera' ,function(){
      vm.cabecera = $rootScope.cabecera;
    },true);

    function lstCompanias(){
      gcwServicePoliza.getListCompanias().then(
        function(res){
          vm.lstCompanias = res.Data;
        });
    }

    function lstTipoMoneda(){
      gcwFactory.getListTipoMonedaGlobal().then(function glpPr(req){
        vm.lstTipoMoneda = req.data;
      });
    }

    function firstLoad(){
      if (vm.formMovimientos && vm.cabecera) {
        if (vm.cabecera.agente && vm.cabecera.gestor) {
          vm.currentPage = 1; // El paginador selecciona el nro 1
          var params = _.assign({}, getParams(), {
            CurrentPage: vm.currentPage
          });
          page.setCurrentTanda(vm.currentPage);
          getMovimientos(params);
        }else{
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Comisiones: Movimientos", "", "", "", "g-myd-modal");
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
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Comisiones: Movimientos", "", "", "", "g-myd-modal");
        }else{
          vm.currentPage = 1; // El paginador selecciona el nro 1
          vm.firstSearch = false;
          var params = _.assign({}, getParams(), {
            CurrentPage: vm.currentPage
          });
          page.setCurrentTanda(params);
          getMovimientos(params);
        }
      }
    }

    function getParams() {
      return {
        companyId: vm.formMovimientos.mCompania.Value,
        coinId: vm.formMovimientos.mTipoMoneda.value,
        dateStart: gcwFactory.formatearFecha(vm.mFechaDesde),
        dateEnd: gcwFactory.formatearFecha(vm.mFechaHasta),
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda,
        CurrentPage: vm.currentPage
      };
    }

    function pageChanged(event) {
      var params = _.assign({}, getParams());
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        params.CurrentPage = nroTanda;
        getMovimientos(params);
      }, setLstCurrentPage);
    }

    function getMovimientos(filter){
      gcwFactory.getMovimientos(filter, true).then(
        function(response){
          if(response.data){
            vm.totalRows = response.data.totalRows;
            vm.totalPages = response.data.totalPages;
            if(response.data.list.length > 0){
              vm.movimientos = response.data.list;
            }else{
              vm.movimientos = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }
          }else{
            vm.movimientos = null;
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.movimientos).setConfiguracionTanda();
          setLstCurrentPage();
      });
    }

    function setLstCurrentPage() {
      vm.movimientos = page.getItemsDePagina();
    }

    $scope.exportar = function(){
      var oim = vm.dataTicket.oimClaims;
      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/commission/movement/download');
      vm.downloadFile = {
        companyId: vm.formMovimientos.mCompania.Value,
        coinId: vm.formMovimientos.mTipoMoneda.value,
        dateStart: gcwFactory.formatearFecha(vm.mFechaDesde),
        dateEnd: gcwFactory.formatearFecha(vm.mFechaHasta),
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        CompanyName: vm.formMovimientos.mCompania.Description,
        AgentName: oim.agentName.toString(),
        CoinName: vm.formMovimientos.mTipoMoneda.description
      };
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 1000);
    }

    $scope.exportarItem = function(item){
      vm.exportURLItem = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+'api/commission/movement/download');
      vm.downloadFileItem = {
        companyId: vm.formMovimientos.mCompania.Value,
        coinId: vm.formMovimientos.mTipoMoneda.value,
        dateStart: item.processDate,
        dateEnd: item.processDate,
        agentId: item.agentId,
        managerId: vm.rol.gestorID,
        CompanyName: vm.formMovimientos.mCompania.Description,
        AgentName: vm.dataTicket.oimClaims.agentName.toString(),
        CoinName: vm.formMovimientos.mTipoMoneda.description
      };
      $timeout(function() {
        document.getElementById('frmExportItem').submit();
      }, 1000);

    }

  } // end controller

  return ng.module('appGcw')
    .controller('MovimientosController', MovimientosController)
    .component('gcwMovimientos', {
      templateUrl: '/gcw/app/components/comisiones/movimientos/movimientos.html',
      controller: 'MovimientosController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
