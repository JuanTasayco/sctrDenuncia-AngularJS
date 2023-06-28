'use strict';

define(['angular', 'constants'], function (ng, constants) {
  reFactoryMedicalAssistance.$inject = [
    '$q',
    '$http',
    '$log',
    'mpSpin',
    'proxyMedicalAssistance',
    'proxyBenefit',
    'proxyFinishRequestRefundAaMm'
  ];

  function reFactoryMedicalAssistance(
    $q,
    $http,
    $log,
    mpSpin,
    proxyMedicalAssistance,
    proxyBenefit,
    proxyFinishRequestRefundAaMm
  ) {
    var SHOW_SPINNER = true;

    var factoryMedicalAssistance = {
      GetCustomerData: GetCustomerData,
      GetAllBenefits: GetAllBenefits,
      SaveRefundMedicalAssistance: SaveRefundMedicalAssistance
    };

    function GetCustomerData(documentMedicalAssistanceCriteria) {
      return proxyMedicalAssistance.GetDocumentMedicalAssistance(documentMedicalAssistanceCriteria, SHOW_SPINNER);
    }

    function GetAllBenefits(policyCriteria) {
      return proxyBenefit.GetAllBenefitBy(policyCriteria, SHOW_SPINNER);
    }

    function SaveRefundMedicalAssistance(rqRefundAaMmDto) {
      return proxyFinishRequestRefundAaMm.SaveRefundForAaMm(rqRefundAaMmDto, SHOW_SPINNER);
    }

    return ng.extend({}, factoryMedicalAssistance);
  }

  return ng
    .module('appReembolso.factoryMedicalAssistance', [
      'oim.proxyService.reembolso2',
    ])
    .factory('reFactoryMedicalAssistance', reFactoryMedicalAssistance);
});
