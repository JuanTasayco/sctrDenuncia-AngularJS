'use strict';
define([
  'angular',
  'system',
  'lodash',
  'MfaFactory',
  '/login/app/login/service/loginFactory.js',
  '/login/app/login/component/authentication/serviceLogin.js',
  'InputCodesController'
], function(angular, system, _) {
  AuthCodeController.$inject = ['$scope', '$state', 'MfaFactory', 'localStorageFactory', 'serviceLogin', 'mModalAlert', 'mapfreAuthetication'];
  function AuthCodeController($scope, $state, MfaFactory, localStorageFactory, serviceLogin, mModalAlert, mapfreAuthetication) {
    var vm = this;

    vm.modality = {};
    vm.inputCodesQuantity = 6;
    vm.mInputCode = {};
    vm.$onInit = onInit;
    vm.onResend = onResend;
    vm.onSumitCode = onSumitCode;

    $scope.$on('$destroy', destroy);

    function onInit() {
      var layoutConfig = {
        onBack: _onBack
      };
      _setLayoutConfig(layoutConfig);
      _getModalty();
    };

    function _onBack() {
      $state.go('authVerify');
    }

    function _setLayoutConfig(config) {
      $scope.$emit('layoutConfig', config);
    }

    function _getModalty() {
      var modalityCode = localStorageFactory.getItem('modalityCode');

      MfaFactory.getModalityByCode(modalityCode)
        .then(function(resModality) {
          vm.modality = MfaFactory.parseModalityByView(resModality, 'code-verify');
        });
    }

    function onResend() {
      var modalityCode = localStorageFactory.getItem('modalityCode');

      MfaFactory.sendCode(modalityCode, true)
        .then(function(resSendCode) {
          if (resSendCode.operationCode ===  constants.operationCode.success) {
            mModalAlert.showSuccess(vm.modality.value, 'Se envió el código nuevamente', null, null, 'Aceptar')
              .then(function() {
                vm.mInputCode = {};
              });
          } else {
            mModalAlert.showWarning(resSendCode.message, '¡Opps!', null, null, 'Aceptar');
          }
        });
    }

    function _getCode() {
      return _.reduce(Object.keys(vm.mInputCode), function(acc, inputCodeKey) {
        acc = acc + vm.mInputCode[inputCodeKey];

        return acc;
      }, '');
    }

    function _signIn() {
      var credentials = mapfreAuthetication.getCredentials();
      var user = localStorageFactory.getItem('profile', false);

      var auth = serviceLogin.resolve(user.code, $scope, { credentials: credentials });
      auth.signIn();
    }

    function onSumitCode() {
      var reqCheckCode = {
        modalityCode: localStorageFactory.getItem('modalityCode'),
        code: _getCode()
      };

      MfaFactory.checkCode(reqCheckCode, true)
        .then(function(resCheckCode) {
          if (resCheckCode.operationCode ===  constants.operationCode.success) {
            _signIn();
          } else {
            mModalAlert.showWarning(resCheckCode.message, '¡Opps!', null, null, 'Aceptar');
          }
        });
    }

    function destroy() {
      $scope.$emit('layoutConfig', {});
    }
  }

  return angular
    .module('appLogin')
    .controller('AuthCodeController', AuthCodeController)
    .component('loginAuthCode', {
      templateUrl: '/login/app/mfa/views/auth-code/auth-code.html',
      controller: 'AuthCodeController',
      controllerAs: 'vm'
    });
});
