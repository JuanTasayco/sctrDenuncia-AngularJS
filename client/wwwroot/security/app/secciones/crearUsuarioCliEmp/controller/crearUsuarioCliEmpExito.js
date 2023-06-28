(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper'],
  function(angular, constants, helper){

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('crearUsuarioCliEmpExitoController',
      ['$scope', '$window', '$state', '$timeout', 'mainServices',
        function($scope, $window, $state, $timeout, mainServices){

          (function onLoad(){
          })();

        }])
  });
