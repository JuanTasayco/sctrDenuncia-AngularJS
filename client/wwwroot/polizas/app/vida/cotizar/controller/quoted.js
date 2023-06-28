(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular', 'constants', 'helper', 'generalConstantVida',
  'modalSendEmail',
  '/polizas/app/vida/proxy/vidaFactory.js',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'],
  function (angular, constants, helper, generalConstantVida) {

    var appAutos = angular.module('appAutos');

    appAutos.controller('vidaQuotedController',
      ['$scope', '$state', 'liveQuotation', 'mModalAlert', 'mModalConfirm', '$filter',
       'vidaFactory', 'mainServices', '$stateParams', 'oimAuthorize','proxyReferido','oimPrincipal','vidaRoles',
      function($scope, $state, liveQuotation, mModalAlert,mModalConfirm,  $filter,
        vidaFactory, mainServices, $stateParams, oimAuthorize,proxyReferido,oimPrincipal,vidaRoles){
          
          $scope.PPJ_PU = false;
          
          function _comesQuote() {
            return $stateParams['comesQuote'];
          }

          (function onLoad() {

            $scope.mainStep = $scope.mainStep || {};

            $scope.mainStep.filterAge = $filter('calculateAge');
            $scope.mainStep.DECIMAL = 2;
            $scope.comesQuote = _comesQuote();

            var existQuotation = !!(liveQuotation && liveQuotation.codigo);
            if (existQuotation) {
              $scope.mainStep.quotationData = liveQuotation;
              var vCurrency = _.find(constants.currencyType, function (currency) {
                return $scope.mainStep.quotationData.codigo_moneda == currency.code;
              });
              $scope.mainStep.quotationData.imp_tasa_venta = $scope.mainStep.quotationData.imp_tasa_venta ? Math.round($scope.mainStep.quotationData.imp_tasa_venta * 10000) / 100 : 0;
              $scope.mainStep.quotationData.simboloMoneda = vCurrency.description;
            }
                     
          $scope.formData = {};
          $scope.formData.numReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido
          
          $scope.disabledEmitir = false;
          
          $scope.codAgente = $scope.mainStep.quotationData.cod_agente;

          function _showAgent(){
            var vRole = oimPrincipal.get_role();
            var vResult = $scope.mainStep.isAdmin || _.contains([vidaRoles.director, vidaRoles.gestor, vidaRoles.eac, vidaRoles.directore, vidaRoles.eacemi, vidaRoles.gestoremi], vRole);
            return vResult;
          }

          $scope.userRoot = _showAgent();

          _validateReferredNumber(true);

            $scope.mainStep.canEmit = !!oimAuthorize.isAuthorized($state.get("vidaemit")) && existQuotation;

            if (generalConstantVida.productsPPJ.find(function (element) { return element == $scope.mainStep.quotationData.codigo_modalidad })) {
              $scope.PPJ_PU = true;
            }
            
            if ($state.params.encuesta) {
              $scope.encuesta = $state.params.encuesta;
              $scope.encuesta.numOperacion = $scope.mainStep.quotationData.codigo;
              if ($scope.encuesta.mostrar == 1) {
                mostrarEncuesta();
              }
            }

          })();

          function mostrarEncuesta() {
            console.log("$scope.encuesta", $scope.encuesta);
            $scope.encuesta.tipo = 'C';
            $scope.dataConfirmation = {
              save: false,
              valor: 0,
              encuesta: $scope.encuesta
            };
            var vModalConfirmation = $uibModal.open({
              backdrop: 'static', // background de fondo
              keyboard: false,
              scope: $scope,
              // size: 'lg',
              template: '<mpf-modal-assessment data="dataConfirmation" close="close()"></mpf-modal-assessment>',
              controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
                //CloseModal
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }]
            });
            vModalConfirmation.result.then(function () {
            }, function () {
            });
          }

          $scope.fnGoQuote = function (option) {
            $state.go('vidacotizar.steps', {
              step: 1,
              quotationNumber: (option === 'E') ? $scope.mainStep.quotationData.codigo : null
            }, { reload: true });
          };

          $scope.fnSendEmail = function () {
            var vQuoteNumber = $stateParams.quotationNumber
            vidaFactory.solicitudCotizacion.enviarCorreoCotizacion(vQuoteNumber, true).then(function (response) {
              var vMessage = response.Message;
              switch (response.OperationCode) {
                case constants.operationCode.success:
                  mModalAlert.showSuccess('Su email ha sido enviado', '', null, 2000);
                  break;
                default:
                  mModalAlert.showError(vMessage, 'ERROR');
                  break;
              }
            }, function (error) {
              // console.log('error');
            }, function (defaultError) {
              // console.log('errorDefault');
            });
          };

          $scope.fnDownload = function () {
            var vQuoteNumber = $stateParams.quotationNumber
            var vFileName = 'OIM_COTIZACION_' + vQuoteNumber + '.pdf';
            vidaFactory.solicitudCotizacion.generarPDFCotizacion(vQuoteNumber, true).then(function (response) {
              var vMessage = response.Message;
              switch (response.OperationCode) {
                case constants.operationCode.success:
                  mainServices.fnDownloadFileBase64(response.Data, 'pdf', vFileName);
                  break;
                default:
                  mModalAlert.showError(vMessage, 'ERROR');
                  break;
              }
            }, function (error) {
              // console.log('error');
            }, function (defaultError) {
              // console.log('errorDefault');
            });
          };

          $scope.fnGoEmit = function () {
            if($scope.formData.numReferido){
              _validateReferredNumber(false);

              setTimeout(function() {
                if($scope.numReferidoIsValid){
                  _Emitir();
                }
              },1000)
            }
            else {
              _Emitir();
            }
            
          };

          function _Emitir() {
            vidaFactory.proxyCotizacion.buscarCotizacionVidaPorCodigo($scope.mainStep.quotationData.codigo, false).then(function (response) {
              if (response.Data.Asegurado.EdadActuarial !== response.Data.Asegurado.EdadActuarialInicial) {
                mModalAlert.showInfo("LA EDAD ACTUARIAL SE HA MODIFICADO", "Generar una nueva cotización", "Info title").then(function () {
                  $state.go('homePolizasVidas');
                });
              } else {
                if (typeof $scope.mainStep.quotationData !== 'undefined') {
                  $state.go('vidaemit.steps', {
                    quotationNumber: $scope.mainStep.quotationData.codigo,
                    step: 1,
                  });
                }
              }
            });
          } 


          function _validateReferredNumber(onLoad) {
            if($scope.formData.numReferido){
              proxyReferido.ValidateReferredNumber($scope.formData.numReferido,"ambos", $scope.codAgente,$scope.userRoot, true)              
              .then(function(response){
                  if(response.data == "F1" || response.data == "F2" || response.data == "F3" ){
                    if(!onLoad){mModalAlert.showWarning(response.mensaje, '')}
                    $scope.numReferidoIsValid = false;
                    $scope.formData.msjReferidoValidate = response.mensaje;
                  }
                  else{
                    $scope.numReferidoIsValid = true;
                    $scope.formData.msjReferidoValidate = null;
                  }
                });
            }
          }
          
        }]).factory('loaderVidaQuotedController', ['vidaFactory', '$q', function (vidaFactory, $q) {
          var quotation;
          //getQuotation
          function getQuotation(quotationNumber, showSpin) {
            var deferred = $q.defer();
            vidaFactory.solicitudCotizacion.recuperarCotizacion(quotationNumber, showSpin).then(function (response) {
              quotation = response.Data;
              deferred.resolve(quotation);
            }, function (error) {
              deferred.reject(error.statusText);
            });
            return deferred.promise;
          }

          return {
            getQuotation: function (quotationNumber, showSpin) {
              return getQuotation(quotationNumber, showSpin);
            }
          };

        }]);

  });
