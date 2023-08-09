'use strict';
define(['angular', 'constants', 'lodash', 'MfaFactory', 'CardModalityController'], function(angular, constants, _) {
  AuthVerifyController.$inject = ['$scope', '$state', 'MfaFactory', 'localStorageFactory', 'mModalAlert'];
  function AuthVerifyController($scope, $state, MfaFactory, localStorageFactory, mModalAlert) {
    var vm = this;

    vm.modalities = [];
    vm.$onInit = onInit;
    vm.onGoTo = onGoTo;

    $scope.$on('$destroy', destroy);

    function onInit() {
      var layoutConfig = {
        onBack: _onBack
      };
      _setLayoutConfig(layoutConfig);
      _getModalties();
    }

    function _onBack() {
      var usersByType = localStorageFactory.getItem('lsUserTypes');
      usersByType && usersByType.length > 1 ?  $state.go('authoButtons') :  $state.go('login');
    }

    function _setLayoutConfig(config) {
      $scope.$emit('layoutConfig', config);
    }

    function _getModalties() {
      MfaFactory.getModalities(true)
        .then(function(resModalities) {
          vm.modalities = _.map(resModalities, function(modality) { return MfaFactory.parseModalityByView(modality, 'auth-verify') });
        }, function(errModalities) {
          if (errModalities.operationCode === 900) {
            mModalAlert.showWarning(errModalities.message, '¡Opps!', null, null, 'Aceptar')
              .then(function() {
                _onBack();
              });
          }
        });
    }

    function onGoTo(modality) {
      localStorageFactory.setItem('modalityCode', modality.code);

      MfaFactory.sendCode(modality.code, true)
        .then(function() {
          $state.go('authCode');
        });
    }

    function destroy() {
      $scope.$emit('layoutConfig', {});
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
