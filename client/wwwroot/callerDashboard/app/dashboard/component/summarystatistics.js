(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'summaryStatistics', ['angular', 'system'], function(angular, system) {
  angular
    .module('oim.caller.dashboard')
    .controller('summaryStatisticsController', [
      function() {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {}
      }
    ])
    .component('summaryStatistics', {
      templateUrl: system.pathAppBase('/dashboard/component/summarystatistics.html'),
      controller: 'summaryStatisticsController',
      bindings: {
        objectValue: '<?',
        objectOptions: '<?'
      }
    });
});
