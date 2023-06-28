'use strict';

define([
  'angular',
  'coreConstants',
  'endpointsConstants',
  'lodash',
], function(ng, coreConstants, endpointsConstants, _) {
  CommonFactory.$inject = ['$q', '$stateParams', 'httpData', '$log', 'mpSpin'];

  function CommonFactory($q, $stateParams, httpData, $log, mpSpin) {
    var domain = endpointsConstants.default;

    return {
      GetDocumentType: GetDocumentType
    };

    function GetDocumentType(codeApp, showSpin) {
      return httpData
        .get(
          domain + 'api/v1/cms/areaPrivada/generales/documentType',
          {
              params: _.assign({
                  codigoApp: codeApp
              })
          },
          undefined,
          showSpin
        )
        .then(function(res) {
          return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
        });
    }
  }
  return ng.module(coreConstants.ngCommonModule, []).factory('CommonFactory', CommonFactory);
});