define([
    'angular',
    'coreConstants',
    'massAmdUtils'
  ], function(angular, coreConstants, massAmdUtils) {
    var appAutos = angular.module(coreConstants.ngMainModule);
    appAutos.controller('massAdmTrayController', 
    ['$scope', '$state', 'MassTrayFactory',
    function($scope, $state, MassTrayFactory) {
      var vm = this;
      var title = 'Programas';
      var thisDay = new Date();
      var mainArgs;

      vm.search = search;
      vm.searchByStatus = searchByStatus;
      vm.pageChanged = pageChanged;
      vm.showDetail = showDetail;
      vm.clearFilters = clearFilters;
      vm.changeFirstDate = changeFirstDate;

      vm.pagination = {
        maxSize: 5,
        sizePerPage: 5,
        currentPage: 1,
        totalRecords: 0
      };

      vm.paramsSearch = {
        estado: '0',
        nomDni: null,
        fechaDesde: null,
        fechaHasta: null,
        pagina: 1
      };

      vm.$onInit = onInit;
      $scope.title = title;

      function onInit() {
        $scope.dateMax = thisDay;
        $scope.format = 'dd/MM/yyyy';
        
        search(vm.paramsSearch, true)
      }

      function search(arg, notClean) {
        vm.noResultInfo = false;
        arg.pagina = 1;
        arg.tamanioPagina = vm.pagination.sizePerPage;
        
        // if (arg.notClean)
        //     notClean = arg.notClean;

        // if(!notClean)
        //     cleanPagination();

        mainArgs = arg;

        searchMass(arg);
      }

      function searchMass(params) {
        var arg = JSON.parse(JSON.stringify(params));

        MassTrayFactory.SearchMass(arg, true)
        .then(function(response) {
          vm.massResults = response.listaResultados;
          vm.statesResults = response.listaEstados;

          refMenuActive(arg.estado);

          vm.pagination.totalRecords = response.totalRegistros;
          vm.noResult = vm.pagination.totalRecords == 0 || !vm.massResults ? true : false;
        });
      }

      function pageChanged() {
        vm.noResultInfo = false;
        mainArgs.pagina = vm.pagination.currentPage;
        mainArgs.tamanioPagina = vm.pagination.sizePerPage;
        searchMass(mainArgs);
      }

      function cleanPagination() {
        vm.pagination = {
            maxSize: 5,
            sizePerPage: 5,
            currentPage: 1,
            totalRecords: 0
        }
      }

      function refMenuActive(code) {
        angular.forEach(vm.statesResults, function (value, key) {
          if (vm.statesResults[key].codigo === code) {
            Object.assign(vm.statesResults[key], { actived: true });
          }
          else {
            Object.assign(vm.statesResults[key], { actived: false });
          }
        });
      }

      function clearFilters() {
        vm.paramsSearch.nomDni = null;
        vm.paramsSearch.fechaDesde = null;
        vm.paramsSearch.fechaHasta = null;
      }

      function searchByStatus(code) {
        vm.paramsSearch.estado = code;
        vm.paramsSearch.tamanioPagina = vm.pagination.sizePerPage;
        vm.paramsSearch.pagina = 1;
        vm.pagination.currentPage = 1;

        searchMass(vm.paramsSearch, true);
      };

      function showDetail (mass) {
        $state.go('massAdmMassDetail', { misaid: mass.idMisa } );
      }

      function changeFirstDate(date) {
        if(date && vm.paramsSearch.fechaHasta && vm.paramsSearch.fechaHasta < date) {
          vm.paramsSearch.fechaHasta = null;
        }
      }

      $scope.copyToClipboard = function (name) {
        massAmdUtils.copyToClipboard(name);
      }
    }]
    )
    appAutos.service("MassItemService", ['$q', 'MassMaintenanceFactory', function($q, MassMaintenanceFactory) {
      var currentResponseView;

      function getMassById(id, showSpin) {
        var deferred = $q.defer();
        MassMaintenanceFactory.GetMass(id, showSpin).then(function(res) {
          currentResponseView = res;
          deferred.resolve(res);
        }, function(e) { 
          deferred.reject(e)
        });
        return deferred.promise;
      }

      function getCurrentMassItem(){
        return currentResponseView;
      }

      this.getMassById = getMassById;
      this.getCurrentMassItem = getCurrentMassItem;
    }])
  });