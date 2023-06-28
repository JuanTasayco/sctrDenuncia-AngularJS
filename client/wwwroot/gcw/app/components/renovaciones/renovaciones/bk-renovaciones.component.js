

define([
  'angular', 'constants', 'lodash', '/gcw/app/factory/gcwFactory.js'
], function(ng, constants, _) {

  RenovacionesController.$inject = ['$scope', 'gcwFactory', '$state', 'mModalAlert', '$rootScope', '$timeout', '$sce', 'MxPaginador'];

  function RenovacionesController($scope, gcwFactory, $state, mModalAlert, $rootScope, $timeout, $sce, MxPaginador) {

    var vm = this;
    var page;

    vm.$onInit = function() {

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');

      vm.formDataRenovaciones = {};
      vm.currentPage = 1; // El paginador selecciona el nro 1
      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 4;
      vm.format = 'dd/MM/yyyy'; //fechas
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);
      vm.renovaciones = null;
      vm.pageChanged = pageChanged; //paginacion
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      vm.totalPages = 0;
      vm.totalRows = 0;

      vm.formDataRenovaciones = {};
      vm.formDataRenovaciones.mTipoFecha = 1;
      vm.formDataRenovaciones.mOpcionTipoBusqueda = 1;

      vm.formDataRenovaciones.mConsultaDesde = gcwFactory.restarMes(new Date(), 1);//new Date();
      vm.fechaDesdeInit = ng.copy(vm.formDataRenovaciones.mConsultaDesde);
      vm.formDataRenovaciones.mConsultaHasta = new Date();

      vm.format = 'dd/MM/yyyy';
      vm.altInputFormats = ['M!/d!/yyyy'];

      vm.popup1 = {
        opened: false
      };

      vm.popup2 = {
        opened: false
      };

      $scope.open1 = function() {
          vm.popup1.opened = true;
      };

      $scope.open2 = function() {
          vm.popup2.opened = true;
      };

      vm.dateOptions = {
        initDate: gcwFactory.restarMes(new Date(), 6)
      };

      vm.dateOptions2 = {
        initDate: vm.formDataRenovaciones.mConsultaDesde,//new Date(),//mConsultaDesde,
        minDate: new Date()
      };

      $scope.$watch('vm.formDataRenovaciones.mConsultaDesde', function(nv){
        vm.dateOptions2.minDate = vm.formDataRenovaciones.mConsultaDesde;
        if(vm.fechaDesdeInit.getTime() !== vm.formDataRenovaciones.mConsultaDesde.getTime()) {
          vm.formDataRenovaciones.mConsultaHasta = gcwFactory.agregarMes(ng.copy(vm.formDataRenovaciones.mConsultaDesde), 6);
        }

        vm.dateOptions2.initDate = gcwFactory.agregarMes(ng.copy(vm.formDataRenovaciones.mConsultaDesde), 6);
        vm.dateOptions2.maxDate = gcwFactory.agregarMes(ng.copy(vm.formDataRenovaciones.mConsultaDesde), 6);
      });

      vm.formFilterRenovaciones = {};
      vm.formFilterRenovaciones.Sector = {};
      vm.formFilterRenovaciones.Sector.code = null;
      lstSectores();
      lstRamos(vm.formFilterRenovaciones.Sector.code);

      vm.firstLoadAgent = firstLoadAgent;
      vm.cabecera = $rootScope.cabecera;
      vm.obtenerAgente = obtenerAgente;

      $timeout(firstLoadAgent(), 1000);

    } // end onInit

    vm.buscar = buscar;
    vm.limpiar = limpiar;
    vm.firstSearch = true;
    vm.irDetalleRenovacion = irDetalleRenovacion;

    vm.open1 = open1;
    vm.open2 = open2;

    function lstSectores(){
      gcwFactory.getListSector(false).then(
        function glpPr(req){
          vm.lstSectores = req.data;
        });
    }

    function lstRamos(code){
      gcwFactory.getListRamo(code, false).then(
        function glpPq(res){
          vm.lstRamos = res.data;
        });
    }

    $scope.$watch('vm.formFilterRenovaciones.Sector', function(){
      lstRamos(vm.formFilterRenovaciones.Sector.code);
    });

    function open1() {
      vm.popup1.opened = true;
    }

    function open2() {
      vm.popup2.opened = true;
    }

    //actualiza registros segun agente o gestor seleccionado
    $rootScope.$watch('cabecera' ,function(){
      vm.cabecera = $rootScope.cabecera;
    },true);

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
            agenteID: (ng.isUndefined(vm.cabecera.agente)) ? 0 : vm.cabecera.agente.id
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
      var params;
      if(vm.cabecera && typeof vm.dataTicket != 'undefined'){
        if(!vm.rol.agenteID){
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Renovaciones");
        }else{
          vm.currentPage = 1;
          vm.firstSearch = false;
          if(vm.formDataRenovaciones.mOpcionTipoBusqueda == 1){
            params = _.assign({}, getParams(), {
              documentType: ng.isUndefined(vm.formDataRenovaciones.Cliente) ? '' : vm.formDataRenovaciones.Cliente.documentType,
              documentNumber: ng.isUndefined(vm.formDataRenovaciones.Cliente) ? "" : vm.formDataRenovaciones.Cliente.documentNumber,
              policyNumber: ''
            });
          }else{
            params = _.assign({}, getParams(), {
              documentType: '',
              documentNumber: '',
              policyNumber: (angular.isUndefined(vm.formDataRenovaciones.mNumPoliza)) ? '' : vm.formDataRenovaciones.mNumPoliza
            });
          }
          page.setCurrentTanda(params);
          getRenovaciones(params);
        }
      }
    }

    function getParams(){
      return {
        dateStart: gcwFactory.formatearFecha(vm.formDataRenovaciones.mConsultaDesde),
        dateEnd: gcwFactory.formatearFecha(vm.formDataRenovaciones.mConsultaHasta),
        typeGroupBranch: (vm.formFilterRenovaciones.Sector.code == null) ? 'T' : vm.formFilterRenovaciones.Sector.code,
        identifierId: (vm.formFilterRenovaciones.Ramo.identifierId == null) ? 0 : vm.formFilterRenovaciones.Ramo.identifierId,
        userCode: vm.dataTicket.userCode,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda,
        CurrentPage: vm.currentPage
      };
    }

    function pageChanged(event) {
      var params;
      if(vm.formDataRenovaciones.mOpcionTipoBusqueda == 1){ //busqueda por cliente
        params = _.assign({}, getParams(), {
          documentType: ng.isUndefined(vm.formDataRenovaciones.Cliente) ? '' : vm.formDataRenovaciones.Cliente.documentType,
          documentNumber: ng.isUndefined(vm.formDataRenovaciones.Cliente) ? "" : vm.formDataRenovaciones.Cliente.documentNumber,
          policyNumber: ""
        });
      }else{
        params = _.assign({}, getParams(), { //busqueda por poliza
          documentType: "",
          documentNumber: "",
          policyNumber: (angular.isUndefined(vm.formDataRenovaciones.mNumPoliza)) ? '' : vm.formDataRenovaciones.mNumPoliza
        });
      }
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        params.CurrentPage = nroTanda;
        getRenovaciones(params);
      }, setLstCurrentPage);
    }

    function getRenovaciones(filter){
      gcwFactory.getRenovaciones(filter, true).then(
        function(response){
          if(response.data){
            vm.totalRows = response.data.totalRows;
            vm.totalPages = response.data.totalPages;
            if(response.data.list.length > 0){
              vm.renovaciones = response.data.list;
            }else{
              vm.renovaciones = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }
          }else{
            vm.renovaciones = null;
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.renovaciones).setConfiguracionTanda();
          setLstCurrentPage();
        });
    }

    function setLstCurrentPage() {
      vm.renovaciones = page.getItemsDePagina();
    }

    function irDetalleRenovacion(item){
      vm.formDataRenovaciones.renovacionDetail = item;
      gcwFactory.addVariableSession("renovacionDetail", vm.formDataRenovaciones.renovacionDetail);
       $state.go('consulta.renovacionDetalle', {id:item.policyNumber}, {reload: false, inherit: false});
    }

    function limpiar(){
      if(vm.formDataRenovaciones.Cliente){
        $rootScope.$emit('cliente:borrar');
        vm.formDataRenovaciones.Cliente = undefined;
      }
      vm.formDataRenovaciones = {};
      vm.formDataRenovaciones.mConsultaDesde =  gcwFactory.restarMes(new Date(), 1);
      vm.formDataRenovaciones.mConsultaHasta = new Date();
      vm.formDataRenovaciones.mNumPoliza = '';

      vm.formDataRenovaciones.mTipoFecha = 1;
      vm.formDataRenovaciones.mOpcionTipoBusqueda = 1;

      vm.formFilterRenovaciones.Sector = {};
      vm.formFilterRenovaciones.Ramo = {};
      vm.formFilterRenovaciones.Sector.code = null;
      vm.formFilterRenovaciones.Ramo.identifierId = null;

      vm.renovaciones = null;
      vm.totalRows = 0;
      vm.totalPages = 0;
    }

    $scope.exportar = function(){
      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/renovation/download');
      vm.downloadFile = {
        documentType: ng.isUndefined(vm.formDataRenovaciones.Cliente) ? '' : vm.formDataRenovaciones.Cliente.documentType,
        documentNumber: ng.isUndefined(vm.formDataRenovaciones.Cliente) ? "" : vm.formDataRenovaciones.Cliente.documentNumber,
        policyNumber: (angular.isUndefined(vm.formDataRenovaciones.mNumPoliza)) ? '' : vm.formDataRenovaciones.mNumPoliza,
        dateStart: gcwFactory.formatearFecha(vm.formDataRenovaciones.mConsultaDesde),
        dateEnd: gcwFactory.formatearFecha(vm.formDataRenovaciones.mConsultaHasta),
        typeGroupBranch: (vm.formFilterRenovaciones.Sector.code == null) ? 'T' : vm.formFilterRenovaciones.Sector.code,
        identifierId: (vm.formFilterRenovaciones.Ramo.identifierId == null) ? 0 : vm.formFilterRenovaciones.Ramo.identifierId,
        userCode: vm.dataTicket.userCode,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID
      };
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 1000);
    }

  } // end controller

  return ng.module('appGcw')
    .controller('RenovacionesController', RenovacionesController)
    .component('gcwRenovaciones', {
      templateUrl: '/gcw/app/components/renovaciones/renovaciones/renovaciones.html',
      controller: 'RenovacionesController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
