(function ($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper'],
  function(angular, constants, helper){

    var appSalud = angular.module('appSalud');

    appSalud.controller('popupSaludController',
      ['$scope', '$window', '$state', '$timeout', '$rootScope',
      function($scope, $window, $state, $timeout, $rootScope){

        (function onLoad(){

        })();
    }]);
});
