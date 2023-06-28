(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'consultationsBySpecialtyMatrix', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .controller('consultationsBySpecialtyMatrixController', ['$filter',function($filter){
        var vm = this;
        vm.applyFormatHeader = applyFormatHeader; 
        function applyFormatHeader (value){
          var valueDate =(value + '').length>=6 ? new Date(value): value;
          var fDate = $filter('date');

          var fuppercase = $filter('uppercase');

          return angular.isDate(valueDate) ? fuppercase(fDate(value, 'dd-MMM')): value;
        }
      }])
      .component('consultationsBySpecialtyMatrix', {
        templateUrl: system.pathAppBase('/dashboard/consultationsBySpecialty/components/parts/matrix.html'),
        controller: 'consultationsBySpecialtyMatrixController',
        bindings: {
          nvtSource:"=?"
        }
      })
      
    });