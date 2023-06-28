define(['angular', 'system', 'generalConstant', 'actterFactory'], function (angular, system, generalConstant) {
    searchActivityController.$inject = ['$timeout', 'actterFactory', 'mModalAlert', '$state'];
    function searchActivityController($timeout, actterFactory, mModalAlert, $state) {
        var vm = this;
        var seed;
        vm.$onInit = onInit;
        
        function onInit() {
          vm.selectItem = selectItem;
          vm.okItem = okItem;
        }

        vm.closeModal = function () {
          vm.onClose({})
        }
        
        vm.changeValue = function () {
          var value = vm.mNombSubAct
          if (value && value.length >= 2) {
            if (seed) cancelSearch();
            seed = $timeout(function () {
              resolveData(value);
            }, 500);
          }
        }

        function resolveData(value) {
          var params = { 
            Descripcion: isNaN(value) ? value.toUpperCase() : null,
            Codigo: isNaN(value) ? null : value,
            TamanoPagina:15, 
            NumeroPagina:1
          };
          actterFactory.getEconomicsActivities(params,true)
            .then(function (response) {
              vm.dataActivities = response.Data
            });
        }

        function cancelSearch() {
          if (seed) $timeout.cancel(seed);
          seed = undefined;
        }
        function okItem() {
          if (vm.selectedItem) {
            vm.onActivity({ $event: { selectedItem: vm.selectedItem } });
          }
        }

        function selectItem(item, accept) {
          if (vm.selectedItem) vm.selectedItem.rowSelected = false;
          vm.selectedItem = item
          vm.selectedItem.rowSelected = true;
          if (accept)
            okItem();
        }
        
    }
    
    return angular
        .module(generalConstant.APP_MODULE)
        .controller('searchActivityController', searchActivityController)
        .component('searchActivity', {
        templateUrl: system.apps.actter.location + '/app/common/components/modals/search-activity.html',
        controller: 'searchActivityController as vm',
        bindings: {
            onClose: "&?",
            onActivity: "&?",
            typePeriodo: "<?",
            hidenPeriod: "<?"
        }
    });
});