'use strict';
define(['angular', 'system'], function(angular, system) {
  AuthCodeController.$inject = ['$scope', '$state'];
  function AuthCodeController($scope, $state) {
    var vm = this;

    vm.$onInit = function() {
      console.log('AuthCodeController');
    };

    vm.onResend = function() {};
    vm.onSumitCode = function() {};
  }

  return angular
    .module('appLogin')
    .controller('AuthCodeController', AuthCodeController)
    .component('loginAuthCode', {
      templateUrl: '/login/app/mfa/views/auth-code/auth-code.template.html',
      controller: 'AuthCodeController',
      controllerAs: 'vm'
    });
});
