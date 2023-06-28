(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'modalFilter', ['angular', 'system'],
  function(angular, system) {
    angular.module('oim.caller.dashboard')
      .controller('modalFilterController', ['proxyDashboard', '$cacheFactory', function(proxyDashboard, $cacheFactory) {
        var vm = this;
        vm.$onInit = onInit;

        function apply() {
          var data = {
            toDate: vm.objectData.toDate,
            fromDate: vm.objectData.fromDate,
            documenterNumber: vm.objectData.documenterNumber,
            operatorName: vm.objectData.operatorName,
            requestType: vm.objectData.requestType ? vm.objectData.requestType : undefined
          }
          vm.objectData = data;
          vm.filterApply({ $filter: data });
        }

        function clear() {
          vm.objectData = {};
          vm.clean();
        }

        function close() {
          vm.close();
        }

        function fill() {
          var cache;
          cache = $cacheFactory.get('filterCache') || $cacheFactory('filterCache');
          vm.typesRequest = cache.get('typesRequest');

          if (!vm.typesRequest) {
            proxyDashboard.GetRequestServiceType().then(function(response) {
              vm.typesRequest = response;
              cache.put('typesRequest', vm.typesRequest);
            });
          }
        }

        function onInit() {
          vm.apply = apply;
          vm.clear = clear;
          vm.closeModal = close
          fill();
        }

      }])
      .component('modalFilter', {
        templateUrl: system.pathAppBase('/common/component/modal-filter.html'),
        controller: 'modalFilterController',
        bindings: {
          objectData: "=?",
          filterApply: "&?",
          clean: "&?",
          close: "&?",
          ignoreDates: "<?"
        }
      })
  });