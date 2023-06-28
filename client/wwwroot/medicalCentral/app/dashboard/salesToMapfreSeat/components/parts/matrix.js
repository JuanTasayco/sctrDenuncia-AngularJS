(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'salesToMapfreSeatMatrix', ['angular', 'system'],
  function(angular, system) {
    angular.module('medicalCenter.app')
    .controller('salesToMapfreSeatMatrixController', ['$filter',function($filter){
      
    }])
    .component('salesToMapfreSeatMatrix', {
      templateUrl: system.pathAppBase('/dashboard/salesToMapfreSeat/components/parts/matrix.html'),
      controller: 'salesToMapfreSeatMatrixController',
      bindings: {
        nvtSource:"=?"
      }
    });
  });