(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'specialityGrowthChart', ['angular', 'lodash', 'system'],
    function(angular, _, system) {
      angular.module('medicalCenter.app')
      .controller('specialityGrowthChartController', ['$scope',function($scope){
        
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new!= null && _new != old){
            var normalizeData = [];
            var header = _new.matrix.header[0].properties;
            var tempHeader = {}
            
            var specialities = [];
            for(var i = 0; i < _new.matrix.data.length - 1; i++){
              var speciality = {
                code: _new.matrix.data[i].processNumber,
                name: _new.matrix.data[i].especialityCode
              };
              specialities.push(speciality);
            }

            var items = {};
            for(var i = 0; i < _new.matrix.data.length - 1; i++){
              items[_new.matrix.data[i].processNumber] = _new.matrix.data[i].properties;
            }
            
            for (var index = 0; index < header.length; index++) {
              var element = header[index];
              var config = {index : index, date: element.value};
              for(var i = 0; i < specialities.length; i++){
                var speciality = specialities[i].code;
                var item = items[speciality];
                var value = item[index].value;
                var v = parseFloat(value);
                v = isNaN(v) ? 0 : v
                config[speciality] = v;
              }
              normalizeData.push(_.extend(config, tempHeader))
            }
            
            renderChart({matrix:_new.matrix.data, normalizeData:normalizeData, specialities: specialities }, 'chartStructureSpecialityGrowth');
          }
        });

        function renderChart(datasource, idDiv){
          var chart = AmCharts.makeChart(idDiv,{
            "type": "serial",
            "theme": "light",
            "dataProvider": datasource.normalizeData,
            "dataTableId": idDiv+'Table',
            "valueAxes": [
              {
                "id": "distanceAxis",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "position": "left",
                "title": "Total"
              }
            ],
            "graphs": generateGraph(datasource.specialities),
            "chartScrollbar": {},
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
                      return (value + '').substring(0,20) + '...'
                  return value
                }
            }
          });

          function zoomChart(){
            chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
          }

          chart.addListener("dataUpdated", zoomChart);
          zoomChart();
        }

        function generateGraph(specialities){
          var graphs = [];
          for(var i = 0; i < specialities.length; i++){
            var config = {
              "alphaField": "alpha",
              "balloonText": specialities[i].name,
              "dashLengthField": "dashLength",
              "fillAlphas": 0.7,
              "type": "column",
              "valueField": specialities[i].code,
              "valueAxis": "distanceAxis"
            }
            graphs.push(config);
          }
          return graphs;
        }
    }]).component('specialityGrowthChart', {
        templateUrl: system.pathAppBase('/dashboard/specialityGrowth/components/parts/chart.html'),
        controller: 'specialityGrowthChartController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });