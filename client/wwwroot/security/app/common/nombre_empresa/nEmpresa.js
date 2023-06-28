(function($root, deps, action){
    define(deps, action)
  })(this, ['angular'],
    function(angular){
  
      var appSecurity = angular.module('appSecurity');
  
      appSecurity.controller('nEmpresaController',
        ['$scope'
        , 'seguridadFactory'
        , function($scope
        , seguridadFactory){
            var vm = this;
            vm.$onInit = function() {
              vm.evoProfile = seguridadFactory.getVarLS('evoProfile')
            };
  
          }])
        .component('nEmpresa', {
          templateUrl: '/security/app/common/nombre_empresa/nEmpresa.html',
          controller: 'nEmpresaController',
          controllerAs: '$ctrl',
          bindings: {
          }
        })
    });
  