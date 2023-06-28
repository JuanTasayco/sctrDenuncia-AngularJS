(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'portfolioGrowthChart', ['angular', 'lodash', 'system'],
    function(angular, _, system) {
      angular.module('medicalCenter.app')
      .controller('portfolioGrowthChartController', ['$scope',function($scope){

        $scope.$watch('$ctrl.nvtSource', function(_new, old){
          if (_new!= null && _new != old){
            var normalizeData = [];
            var header = _new.matrix.header[0].properties;
            var tempHeader = {}
            
            var categories = [];
            for(var i = 0; i < _new.matrix.data.length - 1; i++){
              var category = {
                code: _new.matrix.data[i].categoryCode,
                name: _new.matrix.data[i].categoryName
              };
              categories.push(category);
            }

            var items = {};
            for(var i = 0; i < _new.matrix.data.length - 1; i++){
              items[_new.matrix.data[i].categoryCode] = _new.matrix.data[i].properties;
            }

            var variants = {}, percentages = {};
            for (var index = 0; index < header.length; index++) {
              var element = header[index];
              var config = {index : index, date: element.value};
              for(var i = 0; i < categories.length; i++){
                var category = categories[i].code;
                var item = items[category];
                var value = item[index].value;
                var v = parseFloat(value);
                v = isNaN(v) ? 0 : v
                config[category] = v;
                if(header.length >= 2){
                  if(index == header.length - 2){
                    variants[category] = v;
                  }
                  if(index == header.length - 1){
                    var previousValue = variants[category];
                    if(previousValue !== 0){
                      var differenceKey = "difference" + category;
                      var percentage = Math.round(((v - previousValue) / previousValue) * 100);
                      percentages[category] = percentage;
                      config[differenceKey] = percentage + "%";
                      variants[category] = differenceKey;
                    }
                  }
                }
              }
              normalizeData.push(_.extend(config, tempHeader))
            }
            renderChart({matrix:_new.matrix.data, normalizeData:normalizeData, categories: categories, variants: variants, percentages: percentages }, 'chartStructurePortfolioGrowth');
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
            "graphs": generateGraph(datasource.categories, datasource.variants, datasource.percentages),
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

        function generateGraph(categories, variants, percentages){
          var graphs = [];
          for(var i = 0; i < categories.length; i++){
            var percentage = percentages[categories[i].code];
            var color = "black";
            
            if(percentage < 0){
              color = "red";
            }

            var config = {
              "alphaField": "alpha",
              "balloonText":categories[i].name,
              "color": color,
              "dashLengthField": "dashLength",
              "fillAlphas": 0.7,
              "labelText": "[["+variants[categories[i].code]+"]]",
              "type": "column",
              "valueField": categories[i].code,
              "valueAxis": "distanceAxis"
            }
            graphs.push(config);
          }
          return graphs;
        }
    }]).component('portfolioGrowthChart', {
        templateUrl: system.pathAppBase('/dashboard/portfolioGrowth/components/parts/chart.html'),
        controller: 'portfolioGrowthChartController',
        bindings: {
          nvtSource:"=?",
          onRenderedImage:"&"
        }
      });
    });