(function($root, name, deps, action){
  $root.define(name, deps, action)
})(window, 'chartComponent', ['angular'], function(angular){
  angular.module('kpissalud.app').
  controller('chartComponentController',['$scope','$state', 'configChart', function($scope, $state, configChart){
    var vm = this;
    vm.$onInit = onInit;

    function convertDataset(data) {
      var dataCopy = angular.copy(data);
      if(vm.chartData.categoryDate){
        for(var i = 0; i < dataCopy.length; i++){
          var item = dataCopy[i];
          var basicDate = item[vm.chartData.fields.category];
          var customDate = configChart.formatCustomDate(basicDate);
          item[vm.chartData.fields.category] = customDate;
        }
      }
      return dataCopy;
    }

    function generateGraphData(){
      var graphsData = [];
      for(var key in vm.chartData.legends){
        var dataChart = {
          balloonText: '[[category]]: <b>[[value]]</b>',
          lineThickness: 2
        }

        if(!vm.chartData.legends[key].isGuide) {
          var itemLegend = vm.chartData.legends[key];
          dataChart.lineColor = itemLegend.color;
          dataChart.valueField = key;
          if(vm.chartData.type != 'pie') dataChart.type = vm.chartData.graph;
          if(itemLegend.label){
            dataChart.title = itemLegend.label;
            if(vm.chartData.hasOwnProperty('subtitle')) {
              if(vm.chartData.buttons.length == 2){
                var subtitle = '';
                if(vm.activeFilter1) subtitle = vm.chartData.subtitle[vm.chartData.buttons[0].key];
                else subtitle = vm.chartData.subtitle[vm.chartData.buttons[1].key];
                dataChart.title = itemLegend.label.replace(':subtitle:', subtitle);
              }
            }
            dataChart.balloonText = '[[title]]<br>[[category]]: <b>[[value]]</b>'
          }
          if(vm.chartData.graph == 'column'){
            dataChart.bullet = 'none';
            dataChart.colorField  = itemLegend.color;
            dataChart.fillAlphas = 1;
            dataChart.fixedColumnWidth = 20;
            if(vm.usePercentage) {
              dataChart.balloonText = '[[title]]<br>[[category]]: <b>[[value]]%</b>';
            } else if(vm.chartData.useDefaultPercentage) {
              dataChart.balloonText = '[[title]]<br>[[category]]: <b>[[percents]]%</b>';
            } else {
              dataChart.balloonText = '[[title]]<br>[[category]]: <b>[[value]]</b>';
            }
            if(vm.chartData.orientation == 'horizontal'){
              if(vm.usePercentage) {
                dataChart.labelText = '[[value]]%';
              } else if(vm.chartData.useDefaultPercentage) {
                dataChart.labelText = '[[percents]]%';
              } else {
                dataChart.labelText = '[[value]]';
              }
              dataChart.labelPosition = 'inside';
              dataChart.labelOffset = 50;
              dataChart.showAllValueLabels = true;
            }
          } else {
            dataChart.bullet = 'round';
            dataChart.bulletSize = 8;
          }
          graphsData.push(dataChart);
        }
      }

      return graphsData;
    }

    function generateLegendData(){
      var legendData = [];

      for(var key in vm.chartData.legends){
        var itemLegend = vm.chartData.legends[key];
        if(itemLegend.showLegend){
          var legendChart = {}
          legendChart.title = itemLegend.label;
          legendChart.color = itemLegend.color;
          legendChart.markerType = itemLegend.type;
          legendData.push(legendChart);
        }
      }

      return legendData;
    }

    function generateGuideData(){
      var guideData = [];
      for(var key in vm.chartData.legends){
        var itemLegend = vm.chartData.legends[key];
        if(itemLegend.isGuide) {
          var guideChart = {
            lineColor: itemLegend.color,
            balloonColor: itemLegend.color,
            lineThickness: 1,
            lineAlpha: 1
          }

          var guideValue = 0;
          if(vm.chartData.guides.multiple.length !== 0){
            if(vm.activeFilter1) guideValue = vm.chartData.guides.multiple[0][key];
            else guideValue = vm.chartData.guides.multiple[1][key];
          } else {
            guideValue = vm.chartData.guides.simple[key];
          } 
          guideChart.value = guideValue;
          guideChart.balloonText = '<b>'+ itemLegend.label + '</b>: ' + guideValue;

          guideData.push(guideChart);
        }
      }

      return guideData;
    }

    function setInitialData(){
      vm.activeFilter1 = false;
      vm.activeFilter2 = true;
      vm.usePercentage = false;
      vm.haveSecondTitle = false;
      vm.secondTitle = '';

      vm.listBackgroundColor = [
        '#749806',
        '#ed7839',
        '#e25271',
        '#09c3a7',
        '#37ace2',
        '#8f8f8f',
        '#727e4d',
        '#2eb19d',
        '#ff7800',
        '#008aff',
        '#eba602',
        '#6676ee',
        '#c39109'
      ];

      vm.title = angular.copy(vm.chartData.title);
    }

    $scope.$watch('$ctrl.chartData.data', function(n, o) {
      if (n != o) setChart();
    });

    function setChart(){
      if(vm.chartData){

        var buttons = vm.chartData.buttons;

        if(vm.chartData.hasOwnProperty('subtitle')) {
          if(buttons.length == 2){
            var subtitle = '';
            if(vm.activeFilter1) subtitle = vm.chartData.subtitle[buttons[0].key];
            else subtitle = vm.chartData.subtitle[buttons[1].key];
            vm.title = vm.chartData.title.replace(':subtitle:', subtitle);
          }
        }

        if(vm.chartData.hasOwnProperty('percentage')){
          if(vm.chartData.percentage.button == 'filter1' && vm.activeFilter1) vm.usePercentage = true;
          else if(vm.chartData.percentage.button == 'filter2' && vm.activeFilter2) vm.usePercentage = true;
          else vm.usePercentage = false;
        }

        if(vm.chartData.hasOwnProperty('types')){
          var configData = [];
          if(vm.activeFilter1) configData = vm.chartData.types.filter1.split(',');
          if(vm.activeFilter2) configData = vm.chartData.types.filter2.split(',');

          vm.chartData.type = configData[0];
          if(configData.length >= 2) vm.chartData.graph = configData[1];
          if(configData.length >= 3) vm.chartData.orientation = configData[2];
        }

        if(vm.chartData.hasOwnProperty('secondTitle')) {
          vm.haveSecondTitle = true;
          vm.secondTitle = vm.chartData.secondTitle.base.replace(':value:', vm.chartData.secondTitle.value);
        }

          vm.dataset = [];
          var data = angular.copy(vm.chartData.data);
          if(buttons.length == 2){
            if(vm.activeFilter1) vm.dataset = convertDataset(data[buttons[0].key]);
            else vm.dataset = convertDataset(data[buttons[1].key]);
          } else {
            vm.dataset = convertDataset(data);
          }

        vm.chartData.hasError = vm.dataset.length == 0;

        setTimeout(function() {
          if (vm.chart) vm.chart.destroy();

          var charJson = {
            type: vm.chartData.type,
            theme: 'none',
            dataProvider: vm.dataset,
            responsive: { enabled: true }
          }

          if(vm.chartData.type !== 'pie'){
            var ticks = angular.copy(vm.chartData.ticks);
            if(vm.usePercentage) {
              ticks.y = {
                position: 'r',
                value: '%'
              }
            }
            charJson.categoryField = vm.chartData.fields.category;
            charJson.legend = {
              switchable: false,
              markerSize: 10,
              align: 'center',
              data: generateLegendData()
            };
            charJson.valueAxes = [{
              position: 'left',
              integersOnly: true,
              axisAlpha: 0,
              includeGuidesInMinMax: true,
              guides: generateGuideData(),
              autoGridCount: false,
              gridCount: 6,
              labelFunction : function(value){
                var valueLabel = value;
                if(angular.isNumber(value)) valueLabel = configChart.formatBigValues(value);
                if(ticks.y){
                  if(ticks.y.position == 'r') return valueLabel + ticks.y.value;
                  else if(ticks.y.position == 'l') return ticks.y.value + valueLabel;
                  else return valueLabel;
                } else return valueLabel;
              }
            }];
            charJson.categoryAxis = {
              gridAlpha: 0,
              axisAlpha: 0,
              labelRotation: 45,// si no aplica rotación, volver a 0
              labelFunction : function(value, item, axis){
                if(ticks.x){
                  if(ticks.x.position == 'r') return value + ticks.x.value;
                  else if(ticks.x.position == 'l') return ticks.x.value + value;
                  else return value;
                } else {
                  if(vm.chartData.orientation == 'horizontal') {
                    var chartWidth = axis.chart.realWidth;
                    var maxLabelLength = 30;

                    if (chartWidth <= 300 && value.length > 5) return value.substr(0, 5) + "...";
                    if (chartWidth <= 500 && value.length > 10) return value.substr(0, 10) + "...";
                    return value.length >= maxLabelLength ? value.substr(0, maxLabelLength - 1) + "...": value;
                  }

                  else return value;
                }
              }
            };
            charJson.graphs = generateGraphData();
            if(vm.chartData.orientation == 'horizontal') {
              charJson.rotate = true;
              charJson.categoryAxis.gridPosition = 'start';
              charJson.categoryAxis.autoWrap = true;
            }
            if(vm.usePercentage) {
              charJson.valueAxes[0].maximum = 100;
              charJson.valueAxes[0].strictMinMax = true;
            }
          } else {
            charJson.valueField = vm.chartData.fields.value;
            charJson.titleField = vm.chartData.fields.category;
            charJson.color = '#ffffff';
            charJson.colors = vm.listBackgroundColor;
            charJson.startDuration = 0;
            charJson.legend = {
              position: 'right',
              valueText: '',
              switchable: false,
              markerType: 'circle',
              labelWidth: 250
            };
            charJson.labelRadius = -60;
            charJson.pullOutRadius = 0;
            if(vm.usePercentage) {
              charJson.labelText = '[[value]]%';
              charJson.balloonText = '[[title]]: [[value]]%';
            } else if(vm.chartData.useDefaultPercentage) {
              charJson.labelText = '[[percents]]%';
              charJson.balloonText = '[[title]]: [[percents]]% ([[value]])'; 
            } else {
              charJson.labelText = '[[value]]';
              charJson.balloonText = '[[title]]: [[value]]';
            }
          }

          if(vm.chartData.isExported){
            charJson.export = {};
            charJson.export.enabled = true;
            charJson.export.menu = "";
          }
          
          vm.chartData.finalTitle = vm.title;
          vm.chartData.finalSecondTitle = vm.secondTitle;

          vm.chart = AmCharts.makeChart(vm.chartData.id, charJson);
          vm.chart["export"].capture({}, function() {
            this.toPNG({}, function(base64) {
              vm.chartData.chartImage = base64;
            });
          });
        }, 0);
      }
    }

    function filter1(){
      vm.activeFilter1 = true;
      vm.activeFilter2 = false;
      setChart();
    }

    function filter2(){
      vm.activeFilter1 = false;
      vm.activeFilter2 = true;
      setChart();
    }

    function showTable(){
      var pdfFileName = vm.chartData.pdf.file;
      var tableConfig = angular.copy(vm.chartData.table);
      if(vm.chartData.hasOwnProperty('percentage') && vm.usePercentage){
        if(vm.chartData.percentage.hasOwnProperty('label') && vm.chartData.percentage.hasOwnProperty('value')){
          tableConfig[vm.chartData.percentage.value] = vm.chartData.percentage.label;
        }
      }
      if(vm.chartData.hasOwnProperty('multitable') && vm.chartData.multitable){
        var buttons = vm.chartData.buttons;
        if(buttons.length == 2){
          var config = {};
          var buttonConfig = {};
          config[vm.chartData.fields.category] = tableConfig[vm.chartData.fields.category];

          if(vm.activeFilter1) buttonConfig = tableConfig[buttons[0].key];
          else buttonConfig = tableConfig[buttons[1].key];

          config[buttonConfig.key] = buttonConfig.text;
          tableConfig = config;
        }
      }
      vm.showModalData({ $title: vm.title, $subtitle: vm.secondTitle, $table: tableConfig, $data: vm.dataset, $chart: vm.chartData.chartImage, $file: pdfFileName });
    }

    function downloadFile(){
      var pdfFileName = vm.chartData.pdf.file;
      var tableConfig = angular.copy(vm.chartData.table);
      if(vm.chartData.hasOwnProperty('percentage') && vm.usePercentage){
        if(vm.chartData.percentage.hasOwnProperty('label') && vm.chartData.percentage.hasOwnProperty('value')){
          tableConfig[vm.chartData.percentage.value] = vm.chartData.percentage.label;
        }
      }
      if(vm.chartData.hasOwnProperty('multitable') && vm.chartData.multitable){
        var buttons = vm.chartData.buttons;
        if(buttons.length == 2){
          var config = {};
          var buttonConfig = {};
          config[vm.chartData.fields.category] = tableConfig[vm.chartData.fields.category];

          if(vm.activeFilter1) buttonConfig = tableConfig[buttons[0].key];
          else buttonConfig = tableConfig[buttons[1].key];

          config[buttonConfig.key] = buttonConfig.text;
          tableConfig = config;
        }
      }
      vm.downloadReport({ $chart: vm.chartData.chartImage, $data: vm.dataset, $title: vm.title, $subtitle: vm.secondTitle, $table: tableConfig, $file: pdfFileName });
    }

    function onInit(){
      vm.filter1 = filter1;
      vm.filter2 = filter2;
      vm.showTable = showTable;
      vm.downloadFile = downloadFile;
      setInitialData();
      setChart();
    }

  }]).
  component('chartComponent', {
    templateUrl: '/kpissalud/app/components/indicators/chart-component.html',
    controller: 'chartComponentController',
    bindings: {
      chartData: '=?',
      showModalData: '&?',
      downloadReport: '&?'
    }
  })
});