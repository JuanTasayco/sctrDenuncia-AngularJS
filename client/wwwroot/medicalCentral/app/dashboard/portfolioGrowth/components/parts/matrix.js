(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'portfolioGrowthMatrix', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .controller('portfolioGrowthMatrixController', [function(){

      }])
      .component('portfolioGrowthMatrix', {
        templateUrl: system.pathAppBase('/dashboard/portfolioGrowth/components/parts/matrix.html'),
        controller: 'portfolioGrowthMatrixController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });