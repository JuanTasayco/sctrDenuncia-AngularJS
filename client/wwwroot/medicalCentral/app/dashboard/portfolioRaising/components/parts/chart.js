(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'portfolioRaisingChart', ['angular', 'lodash', 'system', 'helper'],
    function(angular, _, system,  helper) {
      angular.module('medicalCenter.app')
      .controller('portfolioRaisingChartController', ['$scope',function($scope){
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new && _new != old){
            var matrix = helper.clone(_new.matrix);
            var indexFacturacion, indexCaso;
            if(matrix.header.length>0){
              var head = matrix.header[0];
              var itemFact = _.find(head.properties, function(x,i){ var k = (x.value || '').toUpperCase(); return  k == 'FACTURACION' || k == 'FACTURACI¿N' || k == 'FACTURACIÓN'; })
              var itemCaso = _.find(head.properties, function(x){ var k = (x.value || '').toUpperCase(); return  k == '# CASOS'; })
              indexFacturacion = head.properties.indexOf(itemFact);
              indexCaso = head.properties.indexOf(itemCaso);
            }
            angular.forEach(matrix.data, function(v){
              v.facturacion = v.properties[indexFacturacion].value;
              v.caso = v.properties[indexCaso].value;
            });
            matrix.data.push({medicalName:'', itemType:"D"});
            renderChart(_.filter(matrix.data, function(x){return x.itemType === 'D' || x.itemType == 'S'}));
          }
        });
        
        function renderChart(datasource){
          

          var chart = AmCharts.makeChart("chartPortfolioRaising", {
            "type": "serial",
            "theme": "light",
            "legend": {
                "equalWidths": false,
                "useGraphSettings": true,
                "valueAlign": "left",
                "valueWidth": 120
            },
            "dataProvider": datasource,
            "dataTableId": 'chartPortfolioRaisingTable',
            "valueAxes": [{
                "id": "distanceAxis",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "position": "left",
                "title": "Casos"
            }, {
                "id": "durationAxis",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "inside": true,
                "position": "right",
                "title": "SOLES",
                'labelFunction' : function(value, valueText, valueAxis ){
                  return 'S/ '+ valueText;
                }
            }],
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "[[value]]",
                "dashLengthField": "dashLength",
                "fillAlphas": 0.7,
                "legendPeriodValueText": "total: [[value.sum]]",
                "legendValueText": "[[value]]",
                "title": "Facturación",
                "type": "column",
                "valueField": "facturacion",
                "valueAxis": "durationAxis"
            }, 
            {
              "bullet": "square",
              "bulletBorderAlpha": 1,
              "bulletBorderThickness": 1,
              "dashLengthField": "dashLength",
              "legendValueText": "[[value]]",
              "title": "Casos",
              "fillAlphas": 0,
              "valueField": "caso",
              "valueAxis": "distanceAxis"
          }],
            "chartCursor": {
                "categoryBalloonDateFormat": "DD",
                "cursorAlpha": 0.1,
                "cursorColor":"#000000",
                 "fullWidth":true,
                "valueBalloonsEnabled": false,
                "zoomable": false
            },
            "categoryField": "medicalName"
          });
        }
      }])
      .component('portfolioRaisingChart', {
        templateUrl: system.pathAppBase('/dashboard/portfolioRaising/components/parts/chart.html'),
        controller: 'portfolioRaisingChartController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });