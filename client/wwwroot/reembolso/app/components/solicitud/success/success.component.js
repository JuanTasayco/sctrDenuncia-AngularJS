'use strict';

define(['angular'], function(ng) {
  SuccessController.$inject = [];

  function SuccessController() {}

  return ng
    .module('appReembolso')
    .controller('SuccessController', SuccessController)
    .component('reStepOneComponent', {
      templateUrl: '/reembolso/app/components/solicitud/success/success.html',
      controller: 'SuccessController',
      binding: {}
    });
});
