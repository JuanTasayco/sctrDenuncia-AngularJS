(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'structureBillingByPortfolioChart', ['angular', 'lodash', 'system'],
    function(angular, _, system) {
      angular.module('medicalCenter.app')
      .controller('structureBillingByPortfolioChartController', ['$scope',function($scope){
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new && _new != old){
            renderChart(_.filter(_new.matrix.data, function(x){return x.itemType === 'D' || x.itemType == 'S'}));
          }
        });
       function renderChart(datasource){
        var chart = AmCharts.makeChart("chartStructureBillingByPortfolio", {
          "type": "pie",
          "theme": "light",
          "dataProvider": datasource,
          "valueField": "total",
          "titleField": "especialityCode",
          "labelText": "[[title]]: S/ [[value]] ([[percents]]%)",
          "outlineAlpha": 0.4,
          "depth3D": 15,
          "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
          "angle": 30
        } );
       }
      }])
      .component('structureBillingByPortfolioChart', {
        templateUrl: system.pathAppBase('/dashboard/structureBillingByPortfolio/components/parts/chart.html'),
        controller: 'structureBillingByPortfolioChartController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });