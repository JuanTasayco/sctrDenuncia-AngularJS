(function($root, name, deps, action){
  $root.define(name, deps, action)
})(window, 'modalChartData', ['angular'], function(angular){
  angular.module('kpissalud.app').
  controller('modalChartDataController',['$scope','$state', '$filter', function($scope, $state, $filter){
    var vm = this;
    vm.$onInit = onInit;

    function setInitialData() {
      vm.headers = [], vm.rows = [];

      for(var key in vm.table){
        var headerItem = {};
        headerItem.key = key;
        headerItem.label = vm.table[key];
        vm.headers.push(headerItem);
      }

      vm.rows = vm.data;
    }

    function showWithFormat(value, key){
      var valueCheck = parseFloat(value);
      if(!isNaN(valueCheck)) {
        var precision = isDecimalKey(key) || !Number.isInteger(valueCheck) ? 2 : 0;
        return $filter('number')(valueCheck, precision);
      }
      return value;
    }

    function isDecimalKey(key){
      return key == 'ispgdo' ||  key == 'cpcnte' || key == 'ihcbrtra' || key == 'ihotrs' || 
      key == 'cpatncn' || key == 'cppcnte' || key == 'ipttl' || key == 'igdprtmnto' || key == 'igsnstro' ||
      key == 'cpttl' || key == 'igcbrtra' || key == 'igprvdr' || key == 'icgslctds' || key == 'icgrchzds' ||
      key == 'icgprbds' || key == 'iasrchzds' || key == 'iaamdca' || key == 'pcgadgnstco' || key == 'pcgacbrtra' ||
      key == 'pcgrchzds';
    }

    function close() {
      vm.close();
    }

    function downloadReport() {
      vm.download();
    }

    function onInit(){
      vm.closeModal = close;
      vm.downloadReport = downloadReport;
      vm.showWithFormat = showWithFormat;
      setInitialData();
    }

  }]).
  component('modalChartData', {
    templateUrl: '/kpissalud/app/components/indicators/modal-chart-data.html',
    controller: 'modalChartDataController',
    bindings: {
      titletext: '=?',
      data: '=?',
      table: '=?',
      download: '&?',
      close: "&?"
    }
  })
});