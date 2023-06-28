define([
  'angular', 'constants', 'lodash', '/gcw/app/factory/gcwFactory.js'
], function(ng, constants, _) {

  PorGanarController.$inject = ['$scope', 'gcwFactory', '$state', '$uibModal', 'mModalAlert', 'mModalConfirm', '$rootScope', '$sce', '$timeout', 'MxPaginador'];

  function PorGanarController($scope, gcwFactory, $state, $uibModal, mModalAlert, mModalConfirm, $rootScope, $sce, $timeout, MxPaginador) {
    var vm = this;
    var page;

    vm.$onInit = function() {

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 4;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);
      vm.formPorGanar = {};
      vm.firstLoad = firstLoad;
      vm.lstTipoMoneda = lstTipoMoneda;
      vm.pageChanged = pageChanged;
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      vm.comisionesPorGanar = null;
      lstTipoMoneda();

      vm.firstLoadAgent = firstLoadAgent;
      vm.cabecera = $rootScope.cabecera;

      $timeout(firstLoadAgent(), 1000);
    }

    vm.buscar = buscar;
    vm.firstSearch = true;

    //actualiza registros segun agente o gestor seleccionado
    $rootScope.$watch('cabecera' ,function(){
      vm.cabecera = $rootScope.cabecera;
    },true);

    $scope.$watch('vm.tipoMoneda', function(){
      vm.cabecera = $rootScope.cabecera;
    });

    //lista tipo de moneda: Soles y Dolares
    function lstTipoMoneda(){
      gcwFactory.getListTipoMonedaGlobal().then(function glpPr(req){
        vm.lstTipoMoneda = req.data;
      });
    }

    function firstLoad(){
      if (vm.cabecera) {
        if (vm.cabecera.agente && vm.cabecera.gestor) {
          vm.currentPage = 1; // El paginador selecciona el nro 1
          var params = _.assign({}, getParams(), {
            CurrentPage: vm.currentPage
          });
          page.setCurrentTanda(vm.currentPage);
          getComisionesPorGanar(params);
        }
      }
    }

    function firstLoadAgent(){
      vm.rol = {};
      vm.rol.gestorID = 0;
      vm.rol.agenteID = 0;
      vm.cabecera = $rootScope.cabecera;
    }

    function buscar(){
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);

      if(vm.cabecera && typeof vm.dataTicket != 'undefined'){
        if(!vm.rol.agenteID){
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Comisiones: Por Ganar", "", "", "", "g-myd-modal");
        }else{
          vm.currentPage = 1; // El paginador selecciona el nro 1
          vm.firstSearch = false;
          var params = _.assign({}, getParams(), {
            CurrentPage: vm.currentPage
          });

          page.setCurrentTanda(vm.currentPage);
          getComisionesPorGanar(params);
        }
      }
    }

    function getParams() {
      return {
        coinCode: (angular.isUndefined(vm.formPorGanar.mTipoMoneda.value) || vm.formPorGanar.mTipoMoneda.value === null) ? 0 : vm.formPorGanar.mTipoMoneda.value,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda,
        CurrentPage: vm.currentPage
      };
    }

    function pageChanged(event) {
      vm.params = {
        coinCode: (angular.isUndefined(vm.formPorGanar.mTipoMoneda.value) || vm.formPorGanar.mTipoMoneda.value === null) ? 0 : vm.formPorGanar.mTipoMoneda.value,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda
      };
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        vm.params.CurrentPage = nroTanda;
        getComisionesPorGanar(vm.params);
      }, setLstCurrentPage);
    }

    function getComisionesPorGanar(filter){
      gcwFactory.getComisionesPorGanar(filter, true).then(
        function(response){
          var comisionesPorGanar;
          if(response.data){
            vm.totalRows = response.data.totalRows;
            vm.totalPages = response.data.totalPages;
            if(response.data.list.length > 0){
              comisionesPorGanar = response.data.list;
            }else{
              comisionesPorGanar = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }
          }else{
            comisionesPorGanar = null;
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(comisionesPorGanar).setConfiguracionTanda();
          setLstCurrentPage();
      });
    }

    function setLstCurrentPage() {
      vm.comisionesPorGanar = page.getItemsDePagina();
    }

    $scope.exportar = function(){
      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/commission/generated/download');
      vm.downloadFile = {
        coinCode: (angular.isUndefined(vm.formPorGanar.mTipoMoneda.value) || vm.formPorGanar.mTipoMoneda.value === null) ? 0 : vm.formPorGanar.mTipoMoneda.value,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        userCode: vm.dataTicket.userCode
      };
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 1000);
    }

  } // end controller

  return ng.module('appGcw')
    .controller('PorGanarController', PorGanarController)
    .component('gcwPorGanar', {
      templateUrl: '/gcw/app/components/comisiones/por-ganar/por-ganar.html',
      controller: 'PorGanarController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
