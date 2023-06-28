(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper'], 
  function(angular, constants, helper){

    var appCallerDashboard = angular.module('appCallerDashboard');

    appCallerDashboard.controller('callerDashboardAsignadasController', 
      ['$scope', '$window', '$state', '$timeout', 
      function($scope, $window, $state, $timeout){
    
        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};

        })();

    }]);
    // }]).factory('loadercallerDashboardHomeController', ['callerDashboardFactory', '$q', function(callerDashboardFactory, $q){
    //   var claims;

    //   //Claims
    //   function getClaims(){
    //    var deferred = $q.defer();
    //     hogarFactory.getClaims().then(function(response){
    //       claims = response;
    //       deferred.resolve(claims);
    //     }, function (error){
    //       deferred.reject(error.statusText);
    //     });
    //     return deferred.promise; 
    //   }

    //   return {
    //     getClaims: function(){
    //       if(claims) return $q.resolve(claims);
    //       return getClaims();
    //     }
    //   }

    // }])

  });
