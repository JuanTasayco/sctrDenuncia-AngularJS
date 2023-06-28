'use strict';

define(['angular'], function(ng) {
  inspecTemplateController.$inject = ['$scope', '$rootScope', '$log'];

  function inspecTemplateController($scope, $rootScope, $log) {
    // var vm = this;

    $scope.$on('$stateChangeStart', function(event, to, toParams, from, fromParams) {
      $log.log('here', event, to, toParams, from, fromParams);
    });

    $scope.$watch('header', function(newValue) {
      $rootScope.header = newValue;
    });
  }

  return ng
    .module('appInspec')
    .controller('InspecTempalteController', inspecTemplateController)
    .component('inspecTemplate', {
      templateUrl: '/inspec/app/_app/common/inspec-template/inspec-template.html',
      controller: 'InspecTempalteController as $ctrl'
      // bindings: {}
    });
});
