(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'listRequestByCall', ['angular', 'system', 'helper'],
  function(angular, system, helper) {
    angular.module('oim.caller.dashboard')
      .controller('listRequestByCallController', ['orderByTypes', 'proxyDashboard', 'decoratorData', 'odataBuilder', 'mModalAlert', 'mModalConfirm',
        function(orderByTypes, proxyDashboard, decoratorData, odataBuilder, mModalAlert, mModalConfirm) {
          var vm = this;
          vm.$onInit = onInit;
          vm.orderByTypes = helper.objectToArray(orderByTypes);
          vm.pageNumber = 1;
          vm.pageSize = 12;
          vm.orderBy = vm.orderByTypes[0];

          function search() {
            var query = odataBuilder()
              .addOrder(vm.orderBy.code)
              .pageOptions(vm.pageNumber, vm.pageSize)
              .query();

            proxyDashboard.ListToCall(query, true)
              .then(function(response) {
                  vm.totalItems = response.recordCount;
                  vm.noResult = response.recordCount == 0;
                  decoratorData.incidents(response.data);
                  vm.objectData = response.data; console.log(response);
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

          function changeToAttention(item) {
            mModalConfirm
              .confirmInfo("¿Desea atender esta solicitud?", "Solicitud")
              .then(function() {
                proxyDashboard
                  .ChangeToAttention(item.attentionRequestId, true)
                  .then(function() {
                    search();
                  });
              })
          }

          function onInit() {
            vm.pageChanged = pageChanged;
            vm.changeOrder = changeOrder;
            vm.changeToAttention = changeToAttention;
            search();
          }

        }
      ])
      .component('listRequestByCall', {
        templateUrl: system.pathAppBase('/requestbycall/component/listrequestbycall.html'),
        controller: 'listRequestByCallController',
        bindings: {
          totalReacords: "=?",
          onSearch: "&?"
        }
      })
  });