'use strict';

define(['angular', 'coreConstants', 'lodash', 'endpointsConstants'], function (
  ng,
  coreConstants,
  _,
  endpointsConstants
) {
  GeneralAdminClinicaDigitalFactory.$inject = ['httpData'];
  function GeneralAdminClinicaDigitalFactory(httpData) {
    var domain = endpointsConstants.default;
    var testUrl = 'https://api.pre.mapfreperu.com/internal/comun/wsrmantenedoradm/';

    return {
      GetOptions: GetOptions,
      GetSections: GetSections,
      GetDataSection: GetDataSection,
      GetContent: GetContent,
      UpdateContent: UpdateContent
    };

    function GetOptions(showSpin) {
      return [
        { code: "termsConditions", name: "Términos y condiciones", url: "termsConditions" }
      ];
    }

    function GetSections(showSpin) {
      return [
        { code: "DEL_MED", name: "Delivery Medicamentos", url: "deliveryMedicamentos" }
      ];
    }

    function GetDataSection(path, showSpin) {
      var sections = GetSections(showSpin);

      var result = _.find(sections, function(y) {
        return y.url === path
      });

      return result;
    }

    function GetContent(codigoApp, showSpin) {
      return httpData
        .get(
          testUrl + 'termCondition/' + codigoApp,
          null,
          undefined,
          showSpin
        )
        .then(function (res) {
          var result = res.status === 1 && res.data ? res.data.termConditionDescription : ''
          return _.assign(result);
        });
    }

    function UpdateContent(codigoApp, body, showSpin) {
      return httpData
        .put(
          testUrl + 'termCondition/' + codigoApp,
          body,
          null,
          showSpin
        )
        .then(function (res) {
          return _.assign(res);
        });
    }

  } // end factory

  return ng.module(coreConstants.ngGeneralAdminClinicaDigitalModule, []).factory('GeneralAdminClinicaDigitalFactory', GeneralAdminClinicaDigitalFactory);
});
