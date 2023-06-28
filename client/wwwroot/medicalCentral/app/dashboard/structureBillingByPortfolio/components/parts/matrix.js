(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'structureBillingByPortfolioMatrix', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .controller('structureBillingByPortfolioMatrixController', ['$filter',function($filter){
        var vm = this;
        vm.applyFormatHeader = applyFormatHeader; 
        function applyFormatHeader (value){
          var valueDate = new Date(value);
          var fDate = $filter('date');

          var fuppercase = $filter('uppercase');

          return angular.isDate(valueDate) ? fuppercase(fDate(value, 'dd-MMM')): value;
        }
      }])
      .component('structureBillingByPortfolioMatrix', {
        templateUrl: system.pathAppBase('/dashboard/structureBillingByPortfolio/components/parts/matrix.html'),
        controller: 'structureBillingByPortfolioMatrixController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });