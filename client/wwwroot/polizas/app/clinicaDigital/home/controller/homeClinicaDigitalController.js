'use strict';

define(['angular', 'constants', 'helper'], function(
  angular, constants, helper) {

    homeClinicaDigitalController.$inject = [
    '$scope', '$window', '$state', '$timeout', '$rootScope', 'isAdmin'
  ];

  function homeClinicaDigitalController($scope, $window, $state, $timeout, $rootScope, isAdmin) {
    var vm = this;

    vm.$onInit = function () {
      $scope.formData = $scope.formData || {};
      $scope.isAdmin = isAdmin;
    };

    $scope.irACotizar = function(){
      $rootScope.formData = {};
      $state.go('cotizadorClinicaDigital', {reload: true, inherit: false});
    }
    $scope.cambiarPagina = function(page){
      $rootScope.formData = {};
      $state.go(page, {reload: true, inherit: false});
    }
    
  }
return angular.module('appClinicaDigital')
  .controller('homeClinicaDigitalController', homeClinicaDigitalController)
});
