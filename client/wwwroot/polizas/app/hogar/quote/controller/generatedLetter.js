(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/hogar/proxy/hogarFactory.js',
  'modalSendEmail'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarGeneratedLetterController',
      ['$scope', '$window', '$state', 'hogarFactory', '$uibModal', '$sce', 'oimAbstractFactory',
      function($scope, $window, $state, hogarFactory, $uibModal,  $sce, oimAbstractFactory){

        $scope.isMyDream = oimAbstractFactory.isMyDream();
        var codCompania = constants.module.polizas.hogar.codeCia;
        var codRamo = constants.module.polizas.hogar.codeRamo;

        $scope.paramsPdf = {
          url: 'api/reporte/hogar/cotizacion',
          data: ''
        };

        (function onLoad(){

          hogarFactory.getQuotation($state.params.numDocument, true).then(function(response) {
            if (response.OperationCode == constants.operationCode.success) {
              $scope.quotationDetail = response.Data;
              $scope.paramsSignature = setParamsSignature($scope.quotationDetail);
            }
          })

        })();

        // Firma
        $scope.isMobile = helper.isMobile();
        $scope.onSignature = function (data) { }


        function setParamsSignature(params) {
          // Request para firma
          return $scope.paramsSignature = {
            tipoFirma: 1,
            tipoPoliza: "HOGAR",
            numeroRamo: codRamo,
            numeroCompania: codCompania,
            numeroModalidad: params.Hogar.CodigoModalidad || 0,
            numeroCotizacion: 0,
            numeroPoliza: 0,
            firma: ''
          };
        }

        $scope.getParamsSignature = function (nroDoc) {

          if (nroDoc) {
            $scope.paramsSignature.numeroDocumento = nroDoc
            $scope.paramsSignature.agrupador = nroDoc;
          }

          return $scope.paramsSignature;
        }

        $scope.getParamsPdf = function (nroDoc) {
          return {
            url: 'api/reporte/hogar/cotizacion',
            data: codCompania + '/' + nroDoc + '/' + codRamo
          }
        }

        $scope.sendEmail = function(){
          //Modal
          //DataEmail, cuando la cotizacion SI esta guardada
          $scope.emailData = {
            reporteParam : {
              CodigoCompania: constants.module.polizas.hogar.codeCompany, //'1',
              CodigoRamo: constants.module.polizas.hogar.codeRamo, //'120',
              CodigoDocumento: $scope.quotationDetail.NumeroDocumento //'186258'
            }
          };

          $scope.action = constants.modalSendEmail.hogarQuote.action;
            $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
              controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
                //CloseModal
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }]
            });
        }

        /*#########################
        # downloadPDF
        #########################*/
        $scope.downloadPDF = function(){
          $scope.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/reporte/hogar/cotizacion');

          $scope.pdfData = {
            "CodigoCompania": constants.module.polizas.hogar.codeCia,
            "CodigoRamo": constants.module.polizas.hogar.codeRamo,
            "CodigoDocumento": $scope.quotationDetail.NumeroDocumento,
            "cotizacion": {
              "NumeroCotizacion": $scope.quotationDetail.Hogar.NumeroCotizacion,
              "CodigoModalidad": $scope.quotationDetail.Hogar.CodigoModalidad,
              "CodigoMoneda": $scope.quotationDetail.CodigoMoneda,
              "Hogar": {
                "FlagContrataRobo": "S",
                "ValorEdificacion": $scope.quotationDetail.Hogar.ValoresDeclarados.ValorEdificacion,
                "ValorContenido": $scope.quotationDetail.Hogar.ValoresDeclarados.ValorContenido,
                "ValorObjetosValiosos": $scope.quotationDetail.Hogar.ValoresDeclarados.ValorObjetosValiosos,
                "CodigoAlarmaMonitoreo": $scope.quotationDetail.Hogar.CodigoAlarmaMonitoreo,
                "FlagEdificacionValor": "S",
                "FlagContenidoValor": "S",
                "FlagContrataTerremotoEdificacion": $scope.quotationDetail.Hogar.ValoresDeclarados.FlagContrataTerremotoEdificacion,
                "FlagContrataTerremotoContenido": $scope.quotationDetail.Hogar.ValoresDeclarados.FlagContrataTerremotoContenido,
                "FlagFinanciar": "S",
                "Ubigeo": {
                  "CodigoDepartamento": $scope.quotationDetail.Hogar.Ubigeo.CodigoDepartamento,
                  "CodigoProvincia": $scope.quotationDetail.Hogar.Ubigeo.CodigoProvincia,
                  "CodigoDistrito": $scope.quotationDetail.Hogar.Ubigeo.CodigoDistrito
                },
                "ValoresDeclarados": {
                  "ValorEdificacion": $scope.quotationDetail.Hogar.ValoresDeclarados.ValorEdificacion,
                  "ValorContenido": $scope.quotationDetail.Hogar.ValoresDeclarados.ValorContenido,
                  "ValorObjetosValiosos": $scope.quotationDetail.Hogar.ValoresDeclarados.ValorObjetosValiosos,
                  "ImporteContenidoRobo": $scope.quotationDetail.Hogar.ValoresDeclarados.ImporteContenidoRobo,
                  "ImporteObjetosValiososRobo": $scope.quotationDetail.Hogar.ValoresDeclarados.ImporteObjetosValiososRobo,
                  "FlagContrataTerremotoContenido": $scope.quotationDetail.Hogar.ValoresDeclarados.FlagContrataTerremotoContenido,
                  "FlagContrataTerremotoEdificacion": $scope.quotationDetail.Hogar.ValoresDeclarados.FlagContrataTerremotoEdificacion,
                  "FlagContrataTerremotoObjetosValiosos": $scope.quotationDetail.Hogar.ValoresDeclarados.FlagContrataTerremotoObjetosValiosos,
                  "FlagContrataIncendioContenido": $scope.quotationDetail.Hogar.ValoresDeclarados.FlagContrataIncendioContenido,
                  "FlagContrataIncendioEdificacion": $scope.quotationDetail.Hogar.ValoresDeclarados.FlagContrataIncendioEdificacion,
                  "FlagContrataIncendioObjetosValiosos": $scope.quotationDetail.Hogar.ValoresDeclarados.FlagContrataIncendioObjetosValiosos,
                  "FlagContrataRoboContenido": $scope.quotationDetail.Hogar.ValoresDeclarados.FlagContrataRoboContenido,
                  "FlagContrataRoboObjetosValiosos": $scope.quotationDetail.Hogar.ValoresDeclarados.FlagContrataRoboObjetosValiosos
                },
                "CoberturaAdicional": {
                  "DesaparicionMisteriosa": $scope.quotationDetail.Hogar.CoberturaAdicional.DesaparicionMisteriosa,
                  "DeshonestidadEmpleado": $scope.quotationDetail.Hogar.CoberturaAdicional.DeshonestidadEmpleado
                }
              },
              "Agente": {
                "CodigoAgente": $scope.quotationDetail.Agente.CodigoAgente,
                "NombreCompleto": $scope.quotationDetail.Agente.NombreCompleto,
                "TipoGestor": ""
              },
              "Contratante": {
                "NombreCompleto": $scope.quotationDetail.Contratante.NombreCompleto,
                "TipoDocumento": $scope.quotationDetail.Contratante.TipoDocumento,
                "CodigoDocumento": $scope.quotationDetail.Contratante.CodigoDocumento
              }
            }
          }

          $window.setTimeout(function(){
            document.getElementById('frmDownloadPDF').submit();
          });
        }


        /*#########################
        # goEmit
        #########################*/
        $scope.goEmit = function(){
          $state.go('hogarEmitt1', {
            numDocument: $scope.quotationDetail.NumeroDocumento
          })
        }


    }]).factory('loaderHogarGeneratedLetterController', ['hogarFactory', '$q', function(hogarFactory, $q){
      var quotation;

      //getQuotation
      function getQuotation(params, showSpin){
       var deferred = $q.defer();
        hogarFactory.getQuotation(params, showSpin).then(function(response){
          quotation = response.Data;
          deferred.resolve(quotation);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getQuotation: function(params, showSpin){
          if (params){
            if(quotation) return $q.resolve(quotation);
            return getQuotation(params, showSpin);
          }
        }
      }

    }])

  });
