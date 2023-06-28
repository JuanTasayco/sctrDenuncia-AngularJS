(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'rendererCharReportWeb', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .factory('rendererCharReportWeb', ['$filter', '$timeout',function($filter, $timeout){
        function adapterBarData(_new, idDiv, isPie, fn){
            var matrix = helper.clone(_new.matrix);
            
            angular.forEach(matrix.data, function(v){
              
              var p = v.properties[1].value
              p = angular.isString(p) ? p.trim(): p;
              v.percent = parseFloat(/^\.[0-9]/.test(p)?'0'+p:p);
              
              v.total = parseInt(v.properties[0].value);
              
              v.acumulado = v.properties[2].value;
              v.acumulado = angular.isString(v.acumulado) ? v.acumulado.trim().replace('%','') : v.acumulado;
              if (/^\.[0-9]/.test(v.acumulado)) v.acumulado  = '0'+v.acumulado;
              v.acumulado = parseFloat(v.acumulado) ;
            });
            var  chart;
            if (!isPie){
                matrix.data.push({especialityCode:'', itemType:"D"});
                chart = renderChart(_.filter(matrix.data, function(x){return x.itemType === 'D' || x.itemType == 'S'}), idDiv);
            }
            else{
                chart = renderChartPie(_.filter(matrix.data, function(x){return x.itemType === 'D' || x.itemType == 'S'}), idDiv);
            }

            $timeout(function(){
                var item = {action: "download",capture:true, extension:"svg", filename:"amCharts",format:"SVG", label:"SVG",mimeType:"text/xml"}
                chart.export.capture(item, function() {
                  chart.export.drawing.handler.done();
                  chart.export[ "toPNG"]( item, function( data ) {
                        var e = {$event:{imagecontent: data, key: idDiv}}
                        if (fn)
                            fn(e)
                    });
                })
            });
            
        }
        function renderChartPie(datasource, idDiv){
            var chart = AmCharts.makeChart(idDiv, {
              "type": "pie",
              "theme": "light",
              "dataProvider": datasource,
              "valueField": "percent",
              "titleField": "especialityCode",
              "labelText": "[[title]] - [[percents]]%",
              "outlineAlpha": 0.4,
              "depth3D": 15,
              "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
              "angle": 30,
              "export": {
                "enabled": true,
                "menu": [  ]
              }
            } );
            return chart;
           }
        function renderChart(datasource, idDiv){
            var chart = AmCharts.makeChart(idDiv,{
                "export": {
                    "enabled": true,
                    "menu": [  ]
                  },
              "type": "serial",
              "theme": "light",
              "legend": {
                  "equalWidths": false,
                  "useGraphSettings": true,
                  "valueAlign": "left",
                  "valueWidth": 120
              },
              "dataProvider": datasource,
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
                "title": "Acumulado",
                "fillAlphas": 0,
                "valueField": "acumulado",
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
              "categoryField": "especialityCode",
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
            return chart;  
        }
          return { adapterBarData :adapterBarData}
      }])
      
    });