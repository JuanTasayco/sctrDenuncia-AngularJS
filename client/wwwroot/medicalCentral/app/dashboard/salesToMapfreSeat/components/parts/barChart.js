(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'salesToMapfreSeatBarChart', ['angular', 'lodash', 'system', 'helper'],
    function(angular, _, system,  helper) {
      angular.module('medicalCenter.app')
      .controller('salesToMapfreSeatBarChartController', ['$scope','rendererCharReportWeb',function($scope,rendererCharReportWeb){
        var vm = this;
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new && _new != old){
            rendererCharReportWeb.adapterBarData(_new, 'chartSalesToMapfreSeat', undefined, vm.onRenderedImage)
          }
        });
      }])
      .component('salesToMapfreSeatBarChart', {
        templateUrl: system.pathAppBase('/dashboard/salesToMapfreSeat/components/parts/barChart.html'),
        controller: 'salesToMapfreSeatBarChartController',
        bindings: {
          nvtSource:"=?",
          onRenderedImage:'&'
        }
      });
    });