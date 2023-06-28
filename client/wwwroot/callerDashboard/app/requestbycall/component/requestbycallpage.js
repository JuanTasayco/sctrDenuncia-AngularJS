(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'requestByCallPage', ['angular', 'system'],
  function(angular, system) {
    angular.module('oim.caller.dashboard')
      .controller('requestByCallPageController', ['proxyDashboard', function(proxyDashboard) {
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
      .component('requestByCallPage', {
        templateUrl: system.pathAppBase('/requestbycall/component/requestbycallpage.html'),
        controller: 'requestByCallPageController',
        bindings: {

        }
      })
  });