(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'demandStructureMatrix', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .controller('demandStructureMatrixController', [function(){

      }])
      .component('demandStructureMatrix', {
        templateUrl: system.pathAppBase('/dashboard/demandStructure/components/parts/matrix.html'),
        controller: 'demandStructureMatrixController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });