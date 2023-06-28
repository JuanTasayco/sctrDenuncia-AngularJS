(function($root, deps, action) {
  define(deps, action)
})(this,
  ['angular', 'constants', 'modalSendEmail'],

  function(angular, constants) {
    angular
      .module("appSalud")
      .controller('saludMigracionesS2', ['$scope', '$state', 'mpSpin', '$timeout', '$stateParams', '$rootScope', '$q', '$http', 'saludFactory', 'mModalAlert','$uibModal', '$filter',
        function($scope, $state, mpSpin, $timeout, $stateParams, $rootScope, $q, $http, saludFactory, mModalAlert, $uibModal, $filter) {

          $scope.cotizacion = {};
          $scope.resultados = {};
          $scope.migracion = {};
          $scope.mAgenteMigracion = {};

          (function load_SaludMigracionesS2eController() {
            $scope.migracion = saludFactory.getMigracion();
            $scope.mAgenteMigracion = saludFactory.getAgente();
            if(!$scope.migracion.step1){
              $state.go('.', {
                step : 1
              });
              return;
            }
            $scope.cotizacion = $scope.migracion.cotizacion;
            _obtenerCotizacionSalud($scope.cotizacion.NumeroDocumento);
          })();

          $scope.sendEmail = function(){
            $scope.emailData ={
              reporteParam: {CodigoDocumento: $scope.cotizacion.NumeroDocumento} //$scope.formData.quotation
            };

            //Modal
            $scope.optionSendEmail = constants.modalSendEmail.salud;
            var vModalSendEmail = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              // size: 'lg',
              template : '<mpf-modal-send-email action="optionSendEmail" data="emailData" close="close()"></mpf-modal-send-email>',
              controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
                //CloseModal
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }]
            });
          };

          $scope.emitirPoliza = function () {
            var solicitud = _getRequestSolicitud();
            solicitud.Contratante.ImporteMapfreDolar = $scope.migracion.mDolaresAusar;
            saludFactory.generarEmisionPoliza(solicitud, true)
              .then(function (response) {
                if (response.Data.CodError === "0") {
                  var mensaje = "";
                  if(!angular.isUndefined(response.Data.poliza)){
                    var numPoliza = response.Data.poliza.NumPoliza;
                    mensaje = "Se ha guardado la emisión correctamente N° " + numPoliza;
                  }else{
                    mensaje = "Se renovó la poliza correctamente ";
                  }
                  mModalAlert.showSuccess(mensaje, "Emisión")
                    .then(function() {
                    saludFactory.setMigracion({});
                    $state.go('homePolizasSalud');
                  })
                } else {
                  mModalAlert.showError(response.Message, 'Error');
                }
              }).catch(function (err) {
              mModalAlert.showError(err.data.message, 'Error');
            });
          };

          $scope.descargarPdf = function (){
            saludFactory.generarPdfMigracion($scope.resultados.NumeroCotizacion);
          };

          function _obtenerCotizacionSalud(numCotizacion) {
            saludFactory.obtenerCotizacionSalud(numCotizacion, true)
              .then(function (response) {
                if (response.OperationCode === constants.operationCode.success) {
                  $scope.resultados = response.Data;
                } else {
                  mModalAlert.showError(response.Message, 'Error');
                }
              }).catch(function (err) {
              mModalAlert.showError(err.data.message, 'Error');
            });
          }

          function _getRequestSolicitud(){
            var solicitud = {
              "CodigoAgente": $scope.migracion && $scope.migracion.CodigoAgente,
              "CodigoCia": $scope.migracion && $scope.migracion.CodigoCia,
              "NumeroPoliza": $scope.migracion && $scope.migracion.NumeroPoliza,
              'Contratante': $scope.migracion && $scope.migracion.Contratante,
              "NumeroContrato": $scope.migracion && $scope.migracion.NumeroContrato,
              "NombreContrato": $scope.migracion && $scope.migracion.NombreContrato,
              "NumeroSubContrato": $scope.migracion && $scope.migracion.NumeroSubContrato,
              "NombreSubContrato": $scope.migracion && $scope.migracion.NombreSubContrato,
              "NumeroSuplementoCurso": $scope.migracion && $scope.migracion.NumeroSuplementoCurso,
              "FechaVigenciaDesde": $scope.migracion && $scope.migracion.FechaVigenciaDesde,
              "FechaVigenciaHasta": $scope.migracion && $scope.migracion.FechaVigenciaHasta,
              "FechaVigenciaDesdeMigracion": $scope.migracion && _dateToString($scope.migracion.mInicioMigracion),
              "FechaVigenciaHastaMigracion": $scope.migracion && _dateToString($scope.migracion.mFinMigracion),
              "FechaUltimoReciboPagado": $scope.migracion && $scope.migracion.FechaUltimoReciboPagado,
              "AjusteActualPoliza": !$scope.migracion.AjusteActualPoliza ? 0 : parseFloat($scope.migracion.AjusteActualPoliza),
              "PrimaAnualizadaTotal": $scope.resultados && ($scope.resultados.ImporteTotal * 12),
              "NumeroPolizaGrupo": $scope.migracion && $scope.migracion.NumeroPolizaGrupo,
              "DescEstado": $scope.migracion && $scope.migracion.DescEstado,
              "McaEstado": $scope.migracion && $scope.migracion.McaEstado,
              "Asegurados": $scope.migracion && $scope.migracion.Asegurados,
              "producto": {
                "CodigoCompania": $scope.resultados && $scope.resultados.Producto.CodigoCompania,
                "CodigoRamo": $scope.resultados && $scope.resultados.Producto.CodigoRamo,
                "NumeroContrato": $scope.resultados && $scope.resultados.Producto.NumeroContrato,
                "NumeroSubContrato": $scope.resultados && $scope.resultados.Producto.NumeroSubContrato,
                "CodigoProducto": $scope.resultados && $scope.resultados.Producto.CodigoProducto,
                "CodigoModalidad": $scope.resultados && $scope.resultados.Producto.CodigoModalidad,
              },
              "CodigoMoneda": $scope.resultados && $scope.resultados.CodigoMoneda,
              "CodigoFraccionamiento": $scope.resultados && $scope.resultados.CodigoFinanciamiento,
              "NumeroDocumento": $scope.cotizacion && $scope.cotizacion.NumeroDocumento,
              "FacNacimiento": $scope.migracion && $scope.migracion.FacNacimiento,
              "NombreContacto": $scope.migracion && $scope.migracion.NombreContacto,
              "TipoCargo": $scope.migracion && $scope.migracion.TipoCargo,
              "TipoActEconomica": $scope.migracion && $scope.migracion.TipoActEconomica,
              "FechaIngresoPoliza": $scope.migracion && $scope.migracion.FechaIngresoPoliza
            };

            return solicitud;
          }

          function _dateToString(fecha) {
            var fechaModificada = angular.isDate(fecha) ? $filter('date')(fecha, 'dd/MM/yyyy') : fecha;
            return fechaModificada;
          }


        }]);
  });

