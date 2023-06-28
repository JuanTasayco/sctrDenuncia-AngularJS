(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'filterDashByAssign', ['angular', 'system'],
  function(angular, system) {

    angular.module('oim.caller.dashboard')
      .controller('filterDashByAssignController', [function() {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {

        }

      }])
      .component('filterDashByAssign', {
        templateUrl: system.pathAppBase('/dashbyassign/component/filterdashbyassign.html'),
        controller: 'filterDashByAssignController',
        bindings: {

        }
      })
  });