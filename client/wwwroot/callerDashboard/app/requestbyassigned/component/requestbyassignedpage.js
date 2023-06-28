(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'requestByAssignedPage', ['angular', 'system'],
  function(angular, system) {

    angular.module('oim.caller.dashboard')
      .controller('requestByAssignedPageController', ['proxyDashboard', function(proxyDashboard) {
        var vm = this;
        vm.$onInit = onInit;

        function refreshCount() {
          proxyDashboard.CountToCall().then(function(response) {
            vm.totalRecordsToCall = angular.isNumber(response) ? response :
              angular.isNumber(response.data) ? response.data : 0;
          });
          proxyDashboard.CountToAssign().then(function(response) {
            vm.totalRecordsToAssign = angular.isNumber(response) ? response :
              angular.isNumber(response.data) ? response.data : 0;
          });
          proxyDashboard.CountAssignedToday().then(function(response) {
            vm.totalRecordsAssignedToday = angular.isNumber(response) ? response :
              angular.isNumber(response.data) ? response.data : 0;
          });
        }
        vm.searched = function() {
          refreshCount();
        }

        function onInit() {

        }

      }])
      .component('requestByAssignedPage', {
        templateUrl: system.pathAppBase('/requestbyassigned/component/requestbyassignedpage.html'),
        controller: 'requestByAssignedPageController',
        bindings: {

        }
      })
  });