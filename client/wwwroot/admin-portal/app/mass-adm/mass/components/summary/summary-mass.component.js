'use strict';

define(['angular', 'coreConstants', 'system', 'lodash', 'massAmdUtils'], function(ng, coreConstants, system, _, massAmdUtils) {
  var folder = system.apps.ap.location;

  SummaryMassController.$inject = ['$scope'/*, 'AddBannerFactory'*/];

  function SummaryMassController($scope) {
    var vm = this;
    vm.$onDestroy = onDestroy;

    function onDestroy() {
      // console.log("destroy");
    }

    $scope.copyToClipboard = function (name) {
      massAmdUtils.copyToClipboard(name);
    }

  } // end controller
  return ng
    .module(coreConstants.ngMainModule)
    .controller('SummaryMassController', SummaryMassController)
    .component('summaryMassComponent', {
      templateUrl: folder + '/app/mass-adm/mass/components/summary/summary-mass.component.html',
      controller: 'SummaryMassController',
      bindings: {
        data: '=?',
      }
    });
});