(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'listRequestByAssigned', ['angular', 'system'],
  function(angular, system) {

    angular.module('oim.caller.dashboard')
      .controller('listRequestByAssignedController', [
        '$scope', '$uibModal', 'orderByTypes', 'proxyDashboard', 'decoratorData', 'odataBuilder', 'mModalAlert', 'mModalConfirm',
        function($scope, $uibModal, orderByTypes, proxyDashboard, decoratorData, odataBuilder, mModalAlert, mModalConfirm) {

          var vm = this;
          vm.$onInit = onInit;
          vm.orderByTypes = helper.objectToArray(orderByTypes);
          vm.pageNumber = 1;
          vm.pageSize = 12;
          vm.orderBy = vm.orderByTypes[0];
          vm.dataFilter = {}

          function search() {
            var query = odataBuilder()
              .filterEq("FromDate", vm.dataFilter.fromDate)
              .filterEq("ToDate", vm.dataFilter.toDate)
              .filterEq("DocumenterNumber", vm.dataFilter.documenterNumber)
              .filterEq("RequestType", vm.dataFilter.requestType ? vm.dataFilter.requestType.code : undefined)
              .filterEq("OperatorName", vm.dataFilter.operatorName)
              .addOrder(vm.orderBy.code)
              .pageOptions(vm.pageNumber, vm.pageSize)
              .query();

            proxyDashboard.ListAssigned(query, true)
              .then(function(response) {
                  vm.totalItems = response.recordCount;
                  vm.noResult = response.recordCount == 0;
                  decoratorData.incidents(response.data);
                  vm.objectData = response.data;
                },
                function(response) {

                });
            vm.onSearch();
          }

          function pageChanged() {
            search();
          }

          function changeOrder() {
            search();
          }


          function onInit() {
            vm.pageChanged = pageChanged;
            vm.changeOrder = changeOrder;
            search();
          }

          $scope.showFilter = function(option, index, event) {
            var vModal = $uibModal.open({
              backdrop: true,
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              template: '<modal-Filter ignore-dates="false" object-data="dataFilter" filter-apply="applyFilter($filter)" close="close()" clean="cleanFilter()" ><modal-filter>',
              controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

                $scope.dataFilter = vm.dataFilter;

                $scope.cleanFilter = function() {
                  $uibModalInstance.close({});
                };
                $scope.close = function() {
                  $uibModalInstance.close();
                };
                $scope.applyFilter = function($filter) {
                  $uibModalInstance.close($filter);
                }
              }]
            });
            vModal.result.then(function(filter) {
              if (filter) {
                vm.dataFilter = filter;
                search();
              }

            });
          };
        }
      ])
      .component('listRequestByAssigned', {
        templateUrl: system.pathAppBase('/requestbyassigned/component/listrequestbyassigned.html'),
        controller: 'listRequestByAssignedController',
        bindings: {
          totalRecords: "=?",
          onSearch: "&?"
        }
      })
  });