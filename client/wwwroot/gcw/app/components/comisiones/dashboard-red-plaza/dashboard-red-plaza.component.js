define(['angular', 'constants'], function(ng, constants) {

  DashboardRedPlazaController.$inject = [
    '$scope'
    , '$state'
    , '$http'
    , '$window'
    , '$rootScope'
    , 'gcwFactory'
    , 'ErrorHandlerService'
    , 'mModalAlert'
    , '$location'
    , '$timeout'
    , '$q'];

  function DashboardRedPlazaController(
    $scope
    , $state
    , $http
    , $window
    , $rootScope
    , gcwFactory
    , ErrorHandlerService
    , mModalAlert
    , $location
    , $timeout
    , $q) {
    var vm = this;

    vm.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(),
      startingDay: 1,
      minMode: 'month'
    };
    vm.format = 'MMMM yyyy';
    vm.plus = '+';
    vm.minus = '-';
    vm.nroClientes = 0;
    vm.mask = constants.formats.dateFormatMask;
    vm.pattern = constants.formats.dateFormatRegex;
    vm.altInputFormats = ['M!/d!/yyyy'];
    vm.empty = true;

    $scope.$on('loadBoard', function(event){
      vm.loadManager = true;
      fnLoadData()
    })
    $scope.$on('initBoard', function(event){
      vm.loadManager = false;
      initChart();
      initBoard()
    })

    vm.$onInit = function() {

      $rootScope.redCross = true;
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.cabecera = $rootScope.cabecera;
      vm.popupDatePickerDesde = { opened: false };
      vm.openPopupDataPickerDesde = openPopupDataPickerDesde;

      vm.popupDatePickerHasta = { opened: false };
      vm.openPopupDataPickerHasta = openPopupDataPickerHasta;

      vm.mFechaHasta = new Date();
      vm.mFechaDesde = gcwFactory.lastYear(new Date(), 1);

      vm.currentPage = 1;
      vm.itemsPerPage = 10;
      vm.pageChanged = pageChanged;

      vm.loadManager = false;
      vm.empty = true;

      vm.fnClear = fnClear;
      vm.classView = 0
      vm.fnLoadDates = fnLoadDates;
      vm.updateDashboard = updateDashboard;
      vm.downloadReport = downloadReport;
      vm.fnDiffPeriods = fnDiffPeriods;
      vm.fnCheckValueAll = fnCheckValueAll;
      $timeout(function(){
        if(!gcwFactory.isVisibleNetwork()){
          fnLoadData();
          vm.empty = false;
          vm.loadManager = true;
        }
      }, 1000)

    }; // end onInit

    function fnCheckValueAll(item){
      var nv = item.totalCarPolicy + item.totalHealthPolicy + item.totalHomePolicy + item.totalLifePolicy
      var ov = item.totalCarPolicyBefore + item.totalHealthPolicyBefore + item.totalHomePolicyBefore + item.totalLifePolicyBefore
      return ov < nv;
    }

    function fnDiffPeriods(item){
      return (item.totalCarPolicy + item.totalHealthPolicy + item.totalHomePolicy + item.totalLifePolicy) - (item.totalCarPolicyBefore + item.totalHealthPolicyBefore + item.totalHomePolicyBefore + item.totalLifePolicyBefore)
    }

    if($state.current.url === '/comisiones/dashboard-red-plaza'){
      var listenManager = $rootScope.$watch('cabecera.gestor', function(newValue, oldValue) {
        if (!ng.isUndefined(newValue)) {
          vm.cabecera = $rootScope.cabecera;
        }
        if(!$rootScope.network){
          if(vm.cabecera.gestor.id === 0){
            initBoard();
          }else{
            mModalAlert.showWarning('Debe seleccionar una red', '');
            vm.empty = true;
          }
        }else{
            if (newValue === oldValue) {return;}
            vm.loadManager = true;
            fnLoadData()
        }
      }, true);
    }
    $rootScope.$on('$destroy', function() {
      listenManager();
    });

    function initBoard(){
      vm.loadManager = false;
      vm.empty = true;
      vm.labels = [];
      vm.agentDetailSection = [];
      vm.data = [];
      vm.integralitySummary = [];
      vm.totalRows = 0;
    }

    function pageChanged(event) {
      vm.currentPage = event;
      updateDashboard();
    };

    function fnLoadDates(val){
      vm.classView = val;
      if(val == 0){
        vm.dateOptions.minMode = 'month'
        vm.format = 'MMMM yyyy';
      }else{
        vm.dateOptions.minMode = 'year'
        vm.format = 'yyyy';
      }
    }

    function fnClear() {
      vm.mFechaHasta = new Date();
      vm.mFechaDesde = gcwFactory.lastYear(new Date(), 1);
      vm.mOficinas = undefined;
      vm.currentPage = 1;
      fnLoadData();
    }

    vm.getListOffices = function(wilcar) {

      if (wilcar && wilcar.length >= 2) {
        var defer = $q.defer();
        gcwFactory.getListOffices(wilcar.toUpperCase(), false).then(function(response) {
          defer.resolve(response.data);
        });

        return defer.promise;
      }
    };
    function formatPeriod(str){
      var arrTmp = str.split(' - ')
      var month = arrTmp[0].substring(0, 3)
      var year = arrTmp[1].substring(2, 4)
      var period = month+' '+year;
      return period;
    }

    function initChart(){
      vm.labels = [];
      vm.data = [];
      if(!ng.isUndefined(vm.indiceDeIntegridad)){
        var chart = vm.indiceDeIntegridad
        chart.data.labels.pop();
        ng.forEach(chart.data.datasets, function(item){
          item.data = [];
        });
        chart.update();
      }
    }

    function loadDashboard() {
      gcwFactory.dashboardoffice(vm.params)
      .then(function(res) {
        vm.dataDashboard = res.data;

        ng.forEach(res.data, function(item) {
          vm.labels.push(formatPeriod(item.period));
          vm.data.push(item.integralityAverage);
          vm.nroClientes += item.totalClients;
        });

        if(vm.data.length > 0 && $state.current.url === '/comisiones/dashboard-red-plaza'){
          vm.empty = false
          vm.ctx = document.getElementById('indiceDeIntegridad').getContext('2d');
          vm.indiceDeIntegridad = new Chart(vm.ctx, {
            type: 'line',
            data: {
              labels: vm.labels,//['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
              datasets: [
                {
                  data: vm.data,//[1.8, 1.5, 2.7, 1.9, 2.1, 1.7],
                  backgroundColor: '#dbe8f3',
                  borderColor: '#0595ff',
                  pointBackgroundColor: '#4c4c4c',
                  pointBorderColor: '#4c4c4c',
                  borderWidth: 1,
                  spanGaps: false
                }
              ]
            },
            options: {
              elements: {
                line: {
                  tension: 0
                }
              },
              responsive: true,
              legend: {
                display: false
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              },
              title: {
                display: false
              }
            }
        })

        var widthTblFixed = (80*vm.labels.length)+40+170;
        vm.tblFixed = widthTblFixed.toString()+'px';
        }
      })
      .catch(function(err) {
        ErrorHandlerService.handleError(err);
      });
    }

    function openPopupDataPickerDesde() {
      vm.popupDatePickerDesde.opened = true;
    }

    function openPopupDataPickerHasta() {
      vm.popupDatePickerHasta.opened = true;
    }

    function getPolicyIndicatorSection() {
      vm.paramsPolicy = ng.copy(vm.params);
      vm.paramsPolicy.MonthBefore = vm.classView == 0 ? 1 : 12
      gcwFactory.getPolicyIndicatorSection(vm.paramsPolicy).then(function(response) {
        vm.policyIndicatorSection = response.data;
      });
    }

    vm.checkValue = function(valueOld, valueNew) {
      if (valueOld === 0 && valueNew === 0 || (valueOld === valueNew)) {
        return '';
      } else {
        return valueOld < valueNew ? 'gCGreen2' : 'gCRed1';
      }
    };

    function updateDashboard() {
      if(!vm.mFechaDesde || !vm.mFechaHasta){
        mModalAlert.showWarning('Eliga un rango de fechas para obtener resultados', '')
      }else{
        vm.params = {
          MonthSince: vm.mFechaDesde ? vm.mFechaDesde.getMonth() + 1 : new Date().getMonth() + 1
          , YearSince: vm.mFechaDesde ? vm.mFechaDesde.getFullYear() : new Date().getFullYear()
          , MonthUntil: vm.mFechaHasta ? vm.mFechaHasta.getMonth() + 1 : new Date().getMonth() + 1
          , YearUntil: vm.mFechaHasta ? vm.mFechaHasta.getFullYear() : new Date().getFullYear()
          , OfficeId: vm.mOficinas && vm.mOficinas.id || ''
          , RowByPage: 10
          , CurrentPage: vm.currentPage
          , NetworkId: (gcwFactory.isVisibleNetwork()) ? $rootScope.network.networkId : ''
          , GestorId: vm.cabecera.gestor.id
          , OrderBy: 1
        };
        fnLoadData();
      }
    };

    function getAgentDetailSection() {
      vm.paramsPolicy = ng.copy(vm.params);
      vm.paramsPolicy.MonthBefore = vm.classView == 0 ? 1 : 12
      gcwFactory.getAgentDetailSection(vm.paramsPolicy)
      .then(function(response) {
        if(response.operationCode == 200){
          vm.agentDetailSection = response.data.list;
          vm.totalPages = response.data.totalPages
          vm.totalRows = response.data.totalRows
        }else mModalAlert.showError("Ocurrió un error al intentar cargar la información del agente", "");
      })
      .catch(function(err) {
        ErrorHandlerService.handleError(err);
      });
    }

    function getPolicyTypeSummary() {
      gcwFactory.getPolicyTypeSummary(vm.params).then(function(response) {
        vm.policyTypeSummary = response.data;
      });
    }

    function getIntegralitySummary() {
      gcwFactory.getIntegralitySummary(vm.params).then(function(response) {
        vm.integralitySummary = response.data;
      });
    }

    function fnLoadData() {
      vm.params = {
          MonthSince: vm.mFechaDesde.getMonth() + 1 //12,
        , YearSince: vm.mFechaDesde.getFullYear() //2016
        , MonthUntil: vm.mFechaHasta.getMonth() + 1 //2
        , YearUntil: vm.mFechaHasta.getFullYear() //2019
        , OfficeId: "" //1002
        , RowByPage: 10
        , CurrentPage: vm.currentPage
        , NetworkId: (gcwFactory.isVisibleNetwork()) ? $rootScope.network.networkId : ''
        , GestorId: vm.cabecera.gestor.id
        , OrderBy: 1
      };
      initChart();
      loadDashboard();
      getPolicyIndicatorSection();
      getAgentDetailSection();
      getPolicyTypeSummary();
      getIntegralitySummary();
    }

    function downloadReport(){
      var deferred = $q.defer();
      var downloadFile = {
        GestorId: vm.cabecera.gestor == null ? 0 : vm.cabecera.gestor.id
        , MonthSince: vm.params.MonthSince
        , YearSince: vm.params.YearSince
        , MonthUntil: vm.params.MonthUntil
        , YearUntil: vm.params.YearUntil
        , OfficeId: vm.mOficinas && vm.mOficinas.id || ''
        , RowByPage : 10
        , CurrentPage: 1
        , OrderBy: 1
        , MonthBefore: vm.classView == 0 ? 1 : 12
        , NetworkId: (gcwFactory.isVisibleNetwork()) ? $rootScope.network.networkId : ''
      };

      downloadFile = JSON.stringify(downloadFile);
      mpSpin.start();
      $http({
        method: "POST",
        url: constants.system.api.endpoints.gcw+"api/dashboardoffice/agentdetail/downloadd",
        headers: { 'Content-Type': 'application/json' },
        data: downloadFile,
        responseType: 'arraybuffer'
      })
      .then(function(response) {
              // success
        if (response.status == 200) {

          var defaultFileName = "AgenteDetalleDashboard.xls";
          var vtype=  response.headers(["content-type"]);
          var file = new Blob([response.data], {type: vtype});
          mpSpin.end();
          $window.saveAs(file, defaultFileName);
          deferred.resolve(defaultFileName);
        }else{
          mpSpin.end();
          mModalAlert.showError("Ocurrió un error al intentar descargar el reporte", "");
        }
      })
      .catch(function(err) {
        ErrorHandlerService.handleError(err);
      });
    }

  } // end controller

  return ng.module('appGcw')
    .controller('DashboardRedPlazaController', DashboardRedPlazaController)
    .component('gcwDashboardRedPlaza', {
      templateUrl: '/gcw/app/components/comisiones/dashboard-red-plaza/dashboard-red-plaza.html',
      controller: 'DashboardRedPlazaController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
