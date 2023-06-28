'use strict';

define(['angular', 'constants'], function (ng, constants) {
  reFactoryPersonalAccidents.$inject = [
    '$q',
    '$http',
    '$log',
    'mpSpin',
    'proxyPowerEpsValidation',
    'proxyPersonalAccidents',
    'proxyBenefit',
    'proxyFinishRequestRefundAaPp',
    'proxyAffiliation'
  ];

  function reFactoryPersonalAccidents(
    $q,
    $http,
    $log,
    mpSpin,
    proxyPowerEpsValidation,
    proxyPersonalAccidents,
    proxyBenefit,
    proxyFinishRequestRefundAaPp,
    proxyAffiliation
  ) {
    var SHOW_SPINNER = true;

    var factoryPersonalAccidents = {
      ValidatePolicy: ValidatePolicy,
      GetCustomerData: GetCustomerData,
      GetBenefitsByAffiliate: GetBenefitsByAffiliate,
      SaveRefundPersonalAccidents: SaveRefundPersonalAccidents,
      GenerateOpening: GenerateOpening
    };

    function ValidatePolicy(existePolicyCriteria) {
      return proxyPowerEpsValidation.ExistPolicyBy(existePolicyCriteria, SHOW_SPINNER);
    }

    function GetCustomerData(documentPersonalAccidentsCriteria) {
      return proxyPersonalAccidents.GetDocumentPersonalAccidents(documentPersonalAccidentsCriteria, SHOW_SPINNER);
    }

    function GetBenefitsByAffiliate(benefitsAaPpCriteria) {
      return proxyBenefit.GetAllBenefitAaPpBy(benefitsAaPpCriteria, SHOW_SPINNER);
    }

    function SaveRefundPersonalAccidents(rqRefundAaPpDto) {
      return proxyFinishRequestRefundAaPp.SaveRefundForAaPp(rqRefundAaPpDto, SHOW_SPINNER);
    }

    function GenerateOpening(openingCriteria) {
      return proxyAffiliation.GenerateOpening(openingCriteria, SHOW_SPINNER);
    }


    return ng.extend({}, factoryPersonalAccidents);
  }

  return ng
    .module('appReembolso.factoryPersonalAccidents', [
      'oim.proxyService.reembolso2',
    ])
    .factory('reFactoryPersonalAccidents', reFactoryPersonalAccidents);
});
