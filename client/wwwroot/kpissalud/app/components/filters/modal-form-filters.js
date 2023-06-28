(function ($root, name, deps, action) {
  $root.define(name, deps, action)
})(window, 'modalFormFilters', ['angular'], function (angular) {
  angular.module('kpissalud.app').
    controller('modalFormFiltersController', ['$scope', '$state', '$q', 'proxyKpiFiltroApi', 'mpSpin', function ($scope, $state, $q, proxyKpiFiltroApi, mpSpin) {
      var vm = this;
      vm.$onInit = onInit;

      function setInitialData() {
        vm.maxDate = new Date();
        vm.textShowFilter = 'Ver más filtros';
        vm.isSiniestro = vm.dashboard == 'SNSTR';
        vm.isCgw = vm.dashboard == 'CGW';
        vm.isSoat = vm.product.cdgo == 'O';
        vm.isAsistenciaMedica = (vm.product.cdgo == 'S' && vm.product.cod_cia == '1');
        vm.isAccidentesPersonales = vm.product.cdgo == 'A';
        vm.isEps = (vm.product.cdgo == 'S' && vm.product.cod_cia == '3');

        vm.filters = vm.data.filters;
        vm.todosIndicadores = vm.data.todosIndicadores;
        vm.indicators = vm.data.indicators;

        vm.filtersCopy = angular.copy(vm.filters);
        vm.todosIndicadoresCopy = angular.copy(vm.todosIndicadores);
        vm.indicatorsCopy = angular.copy(vm.indicators);
      }

      function showSoatIndicators() {
        angular.forEach(vm.indicators, function (itm) {
          vm.selectIndicator();
          if (itm.cdgo == 'SNSTR_SOAT_GP' || itm.cdgo == 'SNSTR_SOAT_GC' || itm.cdgo == 'SNSTR_SOAT_GTA' ||
            itm.cdgo == 'SNSTR_SOAT_GUGD' || itm.cdgo == 'SNSTR_SOAT_GUGG') {
            itm.show = vm.isSiniestro && vm.isSoat;
          }
        });

        angular.forEach(vm.indicatorsCopy, function (itm) {
          vm.selectIndicator();
          if (itm.cdgo == 'SNSTR_SOAT_GP' || itm.cdgo == 'SNSTR_SOAT_GC' || itm.cdgo == 'SNSTR_SOAT_GTA' ||
            itm.cdgo == 'SNSTR_SOAT_GUGD' || itm.cdgo == 'SNSTR_SOAT_GUGG') {
            itm.show = vm.isSiniestro && vm.isSoat;
          }
          if(itm.cdgo == 'SNSTR_CPM'){
            itm.show = vm.isSiniestro && (vm.isAsistenciaMedica || vm.isEps);
          }
        });
      }

      function loadFiltersData() {
        var promiseList = [];
        mpSpin.start();
        promiseList.push(loadDataRamo());
        promiseList.push(loadDataProducto());
        promiseList.push(loadDepartamento());
        promiseList.push(loadProvincia());

        return $q.all(promiseList).then(function (result) {
          console.log(result);
          mpSpin.end();
        });
      }

      function showOptionalFilters() {
        vm.isShowOptionalFilters = !vm.isShowOptionalFilters;
        vm.textShowFilter = vm.isShowOptionalFilters ? 'Ver menos filtros' : 'Ver más filtros';
      }

      function selectAllIndicator() {
        var toggleStatus = vm.todosIndicadoresCopy;
        angular.forEach(vm.indicatorsCopy, function (itm) { itm.selected = toggleStatus; });
      }

      function selectIndicator() {
        vm.todosIndicadoresCopy = vm.indicatorsCopy.every(function (itm) { return !itm.show || itm.selected; })
      }

      function applyFilters() {
        vm.indicators = vm.indicatorsCopy;
        vm.filters = vm.filtersCopy;
        vm.todosIndicadores = vm.todosIndicadoresCopy;

        vm.filters.indicadores = [];
        angular.forEach(vm.indicators, function (itm) {
          if (itm.show) {
            var indicador = { 'code': itm.cdgo, 'selected': itm.selected };
            vm.filters.indicadores.push(indicador);
          }
        });

        vm.filterApply({ $filters: vm.filters, $indicators: vm.indicators, $todosIndicadores: vm.todosIndicadores });
      }

      function clear() {
        vm.filtersCopy = { range_date: [null, null] };
        vm.todosIndicadoresCopy = true;
        vm.selectAllIndicator();
      }

      function close() {
        vm.close();
      }

      function isValidateForm() {
        var validTypeDate = vm.filtersCopy.ad_tpfcha != null && vm.filtersCopy.ad_tpfcha.cdgo != null;
        var validRangeDate = vm.filtersCopy.range_date[0] !== null && vm.filtersCopy.range_date[1] !== null;
        var validSelectedIndicators = hasValidSelectedIndicator();
        //var validRamo = !vm.isAsistenciaMedica || (vm.filtersCopy.ac_crmo != null && vm.filtersCopy.ac_crmo.cdgo != null);
        var validRamo = true;
        return validTypeDate && validRangeDate && validSelectedIndicators && validRamo;
      }

      function hasValidSelectedIndicator() {
        var selectedIndicator = 0;
        angular.forEach(vm.indicatorsCopy, function (itm) {
          if (itm.show && itm.selected) selectedIndicator++;
        });
        return selectedIndicator > 0;
      }

      function loadDataRamo() {
        var deferred = $q.defer();
        if (vm.filtersCopy.ac_crmo != null) {
          if (vm.filtersCopy.ac_crmo.cdgo == 116) {
            var ac_ndcntrto = vm.filtersCopy.ac_ndcntrto != null ? vm.filtersCopy.ac_ndcntrto.cdgo : null;
            deferred.resolve(vm.reloadMasters({ $search: 'sbcntrato', $params: { ac_ndcntrto: ac_ndcntrto }, $showLoad: false }));
          }
          else if (vm.filtersCopy.ac_crmo.cdgo == 114 || vm.filtersCopy.ac_crmo.cdgo == 115) {
            var ac_crmo = vm.filtersCopy.ac_crmo.cdgo;
            deferred.resolve(vm.reloadMasters({ $search: 'prdcto', $params: { ac_ramo: ac_crmo }, $showLoad: true }));
          } else {
            deferred.resolve([]);
          }
        }
        return deferred.promise;
      }

      function loadDataProducto() {
        var deferred = $q.defer();
        if (vm.filtersCopy.ac_crmo != null) {
          if (vm.filtersCopy.ac_crmo.cdgo == 114 || vm.filtersCopy.ac_crmo.cdgo == 115) {
            var ac_cdprdcto = vm.filtersCopy.ac_cdprdcto != null ? vm.filtersCopy.ac_cdprdcto.cdgo : null;
            var ac_crmo = vm.filtersCopy.ac_crmo.cdgo;
            deferred.resolve(vm.reloadMasters({ $search: 'sbprdcto', $params: { ac_cprdcto: ac_cdprdcto, ac_ramo: ac_crmo }, $showLoad: false }));
          } else {
            deferred.resolve([]);
          }
        }
        return deferred.promise;
      }

      function loadDepartamento() {
        var deferred = $q.defer();
        var ac_cdprtmnto = vm.filtersCopy.ac_cdprtmnto != null ? vm.filtersCopy.ac_cdprtmnto.cdgo : null;
        deferred.resolve(vm.reloadMasters({ $search: 'prvnce', $params: { ac_cdprtmnto: ac_cdprtmnto }, $showLoad: false }));
        return deferred.promise;
      }

      function loadProvincia() {
        var deferred = $q.defer();
        var ac_cdprtmnto = vm.filtersCopy.ac_cdprtmnto != null ? vm.filtersCopy.ac_cdprtmnto.cdgo : null;
        var an_cprvnca = vm.filtersCopy.an_cprvnca != null ? vm.filtersCopy.an_cprvnca.cdgo : null;
        deferred.resolve(vm.reloadMasters({ $search: 'dstrto', $params: { ac_cdprtmnto: ac_cdprtmnto, an_cprvnca: an_cprvnca }, $showLoad: false }));
        return deferred.promise;
      }

      function selectRamo() {
        vm.filtersCopy.ac_ndcntrto = null;
        vm.filtersCopy.ac_ndsbcntrto = null;
        vm.filtersCopy.ac_cdprdcto = null;
        vm.filtersCopy.ac_cdsbprdcto = null;
        vm.masters.subproductos = [];
        vm.masters.subcontratos = [];

        if(vm.filtersCopy.ac_crmo != null && (vm.filtersCopy.ac_crmo.cdgo == 114 || vm.filtersCopy.ac_crmo.cdgo == 115)) {
          var deferred = $q.defer();
          var ac_crmo = vm.filtersCopy.ac_crmo.cdgo;
          deferred.resolve(vm.reloadMasters({ $search: 'prdcto', $params: { ac_ramo: ac_crmo }, $showLoad: true }));
          return deferred.promise;
        }
      }

      function selectContrato() {
        vm.filtersCopy.ac_ndsbcntrto = null;
        var ac_ndcntrto = vm.filtersCopy.ac_ndcntrto != null ? vm.filtersCopy.ac_ndcntrto.cdgo : null;
        vm.reloadMasters({ $search: 'sbcntrato', $params: { ac_ndcntrto: ac_ndcntrto }, $showLoad: true });
      }

      function selectProducto() {
        vm.filtersCopy.ac_cdsbprdcto = null;
        var ac_cdprdcto = vm.filtersCopy.ac_cdprdcto != null ? vm.filtersCopy.ac_cdprdcto.cdgo : null;
        var ac_crmo = vm.filtersCopy.ac_crmo.cdgo;
        vm.reloadMasters({ $search: 'sbprdcto', $params: { ac_cprdcto: ac_cdprdcto, ac_ramo: ac_crmo }, $showLoad: true });
      }

      function selectDepartamento() {
        vm.filtersCopy.an_cprvnca = null;
        vm.filtersCopy.an_cdstrto = null;
        var ac_cdprtmnto = vm.filtersCopy.ac_cdprtmnto != null ? vm.filtersCopy.ac_cdprtmnto.cdgo : null;
        vm.masters.distritos = [];
        vm.reloadMasters({ $search: 'prvnce', $params: { ac_cdprtmnto: ac_cdprtmnto }, $showLoad: true });
      }

      function selectProvincia() {
        vm.filtersCopy.an_cdstrto = null;
        var ac_cdprtmnto = vm.filtersCopy.ac_cdprtmnto != null ? vm.filtersCopy.ac_cdprtmnto.cdgo : null;
        var an_cprvnca = vm.filtersCopy.an_cprvnca != null ? vm.filtersCopy.an_cprvnca.cdgo : null;
        vm.reloadMasters({ $search: 'dstrto', $params: { ac_cdprtmnto: ac_cdprtmnto, an_cprvnca: an_cprvnca }, $showLoad: true });
      }

      function selectClinica() {
        vm.filtersCopy.ac_csde = null;
      }

      function searchClinica(text) {
        if (text && text.length >= 3) {
          var defer = $q.defer();
          var params = { text: text };
          proxyKpiFiltroApi.PostClinica(params)
            .then(function (response) {
              if (response.operationCode == 200) {
                defer.resolve(response.data);
              }
            }, function (response) {
              console.log('Error Clinica');
            });
          return defer.promise;
        }
      }

      function searchSede(text) {
        if (text && text.length >= 3) {
          var defer = $q.defer();
          var ac_cclnca = vm.filtersCopy.ac_cclnca != null ? vm.filtersCopy.ac_cclnca.cdgo : null;
          if (ac_cclnca != null) {
            var params = { ac_cclnca: ac_cclnca, text: text };
            proxyKpiFiltroApi.PostSede(params)
              .then(function (response) {
                if (response.operationCode == 200) {
                  defer.resolve(response.data);
                }
              }, function (response) {
                console.log('Error Sede');
              });
            return defer.promise;
          }
        }
      }

      function searchGrupoEconomico(text) {
        if (text && text.length >= 3) {
          var defer = $q.defer();
          var params = { text: text };
          proxyKpiFiltroApi.PostGrupoEconomico(params)
            .then(function (response) {
              if (response.operationCode == 200) {
                defer.resolve(response.data);
              }
            }, function (response) {
              console.log('Error Grupo Económico');
            });
          return defer.promise;
        }
      }

      function searchContratante(text) {
        if (text && text.length >= 3) {
          var defer = $q.defer();
          var params = { text: text };
          proxyKpiFiltroApi.PostContratante(params)
            .then(function (response) {
              if (response.operationCode == 200) {
                defer.resolve(response.data);
              }
            }, function (response) {
              console.log('Error Contratante');
            });
          return defer.promise;
        }
      }

      function searchIntermediario(text) {
        if (text && text.length >= 3) {
          var defer = $q.defer();
          var params = { text: text };
          proxyKpiFiltroApi.PostIntermediario(params)
            .then(function (response) {
              if (response.operationCode == 200) {
                defer.resolve(response.data);
              }
            }, function (response) {
              console.log('Error Intermediario');
            });
          return defer.promise;
        }
      }

      function onInit() {
        vm.showOptionalFilters = showOptionalFilters;
        vm.applyFilters = applyFilters;
        vm.selectAllIndicator = selectAllIndicator;
        vm.selectIndicator = selectIndicator;
        vm.closeModal = close;
        vm.clear = clear;
        vm.isValidateForm = isValidateForm;
        vm.selectRamo = selectRamo;
        vm.selectContrato = selectContrato;
        vm.selectProducto = selectProducto;
        vm.selectDepartamento = selectDepartamento;
        vm.selectProvincia = selectProvincia;
        vm.selectClinica = selectClinica;
        vm.searchClinica = searchClinica;
        vm.searchSede = searchSede;
        vm.searchGrupoEconomico = searchGrupoEconomico;
        vm.searchContratante = searchContratante;
        vm.searchIntermediario = searchIntermediario;
        setInitialData();
        showSoatIndicators();
        loadFiltersData();
      }

    }]).
    component('modalFormFilters', {
      templateUrl: '/kpissalud/app/components/filters/modal-form-filters.html',
      controller: 'modalFormFiltersController',
      bindings: {
        dashboard: '=?',
        product: '=?',
        data: '=?',
        rangeSearchDate: '=?',
        masters: '=?',
        filterApply: '&?',
        reloadMasters: '&?',
        close: '&?'
      }
    })
});