(function($root, deps, action){
  define(deps, action) 
})(this, ['angular', 'constants'], 
function(angular, constants){

  var appAutos = angular.module(constants.module.polizas.fola.moduleName);

  appAutos.controller('emisionFolaController', 
    ['$scope', '$state',  
    function($scope, $state){
      $scope.numeroDocumento = $state.params.documentoId;
  }])
});