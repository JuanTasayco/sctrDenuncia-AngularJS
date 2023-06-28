define([
  'angular', 'constants', //'constantsrenovacion'
], function (angular, constants /*,constantsrenovacion*/) {
  'use strict';

  angular
    .module('appReno')
    .factory('renovacionBandejaFactory', RenovacionBandejaFactory );

  RenovacionBandejaFactory.$inject = ['$http', '$q'];
    function RenovacionBandejaFactory($http, $q) {
      var factory = {
      };
      var baseView = '/renovacion/app/renovacion/views';
      return factory;
    }
});