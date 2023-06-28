define([
  'angular'
  , 'constants'], function(
  ng
  , constants) {

  ConsultaRedPlazaController.$inject = [
    '$scope'
    , '$state'
    , '$rootScope'
    , 'gaService'
    , '$uibModal'
    , '$window'
    , 'ErrorHandlerService'
    , 'mModalAlert'
    , '$location'
    , 'gcwFactory'
    , '$timeout'];

  function ConsultaRedPlazaController(
    $scope
    , $state
    , $rootScope
    , gaService
    , $uibModal
    , $window
    , ErrorHandlerService
    , mModalAlert
    , $location
    , gcwFactory
    , $timeout
  ) {
    var vm = this;

    vm.$onInit = function() {

      vm.isVisibleNetwork = gcwFactory.isVisibleNetwork();
      vm.isDirector = gcwFactory.isDirector();

      $rootScope.redCross = true;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      if(!$rootScope.netWorkVisitDetails){
        $rootScope.$broadcast('networkInit');
        $rootScope.$broadcast('msgSinResultados');
      }

      $rootScope.step1 = false;
      $rootScope.step2 = false;
      vm.roleUser = gcwFactory.getRoleUser();

      vm.profile = JSON.parse($window.localStorage.getItem('profile'));

      vm.popupDatePickerDesde = { opened: false };
      vm.openPopupDataPickerDesde = openPopupDataPickerDesde;

      vm.popupDatePickerHasta = { opened: false };
      vm.openPopupDataPickerHasta = openPopupDataPickerHasta;

      vm.searchNetWorkAgents = searchNetWorkAgents;

      vm.verDetalle = verDetalle;
      vm.fnModalClientesTotales = fnModalClientesTotales;
      vm.fnModalClientesIntegrales = fnModalClientesIntegrales;

      vm.fnSetItemsPerPage = _fnSetItemsPerPage;
      vm.totalRows = !$rootScope.netWorkVisitDetails ? 0 : gcwFactory.getVariableSession('dataSession').length;
      vm.itemsPerPage = 5;
      vm.currentPage = 1;

      $rootScope.isVisibleNetwork = vm.isVisibleNetwork;
      $rootScope.isDirector = vm.isDirector;
      vm.frmFilterNetwork = !$rootScope.netWorkVisitDetails ? {
        firstLoad: true
        , loadAgent: false
        , infoAgent: !vm.isVisibleNetwork ? gcwFactory.getVariableSession('sessionAgente') : {}
        , mFechaHasta: new Date()
        , mFechaDesde: gcwFactory.lastYear(new Date(), 1)
      } : gcwFactory.getVariableSession('frmSessionNetwork');

      if(!vm.isVisibleNetwork && !$rootScope.isDirector){
        vm.cabecera = {
          agente: {
            id: vm.profile.codagent
          }
        }
        searchNetWorkAgents();
      }else{
        vm.cabecera = $rootScope.cabecera || gcwFactory.getVariableSession('cabeceraSession');
        if($rootScope.netWorkVisitDetails && $rootScope.isDirector){
          searchNetWorkAgents();
        }
      }

      vm.agentes = gcwFactory.getVariableSession('dataSession').length > 0 ?
        gcwFactory.getVariableSession('dataSession') : [];
      vm.month = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
        'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      _calendarInicio();
      _calendarFin();

      $rootScope.$on('searchNetWorkAgents', function(event){
        vm.frmFilterNetwork.loadAgent = false;
        vm.frmFilterNetwork.firstLoad = true;
        searchNetWorkAgents();
      });

    }; // end onInit

    function getFilter(){
      var filter = !vm.isVisibleNetwork ? gcwFactory.getVariableSession('sessionAgente') : gcwFactory.getVariableSession('rolSessionA');
      if (!ng.isUndefined(filter)) {
         return {
          idFullName: filter.idFullName
          , id: filter.id
          , office: filter.officeName
          , contractDate: filter.contractDate
          , name: filter.fullName
        };
      }
    }

    vm.searchNetWorkAgents = searchNetWorkAgents;
    $timeout(function(){
      if(vm.isVisibleNetwork){
      var listenAgent = $rootScope.$watch('cabecera.agente', function(newValue, oldValue) {
        var location = $location.url();
        if(location === '/comisiones/consulta-red-plaza'){
          if (!ng.isUndefined(newValue)) {
            vm.cabecera = $rootScope.cabecera;
          }
          if(!$rootScope.network || $rootScope.network.networkId === null){
            if(!vm.cabecera.agente){
              initBoard();
            }else{
              mModalAlert.showWarning('Debe seleccionar una red', '');
              $rootScope.cabecera.agente = undefined;
            }
          }else{
            if(!vm.cabecera.agente){
              initBoard();
            }else{
              if (newValue === oldValue) {return;}
              vm.frmFilterNetwork.infoAgent = getFilter();
              vm.frmFilterNetwork.loadAgent = true;
              vm.frmFilterNetwork.firstLoad = false;
              if(!vm.isVisibleNetwork && !vm.frmFilterNetwork.firstLoad){
                initBoard();
              }
              searchNetWorkAgents();
            }
          }
        }
      }, true);
      }
    }, 1000);
    $rootScope.$on('$destroy', function() {
      listenAgent();
    });

    function _fnSetItemsPerPage(num) {
      vm.itemsPerPage = num;
      vm.currentPage = 1; // reset to first page
      vm.class = 'gCGreen2 fwBold';
      switch (num) {
        case 5:
          vm.class5 = vm.class;
          vm.class25 = '';
          vm.class50 = '';
          break;
        case 25:
          vm.class25 = vm.class;
          vm.class5 = '';
          vm.class50 = '';
          break;
        case 50:
          vm.class50 = vm.class;
          vm.class25 = '';
          vm.class5 = '';
          break;
        default:
          vm.class5 = vm.class;
          vm.class25 = '';
          vm.class50 = '';
      }
      searchNetWorkAgents();
    }

    function initBoard(){
      $rootScope.step1 = false;
      $rootScope.step2 = false;
      vm.frmFilterNetwork.loadAgent = $rootScope.loadAgent;
      vm.frmFilterNetwork.firstLoad = $rootScope.firstLoad;
      vm.totalRows = 0;
    }
    vm.fnClear = _fnClear;
    function _fnClear() {
      vm.frmFilterNetwork.loadAgent = true;
      vm.frmFilterNetwork.mFechaHasta = new Date();
      vm.frmFilterNetwork.mFechaDesde = gcwFactory.lastYear(new Date(), 1);
      vm.currentPage = 1;
      searchNetWorkAgents();
    }

    function getTime(frmDate){
      return !$rootScope.netWorkVisitDetails ? frmDate.getTime() : new Date(frmDate).getTime()
    }

    function getDate(frmDate){
      return !$rootScope.netWorkVisitDetails ? frmDate : new Date(frmDate)
    }

    function fnDiffDates() {
      return getTime(vm.frmFilterNetwork.mFechaDesde) <= getTime(vm.frmFilterNetwork.mFechaHasta);
    }

    vm.pageChanged = function(event) {
      vm.currentPage = event;
      searchNetWorkAgents();
    };
    function setParams(){
      if($rootScope.isDirector){
        var session = gcwFactory.getVariableSession('rolSessionA')
        var agent = session.id;
      }else if(!vm.isVisibleNetwork){
        var agent = vm.profile.codagent
      }else{
        var agent = vm.cabecera.agente.id
      }
      return {
        MonthSince: getDate(vm.frmFilterNetwork.mFechaDesde).getMonth() + 1
        , YearSince: getDate(vm.frmFilterNetwork.mFechaDesde).getFullYear()
        , MonthUntil: getDate(vm.frmFilterNetwork.mFechaHasta).getMonth() + 1
        , YearUntil: getDate(vm.frmFilterNetwork.mFechaHasta).getFullYear()
        , AgentId: agent
        , RowByPage: vm.itemsPerPage
        , CurrentPage: vm.currentPage
        , OrderBy: 1
        , NetworkId: (!vm.isVisibleNetwork) ? '' : $rootScope.network.networkId
      };
    }

    function searchNetWorkAgents() {
      var diffDates = fnDiffDates();
      if (diffDates) {
      vm.frmFilterNetwork.firstLoad = false;
      vm.frmFilterNetwork.loadAgent = true;
      vm.params = setParams();
      if(vm.isDirector){
        vm.frmFilterNetwork = {
          firstLoad: false
          , loadAgent: true
          , infoAgent: vm.cabecera.agente
          , mFechaHasta: new Date()
          , mFechaDesde: gcwFactory.lastYear(new Date(), 1)
        };
      }
      gcwFactory.addVariableSession('frmSessionNetwork', vm.frmFilterNetwork);
      gcwFactory.getListNetWorkAgents(vm.params, true)
      .then(function(response) {
        var dataList = response.data.list;
        vm.totalRows = response.data.totalRows;
        vm.totalPages = response.data.totalPages;
        if (dataList.length > 0) {
          vm.agentes = [];
          var i = 1;
          ng.forEach(dataList, function(item) {
            var agent = {
              id: i++
              , nClientes: item.totalClients
              , fecha: vm.month[(item.monthProcess) - 1] + ' ' + item.yearProcess
              , mes: item.monthProcess
              , anio: item.yearProcess
              , nJuridicos: item.totalCompanyClients
              , nNaturales: item.totalNaturalClients
              , nClientesIntegrales: item.totalNaturaInte
              , nAutos: item.totalCar
              , nSalud: item.totalHealth
              , nHogar: item.totalHome
              , nVida: item.totalLive
              , ratioActual: item.percentInte
              , isUp: item.percentInte > item.percentIntLastYear
              , ratioAnterior: item.percentIntLastYear
            };
            vm.agentes.push(agent);
          });
          gcwFactory.addVariableSession('dataSession', vm.agentes);
        }
      })
      .catch(function(err) {
        ErrorHandlerService.handleError(err);
      });
      }else{
        mModalAlert.showWarning('La fecha final no debe ser menor a la fecha incial', '');
      }
    }

    function openPopupDataPickerDesde() {
      vm.popupDatePickerDesde.opened = true;
    }

    function openPopupDataPickerHasta() {
      vm.popupDatePickerHasta.opened = true;
    }

    function verDetalle(item) {
      var agenteId = (!vm.isVisibleNetwork) ? vm.profile.codagent : vm.cabecera.agente.id;
      $state.go('consulta.consultaRedplazaDetalle', {'month': item.mes, 'year': item.anio, 'id': agenteId});
    }

    function fnModalClientesTotales() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl: '/gcw/app/components/comisiones/consulta-red-plaza/popup/popupClientesTotales.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function($scope, $uibModalInstance) {
            /* # closeModal #*/
            $scope.closeModal = function() {
              $uibModalInstance.close();
            };
          }]
      });
    }

    function fnModalClientesIntegrales() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl: '/gcw/app/components/comisiones/consulta-red-plaza/popup/popupClientesIntegrales.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function($scope, $uibModalInstance) {
            /* # closeModal #*/
            $scope.closeModal = function() {
              $uibModalInstance.close();
            };
          }]
      });
    }

    function _calendarInicio() {
      $scope.todayInicio = function() {
        vm.frmFilterNetwork.mFechaDesde = !$rootScope.netWorkVisitDetails ?
          gcwFactory.lastYear(new Date(), 1) : new Date(vm.frmFilterNetwork.mFechaDesde);
      };
      $scope.todayInicio();

      $scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: false
      };

      $scope.dateOptionsInicio = {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(),
        startingDay: 1,
        minMode: 'month'
      };

      $scope.toggleMinInicio = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptionsInicio.minDate = $scope.inlineOptions.minDate;
      };
      $scope.toggleMinInicio();

      $scope.openInicio = function() {
        $scope.popupInicio.opened = true;
      };

      $scope.format = 'mm/yyyy';// "MMMM yyyy";
      $scope.mask = constants.formats.dateFormatMask;
      $scope.pattern = constants.formats.dateFormatRegex;

      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popupInicio = {
        opened: false
      };
    }

    function _calendarFin() {
      $scope.todayFin = function() {
        vm.frmFilterNetwork.mFechaHasta = !$rootScope.netWorkVisitDetails ?
          new Date() : new Date(vm.frmFilterNetwork.mFechaHasta);
      };
      $scope.todayFin();

      $scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: false
      };

      $scope.dateOptionsFin = {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: $scope.dateOptionsInicio.minDate,
        startingDay: 1,
        minMode: 'month'
      };

      $scope.toggleMinFin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptionsFin.minDate = $scope.inlineOptions.minDate;
      };
      $scope.toggleMinFin();

      $scope.openFin = function() {
        $scope.popupFin.opened = true;
      };

      $scope.format = 'MMMM yyyy';
      $scope.mask = constants.formats.dateFormatMask;
      $scope.pattern = constants.formats.dateFormatRegex;

      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popupFin = {
        opened: false
      };

    }

  } // end controller

  return ng.module('appGcw')
    .controller('ConsultaRedPlazaController', ConsultaRedPlazaController)
    .component('gcwConsultaRedPlaza', {
      templateUrl: '/gcw/app/components/comisiones/consulta-red-plaza/consulta-red-plaza.html',
      controller: 'ConsultaRedPlazaController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
