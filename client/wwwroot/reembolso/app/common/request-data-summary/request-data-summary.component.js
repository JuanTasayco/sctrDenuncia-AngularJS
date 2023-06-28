'use strict';

define(['angular', 'lodash'], function(ng, _) {
  RequestDataSummaryController.$inject = ['reServices'];

  function RequestDataSummaryController(reServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.formatDate = formatDate;

    function onInit() {
    }

    function formatDate(date) {
      return reServices.formatDateToSlash(date);
    }
  }

  return ng
    .module('appReembolso')
    .controller('RequestDataSummaryController', RequestDataSummaryController)
    .component('reRequestDataSummary', {
      templateUrl: '/reembolso/app/common/request-data-summary/request-data-summary.html',
      controller: 'RequestDataSummaryController',
      bindings: {
        data: '<'
      }
    });

});
