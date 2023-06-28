(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'demandStructureChart', ['angular', 'lodash', 'system'],
    function(angular, _, system) {
      angular.module('medicalCenter.app')
      .controller('demandStructureChartController', ['$scope',function($scope){
        var $ctrl = this;
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new && _new != old){
            
            angular.forEach(_new.matrix.data, function(v){
              v.countValue = v.properties.length>0? v.properties[0].value:0;
            });
            renderChart(_.filter(_new.matrix.data, function(x){return x.itemType === 'D' || x.itemType == 'S'}));
          }
        });
       function renderChart(datasource){
         
        var config = {
          "type": "pie",
          "theme": "light",
          "dataProvider": datasource,
          "valueField": "countValue",
          "titleField": "especialityCode",
          "labelText": "[[title]]: [[value]] ([[percents]]%)",
          "outlineAlpha": 0.4,
          "depth3D": 15,
          "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
          "angle": 30
        };
        var chart = AmCharts.makeChart("chartStructureBillingByPortfolio",  config);
        
      }
    }]).component('demandStructureChart', {
        templateUrl: system.pathAppBase('/dashboard/demandStructure/components/parts/chart.html'),
        controller: 'demandStructureChartController',
        bindings: {
          nvtSource:"=?",
          onRenderedImage:"&"
        }
      });
    });