'use strict';

define(['angular', 'lodash'], function (ng, _) {
  ReAttachmentsAlertController.$inject = ['reFactory', '$log', '$sce'];

  function ReAttachmentsAlertController(reFactory, $log, $sce) {
    var vm = this;
    vm.$onInit = onInit;
    vm.formatHtml = formatHtml;

    function onInit() {}

    function formatHtml() {
      return $sce.trustAsHtml(vm.stringHtml);
    }

  }

  return ng
    .module('appReembolso')
    .controller('ReAttachmentsAlertController', ReAttachmentsAlertController)
    .component('reAttachmentsAlert', {
      templateUrl: '/reembolso/app/components/solicitud/steps/attachments/attachments-alert/attachments-alert.html',
      controller: 'ReAttachmentsAlertController as $ctrl',
      bindings: {
        stringHtml: '<'
      }
    })
})
