'use strict';

define([
  'angular', 'proxyGcw'
  // , '/polizas/app/proxy/servicePoliza.js'
], function(ng) {

  CommonCboService.$inject = ['proxyPerson', 'proxyPolicy', 'proxyLookup', 'proxyElement', 'proxyParameter', 'proxySinister'];

  function CommonCboService(proxyPerson, proxyPolicy, proxyLookup, proxyElement, proxyParameter, proxySinister) {
    var service = {
    //  getListPersonType: getListPersonType,
      getListPagingPersonFilter: getListPagingPersonFilter,
      getListPagingPolicyFilter: getListPagingPolicyFilter,
      getReportListPolicyFilter: getReportListPolicyFilter,
      getListPendingPayment: getListPendingPayment,
      getAutoCompleteManager: getAutoCompleteManager,
      getAutoCompleteAgent: getAutoCompleteAgent,
      getDocumentTypePolicy: getDocumentTypePolicy,
      getDocumentType: getDocumentType,
      getListSector: getListSector,
      getListParameterByGroup: getListParameterByGroup,
      getListRamoBySectorCode: getListRamoBySectorCode,
      getListRamo: getListRamo,
      getListSituation: getListSituation,
      getListStatusPolicy: getListStatusPolicy,
      getRangoDesde: getRangoDesde,
      getListTipoPoliza: getListTipoPoliza,
      getTipoCliente: getTipoCliente,
      getReplacementCarStatus: getReplacementCarStatus,
      getLookupGeneralStatus: getLookupGeneralStatus,
      getProvidersRequests: getProvidersRequests
    };

    return service;

    function getListPagingPersonFilter(params, showSpin) {
      return proxyPerson.getListPagingPersonFilter(params, showSpin);
    }

    function getListPagingPolicyFilter(params, showSpin) {
      return proxyPolicy.getListPagingPolicyFilter(params, showSpin);
    }

    function getReportListPolicyFilter(showSpin) {
      return proxyPolicy.getReportListPolicyFilter(showSpin);
    }

    function getListPendingPayment(params, showSpin) {
      return proxyPolicy.getListPendingPayment(params, showSpin);
    }

    function getAutoCompleteManager(input, codeOffice, roleCode, showSpin) {
      return proxyLookup.getAutoCompleteManager(input, codeOffice, roleCode, showSpin);
    }

    function getAutoCompleteAgent(idManager, params, codeOffice, roleCode, networkId, showSpin) {
      return proxyLookup.getAutoCompleteAgent(idManager, params, codeOffice, roleCode, networkId, showSpin);
    }

    function getDocumentTypePolicy(showSpin) {
      return proxyElement.getListDocumentTypePolicy(showSpin);
    }

    function getDocumentType(showSpin) {
      return proxyLookup.getDocumentType(showSpin);
    }

    function getListSector(showSpin) {
      return proxyElement.getListSector(showSpin);
    }

    function getListParameterByGroup(codeGroup, showSpin) {
      return proxyLookup.getListParameterByGroup(codeGroup, showSpin);
    }

    function getListRamoBySectorCode(sectorCode, showSpin) {
      return proxyLookup.getListRamoBySectorCode(sectorCode, showSpin);
    }

    function getListRamo(sectorCode, showSpin) {
      return proxyLookup.getListRamo(sectorCode, showSpin);
    }

    function getTipoCliente(showSpin) {
      return proxyParameter.getLookupTypeClient(showSpin);
    }

    function getListSituation(showSpin) {
      return proxyElement.getListSituation(showSpin);
    }

    function getListStatusPolicy(showSpin) {
      return proxyParameter.getListStatusPolicy(showSpin);
    }

    function getRangoDesde(showSpin) {
      return proxyElement.getListProcessDate(showSpin);
    }

    function getListTipoPoliza() {
      return proxyElement.getListPolicyType(true);
    }

    function getReplacementCarStatus() {
      return proxyLookup.getReplacementCarStatus();
    }

    function getLookupGeneralStatus() {
      return proxyParameter.getLookupGeneralStatus();
    }

    function getProvidersRequests() {
      return proxySinister.getProvidersRequests();
    }

  } // end service

  return ng.module('appGcw')
    .service('CommonCboService', CommonCboService);
});
