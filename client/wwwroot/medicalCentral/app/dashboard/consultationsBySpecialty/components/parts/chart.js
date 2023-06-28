(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'consultationsBySpecialtyChart', ['angular', 'lodash', 'system'],
    function(angular, _, system) {
      angular.module('medicalCenter.app')
      .controller('consultationsBySpecialtyChartController', ['$scope',function($scope){
        
        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new!= null && _new != old){
            
            var normalizeData = [];
            var header = _new.matrix.header[0].properties;
            var tempHeader = {}
            for (var index = 0; index <  _new.matrix.data.length; index++) {
              var head =  _new.matrix.data[index];
              if (head.itemType != 'T')
                tempHeader[head.especialityCode] = undefined;
            }
            for (var index = 0; index < header.length; index++) {
              var element = header[index];
              normalizeData.push(_.extend({index : index, date: element.value}, tempHeader))
              
            }
            for (var index = 0; index < normalizeData.length; index++) {
              var itemHeader = normalizeData[index];
              for (var key in itemHeader) {
                if (itemHeader.hasOwnProperty(key)) {
                  var element = itemHeader[key];
                  var item = _.find(_new.matrix.data, function(x){
                    return x.especialityCode==key
                  });
                  if (item)
                    itemHeader[key] = parseFloat(item.properties[itemHeader.index].value); 
                }
              }
            }
            renderChart({matrix:_new.matrix.data, normalizeData:normalizeData });
          }
        });
        function renderChart(datasource){
         // var chartData = generateChartData();
          var valueAxes = [];
          var graphs = []
          for (var index = 0; index < datasource.matrix.length; index++) {
            var element = datasource.matrix[index];
            valueAxes.push({
              "id":"v" + index,
              "axisThickness": 2,
              "axisAlpha": 1,
              "position": "left"
            });
            graphs.push({
              "valueAxis": "v" + index,
              "bullet": "round",
              "bulletBorderThickness": 1,
              "hideBulletsCount": 30,
              "title": element.especialityCode,
              "valueField": element.especialityCode,
              "fillAlphas": 0
            })
          }
          var chart = AmCharts.makeChart("chartConsultationsBySpecialty", {
            "type": "serial",
            "theme": "light",
            "colors": ["#67b7dc", "#fdd400", "#84b761", "#cc4748", "#cd82ad", "#2f4074", "#448e4d", "#b7b83f", "#b9783f", "#b93e3d", "#913167","#666","#777"],
            "legend": {
                "useGraphSettings": true
            },
            "dataProvider": datasource.normalizeData,
            "synchronizeGrid":true,
           // "valueAxes": valueAxes,
            "graphs": graphs,
            "chartScrollbar": {},
            "chartCursor": {
                "cursorPosition": "mouse"
            },
            "categoryField": "date",
            "categoryAxis": {
             //   "parseDates": true,
                "axisColor": "#DADADA",
                "minorGridEnabled": true
            }
        });
        function zoomChart(){
          chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
        }
        chart.addListener("dataUpdated", zoomChart);
        zoomChart();
        
        }
      }])
      .component('consultationsBySpecialtyChart', {
        templateUrl: system.pathAppBase('/dashboard/consultationsBySpecialty/components/parts/chart.html'),
        controller: 'consultationsBySpecialtyChartController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });