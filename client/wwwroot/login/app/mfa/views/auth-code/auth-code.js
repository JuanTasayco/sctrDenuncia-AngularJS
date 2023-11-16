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
  AuthCodeController.$inject = ['$scope', '$state', 'MfaFactory', 'localStorageFactory', 'serviceLogin', 'mModalAlert', 'mapfreAuthetication', '$q', '$interval', 'mainServices'];
  function AuthCodeController($scope, $state, MfaFactory, localStorageFactory, serviceLogin, mModalAlert, mapfreAuthetication, $q, $interval, mainServices) {
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
      vm.modalityCode = MfaFactory.getModalityCode();
      _getModaltyByCode(vm.modalityCode);
    };

    function _onBack() {
      $state.go('authVerify');
    }

    function _setLayoutConfig(config) {
      $scope.$emit('layoutConfig', config);
    }

    function _getModaltyByCode(modalityCode) {
      MfaFactory.getModalityByCode(modalityCode)
        .then(function(resModality) {
          vm.modality = MfaFactory.parseModalityByView(resModality, 'code-verify');
        });
    }

    // INFO: Method is necessary to not losing the 'this'
    function _modalSuccess(msg, tit, Func, time, textConfirm, customClass) {
      var deferred = $q.defer();
      mModalAlert.showSuccess(msg, tit, Func, time, textConfirm, customClass)
        .then(function(resModalAlert) {
          deferred.resolve(resModalAlert);
        }, function(resModalAlert) {
          deferred.reject(resModalAlert);
        });

      return deferred.promise;
    }

    function modalAlertTimer(resSendCode) {
      function pad(v) {
        return v.toString().padStart(2, '0');
      }

      function getTimerMessage(dateExpirationTime) {
        var countDownTime = dateExpirationTime - (new Date()).getTime();
        var countDownDate = new Date(countDownTime);

        return {
          countDownTime: countDownTime,
          message: 'Intentelo nuevamente en ' + pad(countDownDate.getMinutes()) + ':' + pad(countDownDate.getSeconds())
        };
      }

      $scope.modalAlertTimer = {
        dateExpirationTime: resSendCode.data.dateExpiration,
        message: resSendCode.message,
        timerMessage: getTimerMessage(resSendCode.data.dateExpiration).message
      };

      var uibModalTimer = {
        scope: $scope,
        controller: function($scope, $uibModalInstance) {
          var intervalTimerMessage = $interval(function() {
            var timerMessage = getTimerMessage($scope.modalAlertTimer.dateExpirationTime);

            $scope.modalAlertTimer.timerMessage = timerMessage.message;

            if (timerMessage.countDownTime <= 0) {
              $interval.cancel(intervalTimerMessage);
              $uibModalInstance.close();
            }
          }, 1000);
        }
      };

      var modalTimerOpt = {
        showIconClose: false,
        showIcon: 'warning',
        title: '¡Opps!',
        templateContent: 'tplModalAlertTimer.html',
        showCancelButton: false
      }

      mainServices.fnShowModal(uibModalTimer, modalTimerOpt);
    }

    function onResend() {
      MfaFactory.sendCode(vm.modalityCode, true)
        .then(function(resSendCode) {
          if (resSendCode.operationCode ===  constants.operationCode.success) {
            _modalSuccess(vm.modality.value, 'Se envió el código nuevamente', null, null, 'Aceptar')
              .then(function() {
                vm.mInputCode = {};
              });
          } else if(resSendCode.operationCode === 901) {
            modalAlertTimer(resSendCode);
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
        modalityCode: vm.modalityCode,
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
