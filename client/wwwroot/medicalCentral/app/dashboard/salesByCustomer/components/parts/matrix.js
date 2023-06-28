(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'salesByCustomerMatrix', ['angular', 'system'],
  function(angular, system) {
    angular.module('medicalCenter.app')
    .controller('salesByCustomerMatrixController', ['$filter',function($filter){
      
    }])
    .component('salesByCustomerMatrix', {
      templateUrl: system.pathAppBase('/dashboard/salesByCustomer/components/parts/matrix.html'),
      controller: 'salesByCustomerMatrixController',
      bindings: {
        nvtSource:"=?"
      }
    });
  });