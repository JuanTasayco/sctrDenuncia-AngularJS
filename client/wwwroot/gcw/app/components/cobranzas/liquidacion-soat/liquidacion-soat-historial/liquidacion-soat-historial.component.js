define([
  'angular',
  '/gcw/app/factory/gcwFactory.js'
], function(ng) {

  LiquidacionSoatHistorialController.$inject = ['$scope', '$rootScope', 'gcwFactory', '$uibModal', 'mModalAlert', 'mModalConfirm', '$sce', '$timeout', '$state', '$location', 'MxPaginador'];

  function LiquidacionSoatHistorialController($scope, $rootScope, gcwFactory, $uibModal, mModalAlert, mModalConfirm, $sce, $timeout, $state, $location, MxPaginador){

    var vm = this;
    var page;
    vm.$onInit = function() {

      $rootScope.$emit('showButtonGenerate', 1);

      $rootScope.preLocHis = $state.current.url;

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');

			vm.formDataLiqDetail = {};
			vm.formDataLiqDetail.Preliquidacion = "Historial de preliquidaciones";
			vm.firstLoad = firstLoad;
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 10;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);

      //anular Preliquidacion
      vm.anularPre = anularPre;

     	//paginacion
			vm.pageChanged = pageChanged;

      vm.firstLoadAgent = firstLoadAgent;
      vm.cabecera = $rootScope.cabecera;

      //si no se anula nada switchHistorial queda en 0
      $rootScope.loadLiquidation = 0;

      $timeout(firstLoad(), 1500);
    }

    //OIM-2169 Anular liquidación seleccionada en el historial
    function anularPre(preSettlement){
      mModalConfirm.confirmInfo('¿Está seguro que quiere anular la preliquidación?','ANULAR PRELIQUIDACIÓN','ANULAR').then(function(){
          gcwFactory.anularPreliquidacion(preSettlement, true).then(function(response){
              if(response.data){
                if(response.data.code == 1){

                  var params = {
                    userCode: vm.dataTicket.userCode,
                    agentId: vm.rol.agenteID,
                    managerId: vm.rol.gestorID,
                    RowByPage: "10",
                    CurrentPage: "1"
                  };
                  $rootScope.loadLiquidation = 1;
                  getPreliquidaciones(params);
                }
              }
            });
        });
    }

    //actualiza registros segun agente o gestor seleccionado
    $rootScope.$watch('cabecera' ,function(){
      vm.cabecera = $rootScope.cabecera;
      $timeout(firstLoad(), 1500);
    },true);

  	function firstLoad(){
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
  		vm.cabecera = $rootScope.cabecera;
      vm.currentPage = 1;
  		if(vm.cabecera){
  			if(!ng.isUndefined(vm.rol.agenteID) && !ng.isUndefined(vm.rol.gestorID)){

  				var params = {
            userCode: vm.dataTicket.userCode,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
						RowByPage: "10",
						CurrentPage: vm.currentPage
  				};

  				getPreliquidaciones(params);

  			}
  		}
  	}

    function firstLoadAgent(){
      vm.rol = {};
      vm.rol.gestorID = 0;
      vm.rol.agenteID = 0;
      vm.cabecera = $rootScope.cabecera;
    }

    //OIM-2170 Integrar listado de preliquidaciones
  	function getPreliquidaciones(params){
  		gcwFactory.preLiquidacionesSoat(params, true).then(function(response){
  			if(response.data){
  				vm.totalPages = response.data.totalPages;
  				vm.totalRows = response.data.totalRows;

  				if(response.data.list.length > 0){
  					vm.preliquidaciones = response.data.list;
  				}else{
  					vm.preliquidaciones = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
  				}
  			}else{
  				vm.preliquidaciones = null;
            vm.totalRows = 0;
            vm.totalPages = 0;
  			}
        page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.preliquidaciones).setConfiguracionTanda();
        setLstCurrentPage();
  		});
  	}

    //Paginacion
    function pageChanged(event) {
     // vm.rol = obtenerAgente();
      vm.paramsPreliquidaciones = {
        userCode: vm.dataTicket.userCode,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
    		RowByPage: "10"
      };

      //getPreliquidaciones(vm.paramsPreliquidaciones);
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        vm.paramsPreliquidaciones.CurrentPage = nroTanda;
        getPreliquidaciones(vm.paramsPreliquidaciones);
      }, setLstCurrentPage);
    }

    function setLstCurrentPage() {
      vm.preliquidaciones = page.getItemsDePagina();
    }

    $scope.exportar = function(){
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/collection/soat/history/download');
        vm.downloadFile = {
          agentId: vm.rol.agenteID,
          managerId: vm.rol.gestorID,
          userCode: vm.dataTicket.userCode
        };
        $timeout(function() {
          document.getElementById('frmExport').submit();
        }, 500);
    }

    $scope.downloadImpresion = function(item,type){
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
      debugger;
      vm.exportURLDetalle = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/collection/soat/download?extensionFile='+type);
        vm.downloadFile2 = {
          preSettlement: item.preSettlement,
          agentId: vm.rol.agenteID,
          managerId: vm.rol.gestorID,
          userCode: vm.dataTicket.userCode
        };
        $timeout(function() {
          document.getElementById('frmExportDetalle').submit();
        }, 500);
    }

  } // end controller

  return ng.module('appGcw')
    .controller('LiquidacionSoatHistorialController', LiquidacionSoatHistorialController)
    .component('gcwLiquidacionSoatHistorial', {
      templateUrl:
      '/gcw/app/components/cobranzas/liquidacion-soat/liquidacion-soat-historial/liquidacion-soat-historial.html',
      controller: 'LiquidacionSoatHistorialController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
