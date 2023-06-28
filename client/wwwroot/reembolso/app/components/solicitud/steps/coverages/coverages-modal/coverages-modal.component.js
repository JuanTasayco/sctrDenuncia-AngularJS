'use strict';

define(['angular', 'lodash', 'reConstants'], function (ng, _, reConstants) {
  ReCoveragesModalController.$inject = ['reFactory', '$q', 'mModalAlert', '$log', '$window'];

  function ReCoveragesModalController(reFactory, $q, mModalAlert, $log, $window) {
    var vm = this;
    vm.$onInit = onInit;
    vm.coverageList = [];
    vm.cerrar = cerrar;
    vm.selectCoverage = selectCoverage;
    vm.sendCoverage = sendCoverage;

    // functions declaration

    function onInit() {
      _getCoveragesList();
      vm.coverage = vm.coverageSelected !== undefined ? vm.coverageSelected : undefined;
    }

    function cerrar() {
      vm.close(void 0);
    }

    function selectCoverage(coverage) {
      if (vm.coverageSelected) {
        return void 0;
      }
      vm.coverage = coverage
    }

    function sendCoverage() {
      vm.close({
        $event: {
          data: vm.coverage,
          status: 'ok'
        }
      });
    }

    // privates

    function _getCoveragesList() {
      reFactory.solicitud
        .GetCoveragesList()
        .then(function (res) {
          vm.coverageList = res.isValid ? res.data : [];
          vm.coverageList = _filterDeathCoverage(vm.coverageList);
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _filterDeathCoverage(coverageList) {
      return vm.afiliate.injuryType === reConstants.injuryTypeDeath.codeField ?
        _.filter(coverageList, function(coverage) {
          return (coverage.code === reConstants.coverages.accidentalDeath || coverage.code === reConstants.coverages.gastosSepelio);
        }) :
        coverageList;
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReCoveragesModalController', ReCoveragesModalController)
    .component('reCoveragesModal', {
      templateUrl: '/reembolso/app/components/solicitud/steps/coverages/coverages-modal/coverages-modal.html',
      controller: 'ReCoveragesModalController as $ctrl',
      bindings: {
        close: '&?',
        coverageSelected: '<',
        afiliate: '<'
      }
    });
});
