(function($root, deps, action){
  define(deps, action)
})(this, ['angular'],
  function(angular){

    var appPericial = angular.module('appPericial', ['chart.js']);

    appPericial.config(function(ChartJsProvider) {
      // Configure all charts
      ChartJsProvider.setOptions({
        maintainAspectRatio: false,
        responsive: true
      });
      // Configure all line charts
      ChartJsProvider.setOptions('line', {
        showLines: true,
        // chartColors: ['rgba(255,255,255,0.4)']
      });
    })

    appPericial.controller('mpfChartController',
      ['$scope', '$element', '$timeout',
        function($scope, $element, $timeout){
          var vm = this;
          vm.$onInit = function() {
            console.log(vm);
            vm.barFlag = false;
            vm.barHorzFlag = false;
            vm.doughnutFlag = false;
            vm.lineFlag = false;
            vm.pieFlag = false;
            vm.radarFlag = false;
            vm.polarFlag = false;
            switch (vm.type) {
              case 'bar':
                vm.barFlag = true;
                break;
              case 'bar-horz':
                vm.barHorzFlag = true;
                break;
              case 'doughnut':
                vm.doughnutFlag = true;
                break;
              case 'line':
                vm.lineFlag = true;
                break;
              case 'pie':
                vm.pieFlag = true;
                break;
              case 'radar':
                vm.radarFlag = true;
                break;
              case 'polar':
                vm.polarFlag = true;
                break;
            }
            vm.chartColorsW = (vm.chartColors) ? vm.chartColors : '';
            // timeout para simular respuesta de servicio
            $timeout(function () {
              vm.chartDataW = (vm.chartData) ? vm.chartData : '';
              vm.chartDatasetOverrideW = (vm.chartDatasetOverride) ? vm.chartDatasetOverride : '';
              vm.chartLabelsW = (vm.chartLabels) ? vm.chartLabels : '';
              vm.chartOptionsW = (vm.chartOptions) ? vm.chartOptions : '';
            },1000);
          };

        }])
      .component('mpfChart', {
        templateUrl: '/pericial/app/common/mpfChart/mpfChart.html',
        controller: 'mpfChartController',
        controllerAs: '$ctrl',
        bindings: {
          type: '=',
          chartColors: '=?',
          chartData: '=?',
          chartLabels:'=?',
          chartOptions: '=?',
          chartDatasetOverride: '=?'
        }
      })
  });
