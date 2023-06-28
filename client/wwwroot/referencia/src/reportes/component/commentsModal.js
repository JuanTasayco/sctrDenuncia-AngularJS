'use strict';
define(['angular'], function(ng) {
  var module = ng.module('referenciaApp');
  module.controller('ModalCommentsController', [function ctrFn() {
    var vm = this;
    vm.onSubmit = function(isValid) {
      if (isValid) {
        vm.save();
      }
    };
  }]).component('modalComments', {
    templateUrl: '/referencia/app/reportes/component/commentsModal.html',
    controller: 'ModalCommentsController',
    bindings: {
      close: '&',
      text: '=',
      save: '&'
    }
  });
});
