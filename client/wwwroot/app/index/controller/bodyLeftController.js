(function($root, deps,factory){
    define(deps, factory)
})(this, ['angular'], function(angular){
    var appHome =  angular.module('oim.layout');
    appHome.controller('bodyLeftController',['$scope', '$rootScope', 'authorizedResource', function($scope, $rootScope, authorizedResource){
      function init(){
          $scope.moreOptions = authorizedResource.accessApp;
      }

      $rootScope.$watch('moreOptions', function(){
        init()
      });

      $scope.setAplication = function(aplicacion){
    		window.location.href = aplicacion.href;
      };

  

    }]);
})
