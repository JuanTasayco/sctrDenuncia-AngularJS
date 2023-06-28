(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'salesByCustomerPieChart', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .controller('salesByCustomerPieChartController', ['$scope', 'rendererCharReportWeb',function($scope, rendererCharReportWeb){
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new && _new != old){
            rendererCharReportWeb.adapterBarData(_new, 'chartPieSalesByCustomer', true)
          }
        });
      }])
      .component('salesByCustomerPieChart', {
        templateUrl: system.pathAppBase('/dashboard/salesByCustomer/components/parts/pieChart.html'),
        controller: 'salesByCustomerPieChartController',
        bindings: {
          nvtSource:"=?",
          onRenderedImage:'&'
        }
      });
    });