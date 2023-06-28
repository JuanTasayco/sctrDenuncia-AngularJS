'use strict';

define(['angular', 'constants', 'helper'], function(
  angular, constants, helper) {

  homeDecesoController.$inject = [
    '$scope', '$window', '$state', '$timeout', '$rootScope', 'decesoAuthorize', 'proxyMenu'
  ];

  function homeDecesoController($scope, $window, $state, $timeout, $rootScope, decesoAuthorize, proxyMenu) {
    var vm = this;
    $scope.formData = $scope.formData || {};
    $scope.codeModule = $state.current.nombreCorto || $state.toOimState.nombreCorto || null;
    vm.$onInit = function () {
      proxyMenu.GetSubMenu('DECESO', true)
      .then(function (response) {
        decesoAuthorize.setHomeMenu(response.data);
        if(!decesoAuthorize.isAuthorized('HOME')){
          $state.go('accessdenied');
        }
      })
      .catch(function (error) {
          $state.go('accessdenied');
      });    
    };
    $scope.cambiarPagina = function(page){
      $state.go(page, {reload: true, inherit: false});
    }

    $scope.validate = function(itemName){
      return decesoAuthorize.menuItem($scope.codeModule, itemName);
    }

  }
return angular.module('appDeceso')
  .controller('homeDecesoController', homeDecesoController)
});
