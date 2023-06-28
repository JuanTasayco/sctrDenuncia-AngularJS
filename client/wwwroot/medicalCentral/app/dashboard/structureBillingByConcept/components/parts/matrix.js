(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'structureBillingByConceptMatrix', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .controller('structureBillingByConceptMatrixController', ['$filter', function($filter){
        var vm = this;
        vm.applyFormatHeader = applyFormatHeader; 
        function applyFormatHeader (value){
          var valueDate = new Date(value);
          var fDate = $filter('date');

          var fuppercase = $filter('uppercase');

          return angular.isDate(valueDate) ? fuppercase(fDate(value, 'dd-MMM')): value;
        }
      }])
      .component('structureBillingByConceptMatrix', {
        templateUrl: system.pathAppBase('/dashboard/structureBillingByConcept/components/parts/matrix.html'),
        controller: 'structureBillingByConceptMatrixController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });