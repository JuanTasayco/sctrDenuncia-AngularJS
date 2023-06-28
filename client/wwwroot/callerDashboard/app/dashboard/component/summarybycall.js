(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'summaryByCall', ['angular', 'system'], function(angular, system) {
  angular
    .module('oim.caller.dashboard')
    .controller('summaryByCallController', [
      function() {
        var vm = this;
        vm.$onInit = onInit;
        vm.toleranceMax = 5;

        function onInit() {}
      }
    ])
    .component('summaryByCall', {
      templateUrl: system.pathAppBase('/dashboard/component/summarybycall.html'),
      controller: 'summaryByCallController',
      bindings: {
        objectValue: '<?',
        countRecords: '<?',
        objectOptions: '<?'
      }
    });
});
