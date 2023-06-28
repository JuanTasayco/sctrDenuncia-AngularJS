(function($root, name, deps, action){
  $root.define(name, deps, action)
})(window, 'chartTextComponent', ['angular'], function(angular){
  angular.module('kpissalud.app').
  controller('chartTextComponentController',['$scope','$state', '$filter', function($scope, $state, $filter){
    var vm = this;
    vm.$onInit = onInit;

    function setInitialData(){
      vm.text = '';
      vm.title = angular.copy(vm.chartData.title);
    }

    $scope.$watch('$ctrl.chartData.data', function(n, o) {
      if (n != o) setChart();
    });

    function setChart(){
      if(vm.chartData){
        var data = angular.copy(vm.chartData.data);
        var value = data[0][vm.chartData.fields.value];
        if(vm.chartData.valueIsNumber) {
          var valueCheck = parseFloat(value);
          if(!isNaN(valueCheck)) {
            var precision = !Number.isInteger(valueCheck) ? 2 : 0;
            value = $filter('number')(valueCheck, precision);
          }
        }
        if(vm.chartData.hasOwnProperty('ticks')){
          if(vm.chartData.ticks.position == 'r') vm.text = value + vm.chartData.ticks.value;
          else if(vm.chartData.ticks.position == 'l') vm.text = vm.chartData.ticks.value + value;
        } else vm.text = value;

        vm.chartData.finalTitle = vm.title;
        vm.chartData.chartImage = vm.text;
      }
    }

    function onInit(){
      setInitialData();
      setChart();
    }

  }]).
  component('chartTextComponent', {
    templateUrl: '/kpissalud/app/components/indicators/chart-text-component.html',
    controller: 'chartTextComponentController',
    bindings: {
      chartData: '=?'
    }
  })
});