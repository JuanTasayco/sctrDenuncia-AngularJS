

define([
  'angular', 'constants', 'gcwServicePoliza'
], function(ng, constants) {

  EstadoRecibosController.$inject = ['$scope', 'gcwFactory', '$state', '$uibModal', 'mModalAlert', 'mModalConfirm', '$rootScope', '$sce', '$timeout', 'MxPaginador','gcwServicePoliza'];

  function EstadoRecibosController($scope, gcwFactory, $state, $uibModal, mModalAlert, mModalConfirm, $rootScope, $sce, $timeout, MxPaginador, gcwServicePoliza){
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
      vm.formEdoRecibo = {};
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.formEdoRecibo.mTipoBusqueda = 1;

      vm.totalPages = 0;
      vm.totalRows = 0;
      vm.mNroPoliza = '';
      vm.mNroRecibo = '';
      lstCompanias();

      lstAnios();
      lstMeses();

      vm.formFilterEdoRecibo = {};
      vm.formFilterEdoRecibo.desdeA = {};
      vm.formFilterEdoRecibo.hastaA = {};

      var actual = new Date();
      vm.formFilterEdoRecibo.desdeA.value = "2008";
      vm.formFilterEdoRecibo.hastaA.value = actual.getFullYear();

      vm.firstLoadAgent = firstLoadAgent;
      vm.cabecera = $rootScope.cabecera;

      gcwFactory.cleanStorage();
      $timeout(firstLoadAgent(), 1000);

    } //end onInit

    vm.buscar = buscar;
    vm.limpiar = limpiar;
    vm.firstSearch = true;
    vm.pageChanged = pageChanged; //paginacion

    //actualiza registros segun agente o gestor seleccionado
    $rootScope.$watch('cabecera' ,function(){
      vm.cabecera = $rootScope.cabecera;
    },true);

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
      var mes = 0;
      for(var i = 1; i <= 12; i++){
        mes = i;
        if(mes <= 9) mes = '0'+i;
        meses.push({'description': mes.toString(), 'value': mes.toString()});
      }
      vm.lstMeses = meses;
    }

    function lstCompanias(){
      gcwServicePoliza.getListCompanias().then(
        function glpPr(req){
          vm.lstCompanias = req.Data;
        });
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
        if(!vm.rol.agenteID || vm.rol.agenteID == 0){
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Comisiones: Estado de recibos", "", "", "", "g-myd-modal");
        }else{
          var desde = Array();
          var hasta = Array();

          desde[0] = vm.formFilterEdoRecibo.desdeA.value;
          desde[1] = vm.formFilterEdoRecibo.desdeM.value;
          var dateStart = desde[1]+'/'+desde[0];

          hasta[0] = vm.formFilterEdoRecibo.hastaA.value;
          hasta[1] = vm.formFilterEdoRecibo.hastaM.value;
          var dateEnd = hasta[1]+'/'+hasta[0];

          vm.currentPage = 1; // El paginador selecciona el nro 1
          vm.firstSearch = false;
          vm.filter = {
            companyId: (ng.isUndefined(vm.formFilterEdoRecibo.mCompania)) ? '' : vm.formFilterEdoRecibo.mCompania.Value,
            policyNumber: (ng.isUndefined(vm.formEdoRecibo.mNroPoliza)) ? '' : vm.formEdoRecibo.mNroPoliza,
            receiptNumber: (ng.isUndefined(vm.formEdoRecibo.mNroRecibo)) ? '' : vm.formEdoRecibo.mNroRecibo,
            dateStart: dateStart,
            dateEnd: dateEnd,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            CurrentPage: vm.currentPage
          };

          page.setCurrentTanda(vm.currentPage);
          getEstadoRecibos(vm.filter);
        }
      }
    }

    //Paginacion
    function pageChanged(event) {

      var desde = Array();
      var hasta = Array();

      desde[0] = vm.formFilterEdoRecibo.desdeA.value;
      desde[1] = vm.formFilterEdoRecibo.desdeM.value;
      var dateStart = desde[1]+'/'+desde[0];

      hasta[0] = vm.formFilterEdoRecibo.hastaA.value;
      hasta[1] = vm.formFilterEdoRecibo.hastaM.value;
      var dateEnd = hasta[1]+'/'+hasta[0];

      vm.filter = {
        companyId: (typeof vm.formFilterEdoRecibo.mCompania == 'undefined') ? '' : vm.formFilterEdoRecibo.mCompania.Value,
        policyNumber: (typeof vm.formEdoRecibo.mNroPoliza == 'undefined') ? '' : vm.formEdoRecibo.mNroPoliza,
        receiptNumber: (typeof vm.formEdoRecibo.mNroRecibo == 'undefined') ? '' : vm.formEdoRecibo.mNroRecibo,
        dateStart: dateStart,
        dateEnd: dateEnd,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda
      };
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        vm.filter.CurrentPage = nroTanda;
        getEstadoRecibos(vm.filter);
      }, setLstCurrentPage);
    }

    function getEstadoRecibos(filter){
      gcwFactory.getEstadoRecibos(filter, true).then(
        function(response){
          //var recibos;
          if(response.data){
            vm.totalRows = response.data.totalRows;
            vm.totalPages = response.data.totalPages;
            if(response.data.list.length > 0){
              vm.recibos = response.data.list;
            }else{
              vm.recibos = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }
          }else{
            vm.recibos = null;
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.recibos).setConfiguracionTanda();
          setLstCurrentPage();
      });
    }

    function setLstCurrentPage() {
      vm.recibos = page.getItemsDePagina();
    }

    function limpiar(){
      vm.firstSearch = true;
      vm.recibos = null;
      vm.totalPages = 0;
      vm.totalRows = 0;
      vm.formEdoRecibo.mTipoBusqueda = 1;
      vm.formEdoRecibo.mNroConstancia = '';
      vm.formEdoRecibo.mNroPoliza = '';
      vm.formEdoRecibo.mNroRecibo = '';
      vm.formEdoRecibo.mCompania = {};
      vm.formEdoRecibo.mCompania.Value = "1"
      vm.formFilterEdoRecibo.desdeA = {};
      vm.formFilterEdoRecibo.desdeM = {};
      vm.formFilterEdoRecibo.desdeA.value = '2008';
      vm.formFilterEdoRecibo.desdeM.value = '01';
      vm.formFilterEdoRecibo.hastaA.value = actual.getFullYear();
      if((actual.getMonth()+1) < 10)
        vm.formFilterEdoRecibo.hastaM.value = '0'+(actual.getMonth()+1);
      else
        vm.formFilterEdoRecibo.hastaM.value = (actual.getMonth()+1);

    }

    $scope.exportar = function(){

      var desde = Array();
      var hasta = Array();

      desde[0] = vm.formFilterEdoRecibo.desdeA.value;
      desde[1] = vm.formFilterEdoRecibo.desdeM.value;
      var dateStart = desde[1]+'/'+desde[0];

      hasta[0] = vm.formFilterEdoRecibo.hastaA.value;
      hasta[1] = vm.formFilterEdoRecibo.hastaM.value;
      var dateEnd = hasta[1]+'/'+hasta[0];

      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/commission/stateReceipt/download');
      vm.downloadFile = {
        companyId: ng.isUndefined(vm.formFilterEdoRecibo.mCompania) ? 0 : vm.formFilterEdoRecibo.mCompania.Value,
        policyNumber: (vm.formEdoRecibo.mNroPoliza == null) ? 0 : vm.formEdoRecibo.mNroPoliza,
        receiptNumber: (vm.formEdoRecibo.mNroRecibo == null) ? 0 : vm.formEdoRecibo.mNroRecibo,
        dateStart: dateStart,
        dateEnd: dateEnd,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: "10",
        CurrentPage: "1"
      };
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 1000);
    }
  } // end controller

  return ng.module('appGcw')
    .controller('EstadoRecibosController', EstadoRecibosController)
    .component('gcwEstadoRecibos', {
      templateUrl: '/gcw/app/components/comisiones/estado-recibos/estado-recibos.html',
      controller: 'EstadoRecibosController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
