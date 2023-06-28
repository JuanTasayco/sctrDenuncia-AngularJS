(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'dashMenu', ['angular', 'system'],
  function(angular, system) {

    angular.module('oim.caller.dashboard')
      .controller('dashMenuController', ['$state', function($state) {
        var vm = this;
        vm.$onInit = onInit;
        vm.currentState = $state.current.name;

        function onInit() {

        }

      }])
      .component('dashMenu', {
        templateUrl: system.pathAppBase('/common/component/dashmenu.html'),
        controller: 'dashMenuController',
        bindings: {
          countCall: "<?",
          countAssing: "<?",
        }
      })
  });