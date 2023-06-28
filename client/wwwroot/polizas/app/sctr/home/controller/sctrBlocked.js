(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper'], 
function(angular, constants, helper){

  var appAutos = angular.module('appAutos');

  appAutos.factory('sctrAgentBloked', ['proxySctr','$q', function(proxySctr, $q){
    
    function isBloked(){
      
      var defer = $q.defer()
      proxySctr.ValidarAgente().then(function(response){
        defer.resolve(response.Data && response.Data.Bloqueado == 1);  
      }, function(response){
        defer.reject(response);
      });
      return defer.promise;
    }
    return {
      isBloked:isBloked
    }
  }]);
});
