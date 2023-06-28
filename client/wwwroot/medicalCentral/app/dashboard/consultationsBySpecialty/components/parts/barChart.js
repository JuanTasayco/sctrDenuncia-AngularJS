(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'consultationsBySpecialtyBarChart', ['angular', 'lodash', 'system'],
    function(angular, _, system) {
      angular.module('medicalCenter.app')
      .controller('consultationsBySpecialtyBarChartController', ['$scope',function($scope){
        
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new!= null && _new != old){
            
            var normalizeData = [];
            var header = _new.matrix.header[0].properties;
            var totals = _new.matrix.data[_new.matrix.data.length-1].properties;
            var tempHeader = {}
            
            for (var index = 0; index < header.length; index++) {
              var element = header[index];
              var total = totals[index];
              var t = parseFloat(total.value);
              t = isNaN(t) ? 0 : t
              normalizeData.push(_.extend({index : index, date: element.value, total:t}, tempHeader))
              
            }
            
            renderChart({matrix:_new.matrix.data, normalizeData:normalizeData }, 'barChartConsultationsBySpecialty');
          }
        });
        function renderChart(datasource, idDiv){
         // var chartData = generateChartData();
         var chart = AmCharts.makeChart(idDiv,{
          
          "type": "serial",
          "theme": "light",
         
          "dataProvider": datasource.normalizeData,
          "dataTableId": idDiv+'Table',
          "valueAxes": [{
              "id": "distanceAxis",
              "axisAlpha": 0,
              "gridAlpha": 0,
              "position": "left",
              "title": "Total"
          }, {
              "id": "durationAxis",
              "axisAlpha": 0,
              "gridAlpha": 0,
              "inside": true,
              "position": "right",
              "title": "Acumulado",
              'labelFunction' : function(value, valueText, valueAxis ){
                return valueText+'%';
              }
          }],
          "graphs": [{
              "alphaField": "alpha",
              "balloonText": "[[value]]",
              "dashLengthField": "dashLength",
              "fillAlphas": 0.7,
              "legendPeriodValueText": "total: [[value.sum]]",
              "legendValueText": "[[value]]",
              "title": "Total",
              "type": "column",
              "valueField": "total",
              "valueAxis": "distanceAxis"
          }, 
          {
            "bullet": "square",
            "bulletBorderAlpha": 1,
            "bulletBorderThickness": 1,
            "dashLengthField": "dashLength",
            "legendValueText": "[[value]]",
            "title": "Periodos",
            "fillAlphas": 0,
            "valueField": "date",
            "valueAxis": "durationAxis"
        }],
          "chartCursor": {
              "categoryBalloonDateFormat": "DD",
              "cursorAlpha": 0.1,
              "cursorColor":"#000000",
               "fullWidth":true,
              "valueBalloonsEnabled": false,
              "zoomable": false
          },
          "categoryField": "date",
          "categoryAxis": {
            "gridPosition": "start",
            "labelRotation": 45,
            'labelFunction' : function(value){
                if (value && value.length>=20)
                    return (value+'').substring(0,20)+'...'
                return value
              }
          },
        })
        
        }
      }])
      .component('consultationsBySpecialtyBarChart', {
        templateUrl: system.pathAppBase('/dashboard/consultationsBySpecialty/components/parts/barChart.html'),
        controller: 'consultationsBySpecialtyBarChartController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });