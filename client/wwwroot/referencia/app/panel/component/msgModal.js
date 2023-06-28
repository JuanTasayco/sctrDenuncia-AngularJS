'use strict';
define(['angular'], function(ng) {
  return ng.module('referenciaModalApp', [])
  .controller('ModalMSGController', function ctrFn() {
    var vm = this;
    vm.data = {};
  }).component('modalmsg', {
    templateUrl: '/referencia/app/panel/component/msgModal.html',
    controller: 'ModalMSGController',
    bindings: {
      close: '&',
      save: '&?',
      options: '=?'
    }
  });
});
