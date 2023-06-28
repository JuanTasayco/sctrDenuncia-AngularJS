(function($root, name, deps, action){
  $root.define(name, deps, action)
})(window, 'listFilters', ['angular'], function(angular){
  angular.module('kpissalud.app').
  controller('listFiltersController',['$scope','$state', '$filter', 'configChart', function($scope, $state, $filter, configChart){
    var vm = this;
    vm.$onInit = onInit;

    function showFilters(){
      vm.showModalFilter();
    }

    $scope.$watch('$ctrl.product', function(n, o) {
      if (n != o) showListFilters();
    });

    $scope.$watchCollection('$ctrl.filters', function(n, o) {
      if (n != o) showListFilters();
    });

    function showListFilters(){
      vm.tags = [];
      vm.filterListName = '';
      vm.totalOptional = 0;
      vm.showMoreFilter = false;
      vm.showHideFilter = false;

      var listName = '';
      var data = vm.filters;

      for(var key in data){
        if(configChart.validateKeyInFilter(vm.dashboard, vm.product, vm.filters, key)){
          var item = data[key];
          var tag = { 'description': '', 'label': '', 'key': '','show': false, 'showLabel': false, 'delete': false, 'hidden': false, 'required': true }
          if(item != null){
            if(typeof item === 'object' && item.cdgo) {
              tag.description = item.dscrpcn;
              tag.show = true;
              tag.key = key;
              if(key !== 'ad_tpfcha' && key !== 'range_date' && key !== 'ac_frclmo' && key !== 'ac_crmo') {
                tag.hidden = true;
                tag.required = false;
              }
              switch(key){
                case 'ac_cejctvo':
                  tag.label = 'Ejecutivo';
                  tag.showLabel = true;
                  break;
                case 'ac_cadtrmdco':
                  tag.label = 'Auditor Médico';
                  tag.showLabel = true;
                  break;
                case 'an_cgecnmco':
                  tag.label = 'Grupo Económico';
                  tag.showLabel = true;
                  break;
                case 'an_ccntrtnte':
                  tag.label = 'Contratante';
                  tag.showLabel = true;
                  break;
                case 'an_cintrmdro':
                  tag.label = 'Intermediario';
                  tag.showLabel = true;
                  break;
              }
            } else if(Array.isArray(item)){
              if(item.length > 0 && angular.isString(item[0])){
                var dateStart = $filter('date')(item[0], 'dd MMM yyyy');
                var dateEnd = $filter('date')(item[1], 'dd MMM yyyy');
                tag.description = dateStart + ' - ' + dateEnd;
                tag.show = true;
                tag.key = 'range_date';
              }
            }
          }
          if(tag.description !== '') {
            if(!tag.hidden) listName += tag.description + ', ';
            else vm.totalOptional++;
          }
          vm.tags.push(tag);
        }
      }
      vm.filterListName = listName.substring(0, listName.length - 2);
      if(vm.totalOptional > 0) {
        vm.filterListName += ', etc';
        vm.showMoreFilter = true;
      }
    }

    function setVisibilitySecondaryFilters(isShow){
      for (var i = 0; i < vm.tags.length; i++) {
        var tag = vm.tags[i];
        if(tag.show && !tag.required) tag.hidden = isShow;
      }
      vm.showMoreFilter = isShow;
      vm.showHideFilter = !isShow;
    }

    function removeFilter(tag){
      if(!tag.required){
        var list = [];
        list = deleteFilter(tag.key, list);

        if(tag.key == 'ac_cdprdcto') {
          list = deleteFilter('ac_cdsbprdcto', list);
        }

        if(tag.key == 'ac_ndcntrto') {
          list = deleteFilter('ac_ndsbcntrto', list);
        }

        if(tag.key == 'ac_cdprtmnto') {
          list = deleteFilter('an_cprvnca', list);
          list = deleteFilter('an_cdstrto', list);
        };

        if(tag.key == 'an_cprvnca') {
          list = deleteFilter('an_cdstrto', list);
        };

        if(tag.key == 'ac_cclnca') {
          list = deleteFilter('ac_csde', list);
        };

        vm.reloadFilters({ $removed: list });
      }
    }

    function deleteFilter(key, list){
      var index = vm.tags.map(function(o){ return o.key; }).indexOf(key);
      if(index != -1){
        var tag = vm.tags[index];
        list.push(tag);

        vm.tags.splice(index, 1);
        vm.totalOptional--;
      }

        if(vm.totalOptional == 0) {
          vm.filterListName = vm.filterListName.substring(0, vm.filterListName.length - 5);
          vm.showMoreFilter = false;
          vm.showHideFilter = false;
        }

      return list;
    }

    function onInit(){
      vm.showFilters = showFilters;
      vm.setVisibilitySecondaryFilters = setVisibilitySecondaryFilters;
      vm.removeFilter = removeFilter;
    }

  }]).
  component('listFilters', {
    templateUrl: '/kpissalud/app/components/filters/list-filters.html',
    controller: 'listFiltersController',
    bindings: {
      filters: '=?',
      filterListName: '=?',
      product: '=?',
      dashboard: '=?',
      showModalFilter: '&?',
      reloadFilters: '&?'
    }
  })
});