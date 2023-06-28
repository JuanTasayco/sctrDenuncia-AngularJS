(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper'], 
  function(angular, constants, helper){

    var appAccidentes = angular.module('appAccidentes');

    appAccidentes.controller('accidentesHomeController', 
      ['$scope', '$window', '$state', '$timeout', '$rootScope', 
      function($scope, $window, $state, $timeout, $rootScope){

        console.log('accidentesHomeController');
    
        (function onLoad(){
          $scope.formData = $scope.formData || {};

        })();

        $scope.irACotizar = function(){
          $rootScope.formData = {};
          $state.go('accidentesQuote', {reload: true, inherit: false});
        }

    }]);

  });