(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper'],
  function(ng, constants, helper){

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('homeController',
      ['$scope',
      '$window',
        function($scope, $window){

          (function onLoad(){
            $window.location.href = '/security/#/dashboard'
          })();

        }]);
  });

