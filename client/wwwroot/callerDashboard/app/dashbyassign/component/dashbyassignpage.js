(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'dashByAssignPage', ['angular', 'system'],
  function(angular, system) {

    angular.module('oim.caller.dashboard')
      .controller('dashByAssignPageController', ['proxyDashboard', function(proxyDashboard) {
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
        }
        vm.searched = function() {
          refreshCount();
        }

        function onInit() {

        }

      }])
      .component('dashByAssignPage', {
        templateUrl: system.pathAppBase('/dashbyassign/component/dashbyassignpage.html'),
        controller: 'dashByAssignPageController',
        bindings: {

        }
      })
  });