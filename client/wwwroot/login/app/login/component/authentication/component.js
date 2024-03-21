/// </// <reference path="" />>
'use strict';

define([
  'angular',
  '/login/app/login/service/loginFactory.js',
  '/login/app/login/component/authentication/serviceLogin.js',
  'constants'
], function(angular, factory, helper, constants) {
  var appLogin = angular.module('appLogin');

  appLogin
    .controller('loginAuth', [
      '$scope',
      '$rootScope',
      '$location',
      '$q',
      'serviceLogin',
      '$stateParams',
      '$state',
      function($scope, $rootScope, $location, $q, serviceLogin, $stateParams, $state) {
        var _self = this;

        _self.tryCancelRecurrent = _self.type != undefined && _self.type !== null && _self.type !== 0;

        var authe = serviceLogin.resolve(_self.type, $scope, _self);

        localStorage.removeItem('local_coordinations');
        localStorage.removeItem('local_cutoff_dates');

        if (authe) {
          _self.isResolveLogin = true;
          authe.init();
          _self.isRecurrente && $state.go('loginByType');
        } else _self.isResolveLogin = false;

        var dataFromMyDream =
          $location.search()['origin'] === constants.originApps.myDream ? $location.search() : $stateParams.data;

        dataFromMyDream && authe.getTokenTransform(dataFromMyDream);

        $scope.showCuenta = !_self.isResolveLogin || _self.tryCancelRecurrent;

        _self._logIn = function() {
          if ($scope.canSubmitValidationForm()) authe.signIn();
        };
        _self.__login = _self._logIn;
        $scope.canSubmitValidationForm = function() {
          if (_self.isRecurrente) {
            return (
              $scope.frmLogin.nIngresaPassword &&
              $scope.frmLogin.nIngresaPassword.$valid &&
              !$scope.frmLogin.nIngresaPassword.$pristine
            );
          } else {
            return (
              $scope.frmLogin.nIngresaUsuario &&
              $scope.frmLogin.nIngresaPassword &&
              $scope.frmLogin.nIngresaUsuario.$valid &&
              !$scope.frmLogin.nIngresaUsuario.$pristine &&
              $scope.frmLogin.nIngresaPassword.$valid &&
              !$scope.frmLogin.nIngresaPassword.$pristine
            );
          }
        };
      }
    ])
    .component('mxLogin', {
      templateUrl: '/login/app/login/component/authentication/template.html',
      controller: 'loginAuth',
      bindings: {
        credentials: '=',
        type: '=',
        isResolveLogin: '='
      }
    })
    .directive('oimEnter', function() {
      return function(scope, element, attrs) {
        element.find('input').bind('keydown keypress', function(event) {
          if (event.which === 13) {
            scope.$apply(function() {
              scope.$eval(attrs.oimEnter);
            });
            event.preventDefault();
          }
        });
      };
    });
});
