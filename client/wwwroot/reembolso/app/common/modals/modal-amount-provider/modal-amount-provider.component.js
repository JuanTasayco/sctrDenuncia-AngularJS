'use strict';

define(['angular', 'lodash', 'ReembolsoActions'], function (ng, _, ReembolsoActions) {
  ModalAmountProviderController.$inject = ['reFactory', '$q', 'mModalAlert', '$ngRedux', '$log'];

  function ModalAmountProviderController(reFactory, $q, mModalAlert, $ngRedux, $log) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.sendAmountProvider = sendAmountProvider;

    // functions declaration

    function onInit() {
      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        solicitud: state.solicitud,
      };
    }

    function sendAmountProvider() {
      vm.close({
        $event: {
          data: vm.amountProvider,
          status: 'ok'
        }
      });
    }
  }

  return ng
    .module('appReembolso')
    .controller('ModalAmountProviderController', ModalAmountProviderController)
    .component('reModalAmountProvider', {
      templateUrl: '/reembolso/app/common/modals/modal-amount-provider/modal-amount-provider.html',
      controller: 'ModalAmountProviderController',
      bindings: {
        close: '&?',
      }
    });
});
