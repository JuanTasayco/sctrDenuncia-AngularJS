(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'monthlyPurchasesBarChart', ['angular', 'lodash', 'system', 'helper'],
    function(angular, _, system,  helper) {
      angular.module('medicalCenter.app')
      .controller('monthlyPurchasesBarChartController', ['$scope', 'rendererCharReportWeb',function($scope, rendererCharReportWeb){
        var vm = this;
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new && _new != old){
            rendererCharReportWeb.adapterBarData(_new, 'chartMonthlyPuchases', undefined, vm.onRenderedImage);
          }
        });
     
      }])
      .component('monthlyPurchasesBarChart', {
        templateUrl: system.pathAppBase('/dashboard/monthlyPurchases/components/parts/barChart.html'),
        controller: 'monthlyPurchasesBarChartController',
        bindings: {
          nvtSource:"=?",
          onRenderedImage:'&'
        }
      });
    });