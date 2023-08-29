define([
  'angular',
  'constants',
  'lodash',
  'gcwServicePoliza'
], function(ng, constants, _) {

  LiquidacionSoatController.$inject = [
  '$scope',
  '$state',
  'gcwFactory',
  '$timeout',
  '$rootScope',
  'mModalAlert',
  'MxPaginador',
  '$stateParams',
  '$sce',
  '$uibModal',
  'gcwServicePoliza'
  ];

  function LiquidacionSoatController(
    $scope,
    $state,
    gcwFactory,
    $timeout,
    $rootScope,
    mModalAlert,
    MxPaginador,
    $stateParams,
    $sce,
    $uibModal,
    gcwServicePoliza
    ) {

    var vm = this;
    var page;
    vm.tandas = {};
    var tandaActual = 1;
    var tempTotal = 0;
    vm.soat = [];//almacena los items desmarcados

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

      vm.lstTipoPoliza = lstTipoPoliza;
      vm.lstUso = lstUso;
      vm.lstTipoMoneda = lstTipoMoneda;
      vm.liquidaciones = null;
      vm.liquidacionesSelected = [];
      vm.liquidacionesSelectedFound = [];
      vm.amountSelect = 0;
      vm.showFiltroPagar = false;

      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      $scope.letterNumber =  $stateParams.id;
      $scope.yearLetter =  $stateParams.year;
      $scope.letterVersion =  $stateParams.version;
      $scope.letterCia =  $stateParams.cia;
      console.log($stateParams);

      //recalcula el monto total (des)habilitando checkbox
      vm.reCalculaTotal = reCalculaTotal;
      vm.buildParamsLiq = buildParamsLiq;

      vm.formDataLiq = {};

      vm.format = 'dd/MM/yyyy';

      lstTipoPoliza();
      lstTipoMoneda();
      lstUso();

      vm.cabecera = $rootScope.cabecera;
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      $rootScope.$on('getDataPostLiquidation', function(event, data){
        vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
        vm.liquidaciones = null;
        vm.totalAmount = 0;
        vm.totalPages = 0;
        vm.totalRows = 0;
        vm.paramsLiquidacion = [];
        var filter = gcwFactory.getVariableSession("liqSession");

        var filterPostLiquidation = {
          CoinCode: filter.CoinCode,
          PolicyType: filter.PolicyType,
          dateStart: filter.dateStart,
          dateEnd: filter.dateEnd,
          agentId: vm.rol.agenteID,
          managerId: vm.rol.gestorID,
          RowByPage: vm.itemsXTanda,
          CurrentPage: 1
        }

        $timeout(function() {
          getLiquidaciones(filterPostLiquidation);
        }, 1000);
      })

      if($rootScope.loadLiquidation == 1){
        vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
        //carga liquidaciones otra vez
        vm.totalRows = 0;
        vm.tipoMoneda = {};
        vm.tipoPoliza = {};
        vm.tipoMoneda.value = 1;
        vm.tipoPoliza.code = 0;
        vm.usoPoliza.code = 0;
        vm.mFechaHasta = new Date();
        vm.mFechaDesde = gcwFactory.restarMes(new Date(), 6);
        vm.filter = {
          CoinCode: 1,
          PolicyType: 0,
          dateStart: gcwFactory.formatearFecha(vm.mFechaDesde),
          dateEnd: gcwFactory.formatearFecha(vm.mFechaHasta),
          agentId: vm.rol.agenteID,
          managerId: vm.rol.gestorID,
          RowByPage: vm.itemsXTanda,
          CurrentPage: 1
        };

        $timeout(function() {
          getLiquidaciones(vm.filter);
        }, 1000);

      }else{
        if(!ng.isUndefined($rootScope.preLocHis)){

          var filterLiqSession = gcwFactory.getVariableSession("filterLiqSession");
          vm.tandas = gcwFactory.getVariableSession("dataTandaSession");

          vm.rol = gcwFactory.getVariableSession("rolSession");

          vm.tipoPoliza = {};
          vm.tipoMoneda = {};
          vm.tipoPoliza.code = filterLiqSession.tipoPoliza;
          vm.tipoMoneda.value = filterLiqSession.tipoMoneda;
          vm.mFechaDesde = new Date(filterLiqSession.mFechaDesde);
          vm.mFechaHasta = new Date(filterLiqSession.mFechaHasta);

          //data obtenida en la busq
          var res2 = gcwFactory.getVariableSession("dataSession");
          var res3 = gcwFactory.getVariableSession("amountSession");

          //monto de liquidacion
          var amount;
          if(!ng.isUndefined(res3.value))
            amount = res3.value;
          else
            amount = res2.totalAmount;

          vm.liquidaciones = vm.tandas["1"].data;

          vm.totalAmount = amount;
          vm.totalRows = res2.totalRows;

          vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
          page.setDataActual(vm.liquidaciones).setConfiguracionTanda().setCurrentTanda(1);
              setLstCurrentPage();

          $rootScope.preLocHis = undefined;
        }else{
          vm.totalRows = 0;
          vm.tipoMoneda = {};
          vm.tipoPoliza = {};
          vm.tipoMoneda.value = 1;
          vm.tipoPoliza.code = 0;
          vm.mFechaHasta = new Date();
          vm.mFechaDesde = gcwFactory.restarMes(new Date(), 6);
        }
      }
      gcwFactory.addVariableSession('filterLiqSession', getFilterLiqSession());
    }// end onInit
    //paginacion
    vm.pageChanged = pageChanged;
    vm.buscar = buscar;
    vm.agregar = agregar;
    vm.quitar = quitar;
    vm.quitarTodo = quitarTodo;
    vm.agregarTodo = agregarTodo;
    vm.searchliquidacionesSelected = searchliquidacionesSelected;
    vm.verHistorial = verHistorial;
    vm.generarLiquidacion = generarLiquidacion;

    function amountSelectFunc() {
      vm.amountSelect = _.reduce(vm.liquidacionesSelected,function (previous, current) {
        return previous + current.netPremium;
      }, 0);
      gcwFactory.addVariableSession('amountSession', {value: vm.amountSelect});
    }

    function generarLiquidacion(){
      var exportData = vm.liquidacionesSelected.length>0 ? vm.paramsLiquidacion : null;

      if(exportData){

        $scope.message = false;
        $scope.porGenerar = false;
        $scope.error = false;

        $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          templateUrl : '/gcw/app/components/cobranzas/liquidacion-soat/modalLiquidacion.html',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {

            $scope.close = function () {
              $uibModalInstance.close();
              $rootScope.$broadcast('getDataPostLiquidation', 1);
            };

            $scope.generar = function(){

              var amount = gcwFactory.getVariableSession("amountSession");
              if(amount.value > 0) $scope.porGenerar = true;
              else $scope.porGenerar = false;

              if($scope.porGenerar){ //desencadena generacion de liq
                exportData.soat = vm.liquidacionesSelected;
                gcwFactory.generarLiquidacion(exportData, true).then(function(response){
                  $scope.message = true;
                  $scope.preSettlement = response.data.value;

                  $scope.downloadFile = {
                    preSettlement: $scope.preSettlement,
                    agentId: exportData.agentId,
                    managerId: exportData.managerId,
                    userCode: exportData.userCode
                  };
                  gcwFactory.addVariableSession('downloadFile', $scope.downloadFile);
                }, function(error){
                  console.log(error);
                });

              }else{
                $scope.error = true;
              }
            }

            $scope.exportarLiq = function(){
              $scope.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/collection/soat/download');
              $scope.downloadFile = gcwFactory.getVariableSession('downloadFile');
              $timeout(function() {
                document.getElementById('frmLiquidSoat').submit();
              }, 500);
            }
          }]
        });
      }else{
        mModalAlert.showInfo("El total de liquidación es 0. No es posible generar liquidación", "Liquidación SOAT");
      }
    }




    function searchliquidacionesSelected(codigo) {
      if(codigo){
        vm.liquidacionesSelectedFound = _.filter(vm.liquidacionesSelected,function (x) {
          return x.policyNumber.indexOf(codigo) >=0 || x.vehicle.plate.indexOf(codigo) >=0
        })
      }
      
      if(vm.polizaPlaca){
        vm.showFiltroPagar = true;
      }
      else{
        vm.showFiltroPagar = false;
      }
    }

    function agregar(item) {
      var existe = _.filter(vm.liquidacionesSelected,function (x) {
        return x.policyNumber == item.policyNumber
      })
      if(existe.length==0){
        item.checkSelected = "S",
        item.checkEnabled = "S",
        vm.liquidacionesSelected.push(item);
        amountSelectFunc();
      }
    }

    function agregarTodo() {
      for (var index = 0; index < vm.liquidaciones.length; index++) {
        if(!vm.liquidaciones[index].btndisabled){
          vm.liquidacionesSelected.push(vm.liquidaciones[index])
        }
  
      }

      vm.liquidaciones = _.map(vm.liquidaciones,function (x) {
        x.btndisabled = true;
        return x;
      }) 
    }

    function quitar(item) {
      vm.liquidacionesSelected = _.filter(vm.liquidacionesSelected,function (x) {
        return x.policyNumber !== item.policyNumber
      });

      vm.liquidacionesSelectedFound = _.filter(vm.liquidacionesSelectedFound,function (x) {
        return x.policyNumber !== item.policyNumber
      });

      vm.liquidaciones = _.map(vm.liquidaciones,function (x) {
        if(x.btndisabled && (x.policyNumber == item.policyNumber)){
          x.btndisabled = false;
        }
        return x;
      }) 
      amountSelectFunc();
    }

    function quitarTodo() {
      vm.liquidacionesSelected = [];
      vm.liquidaciones = _.map(vm.liquidaciones,function (x) {
        x.btndisabled =  false;
        return x;
      }) 
      amountSelectFunc();
    }

    
    function verHistorial() {
      gcwFactory.addVariableSession("dataTandaSession", vm.tandas);
        $state.go('consulta.liquidacionSoatHistorial', {}, {reload: false, inherit: false});
    }


    function getFilterLiqSession(){
      vm.filterLiqSession = {};
      vm.filterLiqSession = {
        tipoPoliza : vm.tipoPoliza.code,
        tipoMoneda : vm.tipoMoneda.value,
        mFechaDesde : vm.mFechaDesde,
        mFechaHasta : vm.mFechaHasta
      }
      return vm.filterLiqSession;
    }

    //lista tipo de poliza: Todos, Laser y Manual
    function lstTipoPoliza(){
      gcwFactory.getListTipoPoliza().then(function glpPr(req) {
        vm.lstTipoPoliza = req.data;
      });
    }

    function verHistorial() {
      gcwFactory.addVariableSession("dataTandaSession", vm.tandas);
        $state.go('consulta.liquidacionSoatHistorial', {}, {reload: false, inherit: false});
    }

    //lista tipo de moneda: Soles y Dolares
    function lstTipoMoneda(){
      gcwFactory.getListTipoMoneda().then(function glpPr(req){
        vm.lstTipoMoneda = req.data;
      });
    }

    function lstUso() {
      gcwFactory.getTypeUse().then(function glpPr(req){
        vm.lstUso = req.data;
      });
    }

    function buscar(){
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);

      if(vm.cabecera && !ng.isUndefined(vm.dataTicket)){
        if(!vm.rol.agenteID || vm.rol.agenteID == 0){
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cobranzas: Liquidación SOAT", "", "", "", "g-myd-modal");
        }else if(gcwFactory.evaluarFechas(vm.mFechaDesde, vm.mFechaHasta)){
          vm.currentPage = 1; // El paginador selecciona el nro 1
          vm.filter = {
            CoinCode: (ng.isUndefined(vm.tipoMoneda)) ? 1 : vm.tipoMoneda.value,
            PolicyType: (ng.isUndefined(vm.tipoPoliza)) ? 0 : vm.tipoPoliza.code,
            dateStart: gcwFactory.formatearFecha(vm.mFechaDesde),
            dateEnd: gcwFactory.formatearFecha(vm.mFechaHasta),
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            CurrentPage: vm.currentPage,
            typeUseCode: (ng.isUndefined(vm.usoPoliza)) ? 0 : vm.usoPoliza.value,
            policyOrPlate: vm.policyOrPlate
          };
          page.setCurrentTanda(vm.currentPage);
          getLiquidaciones(vm.filter);
          gcwFactory.addVariableSession('filterLiqSession', getFilterLiqSession());
        }
      }
    }

    function getLiquidaciones(filter){
      var showBtn = {};

      gcwFactory.getLiquidacionesSoat(filter, true).then(
        function(response){
          //var liquidaciones;
          if(response.data){

            vm.totalAmount = tempTotal || response.data.totalAmount;
            vm.totalPages = response.data.totalPages;
            vm.totalRows = response.data.totalRows;

            gcwFactory.addVariableSession('dataSession', response.data);
            gcwFactory.addVariableSession('rolSession', vm.rol);

            if (response.data.list.length > 0) {
              $rootScope.$emit('showButtonGenerate', 1);
              showBtn.value = "1";
              vm.liquidaciones = response.data.list;
              vm.paramsLiquidacion = buildParamsLiq(response.data.list, null);
              gcwFactory.addVariableSession('showBtn', showBtn);
              gcwFactory.addVariableSession('amountSession', {value: vm.totalAmount});
    				}else{
              showBtn.value = "-1";
              gcwFactory.addVariableSession('showBtn', showBtn);
              $rootScope.$emit('showButtonGenerate', -1);
    					vm.liquidaciones = [];
              vm.totalAmount = 0;
              vm.totalPages = 0;
              vm.totalRows = 0;
              vm.paramsLiquidacion = [];
    				}
    			}else{
            showBtn.value = "-1";
            gcwFactory.addVariableSession('showBtn', showBtn);
            $rootScope.$emit('showButtonGenerate', -1);
            vm.liquidaciones = null;
            vm.totalAmount = 0;
            vm.totalPages = 0;
            vm.totalRows = 0;
            vm.paramsLiquidacion = [];
          }
          vm.tandas[tandaActual] = {data: vm.liquidaciones, paramsLiquidacion: vm.paramsLiquidacion};
          page.setNroTotalRegistros(vm.totalRows).setDataActual(vm.liquidaciones).setConfiguracionTanda();
          setLstCurrentPage();
          saveInSSLiqudacion();

        });
    }

    function saveInSSLiqudacion() {
      gcwFactory.addVariableSession('liqSession', getParamsLiquidacion(vm.tandas));
    }

    function setLstCurrentPage() {
      vm.liquidaciones = page.getItemsDePagina();
      vm.paramsLiquidacion = vm.tandas[tandaActual].paramsLiquidacion;
      if(vm.liquidacionesSelected.length>0){
        vm.liquidaciones = _.map(vm.liquidaciones,function (x) {
          for (var index = 0; index < vm.liquidacionesSelected.length; index++) {
            if(x.policyNumber == vm.liquidacionesSelected[index].policyNumber){
              x.btndisabled = true;
             break;
            }
            else{
              x.btndisabled = false;
            }
          }
          return x;
        })
      }
      else{
        vm.liquidaciones = _.map(vm.liquidaciones,function (x) {
          x.btndisabled = false;
          return x;
        })
      }
    }

    function pageChanged(event) {
      vm.filter = {
    		CoinCode: (typeof vm.tipoMoneda == 'undefined') ? 1 : vm.tipoMoneda.value,
  			PolicyType: (typeof vm.tipoPoliza == 'undefined') ? 0 : vm.tipoPoliza.code,//"0", //code: 0 todos 1 laser 2 manual
        dateStart: gcwFactory.formatearFecha(vm.mFechaDesde),
        dateEnd: gcwFactory.formatearFecha(vm.mFechaHasta),
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
    		RowByPage: vm.itemsXTanda
      };

      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        tandaActual = nroTanda;
        if (vm.tandas[nroTanda]) {
          page.setDataActual(vm.tandas[nroTanda].data).setConfiguracionTanda();
          setLstCurrentPage();
        } else {
          vm.tandas[nroTanda] = {};
          vm.filter.CurrentPage = nroTanda;
          getLiquidaciones(vm.filter);
        }
      }, setLstCurrentPage);
    }

    function polizaSoatN(item, value){
      //crea un array con los datos de los items desmarcados
      var poliza = {
        policyNumber: item.policyNumber,
        receiptNumber: item.receiptNumber,
        checkSelected: 'N'
      }
      if(value == 'N')
        vm.soat.push(poliza);
      else
        _.remove(vm.soat, {receiptNumber: item.receiptNumber});
    }

    function reCalculaTotal(item){
    	if(item.checkSelected == 'N' && vm.totalAmount!=0){
    		vm.totalAmount = vm.totalAmount - item.netPremium;
        polizaSoatN(item, 'N');
      }else{
    		vm.totalAmount = vm.totalAmount + item.netPremium;
        polizaSoatN(item, 'S');
      }

      tempTotal = vm.totalAmount;
      // paramsLiquidacion = gcwFactory.getVariableSession("liqSession");
      vm.paramsLiquidacion = buildParamsLiq(vm.tandas[tandaActual].paramsLiquidacion, item);
      if(!ng.isUndefined($rootScope.preLocHis)){
        vm.paramsLiquidacion = buildParamsLiq(vm.liquidaciones, item);
      }
      gcwFactory.addVariableSession('amountSession', {value: vm.totalAmount});
      saveInSSLiqudacion();
    }

    function buildParamsLiq(data, item){
      var paramsLiquidacion = {};
      paramsLiquidacion = {
        CoinCode: vm.tipoMoneda.value,
        PolicyType: vm.tipoPoliza.code,
        dateStart: gcwFactory.formatearFecha(vm.mFechaDesde),
        dateEnd: gcwFactory.formatearFecha(vm.mFechaHasta),
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        userCode: vm.dataTicket.userCode,
        soat: vm.soat
      }
      gcwFactory.addVariableSession('unCheckedSS', paramsLiquidacion);
      return paramsLiquidacion;
    }

    function getParamsLiquidacion(obj) {
      var keys = _.keys(obj);
      var arrParamsLiquidacion = [];
      _.each(keys, function epl(item) {
        if(ng.isUndefined(obj[item].paramsLiquidacion))
          arrParamsLiquidacion = [].concat([], arrParamsLiquidacion, []);
        else
          arrParamsLiquidacion = [].concat([], arrParamsLiquidacion, obj[item].paramsLiquidacion.soat);
      });
      return ng.extend({}, obj[keys[0]].paramsLiquidacion, {soat: arrParamsLiquidacion});
    }

    $scope.exportar = function(){
      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/collection/soat/download');
      //vm.downloadFile = gcwFactory.getVariableSession('downloadFile');
      vm.downloadFile = {
        preSettlement: "",
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        userCode: vm.dataTicket.userCode
      };
      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 500);
    }
  } // end controller

  return ng.module('appGcw')
    .controller('LiquidacionSoatController', LiquidacionSoatController)
    .component('gcwLiquidacionSoat', {
      templateUrl: '/gcw/app/components/cobranzas/liquidacion-soat/liquidacion-soat.html',
      controller: 'LiquidacionSoatController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
