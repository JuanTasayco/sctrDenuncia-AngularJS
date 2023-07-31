'use strict';
define(['angular', 'system', 'lodash', '/login/app/login/component/authentication/serviceLogin.js', 'MfaFactory'], function(angular, system, _) {
  AuthCodeController.$inject = ['$scope', '$state', 'MfaFactory', 'localStorageFactory', 'serviceLogin', 'mModalAlert'];
  function AuthCodeController($scope, $state, MfaFactory, localStorageFactory, serviceLogin, mModalAlert) {
    var vm = this;

    vm.modality = '';
    vm.$onInit = onInit;
    vm.onResend = onResend;
    vm.onSumitCode = onSumitCode;

    function onInit() {
      _getModalty();
    };

    function _getModalty() {
      var modalityCode = localStorageFactory.getItem('modalityCode');

      MfaFactory.modalityByCode(modalityCode)
        .then(function(resModality) {
          vm.modality = MfaFactory.parseModalityByView(resModality, 'code-verify');
        });
    }

    function onResend() {
      var modalityCode = localStorageFactory.getItem('modalityCode');

      MfaFactory.sendCode(modalityCode, true)
        .then(function(resSendCode) {
          if (resSendCode.operationCode ===  constants.operationCode.success) {
            mModalAlert.showSuccess(vm.modality.value, 'Se envió el código nuevamente');
          } else {
            mModalAlert.showWarning('', resSendCode.message);
          }
        });
    }

    function _finalSignIn(userOfUserTypes) {
      var userType = _.find(constants.typeLogin, function(item) { return item.subType == userOfUserTypes.groupType; });
      var user = Object.assign(userType, userOfUserTypes);

      auth = serviceLogin.resolve(user.code, $scope, vm);
      auth.finalSignIn(user);
    }

    function onSumitCode() {
      var reqCheckCode = {
        modalityCode: localStorageFactory.getItem('modalityCode'),
        code: ''
      };

      MfaFactory.checkCode(reqCheckCode, true)
        .then(function(resCheckCode) {
          if (resCheckCode.operationCode ===  constants.operationCode.success) {
            var userTypes = localStorageFactory.getItem('lsUserTypes');
            if (userTypes.length > 1) {
              $state.go('authoButtons');
            } else {
              _finalSignIn(userTypes[0]);
            }
          } else {
            mModalAlert.showWarning(resCheckCode.message, 'Opps');
          }
        });
    }
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
