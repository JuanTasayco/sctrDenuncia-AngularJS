(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper'], 
  function(angular, constants, helper){

    var appEnel = angular.module('appEnel');

    appEnel.controller('enelHomeController', 
      ['$scope', '$window', '$state', '$timeout', 
      function($scope, $window, $state, $timeout){
    
        document.title = 'OIM - Enel';

        (function onLoad(){
          // $scope.mainStep = $scope.mainStep || {};

        })();

    }]);

  });
