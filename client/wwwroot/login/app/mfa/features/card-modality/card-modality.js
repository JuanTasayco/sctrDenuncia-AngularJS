'use strict';
define([
  'angular',
  'NextFocusByMaxlengthDirective'
], function(angular) {
  CardModalityController.$inject = [];
  function CardModalityController() {
    var vm = this;

    vm.$onInit = onInit;

    function onInit() {};
  }

  return angular
    .module('appLogin')
    .controller('CardModalityController', CardModalityController)
    .component('loginCardModality', {
      templateUrl: '/login/app/mfa/features/card-modality/card-modality.html',
      controller: 'CardModalityController',
      controllerAs: 'vm',
      bindings: {
        modality: '<',
        onClickCard: '&'
      }
    });
});
