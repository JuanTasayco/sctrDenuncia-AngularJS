(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'ocupabilityBySpecialtyMatrix', ['angular', 'system'],
    function(angular, system) {
      angular.module('medicalCenter.app')
      .controller('ocupabilityBySpecialtyMatrixController', [function(){
        var vm = this;
        vm.isUp = isUp;
        vm.isIndexPosition = isIndexPosition;
        function isUp (item,  prop){
          var penultimate = isIndexToLast(item.properties, prop, 1);

          var valueIndicator = item['indicator' + (penultimate?'1':'2')];
          return valueIndicator
          
        }
        function isIndexPosition(properties, prop){
          return  isIndexToLast(properties, prop, 0) ||
                  isIndexToLast(properties, prop, 1);
        }
        function isIndexToLast(properties, prop, indice){
          var currentIndex = properties.indexOf(prop);
          var lastIndex = properties.length - 1
          return currentIndex == (lastIndex - indice) 
        }
        
      }])
      .component('ocupabilityBySpecialtyMatrix', {
        templateUrl: system.pathAppBase('/dashboard/ocupabilityBySpecialty/components/parts/matrix.html'),
        controller: 'ocupabilityBySpecialtyMatrixController',
        bindings: {
          nvtSource:"=?",
          nvtFilter:"=?"
        }
      })
      .factory('ocupabilityBySpecialtyIConverterData', [function(){
        return {
          inferCode:function (dataFilters, codes){
            
            if (dataFilters.detailType && dataFilters.detailType.codigo){
              if (dataFilters.detailType.codigo == 'M')
                return codes[1];
            }
            return codes[0];
          },
          dataAdapter: function(filters, data){
            
            return data;
          }
        }
      }]);;
    });