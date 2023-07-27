'use strict';
define(['angular', 'constants', 'lodash', 'MfaFactory'], function(angular, constants, _) {
  AuthVerifyController.$inject = ['$scope', '$state', 'MfaFactory', 'localStorageFactory'];
  function AuthVerifyController($scope, $state, MfaFactory, localStorageFactory) {
    var vm = this;
    vm.modalities = [];

    vm.$onInit = function() {
      console.log('AuthVerifyController');
      _getModalties();
    };

    function _getModalties() {
      const reqModalities = {
        deviceCode: 'f55d02ddc611421db6f80966b2a9df78'
      };

      MfaFactory.modalities(reqModalities)
        .then(function(resModalities) {
          vm.modalities = _.map(resModalities.data, function(modality) { return MfaFactory.parseModalityByView(modality, 'auth-verify') });
        });
    }

    vm.onVerifyIdentity = function() {};
  }

  return angular
    .module('appLogin')
    .controller('AuthVerifyController', AuthVerifyController)
    .component('loginAuthVerify', {
      templateUrl: '/login/app/mfa/views/auth-verify/auth-verify.template.html',
      controller: 'AuthVerifyController',
      controllerAs: 'vm'
    });
});
