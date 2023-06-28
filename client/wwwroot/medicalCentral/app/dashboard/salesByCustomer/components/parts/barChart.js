(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'salesByCustomerBarChart', ['angular', 'lodash', 'system', 'helper'],
    function(angular, _, system,  helper) {
      angular.module('medicalCenter.app')
      .controller('salesByCustomerBarChartController', ['$scope', 'rendererCharReportWeb',function($scope, rendererCharReportWeb){
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new && _new != old){
            rendererCharReportWeb.adapterBarData(_new, 'chartSalesByCustomer')
          }
        });
      }])
      .component('salesByCustomerBarChart', {
        templateUrl: system.pathAppBase('/dashboard/salesByCustomer/components/parts/barChart.html'),
        controller: 'salesByCustomerBarChartController',
        bindings: {
          nvtSource:"=?",
          onRenderedImage:'&'
        }
      });
    });