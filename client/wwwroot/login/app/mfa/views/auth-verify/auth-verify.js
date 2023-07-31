'use strict';
define(['angular', 'constants', 'lodash', 'MfaFactory', 'CardModalityController'], function(angular, constants, _) {
  AuthVerifyController.$inject = ['$scope', '$state', 'MfaFactory', 'localStorageFactory'];
  function AuthVerifyController($scope, $state, MfaFactory, localStorageFactory) {
    var vm = this;

    vm.modalities = [];
    vm.$onInit = onInit;
    vm.onGoTo = onGoTo;

    function onInit() {
      _getModalties();
    }

    function _getModalties() {
      MfaFactory.getModalities()
        .then(function(resModalities) {
          vm.modalities = _.map(resModalities, function(modality) { return MfaFactory.parseModalityByView(modality, 'auth-verify') });
        });
    }

    function onGoTo(modality) {
      localStorageFactory.setItem('modalityCode', modality.code);

      MfaFactory.sendCode(modality.code, true)
        .then(function() {
          $state.go('authCode');
        });
    }
  }

  return angular
    .module('appLogin')
    .controller('AuthVerifyController', AuthVerifyController)
    .component('loginAuthVerify', {
      templateUrl: '/login/app/mfa/views/auth-verify/auth-verify.html',
      controller: 'AuthVerifyController',
      controllerAs: 'vm'
    });
});
