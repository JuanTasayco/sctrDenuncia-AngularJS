(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'specialityGrowthMatrix', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .controller('specialityGrowthMatrixController', [function(){

      }])
      .component('specialityGrowthMatrix', {
        templateUrl: system.pathAppBase('/dashboard/specialityGrowth/components/parts/matrix.html'),
        controller: 'specialityGrowthMatrixController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });