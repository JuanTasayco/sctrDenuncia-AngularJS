(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'lodash', 'modalSendEmail', 'hogarCpnteAlarmsQuoting'],
  function(angular, constants, _){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarQuoteS4Controller',
      ['$scope', '$state', 'hogarFactory', 'mModalAlert', '$uibModal', 'oimAbstractFactory', 'proxyGeneral',
      function($scope, $state, hogarFactory, mModalAlert, $uibModal, oimAbstractFactory, proxyGeneral){

        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.fourthStep = $state.params.paramsHogarModule || {};

          if (Object.keys($scope.fourthStep).length > 0) {
            $scope.mainStep.showagente = true;
            $scope.mainStep.goback = false;
            $scope.mainStep.showtitle = true;

            $scope.primaAnualHogarIdealTradicional = $scope.fourthStep.hogarIdealTradicionalPrima.cotizacion ? $scope.fourthStep.hogarIdealTradicionalPrima.cotizacion.conceptosDesglose.impPrimaTotal : 0;
            $scope.primaAnualHogarIdealSmart =  $scope.fourthStep.hogarIdealSmartPrima.cotizacion ? $scope.fourthStep.hogarIdealSmartPrima.cotizacion.conceptosDesglose.impPrimaTotal : 0;
            $scope.primaAnualHogar24Horas = $scope.fourthStep.hogar24horasPrima.cotizacion ? $scope.fourthStep.hogar24horasPrima.cotizacion.conceptosDesglose.impPrimaTotal : 0;
            $scope.primaAnualSmart24Horas = $scope.fourthStep.hogarSmartPrima.cotizacion ? $scope.fourthStep.hogarSmartPrima.cotizacion.conceptosDesglose.impPrimaTotal : 0;

            $scope.fourthStep.requestQuotation[0].valorCotizacion = $scope.fourthStep.hogarIdealTradicionalPrima.cotizacion;
            $scope.fourthStep.requestQuotation[1].valorCotizacion = $scope.fourthStep.hogarIdealSmartPrima.cotizacion;
            $scope.fourthStep.requestQuotation[2].valorCotizacion = $scope.fourthStep.hogar24horasPrima.cotizacion;
            $scope.fourthStep.requestQuotation[3].valorCotizacion = $scope.fourthStep.hogarSmartPrima.cotizacion;
            $scope.fourthStep.requestQuotation[0].producto.desModalidad = 'Hogar Ideal A';
            $scope.fourthStep.requestQuotation[1].producto.desModalidad = 'Hogar Ideal B';
            $scope.fourthStep.requestQuotation[2].producto.desModalidad = 'Mapfre 24 Horas';
            $scope.fourthStep.requestQuotation[3].producto.desModalidad = 'Mapfre Smart 24 Horas';

            $scope.dataFirstStep = $scope.fourthStep.data;

            getEncuesta();
          } else {
            $state.go('.',{
              step: 1
            });
          }
        })();

        function getEncuesta(){
          var codCia = constants.module.polizas.hogar.codeCompany;
          var codeRamo = constants.module.polizas.hogar.codeRamo;
  
          proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
            if(response.OperationCode == constants.operationCode.success){
              if (Object.keys(response.Data.Pregunta).length > 0){
                $scope.encuesta = response.Data;
              }else{
                $scope.encuesta = {};
                $scope.encuesta.mostrar = 0;
              }
            }
          }, function(error){
            console.log('Error en getEncuesta: ' + error);
          })
        }

        $scope.$on('fnSendQuoteChecked', function(event, data) {
          data.PorDctoIntgPlaza = $scope.firstStep.PorDctoIntgPlaza || 0;
          data.MarcaPorDctoIntegralidad = $scope.firstStep.DctoIntegralidad ? "S" : "N";
          $scope.fourthStep.requestComparativo.push(data);
        })

        /*#########################
        # saveQuotation
        #########################*/
        $scope.saveQuotation = function() {
          $scope.fourthStep.requestComparativo = [];
          $scope.$broadcast('fnValidateChecked');

          if ($scope.fourthStep.requestComparativo.length > 0) {
            $scope.dataConfirmation = {
              save:false
            };

            var vModalConfirmation = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              template : '<mpf-modal-confirmation data="dataConfirmation" close="close()"></mpf-modal-confirmation>',
              controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
                //CloseModal
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }]
            });
            vModalConfirmation.result.then(function(){
              $scope.$watch('dataConfirmation', function(value){
                if (value.save) {
                  $scope.guardarCotizacion();
                }
              });
            },function(){
            });
          } else {
            mModalAlert.showInfo('', 'Debe seleccionar una cotización a guardar');
          }
        }

        $scope.guardarCotizacion = function() {
          $scope.fourthStep.numeroDocumentos = [];

          // Sistema Origen: OIM o MYD
          var origen = oimAbstractFactory.getOrigin();
          var documentos = _.map($scope.fourthStep.requestComparativo, function (doc) {
            if (doc) {
              doc.Documento.CodigoSistema = origen;
              return doc;
            }
          });

          hogarFactory.saveQuotationComparativo(documentos,true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              response.Data.map(function(item) {
                $scope.fourthStep.numeroDocumentos.push(item.Documento.NumeroDocumento);
              })

              $scope.fourthStep.documentosGuardados = response.Data;
              
              if($scope.encuesta.mostrar == 1){
                $scope.encuesta.numOperacion = $scope.fourthStep.documentosGuardados.join('-');
                $state.go('.', {
                  step: 5,
                  paramsHogarModule: $scope.fourthStep,
                  encuesta: $scope.encuesta
                });
              }else{
                $state.go('.', {
                  step: 5,
                  paramsHogarModule: $scope.fourthStep
                });
              }
            }else{
              mModalAlert.showError(response.Message, 'Error');
            }
          }, function(error){
          }, function(defaultError){
          });
        }

    }]);

  });
