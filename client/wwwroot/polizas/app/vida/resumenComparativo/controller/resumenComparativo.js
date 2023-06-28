(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/vida/proxy/vidaFactory.js'],
  function (angular, constants, helper) {

    var appAutos = angular.module('appAutos');

    appAutos.controller('vidaResumenComparativoController',
      ['$scope', '$window', '$state', 'vidaFactory', '$timeout', '$uibModal', 'mModalAlert', 'mModalConfirm', 'oimClaims', 'oimPrincipal', '$filter', '$sce', '$q', 'mpSpin', 'vidaRoles',
        function ($scope, $window, $state, vidaFactory, $timeout, $uibModal, mModalAlert, mModalConfirm, oimClaims, oimPrincipal, $filter, $sce, $q, mpSpin, vidaRoles) {

          (function onLoad() {
            $scope.mainStep = $scope.mainStep || {};

            $scope.main = $scope.main || {};
            $scope.main.isAdmin = oimPrincipal.isAdmin();
            $scope.main.agent = oimPrincipal.getAgent();
            $scope.mainStep.mAgenteFilter = $scope.main.agent;

            $scope.filterDate = $filter('date');

            settingsVigencia();

            $scope.mainStep.pdfURLSummaryEquipment = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/reporte/Vida/resumenequipo');
            const opcMenu = localStorage.getItem('currentBreadcrumb');
            $scope.mainStep.pdfURLSummaryAgent = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/reporte/Vida/resumenagente' + '?COD_OBJETO=.&OPC_MENU=' + opcMenu);

            $scope.showAgent = _showAgent();

            $scope.mainStep.mDniRucFilter = ''

            $scope.mainStep.mProductoFilter = ''
            $scope.mainStep.productoFilterData = []

            $scope.mainStep.mTipoDocumento = { NombreTipoDocumento: "DNI", CodigoTipoDocumento: 0 }

            $scope.mainStep.tipoDocumentoData = []

            $scope.validationForm = {
              selectedProducto: true,
              selectedAgente: true,
              selectedTipoDocumento: true,
              selectedDocumento: true
            }


            getProductos()
            getTipoDocumento()
          
          })();

          $scope.link = function (item) {
            localStorage.setItem('infoPoliza', JSON.stringify(item))  
            $state.go('vidaResumenComparativoDetalle', {
            });
          };

          function getTipoDocumento() {
            $scope.mainStep.tipoDocumentoData = [
              { NombreTipoDocumento: "DNI", CodigoTipoDocumento: 0 },
              { NombreTipoDocumento: "RUC", CodigoTipoDocumento: 1 }
            ]
          }

          function getProductos() {
            vidaFactory.getProducts(true).then(function (response) {
              if (response.OperationCode === 200) {
                var listSelectedProducs = []
                for (var idx = 0; idx < response.Data.length; idx++) {
                  if (response.Data[idx].CodigoProducto === 66102 || response.Data[idx].CodigoProducto === 66101) {
                    listSelectedProducs.push(response.Data[idx])
                  }
                }
                $scope.mainStep.productoFilterData = listSelectedProducs
              }
            });

          }

          function settingsVigencia() {
            $scope.today = function () {
              var _today = new Date();
              if (typeof $scope.mainStep.mDesdeFilter === 'undefined') $scope.mainStep.mDesdeFilter = new Date();
              if (typeof $scope.mainStep.mHastaFilter === 'undefined') $scope.mainStep.mHastaFilter = new Date();
            };
            $scope.today();

            $scope.inlineOptions = {
              minDate: new Date(),
              showWeeks: true
            };

            $scope.dateOptions = {
              formatYear: 'yy',
              minDate: new Date(),
              startingDay: 1
            };

            $scope.toggleMin = function () {
              $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
              $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
            };

            $scope.toggleMin();

            $scope.openDesdeFilter = function () {
              $scope.popupDesdeFilter.opened = true;
            };
            $scope.openHastaFilter = function () {
              $scope.popupHastaFilter.opened = true;
            };

            $scope.setDate = function (year, month, day) {
              $scope.dt = new Date(year, month, day);
            };

            $scope.format = constants.formats.dateFormat;
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.popupDesdeFilter = {
              opened: false
            };
            $scope.popupHastaFilter = {
              opened: false
            };
          }

          function _buildAgent(value) {
            var data = {
              CodigoNombre: value.toUpperCase(),
              CodigoGestor: (typeof $scope.mainStep.mGestorFilter === 'undefined') ? '0' : $scope.mainStep.mGestorFilter.codigo,
              CodigoOficina: (oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode,
              McaGestSel: 'S',
              RolUsuario: oimPrincipal.get_role()
            }
            return data;
          }

          $scope.searchAgent = function (value) {
            var params = _buildAgent(value);
            return vidaFactory.getAgent(params, false);
          }

          function buildSummaryFilter() {
            var data_filter = {
              "producto": {
                "codRamo": !$scope.mainStep.mProductoFilter.CodigoProducto ? '0' : $scope.mainStep.mProductoFilter.CodigoRamo,
                "codModalidad": !$scope.mainStep.mProductoFilter.CodigoProducto ? '0' : $scope.mainStep.mProductoFilter.CodigoProducto,
              },
              "contratante": {
                "tipDocum": !$scope.mainStep.mTipoDocumento ? '' : $scope.mainStep.mTipoDocumento.NombreTipoDocumento,
                "codDocum": !$scope.mainStep.mDniRucFilter ? '0' : $scope.mainStep.mDniRucFilter,
              },
              "poliza": {
                "codAgente": (typeof $scope.mainStep.mAgenteFilter === 'undefined') ? oimClaims.agentID : $scope.mainStep.mAgenteFilter.codigoAgente,
              },
              "cotizacion": {
                "fecCotizacion": formatearFecha($scope.filterDate($scope.mainStep.mDesdeFilter, constants.formats.dateFormat)),
                "fecHasta": formatearFecha($scope.filterDate($scope.mainStep.mHastaFilter, constants.formats.dateFormat))
              }
            }
            return data_filter;
          }
          
          function formatearFecha(date) {
            var dia = date.substring(0, 2)
            var mes = date.substring(3, 5)
            var anio = date.substring(6, 10)
            return dia + "/" + mes + "/" + anio
          }

          function _showAgent() {
            var vRole = oimPrincipal.get_role();
            // WEBMASTER = AGENTEVE
            var vResult = $scope.main.isAdmin || _.contains([vidaRoles.director, vidaRoles.gestor, vidaRoles.supervisor], vRole);
            return vResult;
          }

          function _validateForm() {
            $scope.validationForm.selectedProducto = $scope.mainStep.mProductoFilter.CodigoProducto ? true : false
            $scope.validationForm.selectedAgente = $scope.mainStep.mAgenteFilter ? true : false
            $scope.validationForm.selectedTipoDocumento = $scope.mainStep.mTipoDocumento ? true : false
            $scope.validationForm.selectedDocumento = $scope.mainStep.mDniRucFilter ? true : false
            return $scope.validationForm.selectedProducto && $scope.validationForm.selectedAgente && $scope.validationForm.selectedTipoDocumento && $scope.validationForm.selectedDocumento
          }
          
          $scope.filterData = function () {
            _filterData();
          }

          function _filterData() {
            if (_validateForm()) {
              mpSpin.start();
              $scope.noResult = true;
              
              var allFilter = buildSummaryFilter()
              vidaFactory.obtenerResumen.getData(allFilter).then(function (response) {
                var auxList = []
                if (response.Data && response.Data.cabecera && response.Data.cabecera.NomProducto) {
                  auxList.push(response.Data)
                  $scope.itemsEquipment = auxList
                  $scope.noResult = false;
                } else {
                  $scope.itemsEquipment = []
                  $scope.noResult = true;
                }
                mpSpin.end();
              }, function (error) {
                $scope.itemsEquipment = []
                $scope.noResult = true;
                mpSpin.end();
              });
            }
          }
          function _clearFilter() {
            $scope.mainStep.mGestorFilter = undefined;
            $scope.mainStep.mAgenteFilter = undefined;
            $scope.mainStep.mDesdeFilter = new Date();
            $scope.mainStep.mHastaFilter = new Date();
            $scope.mainStep.mDniRucFilter = ''
            $scope.mainStep.mProductoFilter = ''
            $scope.mainStep.mTipoDocumento = { NombreTipoDocumento: "DNI", CodigoTipoDocumento: 0 }

          }
          $scope.clearFilter = function () {
            _clearFilter();
          }
        }]);
  });
