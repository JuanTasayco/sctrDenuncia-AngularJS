(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'portfolioRaisingMatrix', ['angular', 'system', 'lodash'],
    function(angular, system, _) {
      angular.module('medicalCenter.app')
      .controller('portfolioRaisingMatrixController', ['$filter',function($filter){
        var vm = this
        vm.resolveValue = resolveValue;
        function currency(value){
          var cr = $filter('currency')
          return cr(value);
        }
        function percent(value){
          var cr = $filter('number')
          return cr((value * 100),2) + '%'
        }
        var settingsFormat = [{index:0, functionValue:currency}, {index:3, functionValue:percent}, {index:4, functionValue:percent}]
        function resolveValue(prop, properties){
         
          var index = properties.indexOf(prop);
          var setting =  _.find(settingsFormat, function(c){return c.index==index });
          return setting ? setting.functionValue(prop.value): prop.value;
        }
      }])
      .component('portfolioRaisingMatrix', {
        templateUrl: system.pathAppBase('/dashboard/portfolioRaising/components/parts/matrix.html'),
        controller: 'portfolioRaisingMatrixController',
        bindings: {
          nvtSource:"=?"
        }
      });
    });