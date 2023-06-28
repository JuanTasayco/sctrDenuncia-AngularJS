'use strict';

define(['angular', 'wpConstant'], function(ng, wpConstant) {
  function MsgBoxController() {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.msgTxt = vm.msgTxt || wpConstant.msgErrorTabs;
    }
  }

  return ng
    .module('appWp')
    .controller('MsgBoxController', MsgBoxController)
    .component('wpMsgBox', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/msg-box/msg-box.html',
      controller: 'MsgBoxController',
      bindings: {
        msgTxt: '@?',
        ngIf: '=?',
        showMsgError: '=?'
      }
    });
});
