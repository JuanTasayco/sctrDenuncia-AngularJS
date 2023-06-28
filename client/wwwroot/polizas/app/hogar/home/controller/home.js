(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/hogar/proxy/hogarFactory.js'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarHomeController',
      ['$scope', '$window', '$state', 'hogarFactory', '$timeout',
      function($scope, $window, $state, hogarFactory, $timeout){

        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};

        })();

    }]);
  });
