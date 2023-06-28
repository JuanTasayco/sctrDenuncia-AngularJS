(function($root, name, deps, action){
  $root.define(name, deps, action)
})(window, 'formFilters', ['angular'], function(angular){
  angular.module('kpissalud.app').
  controller('formFiltersController', ['$scope','$state', '$q', 'proxyKpiFiltroApi', function($scope, $state, $q, proxyKpiFiltroApi){
    var vm = this;
    vm.$onInit = onInit;

    function setInitialData(){
      vm.filters = {
        ad_tpfcha: null,
        range_date: [null, null],
        ac_frclmo: null,
        ac_crmo: null,
        ac_ndcntrto: null,
        ac_ndsbcntrto: null,
        ac_cdprdcto: null,
        ac_cdsbprdcto: null,
        ac_cdprtmnto: null,
        an_cprvnca: null,
        an_cdstrto: null,
        ac_cclnca: null,
        ac_csde: null,
        ac_ccbrtra: null,
        ac_cdgnstco: null,
        ac_cejctvo: null,
        ac_cadtrmdco: null,
        an_cgecnmco: null,
        an_ccntrtnte: null,
        an_cintrmdro: null
      };
      vm.maxDate = new Date();
      vm.textShowFilter = 'Ver más filtros';
      vm.isSiniestro = vm.dashboard == 'SNSTR';
      vm.isCgw = vm.dashboard == 'CGW';
      vm.isSoat = vm.product.cdgo == 'O';
      vm.isAsistenciaMedica = (vm.product.cdgo == 'S' && vm.product.cod_cia == '1');
      vm.isAccidentesPersonales = vm.product.cdgo == 'A';
      vm.isEps = (vm.product.cdgo == 'S' && vm.product.cod_cia == '3');
      vm.todosIndicadores = true;

      vm.masters.indicadores = [
        // Siniestro
        { 'cdgo': 'SNSTR_TPASP', 'dscrpcn': 'Tiempo promedio de atención de siniestros pagados', 'show': vm.isSiniestro, 'selected': false },
        { 'cdgo': 'SNSTR_NTSP', 'dscrpcn': 'Número total de siniestros pagados', 'show': vm.isSiniestro, 'selected': false },
        { 'cdgo': 'SNSTR_ITSP', 'dscrpcn': 'Importe total (S/) de siniestros pagados', 'show': vm.isSiniestro, 'selected': false },
        { 'cdgo': 'SNSTR_CPAP', 'dscrpcn': 'Costo (S/) promedio de atención/paciente', 'show': vm.isSiniestro, 'selected': false },
        { 'cdgo': 'SNSTR_ITH', 'dscrpcn': 'Importe (S/)/tasa (%) de hospitalización', 'show': vm.isSiniestro, 'selected': false },
        { 'cdgo': 'SNSTR_CPM', 'dscrpcn': 'Costo (S/) paciente mes', 'show': vm.isSiniestro && (vm.isAsistenciaMedica || vm.isEps), 'selected': false },
        // SOAT
        { 'cdgo': 'SNSTR_SOAT_GP', 'dscrpcn': 'Gastos por proveedores', 'show': vm.isSiniestro && vm.isSoat, 'selected': false },
        { 'cdgo': 'SNSTR_SOAT_GC', 'dscrpcn': 'Gastos por cobertura', 'show': vm.isSiniestro && vm.isSoat, 'selected': false },
        { 'cdgo': 'SNSTR_SOAT_GTA', 'dscrpcn': 'Gastos por tipo de accidente', 'show': vm.isSiniestro && vm.isSoat, 'selected': false },
        { 'cdgo': 'SNSTR_SOAT_GUGD', 'dscrpcn': 'Importe (S/)/tasa (%) de gastos por ubicación geográfica detallada', 'show': vm.isSiniestro && vm.isSoat, 'selected': false },
        { 'cdgo': 'SNSTR_SOAT_GUGG', 'dscrpcn': '% de gastos por ubicación geográfica general por zona', 'show': vm.isSiniestro && vm.isSoat, 'selected': false },
        // CG
        { 'cdgo': 'CGW_ITR', 'dscrpcn': 'Importe total (S/) de reservas', 'show': vm.isCgw, 'selected': false },
        { 'cdgo': 'CGW_CGS', 'dscrpcn': 'Cartas de garantía solicitadas', 'show': vm.isCgw, 'selected': false },
        { 'cdgo': 'CGW_CGR', 'dscrpcn': 'Cartas de garantía rechazadas', 'show': vm.isCgw, 'selected': false },
        { 'cdgo': 'CGW_NTCG', 'dscrpcn': 'Número total de cartas de garantía', 'show': vm.isCgw, 'selected': false },
        { 'cdgo': 'CGW_ITCG', 'dscrpcn': 'Importe total (S/) de cartas de garantía', 'show': vm.isCgw, 'selected': false },
        { 'cdgo': 'CGW_ASR', 'dscrpcn': 'Ahorro (S/) por solicitudes rechazadas', 'show': vm.isCgw, 'selected': false },
        { 'cdgo': 'CGW_AAM', 'dscrpcn': 'Ahorro (S/) por auditoría médica', 'show': vm.isCgw, 'selected': false },
        { 'cdgo': 'CGW_DA', 'dscrpcn': 'Diagnósticos aprobados', 'show': vm.isCgw, 'selected': false },
        { 'cdgo': 'CGW_CA', 'dscrpcn': 'Coberturas aprobadas', 'show': vm.isCgw, 'selected': false },
        { 'cdgo': 'CGW_MR', 'dscrpcn': 'Motivos de rechazo', 'show': vm.isCgw, 'selected': false }
      ];

      vm.masters.typesDate = [
        { 'cdgo': 'FCHCRRNC', 'dscrpcn': 'Fecha de Ocurrencia' },
        { 'cdgo': 'FCHPRNTCN', 'dscrpcn': 'Fecha de Presentación' },
        { 'cdgo': 'FCHLQDCN', 'dscrpcn': 'Fecha de Liquidación' },
        { 'cdgo': 'FCHPG', 'dscrpcn': 'Fecha de Pago' }
      ];

      vm.masters.claimsForm = [
        { 'cdgo': 'C', 'dscrpcn': 'Crédito' },
        { 'cdgo': 'R', 'dscrpcn': 'Reembolso' }
      ];

      vm.selectAllIndicator();
    }

    function showOptionalFilters(){
      vm.isShowOptionalFilters = !vm.isShowOptionalFilters;
      vm.textShowFilter = vm.isShowOptionalFilters ? 'Ver menos filtros' : 'Ver más filtros';
    }

    $scope.$watch('$ctrl.product', function(n, o) {
      if (n != o) {
        vm.isSoat = vm.product.cdgo == 'O';
        vm.isAsistenciaMedica = (vm.product.cdgo == 'S' && vm.product.cod_cia == '1');
        vm.isAccidentesPersonales = vm.product.cdgo == 'A';
        vm.isEps = (vm.product.cdgo == 'S' && vm.product.cod_cia == '3');
        angular.forEach(vm.masters.indicadores, function(itm){ 
          vm.selectIndicator();
          if(itm.cdgo == 'SNSTR_SOAT_GP' || itm.cdgo == 'SNSTR_SOAT_GC' || itm.cdgo == 'SNSTR_SOAT_GTA' || 
            itm.cdgo == 'SNSTR_SOAT_GUGD' || itm.cdgo == 'SNSTR_SOAT_GUGG'){
            itm.show = vm.isSiniestro && vm.isSoat;
          }
          if(itm.cdgo == 'SNSTR_CPM'){
            itm.show = vm.isSiniestro && (vm.isAsistenciaMedica || vm.isEps);
          }
        });
        generateFilterIndicadores();
        vm.updateProduct({ $indicadores: vm.filters.indicadores });
      }
    });

    function selectAllIndicator(){
      var toggleStatus = vm.todosIndicadores;
      angular.forEach(vm.masters.indicadores, function(itm){ itm.selected = toggleStatus; });
    }

    function selectIndicator(){
      vm.todosIndicadores = vm.masters.indicadores.every(function(itm){ return !itm.show || itm.selected; })
    }

    function isValidateForm(){
      var validTypeDate = vm.filters.ad_tpfcha != null && vm.filters.ad_tpfcha.cdgo != null;
      var validRangeDate = vm.filters.range_date[0] !== null && vm.filters.range_date[1] !== null;
      var validSelectedIndicators = hasValidSelectedIndicator();
      //var validRamo = !vm.isAsistenciaMedica || (vm.filters.ac_crmo != null && vm.filters.ac_crmo.cdgo != null);
      var validRamo = true;
      return validTypeDate && validRangeDate && validSelectedIndicators && validRamo;
    }

    function generateFilterIndicadores(){
      vm.filters.indicadores = [];
      angular.forEach(vm.masters.indicadores, function(itm){ 
        if(itm.show){
          var indicador = { 'code': itm.cdgo, 'selected': itm. selected };
          vm.filters.indicadores.push(indicador);
        }
      });
    }

    function applyFilters(){
      generateFilterIndicadores();
      vm.filterApply({ $filters: vm.filters, $indicators: vm.masters.indicadores, $todosIndicadores: vm.todosIndicadores });
    }

    function hasValidSelectedIndicator(){
      var selectedIndicator = 0;
      angular.forEach(vm.masters.indicadores, function(itm){ 
        if(itm.show && itm.selected) selectedIndicator++;
      });
      return selectedIndicator > 0;
    }

    function selectedRamo(){
      vm.filters.ac_ndcntrto = null;
      vm.filters.ac_ndsbcntrto = null;
      vm.filters.ac_cdprdcto = null;
      vm.filters.ac_cdsbprdcto = null;
      vm.masters.subproductos = [];
      vm.masters.subcontratos = [];

      if(vm.filters.ac_crmo != null && (vm.filters.ac_crmo.cdgo == 114 || vm.filters.ac_crmo.cdgo == 115)) {
        var deferred = $q.defer();
        var ac_crmo = vm.filters.ac_crmo.cdgo;
        deferred.resolve(vm.reloadMasters({ $search: 'prdcto', $params: { ac_ramo: ac_crmo }, $showLoad: true }));
        return deferred.promise;
      }
    }

    function selectContrato(){
      var deferred = $q.defer();
      vm.filters.ac_ndsbcntrto = null;
      var ac_ndcntrto = vm.filters.ac_ndcntrto != null ? vm.filters.ac_ndcntrto.cdgo : null;
      deferred.resolve(vm.reloadMasters({ $search: 'sbcntrato', $params: { ac_ndcntrto: ac_ndcntrto }, $showLoad: true }));
      return deferred.promise;
    }

    function selectProducto(){
      var deferred = $q.defer();
      vm.filters.ac_cdsbprdcto = null;
      var ac_cdprdcto = vm.filters.ac_cdprdcto != null ? vm.filters.ac_cdprdcto.cdgo : null;
      var ac_crmo = vm.filters.ac_crmo.cdgo;
      deferred.resolve(vm.reloadMasters({ $search: 'sbprdcto', $params: { ac_cprdcto: ac_cdprdcto, ac_ramo: ac_crmo }, $showLoad: true }));
      return deferred.promise;
    }

    function selectDepartamento(){
      var deferred = $q.defer();
      vm.filters.an_cprvnca = null;
      vm.filters.an_cdstrto = null;
      var ac_cdprtmnto = vm.filters.ac_cdprtmnto != null ? vm.filters.ac_cdprtmnto.cdgo : null;
      vm.masters.distritos = [];
      deferred.resolve(vm.reloadMasters({ $search: 'prvnce', $params: { ac_cdprtmnto: ac_cdprtmnto }, $showLoad: true }));
      return deferred.promise;
    }

    function selectProvincia(){
      var deferred = $q.defer();
      vm.filters.an_cdstrto = null;
      var ac_cdprtmnto = vm.filters.ac_cdprtmnto != null ? vm.filters.ac_cdprtmnto.cdgo : null;
      var an_cprvnca = vm.filters.an_cprvnca != null ? vm.filters.an_cprvnca.cdgo : null;
      deferred.resolve(vm.reloadMasters({ $search: 'dstrto', $params: { ac_cdprtmnto: ac_cdprtmnto, an_cprvnca: an_cprvnca }, $showLoad: true }));
      return deferred.promise;
    }

    function selectClinica(){
      vm.filters.ac_csde = null;
    }

    function searchClinica(text){
      if (text && text.length >= 3) {
        var defer = $q.defer();
        var params = { text : text };
        proxyKpiFiltroApi.PostClinica(params)
          .then(function(response){
            if(response.operationCode == 200) {
              defer.resolve(response.data);
            }
          }, function(response) {
            console.log('Error Clinica');
          });
        return defer.promise;
      }
    }

    function searchSede(text){
      if (text && text.length >= 3) {
        var defer = $q.defer();
        var ac_cclnca = vm.filters.ac_cclnca != null ? vm.filters.ac_cclnca.cdgo : null;
        if(ac_cclnca != null){
          var params = { ac_cclnca: ac_cclnca, text : text };
          proxyKpiFiltroApi.PostSede(params)
            .then(function(response){
              if(response.operationCode == 200) {
                defer.resolve(response.data);
              }
            }, function(response) {
              console.log('Error Sede');
            });
          return defer.promise;
        }
      }
    }

    function searchGrupoEconomico(text){
      if (text && text.length >= 3) {
        var defer = $q.defer();
        var params = { text : text };
        proxyKpiFiltroApi.PostGrupoEconomico(params)
          .then(function(response){
            if(response.operationCode == 200) {
              defer.resolve(response.data);
            }
          }, function(response) {
            console.log('Error Grupo Económico');
          });
        return defer.promise;
      }
    }

    function searchContratante(text){
      if (text && text.length >= 3) {
        var defer = $q.defer();
        var params = { text : text };
        proxyKpiFiltroApi.PostContratante(params)
          .then(function(response){
            if(response.operationCode == 200) {
              defer.resolve(response.data);
            }
          }, function(response) {
            console.log('Error Contratante');
          });
        return defer.promise;
      }
    }

    function searchIntermediario(text){
      if (text && text.length >= 3) {
        var defer = $q.defer();
        var params = { text : text };
        proxyKpiFiltroApi.PostIntermediario(params)
          .then(function(response){
            if(response.operationCode == 200) {
              defer.resolve(response.data);
            }
          }, function(response) {
            console.log('Error Intermediario');
          });
        return defer.promise;
      }
    }

    function onInit(){
      vm.showOptionalFilters = showOptionalFilters;
      vm.applyFilters = applyFilters;
      vm.selectAllIndicator = selectAllIndicator;
      vm.selectIndicator = selectIndicator;
      vm.isValidateForm = isValidateForm;
      vm.selectedRamo = selectedRamo;
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
    }

  }]).
  component('formFilters', {
    templateUrl: '/kpissalud/app/components/filters/form-filters.html',
    controller: 'formFiltersController',
    bindings: {
      dashboard:'=?',
      product:'=?',
      rangeSearchDate:'=?',
      masters:'=?',
      filterApply: '&?',
      reloadMasters:'&?',
      updateProduct: '&?'
    }
  })
});