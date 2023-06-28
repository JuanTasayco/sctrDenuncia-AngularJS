(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'monthlyPurchasesPieChart', ['angular', 'lodash', 'system', 'helper'],
    function(angular, _, system,  helper) {
      angular.module('medicalCenter.app')
      .controller('monthlyPurchasesPieChartController', ['$scope', 'rendererCharReportWeb',function($scope, rendererCharReportWeb){
        var vm = this;
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new && _new != old){
            rendererCharReportWeb.adapterBarData(_new, 'chartPieMonthlyPurchases', true, vm.onRenderedImage)
          }
        });
      }])
      .component('monthlyPurchasesPieChart', {
        templateUrl: system.pathAppBase('/dashboard/monthlyPurchases/components/parts/pieChart.html'),
        controller: 'monthlyPurchasesPieChartController',
        bindings: {
          nvtSource:"=?",
          onRenderedImage:'&'
        }
      });
    });