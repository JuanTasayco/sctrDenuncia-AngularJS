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
      function($scope, $rootScope, $state, serviceLogin, $window, mapfreAuthetication) {
        var _self = this,
          authe;

        _self.data = _self.data || {};

        _self.data.userTypes = angular.fromJson($window.localStorage['lsUserTypes']) || [];
        if (!_self.data.userTypes.length) $state.go('login');

        _self.fnFinalSignIn = function(item) {
          var vUserType = _.find(constants.typeLogin, function(value, index) {
            return value.subType == item.groupType;
          });
          var user = _.assign({}, vUserType, item);

          authe = serviceLogin.resolve(user.code, $scope, _self);
          authe.finalSignIn(user);
        };
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
