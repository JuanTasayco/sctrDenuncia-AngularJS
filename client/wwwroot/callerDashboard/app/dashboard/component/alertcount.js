(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'alertCount', ['angular', 'system'],
  function(angular, system) {

    angular.module('oim.caller.dashboard')
      .controller('alertCountController', [function() {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {

        }

      }])
      .component('alertCount', {
        templateUrl: system.pathAppBase('/dashboard/component/alertcount.html'),
        controller: 'alertCountController',
        bindings: {
          objectValue: "<?"
        }
      })
  });