define([
  'angular',
  'constants',
  'lodash',
  '/login/app/login/service/loginFactory.js',
  '/login/app/login/component/authentication/serviceLogin.js'
], function(angular, constants, _) {
  'use strict';

  angular
    .module('appLogin')
    .controller('ctrlbuttonsAuth', [
      '$scope',
      '$rootScope',
      '$state',
      'serviceLogin',
      '$window',
      'mapfreAuthetication',
      'localStorageFactory',
      function($scope, $rootScope, $state, serviceLogin, $window, mapfreAuthetication, localStorageFactory) {
        var vm = this;

        vm.data = vm.data || {};
        vm.data.userTypes = [];
        vm.$onInit = onInit;
        vm.onUserTypeSelect = onUserTypeSelect;

        function onInit() {
          mapfreAuthetication.getUserTypes()
            .then(function(resUserTypes) {
              vm.data.userTypes = resUserTypes;
              if (!vm.data.userTypes.length) $state.go('login');
            });
        };

        function _toMfa(user, idx) {
          var profile = localStorageFactory.getItem('profile', false);
          localStorageFactory.setItem('profile', _.assign(profile, user), false);

          vm.data.userTypes.splice(idx, 1, _.assign(user, { selectedByMfa: true }));
          mapfreAuthetication.setUserTypes(vm.data.userTypes);

          $state.go('authVerify');
        }

        function _finalSignIn(user) {
          var authe = serviceLogin.resolve(user.code, $scope, vm);
          authe.finalSignIn(user);
        }

        function onUserTypeSelect(item, idx) {
          var userConstantByGroupType = _.find(constants.typeLogin, function(value) { return value.subType == item.groupType; });
          var user = _.assign({}, userConstantByGroupType, item);

          if (mapfreAuthetication.getXmfa()) {
            _toMfa(user, idx);
          } else {
            _finalSignIn(user);
          }
        }
      }
    ])
    .component('buttonsAuth', {
      templateUrl: '/login/app/login/component/buttonsAuth/buttonsAuth.html',
      controller: 'ctrlbuttonsAuth',
      bindings: {
        settings: '='
      }
    });
});
