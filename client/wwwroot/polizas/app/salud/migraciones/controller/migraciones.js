'use strict';
define([
  'angular', 'constants'
], function(angular, constants){

  var appSalud = angular.module('appSalud');

  appSalud.controller('saludMigracionesController', ['$scope', 'oimPrincipal', '$window', '$state', '$rootScope', function($scope, oimPrincipal, $window, $state, $rootScope){
    console.log('saludMigracionesController');

    (function onLoad(){
      $scope.formData = $rootScope.formData || {};
    })();

    $scope.$watch('formData', function(nv)
    {
      $rootScope.formData =  nv;
    });


    $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
      $scope.currentStep = param.step;
    });

    /*#########################
    # Steps
    #########################*/
    $scope.nav = {};
    $scope.nav.go = function (step){
      var e = { cancel : false, step: step }
      $scope.$broadcast('changingStep', e);
      return !e.cancel;
    };

    $scope.$on('$destroy', function(){
      saludFactory.setMigracion({});
    });

  }])
});
