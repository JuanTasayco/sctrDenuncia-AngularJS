(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular', 'constants', 'helper',
  'modalSendEmail',
  '/polizas/app/vida/proxy/vidaFactory.js'],
  function (angular, constants, helper) {

    var appAutos = angular.module('appAutos');

    appAutos.controller('vidaResumenComparativoDetalleController',
      ['$scope','mainServices','mpSpin', 'httpData',
        function ($scope, mainServices, mpSpin, httpData) {

          (function onLoad() {
            $scope.mainStep = $scope.mainStep || {};
            _getDetalle()
          })();

          function _getDetalle() {
            mpSpin.start();
            $scope.mainStep.quotationData = JSON.parse(localStorage.getItem('infoPoliza')).cabecera
            mpSpin.end();
          }

          $scope.fnDownload = function () {
            var bodyParam = {
              cabecera: $scope.mainStep.quotationData
            }
            const urlRequest = constants.system.api.endpoints.policy + 'api/Vida/vidaRenta/cotizaciones/documento'
            httpData.postDownload(
              urlRequest,
              bodyParam,
              { headers: { 'Content-Type': 'application/json' }, responseType: 'arraybuffer' },
              true
            ).then(function (data) {
              mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
            });
          };
        }])
  });