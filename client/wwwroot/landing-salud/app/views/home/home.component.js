'use strict';

(function($root, deps, action){
  define(deps, action, 'constants')
})(this, ['angular', 'appConstant', 'constants'],
function(angular, appConstant) {

  HomeController.$inject = ['$scope', '$http','$stateParams', '$state','$timeout', 'mpSpin','$q'];
  function HomeController($scope, $http, $stateParams, $state, $timeout, mpSpin,$q) {
    (function onLoad(){
      //$state.go('quote.steps', {quotationNumber: $stateParams.quotationNumber, step: 1});
	  console.log('Version 25/01/23 13:00');
      mpSpin.start();      
      postData().then(function (response) {
        if(response.access_token){
          localStorage.setItem("jwtMapfreToken_jwtMapfreToken", response.access_token);
          mpSpin.end();
          $timeout(function() {
            $state.go('quote.steps', {quotationNumber: $stateParams.quotationNumber, step: 1});
          }, 500);
        }
        
        
      }, function(error){
        mpSpin.end();
        console.log('Error' + error);
      });

    }
    
    )();

    function postData() {
      var credential = 'dXNlcnNhbHVkOnVzM3JzNGx1ZC4yMDIx';
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: constants.system.api.url + 'api/login/basic',
        headers: {
          "Authorization": "Basic " + credential
        },
        data:{
          "username": "usersalud",
          "password": "us3rs4lud.2021"
        }
      })
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(response) {
          deferred.reject(response);
        });
      return deferred.promise;
    }
    
  }

  return angular
    .module(appConstant.appModule)
    .controller('HomeController', HomeController);

});
