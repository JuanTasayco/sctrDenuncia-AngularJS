'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('ModalConfirmationController', [function ctrFn() {
  }]).component('modalConfirmation', {
    templateUrl: '/referencia/app/reportes/component/confirmationModal.html',
    controller: 'ModalConfirmationController',
    bindings: {
      msg: '@',
      close: '&'
    }
  });
});
