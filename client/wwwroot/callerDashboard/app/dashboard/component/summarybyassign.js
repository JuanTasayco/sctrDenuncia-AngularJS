(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'summaryByAssign', ['angular', 'system'], function(angular, system) {
  angular
    .module('oim.caller.dashboard')
    .controller('summaryByAssignController', [
      function() {
        var vm = this;
        vm.$onInit = onInit;
        vm.toleranceMax = 5;

        function onInit() {}
      }
    ])
    .component('summaryByAssign', {
      templateUrl: system.pathAppBase('/dashboard/component/summarybyassign.html'),
      controller: 'summaryByAssignController',
      bindings: {
        objectValue: '<?',
        countRecords: '<?',
        objectOptions: '<?'
      }
    });
});
