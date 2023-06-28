'use strict';

define(['angular', 'constants'], function (ng, constants) {
  reFactoryMaintenance.$inject = [
    'proxyMaintenance',
    'proxyExecutive',
    'proxyBroker'
  ];

  function reFactoryMaintenance(
    proxyMaintenance,
    proxyExecutive,
    proxyBroker
  ) {
    var SHOW_SPINNER = true;

    var factoryMaintenance = {
      GetAllSoatExecutives: GetAllSoatExecutives,
      GetAllExecutives: GetAllExecutives,
      ToggleStateSoatExecutive: ToggleStateSoatExecutive,
      MassiveDeactivateStateSoat: MassiveDeactivateStateSoat,
      MassiveDeactivateState: MassiveDeactivateState,
      UpdateExecutive: UpdateExecutive,
      AddSoatExecutive: AddSoatExecutive,
      GetBrokersByExecutive: GetBrokersByExecutive,
      AddExecutive: AddExecutive,
      DeleteBroker: DeleteBroker,
      ToggleStateExecutive: ToggleStateExecutive,
      AddBroker: AddBroker,
      GetAllAvailableLastDigit: GetAllAvailableLastDigit
    };

    function GetAllSoatExecutives() {
      return proxyMaintenance.GetAllExecutiveSoatByLastNun(SHOW_SPINNER);
    }

    function GetAllExecutives() {
      return proxyExecutive.GetAllExecutiveBy('', SHOW_SPINNER);
    }

    function ToggleStateSoatExecutive(executiveSoatByLastSinNum) {
      return proxyMaintenance.ActiveOrInactiveExecutiveSoatByLastSinNun(
        executiveSoatByLastSinNum,
        SHOW_SPINNER
      );
    }

    function ToggleStateExecutive(executiveCriteria) {
      return proxyExecutive.ActivateOrInactivate(
        executiveCriteria,
        SHOW_SPINNER
      );
    }

    function MassiveDeactivateStateSoat(listExecutiveSoatByLastSinNum) {
      return proxyMaintenance.InactivateExecutiveSoatByLastSinNun(
        listExecutiveSoatByLastSinNum,
        SHOW_SPINNER
      )
    }

    function MassiveDeactivateState(listExecutiveCriteria) {
      return proxyExecutive.InactivateMassive(
        listExecutiveCriteria,
        SHOW_SPINNER
      )
    }

    function UpdateExecutive(updateExecutiveSoatByLastSinNum) {
      return proxyMaintenance.UpdateExecutiveSoatByLastSinNun(
        updateExecutiveSoatByLastSinNum,
        SHOW_SPINNER
      )
    }

    function AddSoatExecutive(saveExecutiveSoatByLastSinNum) {
      return proxyMaintenance.SaveExecutiveSoatByLastSinNun(
        saveExecutiveSoatByLastSinNum,
        SHOW_SPINNER
      )
    }

    function AddExecutive(saveExecutiveCriteria) {
      return proxyExecutive.SaveExecutive(
        saveExecutiveCriteria,
        SHOW_SPINNER
      )
    }

    function GetBrokersByExecutive(idRefundExecutive) {
      return proxyBroker.GetAllExecutiveBrokerBy(
        idRefundExecutive,
        SHOW_SPINNER
      )
    }

    function DeleteBroker(deleteExecutivoBrokerCriteria) {
      return proxyBroker.DeleteExecutiveBroker(
        deleteExecutivoBrokerCriteria,
        SHOW_SPINNER
      )
    }

    function AddBroker(updateExecutiveBrokerCriteria) {
      return proxyBroker.SaveExecutiveBroker(
        updateExecutiveBrokerCriteria,
        SHOW_SPINNER
      )
    }

    function GetAllAvailableLastDigit() {
      return proxyMaintenance.GetAllAvailableLastDigit(SHOW_SPINNER);
    }

    return ng.extend({}, factoryMaintenance);
  }

  return ng
    .module('appReembolso.factoryMaintenance', ['oim.proxyService.reembolso2'])
    .factory('reFactoryMaintenance', reFactoryMaintenance);
});
