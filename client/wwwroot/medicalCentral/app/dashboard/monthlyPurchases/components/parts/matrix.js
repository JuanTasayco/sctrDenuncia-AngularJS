(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'monthlyPurchasesMatrix', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .controller('monthlyPurchasesMatrixController', ['$filter',function($filter){
        
      }])
      .component('monthlyPurchasesMatrix', {
        templateUrl: system.pathAppBase('/dashboard/monthlyPurchases/components/parts/matrix.html'),
        controller: 'monthlyPurchasesMatrixController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });